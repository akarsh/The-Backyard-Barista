export type LanguageCode = "en" | "de" | "te";

export interface AppTranslations {
  brandName: string;
  brandSubline: string;
  accessibility: {
    primaryNavigation: string;
    mobileNavigation: string;
    languageSelector: string;
    languageAndThemeControls: string;
    colorTheme: string;
    closeJournal: string;
    closeTimer: string;
    closeVisualization: string;
    closeShoppingList: string;
    messageMilo: string;
    architectureMode: string;
    usernameOrEmail: string;
    removeRecipe: string;
  };
  nav: {
    studio: string;
    journal: string;
    origins: string;
    roastMilk: string;
    systemMap: string;
    mobileStudio: string;
    mobileJournal: string;
    mobileOrigins: string;
    mobileSystem: string;
    signIn: string;
    openJournal: string;
  };
  theme: {
    auto: string;
    light: string;
    dark: string;
  };
  scrollToTop: string;
  hero: {
    eyebrow: string;
    nativeLine: string;
    headline: string;
    description: string;
    ctaCraft: string;
    ctaAsk: string;
    pills: [string, string, string];
    cardCaptionTitle: string;
    cardCaptionSub: string;
    metrics: {
      lotsLabel: string;
      roastLabel: string;
      roastValue: string;
      milkLabel: string;
      milkValue: string;
      tempLabel: string;
    };
  };
  studio: {
    eyebrow: string;
    title: string;
    subtitle: string;
    controlsTitle: string;
    reset: string;
    flavorDirection: string;
    selectOneOrMore: string;
    selectedCount: string;
    brewMethod: string;
    servingTemp: string;
    hot: string;
    iced: string;
    bodyIntensity: string;
    bodyLight: string;
    bodyBalanced: string;
    bodyBold: string;
    originLot: string;
    baristaChoiceMatch: string;
    roastProfile: string;
    milkAlternative: string;
    additionalNotes: string;
    notesPlaceholder: string;
    localPreviewNotice: string;
    previewLocalBrews: string;
    hideLocalPreviews: string;
    localPreviewsTitle: string;
    localPreviewsSubtitle: string;
    localPreviewCurrent: string;
    localPreviewUse: string;
    localPreviewApplied: string;
    crafting: string;
    craftBtn: string;
    visualizeBrew: string;
    rendering: string;
    copyRecipe: string;
    copied: string;
    shoppingList: string;
    hideList: string;
    brewTimer: string;
    hideTimer: string;
    saveToJournal: string;
    savedToJournal: string;
    regenerate: string;
    baristaNoteTitle: string;
    selectedBean: string;
    roastCurve: string;
    milkTexture: string;
    extractionParams: string;
    dose: string;
    yieldWater: string;
    ratio: string;
    waterTemp: string;
    grind: string;
    targetTime: string;
    dialInTip: string;
    consultMilo: string;
    consultSubtitle: string;
    quickPrompts: string[];
    you: string;
    miloRole: string;
    brewSheetUpdated: string;
    miloThinking: string;
    chatPlaceholder: string;
    send: string;
  };
  timer: {
    activeTitle: string;
    totalRemaining: string;
    step: string;
    completeTitle: string;
    completeSub: string;
    currentStep: string;
    targetSuffix: string;
    upNext: string;
    pause: string;
    resume: string;
    nextStep: string;
    brewAgain: string;
    restart: string;
    done: string;
    active: string;
    queued: string;
  };
  shopping: {
    title: string;
    subtitle: string;
    copyList: string;
    copied: string;
    ingredients: string;
    equipment: string;
    plainTextPreview: string;
  };
  journal: {
    eyebrow: string;
    title: string;
    subtitle: string;
    accessTitle: string;
    accessDesc: string;
    inputPlaceholder: string;
    signingIn: string;
    openJournalBtn: string;
    signedInAs: string;
    recipeSingular: string;
    recipePlural: string;
    inJournalKey: string;
    exportJson: string;
    githubSyncBtn: string;
    signOut: string;
    syncTitle: string;
    syncDescPrefix: string;
    syncDescSuffix: string;
    repoLabel: string;
    branchLabel: string;
    patLabel: string;
    syncing: string;
    commitJson: string;
    viewCommit: string;
    emptyTitlePrefix: string;
    emptyDesc: string;
    copy: string;
    copied: string;
    loadIntoStudio: string;
  };
  origins: {
    eyebrow: string;
    title: string;
    subtitle: string;
    loadIntoStudio: string;
    matrixEyebrow: string;
    matrixTitle: string;
    photoTag: string;
    photoHeading: string;
    roastProfiles: string;
    milkAlternatives: string;
  };
  diagram: {
    eyebrow: string;
    title: string;
    serverModeBtn: string;
    staticModeBtn: string;
    stage1Tag: string;
    stage1Title: string;
    stage1Desc: string;
    stage1Foot: string;
    stage2aTag: string;
    stage2aTitle: string;
    stage2aDesc: string;
    stage2bTag: string;
    stage2bTitle: string;
    stage2bDesc: string;
    stage3Tag: string;
    stage3Title: string;
    stage3Desc: string;
    stage3Foot: string;
    stage4Tag: string;
    stage4Title: string;
    stage4Desc: string;
    stage4Foot: string;
    trust1Title: string;
    trust1Desc: string;
    trust2Title: string;
    trust2Desc: string;
    trust3Title: string;
    trust3Desc: string;
  };
  drawer: {
    title: string;
    localLabel: string;
    signInPromptTitle: string;
    signInPromptDesc: string;
    goToSignIn: string;
    emptyTitle: string;
    emptyDesc: string;
    loadRecipe: string;
  };
  footer: {
    copyright: string;
    nativeLine: string;
    quickDrawer: string;
  };
}

export const TRANSLATIONS: Record<LanguageCode, AppTranslations> = {
  en: {
    brandName: "KaapiWerk",
    brandSubline: "Akarsh Seggemu · Coffee Barista",
    accessibility: {
      primaryNavigation: "Primary navigation",
      mobileNavigation: "Mobile quick navigation",
      languageSelector: "Language selector",
      languageAndThemeControls: "Language, theme, and scroll controls",
      colorTheme: "Color theme",
      closeJournal: "Close recipe journal",
      closeTimer: "Close brew timer",
      closeVisualization: "Close brew visualization",
      closeShoppingList: "Close shopping list",
      messageMilo: "Message Milo the barista",
      architectureMode: "Inspect architecture mode",
      usernameOrEmail: "Username or email",
      removeRecipe: "Remove recipe",
    },
    nav: {
      studio: "Craft Studio",
      journal: "Recipe Journal",
      origins: "Single Origins",
      roastMilk: "Roast & Milk",
      systemMap: "System Map",
      mobileStudio: "Studio",
      mobileJournal: "Journal",
      mobileOrigins: "Origins",
      mobileSystem: "System",
      signIn: "Sign In",
      openJournal: "Recipe Journal",
    },
    theme: {
      auto: "Auto (System)",
      light: "Light",
      dark: "Dark",
    },
    scrollToTop: "Scroll to top",
    hero: {
      eyebrow: "Akarsh Seggemu · Berlin · Bhagyanagaram",
      nativeLine: "Telangana Kaapi · Berliner Rösterei",
      headline: "Craft your signature cup, guided by flavor.",
      description:
        "Blending South Indian Telangana Kaapi hospitality with Berlin micro-roastery precision. Tell Milo your preferred flavor notes, roast curve, and milk style for exact gram-by-gram recipes.",
      ctaCraft: "Craft Your Cup",
      ctaAsk: "Ask the Barista",
      pills: [
        "Direct-Trade Micro-Lots",
        "Custom Roast Development",
        "Plant & Dairy Microfoam Pairing",
      ],
      cardCaptionTitle: "KaapiWerk Bar",
      cardCaptionSub: "93°C Precision Bloom · 1:16 Extraction",
      metrics: {
        lotsLabel: "Curated Origin Lots",
        roastLabel: "Roast Development",
        roastValue: "4 Curves",
        milkLabel: "Milk & Botanical Pairings",
        milkValue: "6 Textures",
        tempLabel: "Target Brew Water",
      },
    },
    studio: {
      eyebrow: "01. Interactive Workbench",
      title: "Dial in your flavor profile",
      subtitle:
        "Select your flavor notes and brew preferences, or lock in a specific roast and milk alternative. Milo will calibrate the exact recipe.",
      controlsTitle: "Taste & Brew Controls",
      reset: "Reset",
      flavorDirection: "Flavor Direction",
      selectOneOrMore: "Select 1 or more",
      selectedCount: "selected",
      brewMethod: "Brew Method",
      servingTemp: "Serving Temperature",
      hot: "Hot",
      iced: "Iced",
      bodyIntensity: "Body & Intensity",
      bodyLight: "Light & Tea-Like",
      bodyBalanced: "Balanced",
      bodyBold: "Syrupy & Bold",
      originLot: "Single-Origin Bean Lot",
      baristaChoiceMatch: "Barista Choice (Match to Flavors)",
      roastProfile: "Roast Profile",
      milkAlternative: "Milk Alternative",
      additionalNotes: "Additional Notes (Optional)",
      notesPlaceholder: "e.g., Low acidity, silky texture, afternoon drink",
      localPreviewNotice:
        "Explore local brew previews based on your current settings. They work without Gemini.",
      previewLocalBrews: "Preview local brews",
      hideLocalPreviews: "Hide brew previews",
      localPreviewsTitle: "Local brew previews",
      localPreviewsSubtitle:
        "Each option keeps your selected flavors, serving temperature, body, origin, roast and milk; only the brew method changes. These deterministic previews don't use Gemini.",
      localPreviewCurrent: "Current method",
      localPreviewUse: "Use this brew",
      localPreviewApplied:
        "Loaded a local brew preview based on your settings. This recipe was created without Gemini.",
      crafting: "Crafting your brew sheet...",
      craftBtn: "Craft Recommendation",
      visualizeBrew: "Visualize Brew",
      rendering: "Rendering...",
      copyRecipe: "Copy Recipe",
      copied: "Copied",
      shoppingList: "Shopping List",
      hideList: "Hide List",
      brewTimer: "Brew Timer",
      hideTimer: "Hide Timer",
      saveToJournal: "Save to Journal",
      savedToJournal: "Saved to Journal",
      regenerate: "Regenerate",
      baristaNoteTitle: "Milo's Barista Note",
      selectedBean: "Selected Bean",
      roastCurve: "Roast Curve",
      milkTexture: "Milk & Texture",
      extractionParams: "Extraction Parameters",
      dose: "Dose",
      yieldWater: "Yield / Water",
      ratio: "Ratio",
      waterTemp: "Water Temp",
      grind: "Grind",
      targetTime: "Target Time",
      dialInTip: "Dial-In Tip:",
      consultMilo: "Consult Milo",
      consultSubtitle:
        "Ask follow-up questions or tell Milo to modify this recipe in real time.",
      quickPrompts: [
        "Make this iced",
        "Swap to macadamia milk",
        "How do I avoid bitterness?",
        "Adjust for a sweeter finish",
      ],
      you: "You",
      miloRole: "Milo · Head Barista",
      brewSheetUpdated: "Brew sheet updated",
      miloThinking: "Milo is dialing in an answer...",
      chatPlaceholder: "Ask Milo to swap milk, go iced, or refine grind size...",
      send: "Send",
    },
    timer: {
      activeTitle: "Active Brew Timer",
      totalRemaining: "Total Remaining",
      step: "Step",
      completeTitle: "Brew complete — enjoy your cup",
      completeSub: "is ready to serve",
      currentStep: "Current Step",
      targetSuffix: "s target",
      upNext: "Up next",
      pause: "Pause",
      resume: "Resume",
      nextStep: "Next Step",
      brewAgain: "Brew Again",
      restart: "Restart",
      done: "Done",
      active: "Active",
      queued: "Queued",
    },
    shopping: {
      title: "Copy-Paste Grocery & Gear List",
      subtitle: "Formatted for Apple Notes, Google Keep, or Notion checklists",
      copyList: "Copy List",
      copied: "Copied",
      ingredients: "Ingredients",
      equipment: "Equipment",
      plainTextPreview: "Plain-text preview",
    },
    journal: {
      eyebrow: "02. Repository Recipe Journal",
      title: "Your saved caffeine creations",
      subtitle:
        "Passwordless sign-in with just your username or email. Entries sync with the static repository JSON database at zero cloud database cost.",
      accessTitle: "Passwordless Journal Access",
      accessDesc:
        "Enter your username or email address to unlock your personal recipe journal. Your identifier is hashed locally with SHA-256 so raw email addresses are never exposed in public repository files.",
      inputPlaceholder: "Username or email (e.g. alex@domain.com)",
      signingIn: "Signing in...",
      openJournalBtn: "Open Journal",
      signedInAs: "Signed in as",
      recipeSingular: "recipe",
      recipePlural: "recipes",
      inJournalKey: "in journal · Static JSON key",
      exportJson: "Export Repo JSON",
      githubSyncBtn: "GitHub Repo Sync",
      signOut: "Sign Out",
      syncTitle: "Direct GitHub Repository Database Sync",
      syncDescPrefix: "Commits the updated",
      syncDescSuffix:
        "file directly to your repository from GitHub Pages. Your token stays in memory only and is cleared on sign-out or refresh.",
      repoLabel: "Repository (owner/name)",
      branchLabel: "Branch",
      patLabel: "Fine-Grained PAT (Contents: Read & Write)",
      syncing: "Syncing...",
      commitJson: "Commit JSON",
      viewCommit: "View commit",
      emptyTitlePrefix: "No saved creations yet for",
      emptyDesc:
        "Craft any custom coffee recipe in the studio above and click Save to Journal. Your creations will be waiting here whenever you sign back in.",
      copy: "Copy",
      copied: "Copied",
      loadIntoStudio: "Load into Studio",
    },
    origins: {
      eyebrow: "03. Seasonal Micro-Lots",
      title: "Single-origin beans on bar",
      subtitle:
        "Load any lot directly into the crafting studio to have Milo build an extraction profile around its terroir.",
      loadIntoStudio: "Load into Studio",
      matrixEyebrow: "04. Pairing Matrix",
      matrixTitle: "Click any roast curve or milk base to test in the studio",
      photoTag: "Roast & Milk Chemistry",
      photoHeading: "Balancing origin acidity with microfoam sweetness",
      roastProfiles: "Roast Profiles",
      milkAlternatives: "Milk & Plant Alternatives",
    },
    diagram: {
      eyebrow: "05. System Map for Humans",
      title: "How your cup is crafted & stored",
      serverModeBtn: "Live AI Server Mode",
      staticModeBtn: "Static GitHub.io Mode",
      stage1Tag: "01 · Browser UI",
      stage1Title: "Flavor & Gear Controls",
      stage1Desc:
        "You pick flavor direction, brew method, temperature, roast curve, and milk base.",
      stage1Foot: "React + Tailwind UI",
      stage2aTag: "02A · Express + Gemini AI",
      stage2aTitle: "Server-Side AI Barista & Image Render",
      stage2aDesc:
        "Rate-limited /api/barista/* routes call Gemini securely using server env keys (never exposed to browser).",
      stage2bTag: "02B · Static Browser Engine",
      stage2bTitle: "Zero-Cost GitHub Pages Fallback",
      stage2bDesc:
        "When hosted statically on github.io (HTTP 404/405), built-in barista logic crafts recipes 100% locally.",
      stage3Tag: "03 · Workbench",
      stage3Title: "Brew Sheet & Active Tools",
      stage3Desc:
        "Drives the phased Brew Timer, Shopping Checklist, Emoji Copy, Visual Render, and Milo Chat.",
      stage3Foot: "Exact g / ml / °C specs",
      stage4Tag: "04 · Repo DB",
      stage4Title: "Static JSON + SHA-256 Auth",
      stage4Desc:
        "Usernames are hashed locally via Web Crypto. Saved drinks merge localStorage and recipe-journal.json.",
      stage4Foot: "$0 Cloud Database Cost",
      trust1Title: "Zero Raw Emails Stored",
      trust1Desc:
        "Identifiers are hashed in-browser with SHA-256 and display masked handles before any JSON export or GitHub commit.",
      trust2Title: "Memory-Only GitHub Token",
      trust2Desc:
        "Optional Fine-Grained PATs stay strictly in React state and are cleared immediately when you sign out or refresh.",
      trust3Title: "Hardened API & JSON Parsing",
      trust3Desc:
        "Prototype-pollution stripping, 64KB body limits, and 30 req/min IP rate limiting guard every barista request.",
    },
    drawer: {
      title: "Recipe Journal",
      localLabel: "local",
      signInPromptTitle: "Sign in with your username or email",
      signInPromptDesc:
        "Access your saved creations across sessions and sync with the static repository JSON database.",
      goToSignIn: "Go to Journal Sign In",
      emptyTitle: "No saved recipes yet",
      emptyDesc:
        "Craft a coffee profile in the studio and click Save to Journal to store your favorite bean, roast, and milk combinations.",
      loadRecipe: "Load Recipe",
    },
    footer: {
      copyright: "© 2026 Akarsh Seggemu · KaapiWerk",
      nativeLine: "Telangana Kaapi · Berlin · Bhagyanagaram",
      quickDrawer: "Quick Drawer",
    },
  },
  de: {
    brandName: "KaapiWerk",
    brandSubline: "Akarsh Seggemu · Kaffeeröster & Barista",
    accessibility: {
      primaryNavigation: "Hauptnavigation",
      mobileNavigation: "Mobile Schnellnavigation",
      languageSelector: "Sprachauswahl",
      languageAndThemeControls: "Steuerung für Sprache, Farbschema und Seitenanfang",
      colorTheme: "Farbschema",
      closeJournal: "Rezept-Journal schließen",
      closeTimer: "Brüh-Timer schließen",
      closeVisualization: "Brühvisualisierung schließen",
      closeShoppingList: "Einkaufsliste schließen",
      messageMilo: "Milo, dem Barista, eine Nachricht senden",
      architectureMode: "Architekturmodus auswählen",
      usernameOrEmail: "Benutzername oder E-Mail-Adresse",
      removeRecipe: "Rezept entfernen",
    },
    nav: {
      studio: "Brüh-Studio",
      journal: "Rezept-Journal",
      origins: "Single Origins",
      roastMilk: "Röstung & Milch",
      systemMap: "Systemkarte",
      mobileStudio: "Studio",
      mobileJournal: "Journal",
      mobileOrigins: "Origins",
      mobileSystem: "System",
      signIn: "Anmelden",
      openJournal: "Rezept-Journal",
    },
    theme: {
      auto: "Auto (System)",
      light: "Hell",
      dark: "Dunkel",
    },
    scrollToTop: "Nach oben scrollen",
    hero: {
      eyebrow: "Akarsh Seggemu · Berlin · Bhagyanagaram",
      nativeLine: "Telangana-Kaapi · Berliner Rösterei",
      headline: "Kreiere deine persönliche Tasse, geführt vom Geschmack.",
      description:
        "Südindische Telangana-Kaapi-Gastfreundschaft trifft auf Berliner Mikrorösterei-Präzision. Nenne Milo deine gewünschten Aromen, deine Röstkurve und deine Milchwahl für grammgenaue Brührezepte.",
      ctaCraft: "Tasse kreieren",
      ctaAsk: "Barista fragen",
      pills: [
        "Direkthandel-Mikrolots",
        "Präzise Röstentwicklung",
        "Milch- & Pflanzenschaum-Pairing",
      ],
      cardCaptionTitle: "KaapiWerk Bar",
      cardCaptionSub: "93°C Präzisions-Bloom · 1:16 Extraktion",
      metrics: {
        lotsLabel: "Ausgewählte Origin-Lots",
        roastLabel: "Röstprofile",
        roastValue: "4 Kurven",
        milkLabel: "Milch & Alternativen",
        milkValue: "6 Texturen",
        tempLabel: "Ziel-Brühtemperatur",
      },
    },
    studio: {
      eyebrow: "01. Interaktive Werkbank",
      title: "Stimme dein Aromaprofil ab",
      subtitle:
        "Wähle Geschmacksnoten und Brühmethode oder lege eine Röstung und Milchalternative fest. Milo kalibriert das exakte Rezept.",
      controlsTitle: "Geschmack & Parameter",
      reset: "Zurücksetzen",
      flavorDirection: "Geschmacksrichtung",
      selectOneOrMore: "1 oder mehr wählen",
      selectedCount: "gewählt",
      brewMethod: "Brühmethode",
      servingTemp: "Serviertemperatur",
      hot: "Heiß",
      iced: "Eisgekühlt",
      bodyIntensity: "Körper & Intensität",
      bodyLight: "Leicht & teeartig",
      bodyBalanced: "Ausgewogen",
      bodyBold: "Sirupartig & kräftig",
      originLot: "Single-Origin-Bohnenlot",
      baristaChoiceMatch: "Barista-Wahl (passend zu Aromen)",
      roastProfile: "Röstprofil",
      milkAlternative: "Milchalternative",
      additionalNotes: "Zusätzliche Notizen (Optional)",
      notesPlaceholder: "z. B. wenig Säure, seidige Textur, für den Nachmittag",
      localPreviewNotice:
        "Sieh dir lokale Brühvorschauen mit deinen aktuellen Einstellungen an – ganz ohne Gemini.",
      previewLocalBrews: "Lokale Brühoptionen ansehen",
      hideLocalPreviews: "Brühvorschauen ausblenden",
      localPreviewsTitle: "Lokale Brühvorschauen",
      localPreviewsSubtitle:
        "Jede Option übernimmt deine gewählten Aromen, Serviertemperatur, Körper, Ursprung, Röstung und Milch; nur die Brühmethode ändert sich. Diese Vorschauen benötigen Gemini nicht.",
      localPreviewCurrent: "Aktuelle Methode",
      localPreviewUse: "Dieses Rezept wählen",
      localPreviewApplied:
        "Eine lokale Brühvorschau mit deinen Einstellungen wurde geladen. Dieses Rezept wurde ohne Gemini erstellt.",
      crafting: "Brühblatt wird erstellt...",
      craftBtn: "Rezept kreieren",
      visualizeBrew: "Visualisieren",
      rendering: "Wird gerendert...",
      copyRecipe: "Kopieren",
      copied: "Kopiert",
      shoppingList: "Einkaufsliste",
      hideList: "Liste ausblenden",
      brewTimer: "Brüh-Timer",
      hideTimer: "Timer ausblenden",
      saveToJournal: "Im Journal speichern",
      savedToJournal: "Gespeichert",
      regenerate: "Neu generieren",
      baristaNoteTitle: "Milos Barista-Notiz",
      selectedBean: "Gewählte Bohne",
      roastCurve: "Röstkurve",
      milkTexture: "Milch & Textur",
      extractionParams: "Extraktions-Parameter",
      dose: "Dosis",
      yieldWater: "Ertrag / Wasser",
      ratio: "Verhältnis",
      waterTemp: "Wassertemp.",
      grind: "Mahlgrad",
      targetTime: "Zielzeit",
      dialInTip: "Barista-Tipp:",
      consultMilo: "Milo fragen",
      consultSubtitle:
        "Stelle Rückfragen oder lass Milo das Rezept direkt in Echtzeit anpassen.",
      quickPrompts: [
        "Als Iced-Variante zubereiten",
        "Auf Macadamia-Milch wechseln",
        "Wie vermeide ich Bitterkeit?",
        "Süßeres Finish abstimmen",
      ],
      you: "Du",
      miloRole: "Milo · Chef-Barista",
      brewSheetUpdated: "Rezept aktualisiert",
      miloThinking: "Milo stimmt eine Antwort ab...",
      chatPlaceholder:
        "Frag Milo nach anderer Milch, Eis-Variante oder Mahlgrad...",
      send: "Senden",
    },
    timer: {
      activeTitle: "Aktiver Brüh-Timer",
      totalRemaining: "Restzeit gesamt",
      step: "Schritt",
      completeTitle: "Brühvorgang fertig — genieße deine Tasse",
      completeSub: "ist servierbereit",
      currentStep: "Aktueller Schritt",
      targetSuffix: " Sek. Ziel",
      upNext: "Als Nächstes",
      pause: "Pause",
      resume: "Weiter",
      nextStep: "Nächster Schritt",
      brewAgain: "Neu brühen",
      restart: "Neustart",
      done: "Fertig",
      active: "Aktiv",
      queued: "Wartet",
    },
    shopping: {
      title: "Einkaufs- & Equipment-Liste",
      subtitle: "Formatiert für Apple Notizen, Google Keep oder Notion",
      copyList: "Liste kopieren",
      copied: "Kopiert",
      ingredients: "Zutaten",
      equipment: "Ausrüstung",
      plainTextPreview: "Klartext-Vorschau",
    },
    journal: {
      eyebrow: "02. Repository Rezept-Journal",
      title: "Deine gespeicherten Kreationen",
      subtitle:
        "Passwortlose Anmeldung nur mit Benutzername oder E-Mail-Adresse. Einträge werden ohne Cloud-Kosten mit der statischen JSON-Datenbank synchronisiert.",
      accessTitle: "Passwortloser Journal-Zugang",
      accessDesc:
        "Gib deinen Benutzernamen oder deine E-Mail-Adresse ein. Deine Kennung wird lokal per SHA-256 gehasht, sodass niemals Klartext-E-Mail-Adressen im Repository landen.",
      inputPlaceholder:
        "Benutzername oder E-Mail-Adresse (z. B. alex@domain.de)",
      signingIn: "Wird angemeldet...",
      openJournalBtn: "Journal öffnen",
      signedInAs: "Angemeldet als",
      recipeSingular: "Rezept",
      recipePlural: "Rezepte",
      inJournalKey: "im Journal · Statischer JSON-Key",
      exportJson: "JSON exportieren",
      githubSyncBtn: "GitHub Repo-Sync",
      signOut: "Abmelden",
      syncTitle: "Direkter GitHub Repository-Sync",
      syncDescPrefix: "Speichert die aktualisierte",
      syncDescSuffix:
        "direkt von GitHub Pages per Commit im Repository. Dein Token bleibt nur im Arbeitsspeicher und wird beim Abmelden oder Neuladen gelöscht.",
      repoLabel: "GitHub-Konto/Repository",
      branchLabel: "Branch",
      patLabel: "Fine-Grained PAT (Contents: Read & Write)",
      syncing: "Synchronisiert...",
      commitJson: "JSON committen",
      viewCommit: "Commit ansehen",
      emptyTitlePrefix: "Noch keine Rezepte für",
      emptyDesc:
        "Kreiere oben ein Kaffeerezept und klicke auf „Im Journal speichern“. Deine Kreationen warten hier beim nächsten Login.",
      copy: "Kopieren",
      copied: "Kopiert",
      loadIntoStudio: "Ins Studio laden",
    },
    origins: {
      eyebrow: "03. Saisonale Micro-Lots",
      title: "Single-Origin-Bohnen an der Bar",
      subtitle:
        "Lade jedes Lot direkt ins Studio, damit Milo ein Extraktionsprofil passend zum Terroir erstellt.",
      loadIntoStudio: "Ins Studio laden",
      matrixEyebrow: "04. Pairing-Matrix",
      matrixTitle:
        "Klicke auf eine Röstkurve oder Milchbasis zum Testen im Studio",
      photoTag: "Röst- & Milchchemie",
      photoHeading:
        "Herkunftssäure mit der Süße von Mikroschaum ausbalancieren",
      roastProfiles: "Röstprofile",
      milkAlternatives: "Milch & Pflanzendrinks",
    },
    diagram: {
      eyebrow: "05. Systemkarte für Menschen",
      title: "Wie deine Tasse kreiert & gespeichert wird",
      serverModeBtn: "Live-KI-Server-Modus",
      staticModeBtn: "Statischer GitHub.io-Modus",
      stage1Tag: "01 · Browser-UI",
      stage1Title: "Aroma- & Brüh-Steuerung",
      stage1Desc:
        "Du wählst Aromen, Brühmethode, Temperatur, Röstkurve und Milchbasis.",
      stage1Foot: "React + Tailwind UI",
      stage2aTag: "02A · Express + Gemini KI",
      stage2aTitle: "Serverseitiger KI-Barista & Foto",
      stage2aDesc:
        "Rate-limitierte /api/barista/*-Routen nutzen Gemini sicher über Server-Schlüssel.",
      stage2bTag: "02B · Statische Browser-Engine",
      stage2bTitle: "Kostenloses GitHub-Pages-Fallback",
      stage2bDesc:
        "Auf github.io (HTTP 404/405) berechnet eingebaute Barista-Logik Rezepte 100 % lokal.",
      stage3Tag: "03 · Werkbank",
      stage3Title: "Brühblatt & Aktive Tools",
      stage3Desc:
        "Steuert den Phasen-Timer, die Einkaufsliste, den Emoji-Export, das Foto-Rendering & den Milo-Chat.",
      stage3Foot: "Exakte g / ml / °C Werte",
      stage4Tag: "04 · Repo-DB",
      stage4Title: "Statisches JSON + SHA-256",
      stage4Desc:
        "Namen werden lokal per Web Crypto gehasht und mit recipe-journal.json zusammengeführt.",
      stage4Foot: "0 € Datenbank-Kosten",
      trust1Title: "Keine Klartext-E-Mails",
      trust1Desc:
        "Kennungen werden im Browser mit SHA-256 gehasht und vor jedem Export maskiert.",
      trust2Title: "Token nur im Speicher",
      trust2Desc:
        "Optionale GitHub-PATs bleiben im React-State und werden beim Abmelden sofort gelöscht.",
      trust3Title: "Gehärtete API & JSON",
      trust3Desc:
        "Prototype-Pollution-Schutz, 64-KB-Limits und ein Rate-Limit von 30 Anfragen/Min. schützen alle Anfragen.",
    },
    drawer: {
      title: "Rezept-Journal",
      localLabel: "lokal",
      signInPromptTitle: "Mit Benutzername oder E-Mail-Adresse anmelden",
      signInPromptDesc:
        "Greife sitzungsübergreifend auf deine gespeicherten Rezepte zu und synchronisiere sie mit dem Repo.",
      goToSignIn: "Zum Journal-Login",
      emptyTitle: "Noch keine Rezepte gespeichert",
      emptyDesc:
        "Erstelle oben ein Kaffeeprofil und klicke auf „Im Journal speichern“.",
      loadRecipe: "Rezept laden",
    },
    footer: {
      copyright: "© 2026 Akarsh Seggemu · KaapiWerk",
      nativeLine: "Telangana-Kaapi · Berlin · Bhagyanagaram",
      quickDrawer: "Schnellzugriff",
    },
  },
  te: {
    brandName: "కాపీవెర్క్",
    brandSubline: "ఆకర్ష్ సెగ్గెము · కాఫీ బారిస్టా",
    accessibility: {
      primaryNavigation: "ప్రధాన నావిగేషన్",
      mobileNavigation: "మొబైల్ త్వరిత నావిగేషన్",
      languageSelector: "భాష ఎంపిక",
      languageAndThemeControls: "భాష, థీమ్ మరియు పైకి వెళ్లే నియంత్రణలు",
      colorTheme: "రంగుల థీమ్",
      closeJournal: "రెసిపీ జర్నల్‌ను మూసివేయండి",
      closeTimer: "బ్రూ టైమర్‌ను మూసివేయండి",
      closeVisualization: "కాఫీ చిత్రాన్ని మూసివేయండి",
      closeShoppingList: "షాపింగ్ లిస్ట్‌ను మూసివేయండి",
      messageMilo: "బారిస్టా మైలోకు సందేశం పంపండి",
      architectureMode: "సిస్టమ్ మ్యాప్ విధానాన్ని ఎంచుకోండి",
      usernameOrEmail: "యూజర్‌నేమ్ లేదా ఈమెయిల్",
      removeRecipe: "రెసిపీని తొలగించండి",
    },
    nav: {
      studio: "క్రాఫ్ట్ స్టూడియో",
      journal: "రెసిపీ జర్నల్",
      origins: "సింగిల్ ఆరిజిన్స్",
      roastMilk: "రోస్ట్ & మిల్క్",
      systemMap: "సిస్టమ్ మ్యాప్",
      mobileStudio: "స్టూడియో",
      mobileJournal: "జర్నల్",
      mobileOrigins: "ఆరిజిన్స్",
      mobileSystem: "సిస్టమ్",
      signIn: "సైన్ ఇన్",
      openJournal: "రెసిపీ జర్నల్",
    },
    theme: {
      auto: "ఆటో (సిస్టమ్)",
      light: "లైట్",
      dark: "డార్క్",
    },
    scrollToTop: "పైకి స్క్రోల్ చేయండి",
    hero: {
      eyebrow: "ఆకర్ష్ సెగ్గెము · బెర్లిన్ · భాగ్యనగరం",
      nativeLine: "తెలంగాణ కాఫీ · బెర్లిన్ రోస్టరీ",
      headline: "మీ అభిరుచికి తగిన ప్రత్యేక కాఫీని రూపొందించండి.",
      description:
        "తెలంగాణ ఆతిథ్య కాఫీ రుచిని బెర్లిన్ మైక్రో-రోస్టరీ కచ్చితత్వంతో కలిపి రూపొందించిన స్టూడియో. మీకు ఇష్టమైన రుచులు, రోస్ట్ మరియు పాల ఎంపికను మైలోకు చెప్పండి.",
      ctaCraft: "కాఫీ తయారు చేయండి",
      ctaAsk: "బారిస్టాను అడగండి",
      pills: [
        "డైరెక్ట్-ట్రేడ్ మైక్రో-లాట్స్",
        "కచ్చితమైన రోస్ట్ ప్రొఫైల్స్",
        "మిల్క్ & ప్లాంట్ మైక్రోఫోమ్",
      ],
      cardCaptionTitle: "కాపీవెర్క్ బార్",
      cardCaptionSub: "93°C కచ్చితమైన బ్లూమ్ · 1:16 ఎక్స్‌ట్రాక్షన్",
      metrics: {
        lotsLabel: "ఎంచుకున్న ఆరిజిన్ లాట్స్",
        roastLabel: "రోస్ట్ ప్రొఫైల్స్",
        roastValue: "4 రకాలు",
        milkLabel: "పాలు & ప్రత్యామ్నాయాలు",
        milkValue: "6 టెక్స్చర్లు",
        tempLabel: "నీటి ఉష్ణోగ్రత",
      },
    },
    studio: {
      eyebrow: "01. ఇంటరాక్టివ్ వర్క్‌బెంచ్",
      title: "మీ కాఫీ రుచిని ఎంచుకోండి",
      subtitle:
        "మీకు ఇష్టమైన ఫ్లేవర్ నోట్స్, బ్రూ విధానం లేదా రోస్ట్ & పాలను ఎంచుకోండి. మైలో కచ్చితమైన రెసిపీని సిద్ధం చేస్తారు.",
      controlsTitle: "రుచి & బ్రూ నియంత్రణలు",
      reset: "రీసెట్",
      flavorDirection: "రుచి దిశ",
      selectOneOrMore: "1 లేదా ఎక్కువ ఎంచుకోండి",
      selectedCount: "ఎంపికయ్యాయి",
      brewMethod: "బ్రూ విధానం",
      servingTemp: "సర్వింగ్ ఉష్ణోగ్రత",
      hot: "వేడి (Hot)",
      iced: "చల్లని (Iced)",
      bodyIntensity: "చిక్కదనం & తీవ్రత",
      bodyLight: "తేలిక & టీ లాంటిది",
      bodyBalanced: "సమతుల్యమైనది",
      bodyBold: "చిక్కని & గాఢమైనది",
      originLot: "సింగిల్-ఆరిజిన్ కాఫీ గింజలు",
      baristaChoiceMatch: "బారిస్టా ఎంపిక (రుచులకు తగినది)",
      roastProfile: "రోస్ట్ ప్రొఫైల్",
      milkAlternative: "పాలు / ప్రత్యామ్నాయం",
      additionalNotes: "అదనపు సూచనలు (ఐచ్ఛికం)",
      notesPlaceholder: "ఉదా: తక్కువ ఆమ్లత్వం, మృదువైన టెక్స్చర్, మధ్యాహ్నం కోసం",
      localPreviewNotice:
        "మీ ప్రస్తుత సెట్టింగ్‌లతో స్థానిక బ్రూ ప్రివ్యూలను చూడండి. ఇవి Gemini లేకుండానే పనిచేస్తాయి.",
      previewLocalBrews: "స్థానిక బ్రూ ప్రివ్యూలు చూడండి",
      hideLocalPreviews: "బ్రూ ప్రివ్యూలను దాచండి",
      localPreviewsTitle: "స్థానిక బ్రూ ప్రివ్యూలు",
      localPreviewsSubtitle:
        "ప్రతి ఎంపిక మీరు ఎంచుకున్న రుచులు, సర్వింగ్ ఉష్ణోగ్రత, బాడీ, ఆరిజిన్, రోస్ట్, పాలను ఉపయోగిస్తుంది; బ్రూ విధానం మాత్రమే మారుతుంది. ఈ ప్రివ్యూలకు Gemini అవసరం లేదు.",
      localPreviewCurrent: "ప్రస్తుత విధానం",
      localPreviewUse: "ఈ బ్రూను ఎంచుకోండి",
      localPreviewApplied:
        "మీ సెట్టింగ్‌లతో స్థానిక బ్రూ ప్రివ్యూని లోడ్ చేశాం. ఈ రెసిపీ Gemini లేకుండా రూపొందించబడింది.",
      crafting: "రెసిపీ సిద్ధమవుతోంది...",
      craftBtn: "రెసిపీని తయారు చేయండి",
      visualizeBrew: "ఫొటో చూడండి",
      rendering: "చిత్రీకరిస్తోంది...",
      copyRecipe: "రెసిపీ కాపీ",
      copied: "కాపీ అయింది",
      shoppingList: "షాపింగ్ లిస్ట్",
      hideList: "లిస్ట్ దాచండి",
      brewTimer: "బ్రూ టైమర్",
      hideTimer: "టైమర్ దాచండి",
      saveToJournal: "జర్నల్‌లో సేవ్ చేయండి",
      savedToJournal: "సేవ్ అయింది",
      regenerate: "మళ్ళీ చిత్రీకరించండి",
      baristaNoteTitle: "మైలో బారిస్టా నోట్",
      selectedBean: "ఎంచుకున్న గింజలు",
      roastCurve: "రోస్ట్ కర్వ్",
      milkTexture: "పాలు & టెక్స్చర్",
      extractionParams: "బ్రూ కొలతలు",
      dose: "కాఫీ మోతాదు",
      yieldWater: "నీరు / దిగుబడి",
      ratio: "నిష్పత్తి",
      waterTemp: "నీటి వేడి",
      grind: "గ్రైండ్",
      targetTime: "సమయం",
      dialInTip: "బారిస్టా చిట్కా:",
      consultMilo: "మైలోతో మాట్లాడండి",
      consultSubtitle:
        "సందేహాలు అడగండి లేదా రెసిపీని మార్చమని మైలోకు చెప్పండి.",
      quickPrompts: [
        "దీన్ని ఐస్డ్ కాఫీగా మార్చండి",
        "మకడమియా పాలతో మార్చండి",
        "చేదు తగ్గించడం ఎలా?",
        "మరింత తీపి రుచి కోసం మార్చండి",
      ],
      you: "మీరు",
      miloRole: "మైలో · ప్రధాన బారిస్టా",
      brewSheetUpdated: "రెసిపీ అప్‌డేట్ అయింది",
      miloThinking: "మైలో సమాధానం సిద్ధం చేస్తున్నారు...",
      chatPlaceholder: "పాలు మార్చమని లేదా ఐస్డ్ చేయమని మైలోను అడగండి...",
      send: "పంపండి",
    },
    timer: {
      activeTitle: "లైవ్ బ్రూ టైమర్",
      totalRemaining: "మిగిలిన సమయం",
      step: "దశ",
      completeTitle: "కాఫీ సిద్ధమైంది — ఆస్వాదించండి",
      completeSub: "సర్వ్ చేయడానికి సిద్ధంగా ఉంది",
      currentStep: "ప్రస్తుత దశ",
      targetSuffix: " సె. లక్ష్యం",
      upNext: "తదుపరి",
      pause: "ఆపండి",
      resume: "కొనసాగించండి",
      nextStep: "తదుపరి దశ",
      brewAgain: "మళ్ళీ బ్రూ చేయండి",
      restart: "రీస్టార్ట్",
      done: "పూర్తి",
      active: "నడుస్తోంది",
      queued: "వేచి ఉంది",
    },
    shopping: {
      title: "కావలసిన పదార్థాలు & పరికరాల లిస్ట్",
      subtitle: "Apple Notes, Google Keep లేదా Notion లో పేస్ట్ చేయడానికి సిద్ధం",
      copyList: "లిస్ట్ కాపీ",
      copied: "కాపీ అయింది",
      ingredients: "పదార్థాలు",
      equipment: "పరికరాలు",
      plainTextPreview: "టెక్స్ట్ ప్రివ్యూ",
    },
    journal: {
      eyebrow: "02. రిపోజిటరీ రెసిపీ జర్నల్",
      title: "మీరు సేవ్ చేసిన కాఫీ రెసిపీలు",
      subtitle:
        "పాస్‌వర్డ్ లేకుండా యూజర్‌నేమ్ లేదా ఈమెయిల్‌తో సైన్ ఇన్ చేయండి. మీ రెసిపీలు క్లౌడ్ ఖర్చు లేకుండా స్టాటిక్ GitHub JSONలో భద్రపరచబడతాయి.",
      accessTitle: "పాస్‌వర్డ్ లేని జర్నల్ లాగిన్",
      accessDesc:
        "మీ వ్యక్తిగత జర్నల్ తెరవడానికి యూజర్‌నేమ్ లేదా ఈమెయిల్ నమోదు చేయండి. మీ గుర్తింపు స్థానికంగా SHA-256తో హ్యాష్ అవుతుంది; అసలు ఈమెయిల్ పబ్లిక్ రిపోజిటరీ ఫైళ్లలో నిల్వ చేయబడదు.",
      inputPlaceholder: "యూజర్‌నేమ్ లేదా ఈమెయిల్ (ఉదా: alex@domain.com)",
      signingIn: "లాగిన్ అవుతోంది...",
      openJournalBtn: "జర్నల్ తెరవండి",
      signedInAs: "లాగిన్ అయినవారు:",
      recipeSingular: "రెసిపీ",
      recipePlural: "రెసిపీలు",
      inJournalKey: "జర్నల్‌లో · స్టాటిక్ JSON కీ",
      exportJson: "JSON డౌన్‌లోడ్",
      githubSyncBtn: "GitHub రిపో సింక్",
      signOut: "సైన్ అవుట్",
      syncTitle: "నేరుగా GitHub రిపోజిటరీ సింక్",
      syncDescPrefix: "అప్‌డేట్ చేసిన",
      syncDescSuffix:
        "ఫైల్‌ను GitHub Pages నుండే నేరుగా కమిట్ చేస్తుంది. మీ టోకెన్ మెమరీలో మాత్రమే ఉండి, సైన్ అవుట్ చేసినప్పుడు లేదా పేజీని మళ్లీ లోడ్ చేసినప్పుడు తొలగించబడుతుంది.",
      repoLabel: "GitHub ఖాతా/రిపోజిటరీ",
      branchLabel: "బ్రాంచ్",
      patLabel: "Fine-Grained PAT (Contents: Read & Write)",
      syncing: "సింక్ అవుతోంది...",
      commitJson: "JSON కమిట్ చేయండి",
      viewCommit: "కమిట్ చూడండి",
      emptyTitlePrefix: "ఇంకా సేవ్ చేసిన రెసిపీలు లేవు:",
      emptyDesc:
        "పైన స్టూడియోలో కాఫీ రెసిపీ తయారు చేసి 'జర్నల్‌లో సేవ్ చేయండి' నొక్కండి. మీరు మళ్ళీ లాగిన్ అయినప్పుడు అవన్నీ ఇక్కడ కనిపిస్తాయి.",
      copy: "కాపీ",
      copied: "కాపీ అయింది",
      loadIntoStudio: "స్టూడియోలోకి లోడ్ చేయండి",
    },
    origins: {
      eyebrow: "03. సీజనల్ మైక్రో-లాట్స్",
      title: "బార్‌లో అందుబాటులో ఉన్న సింగిల్-ఆరిజిన్ గింజలు",
      subtitle:
        "ఏదైనా కాఫీ లాట్‌ను స్టూడియోలోకి లోడ్ చేసి దాని రుచికి తగిన ఎక్స్‌ట్రాక్షన్ ప్రొఫైల్ పొందండి.",
      loadIntoStudio: "స్టూడియోలోకి లోడ్ చేయండి",
      matrixEyebrow: "04. పెయిరింగ్ మ్యాట్రిక్స్",
      matrixTitle: "స్టూడియోలో పరీక్షించడానికి రోస్ట్ లేదా పాలను క్లిక్ చేయండి",
      photoTag: "రోస్ట్ & మిల్క్ కెమిస్ట్రీ",
      photoHeading: "గింజల సహజ రుచిని మైక్రోఫోమ్ తీపితో సమన్వయం చేయడం",
      roastProfiles: "రోస్ట్ ప్రొఫైల్స్",
      milkAlternatives: "పాలు & ప్లాంట్ ప్రత్యామ్నాయాలు",
    },
    diagram: {
      eyebrow: "05. సిస్టమ్ మ్యాప్ (అందరికీ అర్థమయ్యేలా)",
      title: "మీ కాఫీ రెసిపీ ఎలా తయారవుతుంది & సేవ్ అవుతుంది",
      serverModeBtn: "లైవ్ AI సర్వర్ మోడ్",
      staticModeBtn: "స్టాటిక్ GitHub.io మోడ్",
      stage1Tag: "01 · బ్రౌజర్ UI",
      stage1Title: "రుచి & పరికరాల ఎంపిక",
      stage1Desc:
        "మీరు రుచి, బ్రూ విధానం, ఉష్ణోగ్రత, రోస్ట్ మరియు పాలను ఎంచుకుంటారు.",
      stage1Foot: "React + Tailwind UI",
      stage2aTag: "02A · Express + Gemini AI",
      stage2aTitle: "సర్వర్-సైడ్ AI బారిస్టా & ఫొటో",
      stage2aDesc:
        "/api/barista/* ద్వారా Gemini AI సురక్షితంగా కనెక్ట్ అవుతుంది (కీలు బ్రౌజర్‌కు వెళ్ళవు).",
      stage2bTag: "02B · స్టాటిక్ బ్రౌజర్ ఇంజిన్",
      stage2bTitle: "ఖర్చు లేని GitHub Pages ఫాల్‌బ్యాక్",
      stage2bDesc:
        "github.io వంటి స్టాటిక్ సైట్లలో (HTTP 404/405) స్థానిక బారిస్టా లాజిక్ పనిచేస్తుంది.",
      stage3Tag: "03 · వర్క్‌బెంచ్",
      stage3Title: "బ్రూ షీట్ & లైవ్ టూల్స్",
      stage3Desc:
        "బ్రూ టైమర్, షాపింగ్ లిస్ట్, ఎమోజీ కాపీ, ఫొటో రెండర్ & మైలో చాట్ నడుస్తాయి.",
      stage3Foot: "కచ్చితమైన g / ml / °C వివరాలు",
      stage4Tag: "04 · రిపో DB",
      stage4Title: "స్టాటిక్ JSON + SHA-256 లాగిన్",
      stage4Desc:
        "పేర్లు Web Crypto తో హ్యాష్ అయ్యి localStorage & recipe-journal.json లో సేవ్ అవుతాయి.",
      stage4Foot: "$0 క్లౌడ్ డేటాబేస్ ఖర్చు",
      trust1Title: "అసలు ఈమెయిల్స్ సేవ్ కావు",
      trust1Desc:
        "యూజర్‌నేమ్ లేదా ఈమెయిల్ బ్రౌజర్‌లోనే SHA-256 తో హ్యాష్ అయ్యి మాస్క్ చేయబడుతుంది.",
      trust2Title: "మెమరీలో మాత్రమే GitHub టోకెన్",
      trust2Desc:
        "మీ GitHub PAT కేవలం React స్టేట్‌లో ఉంటుంది; సైన్ అవుట్ చేస్తే వెంటనే తుడిచివేయబడుతుంది.",
      trust3Title: "సురక్షితమైన API & JSON పార్సింగ్",
      trust3Desc:
        "ప్రోటోటైప్ పొల్యూషన్ రక్షణ, 64KB పరిమితి మరియు నిమిషానికి 30 అభ్యర్థనల రేట్ లిమిటింగ్ భద్రత కల్పిస్తాయి.",
    },
    drawer: {
      title: "రెసిపీ జర్నల్",
      localLabel: "స్థానిక",
      signInPromptTitle: "యూజర్‌నేమ్ లేదా ఈమెయిల్‌తో సైన్ ఇన్ చేయండి",
      signInPromptDesc:
        "మీ సేవ్ చేసిన కాఫీ రెసిపీలను ఎప్పుడైనా చూడండి మరియు స్టాటిక్ GitHub JSON తో సింక్ చేయండి.",
      goToSignIn: "జర్నల్ సైన్ ఇన్‌కు వెళ్ళండి",
      emptyTitle: "ఇంకా సేవ్ చేసిన రెసిపీలు లేవు",
      emptyDesc:
        "స్టూడియోలో కాఫీ రెసిపీ తయారు చేసి 'జర్నల్‌లో సేవ్ చేయండి' నొక్కండి.",
      loadRecipe: "రెసిపీ లోడ్ చేయండి",
    },
    footer: {
      copyright: "© 2026 ఆకర్ష్ సెగ్గెము · కాపీవెర్క్",
      nativeLine: "తెలంగాణ కాఫీ · బెర్లిన్ · భాగ్యనగరం",
      quickDrawer: "త్వరిత డ్రాయర్",
    },
  },
};
