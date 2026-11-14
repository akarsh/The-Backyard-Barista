import { readFile, readdir, realpath, writeFile } from "node:fs/promises";
import path from "node:path";

const rootPackage = JSON.parse(await readFile("package.json", "utf8"));
const installedPackages = new Map();
const scannedNodeModules = new Set();
const projectRoot = process.cwd();

async function scanNodeModules(directory) {
  let actualDirectory;
  try {
    actualDirectory = await realpath(directory);
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }

  if (scannedNodeModules.has(actualDirectory)) return;
  scannedNodeModules.add(actualDirectory);

  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const entryPath = path.join(directory, entry.name);

    if (entry.name.startsWith("@")) {
      for (const scopedPackage of await readdir(entryPath, {
        withFileTypes: true,
      })) {
        await scanPackage(path.join(entryPath, scopedPackage.name));
      }
    } else {
      await scanPackage(entryPath);
    }
  }
}

async function scanPackage(directory) {
  const packageFile = path.join(directory, "package.json");
  let metadata;
  try {
    metadata = JSON.parse(await readFile(packageFile, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return;
    throw error;
  }

  if (typeof metadata.name !== "string" || typeof metadata.version !== "string") {
    throw new Error(`Missing package name or version in ${packageFile}.`);
  }

  const license =
    typeof metadata.license === "string"
      ? metadata.license
      : metadata.license?.type;
  if (typeof license !== "string" || license.length === 0) {
    throw new Error(`Missing license metadata for ${metadata.name}@${metadata.version}.`);
  }

  const directType = rootPackage.dependencies?.[metadata.name]
    ? "Runtime"
    : rootPackage.devDependencies?.[metadata.name]
      ? "Development"
      : "Transitive";
  const location = path.relative(projectRoot, directory).split(path.sep).join("/");
  const key = `${metadata.name}@${metadata.version}`;

  const existingPackage = installedPackages.get(key);
  if (!existingPackage) {
    installedPackages.set(key, {
      name: metadata.name,
      version: metadata.version,
      license,
      dependencyType: directType,
      location,
    });
  } else if (location < existingPackage.location) {
    existingPackage.location = location;
  }

  await scanNodeModules(path.join(directory, "node_modules"));
}

await scanNodeModules(path.join(projectRoot, "node_modules"));
if (installedPackages.size === 0) {
  throw new Error("No npm dependencies found. Install dependencies before generating the report.");
}

const dependencies = [...installedPackages.values()].sort((a, b) => {
  const left = `${a.name}@${a.version}`;
  const right = `${b.name}@${b.version}`;
  return left < right ? -1 : left > right ? 1 : 0;
});

const licenseCounts = Object.fromEntries(
  [...dependencies.reduce((counts, item) => {
    counts.set(item.license, (counts.get(item.license) ?? 0) + 1);
    return counts;
  }, new Map())].sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
);

const inventory = {
  schemaVersion: 1,
  generatedFrom: "installed node_modules package metadata",
  dependencyCount: dependencies.length,
  licenseCounts,
  dependencies,
};

const summary = Object.entries(licenseCounts)
  .map(([license, count]) => `- \`${license}\`: ${count}`)
  .join("\n");
const rows = dependencies
  .map(
    ({ name, version, license, dependencyType }) =>
      `| \`${name}\` | \`${version}\` | \`${license}\` | ${dependencyType} |`
  )
  .join("\n");

const markdown = `# Third-party dependency licenses

Generated from the package metadata of dependencies currently installed in
\`node_modules\`. Run \`bun install\` first so the installed tree matches the
repository's \`bun.lock\`, then regenerate with \`npm run licenses\`.
The generator fails if an installed package has no declared license metadata.

This report lists declared license identifiers, not full license texts. It
includes direct and transitive packages installed for the current environment;
platform-specific optional dependencies may differ on other systems.

## Summary

${summary}

**Installed package versions:** ${dependencies.length}

## Package inventory

| Package | Version | Declared license | Dependency type |
| --- | --- | --- | --- |
${rows}

## Scope and distribution notes

- Check a package's upstream \`LICENSE\` and \`NOTICE\` files before distributing
  a release; package metadata is an index, not legal verification.
- This report does not cover KaapiWerk's own source, remote services, or
  non-npm materials such as images, fonts, and other assets. Check those
  separately and retain any required notices.
- Development dependencies are included for transparency; this does not mean
  every listed package ships in the production site.
`;

await writeFile("docs/DEPENDENCY_LICENSES.md", markdown);
await writeFile(
  "docs/dependency-licenses.json",
  `${JSON.stringify(inventory, null, 2)}\n`
);

console.log(`Wrote license inventory for ${dependencies.length} installed packages.`);
