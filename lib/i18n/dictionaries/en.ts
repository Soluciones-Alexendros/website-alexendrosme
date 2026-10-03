import type { TranslationDict } from "../types";

const en: TranslationDict = {
  locale: {
    name: "English",
    short: "EN",
  },

  nav: {
    biografia: "(Auto)biography",
    opinion: "Opinion",
    productos: "Products",
    productosLabel: "Product hub — alexendros.dev",
    menuLabel: "Open menu",
    menuCloseLabel: "Close menu",
    navLabel: "Main navigation",
    logoLabel: "Alexendros — back to home",
    skipToContent: "Skip to content",
  },

  hero: {
    eyebrow: "Valencia · thought, freedom & digital life",
    signature: "Alexendros. Great solutions from unforeseen ingenuity.",
    lead: "A personal space, set apart from money. I write and think out loud here; the commercial side lives at {link}.",
    leadLink: "alexendros.dev",
    tagline: "Enthusiasm for clear ideas, with no profit motive.",
    ctaContact: "Write to me",
    ctaAbout: "Get to know me",
  },

  sections: {
    biografia: {
      title: "(Auto)biography",
      p1: "My name is Alejandro Domingo Agustí, and online I am known as Alexendros. I was born in Valencia and have worked in various trades: hospitality, management, and later work in front of screens. I learned to read people and businesses before talking about tools.",
      p2: "This site stands apart from money: nothing is sold here. I write about freedom, attention, personal sovereignty, and digital life, without filters. If you are looking for the commercial side, it is at {link}. If you want to know what I think, stay.",
      p2Link: "alexendros.dev",
      p3: "I believe in deciding with judgment, in not entrusting what matters most to strangers, and in writing for those who distrust comfortable narratives. This project is simple on purpose: a clear site, without noise, asking for nothing in return.",
    },
    publicaciones: {
      title: "Latest pieces",
      desc: "Short pieces, no filler. The latest from {opinionLink}.",
      opinionLabel: "Opinion",
      empty: "No pieces published yet. Check back soon.",
    },
    principios: {
      title: "What I stand for",
      desc: "Three ideas running through everything I write.",
      atencion: {
        title: "Attention",
        body: "Your attention is yours. When something costs no money, it usually costs hours.",
        cta: "Read about attention",
      },
      soberania: {
        title: "Sovereignty",
        body: "Keep what's critical in your hands: identity, files, conversations. Delegating is fine; not knowing to whom isn't.",
        cta: "Read about sovereignty",
      },
      protocolos: {
        title: "Protocols",
        body: "Open roads before walled gardens. If a service disappears, your voice shouldn't.",
        cta: "Read about protocols",
      },
    },
    contacto: {
      title: "Shall we talk?",
      desc: "No forms, no tracking: just an email.",
    },
  },

  footer: {
    legalNavLabel: "Legal navigation",
    avisoLegal: "Legal notice",
    privacidad: "Privacy",
    cookies: "Cookies",
    licencia: "License",
    hubProductos: "Product hub → alexendros.dev",
    hubLabel: "Product hub — alexendros.dev",
    copyright: "CC BY-NC-SA 4.0",
  },

  antiMonetization: {
    text: "This space is free of {strong}.",
    strong: "monetization",
    chips: ["0 ads", "0 affiliates", "0 sales"],
    chipsLabel: "What you won't find here",
    link: "Go to alexendros.dev",
    dismissLabel: "Close monetization-free notice",
    regionLabel: "Monetization-free space notice",
  },

  motion: {
    pause: "Pause background animations",
    play: "Resume background animations",
  },

  backToTop: "Back to top",

  theme: {
    system: "System",
    light: "Light",
    dark: "Dark",
    ariaLabel: "Current theme: {theme}. Change theme.",
  },

  localeToggle: {
    ariaLabel: "Current language: {locale}. Change language.",
  },

  collection: {
    label: "Collection",
    empty: "No articles published yet.",
    backHome: "← Back to home",
  },

  article: {
    backOpinion: "← Back to Opinion",
    tagsLabel: "Tags",
    minutesShort: "min read",
    tocTitle: "On this page",
    related: "Keep reading",
  },

  opinion: {
    featured: "Latest",
    archive: "Archive",
  },

  tags: {
    indexTitle: "Tags",
    detailLabel: "Tag",
    indexEmpty: "No tags yet.",
    backToTags: "← All tags",
    countLabelOne: "tag",
    countLabelMany: "tags",
    countTotalSuffix: "in total.",
    detailCountOne: "article with this tag",
    detailCountMany: "articles with this tag",
  },

  pwa: {
    updateReady: "New version available",
    updateApply: "Update",
    updateDismiss: "Later",
  },

  search: {
    trigger: "Search",
    triggerAria: "Open search",
    placeholder: "Search articles...",
    noResults: 'No results found for "{query}".',
    results: '{count} result(s) for "{query}"',
    sectionOpinion: "Opinion",
    shortcut: "Search (Ctrl/⌘K)",
    loadError: "Could not load the search index. Please try again later.",
    loading: "Loading search index...",
    clear: "Clear search",
  },

  errors: {
    notFoundTitle: "Page not found",
    notFoundDesc: "This link leads nowhere: the page doesn't exist or has moved.",
    notFoundCta: "Back to home",
    errorTitle: "Something went wrong",
    errorDesc: "An unexpected error occurred. Try again or head back home.",
    errorCta: "Back to home",
  },

  contact: {
    fabLabel: "Contact actions",
    emailLabel: "Send email",
    contactame: "Contact me",
    copy: "Copy email",
    copied: "Email copied",
    copyError: "Couldn't copy the email",
  },
};

export default en;
