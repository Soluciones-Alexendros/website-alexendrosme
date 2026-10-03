import type { TranslationDict } from "../types";

const es: TranslationDict = {
  locale: {
    name: "Español",
    short: "ES",
  },

  nav: {
    biografia: "(Auto)biografía",
    opinion: "Opinión",
    productos: "Productos",
    productosLabel: "Hub de productos — alexendros.dev",
    menuLabel: "Abrir menú",
    menuCloseLabel: "Cerrar menú",
    navLabel: "Navegación principal",
    logoLabel: "Alexendros — volver al inicio",
    skipToContent: "Saltar al contenido",
  },

  hero: {
    eyebrow: "Valencia · pensamiento, libertad y vida digital",
    signature: "Alexendros. Grandes soluciones de un ingenio no previsto.",
    lead: "Espacio personal, al margen del dinero. Aquí escribo y pienso en voz alta; la actividad comercial vive en {link}.",
    leadLink: "alexendros.dev",
    tagline: "Entusiasmo por las ideas claras, sin ningún afán de lucro.",
    ctaContact: "Escríbeme",
    ctaAbout: "Conóceme",
  },

  sections: {
    biografia: {
      title: "(Auto)biografía",
      p1: "Me llamo Alejandro Domingo Agustí y en la red me conocen como Alexendros. Nací en Valencia y he trabajado en oficios diversos: hostelería, gestión y, más tarde, el trabajo frente a pantallas. Aprendí a leer a las personas y los negocios antes que a hablar de herramientas.",
      p2: "Este sitio se mantiene al margen del dinero: aquí no se vende nada. Escribo sobre libertad, atención, soberanía personal y vida digital, sin filtros. Si buscas la vertiente comercial, está en {link}. Si quieres saber lo que pienso, quédate.",
      p2Link: "alexendros.dev",
      p3: "Creo en decidir con criterio, en no confiar lo esencial a desconocidos y en escribir para quienes desconfían de los relatos cómodos. Este proyecto es sencillo a propósito: un sitio claro, sin ruido, que no pide nada a cambio.",
    },
    publicaciones: {
      title: "Últimas piezas",
      desc: "Textos breves, sin relleno. Lo último en {opinionLink}.",
      opinionLabel: "Opinión",
      empty: "Todavía no hay piezas publicadas. Vuelve pronto.",
    },
    principios: {
      title: "Lo que defiendo",
      desc: "Tres ideas que atraviesan todo lo que escribo.",
      atencion: {
        title: "Atención",
        body: "Tu atención es tuya. Cuando algo no cuesta dinero, suele costar horas.",
        cta: "Leer sobre atención",
      },
      soberania: {
        title: "Soberanía",
        body: "Lo crítico, en tus manos: identidad, archivos, conversaciones. Delegar está bien; no saber a quién, no.",
        cta: "Leer sobre soberanía",
      },
      protocolos: {
        title: "Protocolos",
        body: "Caminos abiertos antes que jardines amurallados. Si un servicio desaparece, tu voz no debería hacerlo.",
        cta: "Leer sobre protocolos",
      },
    },
    contacto: {
      title: "¿Hablamos?",
      desc: "Sin formularios ni seguimiento: un correo y ya está.",
    },
  },

  footer: {
    legalNavLabel: "Navegación legal",
    avisoLegal: "Aviso legal",
    privacidad: "Privacidad",
    cookies: "Cookies",
    licencia: "Licencia",
    hubProductos: "Hub de productos → alexendros.dev",
    hubLabel: "Hub de productos — alexendros.dev",
    copyright: "CC BY-NC-SA 4.0",
  },

  antiMonetization: {
    text: "Este espacio es libre de {strong}.",
    strong: "monetización",
    chips: ["0 anuncios", "0 afiliados", "0 ventas"],
    chipsLabel: "Lo que no encontrarás aquí",
    link: "Ir a alexendros.dev",
    dismissLabel: "Cerrar aviso de espacio libre de monetización",
    regionLabel: "Aviso de espacio libre de monetización",
  },

  motion: {
    pause: "Pausar animaciones del fondo",
    play: "Reanudar animaciones del fondo",
  },

  backToTop: "Volver arriba",

  theme: {
    system: "Sistema",
    light: "Claro",
    dark: "Oscuro",
    ariaLabel: "Tema actual: {theme}. Cambiar tema.",
  },

  localeToggle: {
    ariaLabel: "Idioma actual: {locale}. Cambiar idioma.",
  },

  collection: {
    label: "Colección",
    empty: "No hay artículos publicados aún.",
    backHome: "← Volver al inicio",
  },

  article: {
    backOpinion: "← Volver a Opinión",
    tagsLabel: "Etiquetas",
    minutesShort: "min de lectura",
    tocTitle: "En este artículo",
    related: "Sigue leyendo",
  },

  opinion: {
    featured: "Lo más reciente",
    archive: "Archivo",
  },

  tags: {
    indexTitle: "Etiquetas",
    detailLabel: "Etiqueta",
    indexEmpty: "No hay etiquetas aún.",
    backToTags: "← Todas las etiquetas",
    countLabelOne: "etiqueta",
    countLabelMany: "etiquetas",
    countTotalSuffix: "en total.",
    detailCountOne: "artículo con esta etiqueta",
    detailCountMany: "artículos con esta etiqueta",
  },

  pwa: {
    updateReady: "Nueva versión disponible",
    updateApply: "Actualizar",
    updateDismiss: "Más tarde",
  },

  search: {
    trigger: "Buscar",
    triggerAria: "Abrir búsqueda",
    placeholder: "Busca en artículos...",
    noResults: 'No se encontraron resultados para "{query}".',
    results: '{count} resultado(s) para "{query}"',
    sectionOpinion: "Opinión",
    shortcut: "Buscar (Ctrl/⌘K)",
    loadError: "No se pudo cargar el índice de búsqueda. Intenta de nuevo más tarde.",
    loading: "Cargando índice de búsqueda...",
    clear: "Limpiar búsqueda",
  },

  errors: {
    notFoundTitle: "Página no encontrada",
    notFoundDesc: "Este enlace no lleva a ninguna parte: la página no existe o se ha mudado.",
    notFoundCta: "Volver al inicio",
    errorTitle: "Algo ha fallado",
    errorDesc: "Ha ocurrido un error inesperado. Vuelve a intentarlo o regresa al inicio.",
    errorCta: "Volver al inicio",
  },

  contact: {
    fabLabel: "Acciones de contacto",
    emailLabel: "Enviar correo",
    contactame: "Contáctame",
    copy: "Copiar correo",
    copied: "Correo copiado",
    copyError: "No se pudo copiar el correo",
  },
};

export default es;
