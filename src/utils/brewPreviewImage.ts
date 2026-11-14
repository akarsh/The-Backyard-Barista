export function getBrewPreviewImageUrl(method: string): string {
  const normalizedMethod = method.toLowerCase();
  let artwork: string;

  if (normalizedMethod.includes("pour") || normalizedMethod.includes("v60")) {
    artwork = `
      <path d="M91 28h138l-40 65h-58z" fill="#F8F5EE"/>
      <path d="M105 37h110M112 50h94M120 64h78M129 78h60" fill="none" stroke="#B45309" stroke-width="3"/>
      <path d="M151 94v14m0 0c-5 5-5 9 0 11 5-2 5-6 0-11" fill="none"/>
      <path d="M91 119h120l-13 30h-94z" fill="#F8F5EE"/>
      <path d="M211 125h15a12 12 0 0 1 0 24h-20" fill="none"/>
      <path d="M111 128h78" stroke="#A62C1B" stroke-width="6"/>
    `;
  } else if (normalizedMethod.includes("espresso")) {
    artwork = `
      <path d="M76 30h168v46H76z" fill="#F8F5EE"/>
      <path d="M91 42h138M112 77v18m96-18v18" fill="none"/>
      <path d="M140 77v20m0 0c-7 7-7 12 0 15 7-3 7-8 0-15" fill="none"/>
      <path d="M113 111h92l-8 38h-76z" fill="#F8F5EE"/>
      <path d="M205 119h14a15 15 0 0 1 0 30h-19" fill="none"/>
      <path d="M125 122h68" stroke="#A62C1B" stroke-width="7"/>
    `;
  } else if (normalizedMethod.includes("flat")) {
    artwork = `
      <path d="M108 45h104l-9 98a10 10 0 0 1-10 9h-66a10 10 0 0 1-10-9z" fill="#F8F5EE"/>
      <path d="M110 89h100" stroke="#A62C1B" stroke-width="28"/>
      <path d="M132 55v30m26-30v30m26-30v30" fill="none" stroke="#B45309" stroke-width="3"/>
      <path d="M209 68h16a21 21 0 0 1 0 42h-15" fill="none"/>
    `;
  } else if (normalizedMethod.includes("aero")) {
    artwork = `
      <path d="M113 31h94l-8 79h-78z" fill="#F8F5EE"/>
      <path d="M105 31h110M124 46h72m-68 16h64m-60 16h56" fill="none"/>
      <path d="M160 111v16" fill="none"/>
      <path d="M117 127h86l-8 22h-70z" fill="#F8F5EE"/>
      <path d="M203 131h13a9 9 0 0 1 0 18h-17" fill="none"/>
      <path d="M130 135h58" stroke="#A62C1B" stroke-width="6"/>
    `;
  } else if (normalizedMethod.includes("cold")) {
    artwork = `
      <path d="M120 29h80v20l12 94a11 11 0 0 1-11 12h-82a11 11 0 0 1-11-12l12-94z" fill="#F8F5EE"/>
      <path d="M120 91h80l9 54a11 11 0 0 1-11 10h-82a11 11 0 0 1-11-10z" fill="#A62C1B"/>
      <path d="M132 101l18-14 17 14-18 17zM165 126l14-11 15 12-15 13z" fill="#F8F5EE" fill-opacity=".85" stroke="none"/>
      <path d="M123 49h74m-65-9h56" fill="none" stroke="#B45309" stroke-width="3"/>
    `;
  } else if (normalizedMethod.includes("cortado")) {
    artwork = `
      <path d="M108 83h104l-9 61a10 10 0 0 1-10 9h-66a10 10 0 0 1-10-9z" fill="#F8F5EE"/>
      <path d="M112 112h96" stroke="#A62C1B" stroke-width="23"/>
      <path d="M212 91h14a20 20 0 0 1 0 40h-13" fill="none"/>
      <path d="M137 99c8-13 39-13 47 0-10 10-37 10-47 0z" fill="#B45309" stroke="none"/>
    `;
  } else {
    artwork = `
      <path d="M102 91h112l-11 58h-90z" fill="#F8F5EE"/>
      <path d="M213 101h15a20 20 0 0 1 0 40h-18" fill="none"/>
      <path d="M116 102h84" stroke="#A62C1B" stroke-width="9"/>
      <path d="M144 105c-18-8-13-21 0-26 13 5 18 18 0 26zm0 0c0-14 7-24 19-28" fill="none" stroke="#B45309" stroke-width="4"/>
      <path d="M151 83c-10-13 0-23 13-21 8 10 4 20-13 21z" fill="#B45309" stroke="none"/>
    `;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180">
      <rect width="320" height="180" rx="18" fill="#EFE9DC"/>
      <circle cx="251" cy="43" r="29" fill="#B45309" fill-opacity=".12"/>
      <path d="M30 157h260" stroke="#5C534A" stroke-opacity=".4" stroke-width="2"/>
      <g stroke="#191614" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
        ${artwork}
      </g>
    </svg>
  `;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
