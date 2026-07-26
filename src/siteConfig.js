/**
 * Configuración del sitio: rutas públicas, metadatos SEO y datos estructurados.
 *
 * Vive fuera de App.jsx para que la app y el prerender (SSG) compartan una
 * única fuente de verdad de títulos, descripciones y schema.org por ruta.
 */

import { Activity, BookOpen, Compass, User } from 'lucide-react';

export const WA_NUMBER = "573112602355";
export const SITE_URL = "https://www.gimnasioemocionalmb.com";

export const HOME_SEO = {
  title: "Gimnasio Emocional Mentes Brillantes | Fundación Social Mentes Brillantes",
  description: "Programa de entrenamiento emocional de la Fundación Social Mentes Brillantes (entidad sin ánimo de lucro, NIT 901.002.849-3): encuentros comunitarios gratuitos en Bogotá, procesos de transformación y prevención en salud mental desde 2016.",
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/impacto/comunidad-gemb.webp`,
  structuredData: {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "Fundación Social Mentes Brillantes",
    alternateName: ["Gimnasio Emocional Mentes Brillantes", "GEMB"],
    url: SITE_URL,
    logo: `${SITE_URL}/logo-gemb.png`,
    image: `${SITE_URL}/impacto/comunidad-gemb.webp`,
    foundingDate: "2016",
    taxID: "901.002.849-3",
    email: "fundacionsocial@gimnasioemocionalmb.com",
    telephone: "+573112602355",
    address: { "@type": "PostalAddress", addressLocality: "Bogotá", addressCountry: "CO" },
    sameAs: ["https://www.instagram.com/gimnasioemocional_mb"],
    description: "Entidad sin ánimo de lucro que entrena inteligencia emocional y previene violencias mediante programas comunitarios gratuitos y procesos de acompañamiento; los excedentes financian su labor social."
  }
};

export const ADMIN_SEO = {
  title: "Panel privado | Gimnasio Emocional Mentes Brillantes",
  description: "Acceso privado al panel administrativo de Gimnasio Emocional Mentes Brillantes.",
  url: `${SITE_URL}/#admin`,
  image: `${SITE_URL}/logo-gemb.png`,
  robots: "noindex, nofollow"
};

export const ALEXANDRA_PATH = "/alexandra-ortega";

export const ALEXANDRA_SEO = {
  title: "Alexandra Ortega | Fundadora de Gimnasio Emocional Mentes Brillantes",
  description: "Conoce a Alexandra Ortega: psicóloga, coach ontológica y fundadora de la técnica Gimnasio Emocional Mentes Brillantes (GEMB). Tallerista, conferencista y formadora en salud mental con trayectoria continua desde 2016.",
  url: `${SITE_URL}${ALEXANDRA_PATH}`,
  image: `${SITE_URL}/alexandra-sq.jpg`,
  structuredData: {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Alexandra Ortega",
    jobTitle: "Psicóloga, Coach Ontológica, Tallerista, Conferencista y Formadora en Salud Mental",
    description: "Fundadora de la técnica Gimnasio Emocional Mentes Brillantes (GEMB), con trayectoria continua desde 2016 en inteligencia emocional, prevención en salud mental, liderazgo consciente, enfoque de género y construcción de paz territorial.",
    image: `${SITE_URL}/alexandra-sq.jpg`,
    url: `${SITE_URL}${ALEXANDRA_PATH}`,
    email: "mailto:yaosproactiva@hotmail.com",
    telephone: "+573208413878",
    worksFor: {
      "@type": "Organization",
      name: "Fundación Social Mentes Brillantes",
      url: SITE_URL
    },
    knowsAbout: [
      "Inteligencia emocional",
      "Prevención en salud mental",
      "Liderazgo consciente",
      "Enfoque de género",
      "Duelo y resignificación",
      "Construcción de paz"
    ],
    sameAs: ["https://www.instagram.com/gimnasioemocional_mb"]
  }
};

export const FUNDACION_PATH = "/fundacion";

export const FUNDACION_SEO = {
  title: "La Fundación | Labor social de Gimnasio Emocional Mentes Brillantes",
  description:
    "Fundación Social Mentes Brillantes (NIT 901.002.849-3): encuentros comunitarios gratuitos en Bogotá, formación a lideresas y un modelo solidario que reinvierte sus excedentes en labor social desde 2016.",
  url: `${SITE_URL}${FUNDACION_PATH}`,
  image: `${SITE_URL}/impacto/comunidad-gemb.webp`,
  structuredData: {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "Fundación Social Mentes Brillantes",
    alternateName: ["Gimnasio Emocional Mentes Brillantes", "GEMB"],
    url: SITE_URL,
    logo: `${SITE_URL}/logo-gemb.png`,
    image: `${SITE_URL}/impacto/comunidad-gemb.webp`,
    foundingDate: "2016",
    taxID: "901.002.849-3",
    email: "fundacionsocial@gimnasioemocionalmb.com",
    telephone: "+573112602355",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bogotá",
      addressCountry: "CO"
    },
    areaServed: "Colombia",
    founder: { "@type": "Person", name: "Alexandra Ortega" },
    sameAs: ["https://www.instagram.com/gimnasioemocional_mb"]
  }
};

export const CONTACTO_PATH = "/contacto";

export const CONTACTO_SEO = {
  title: "Contacto y participación | Fundación Social Mentes Brillantes",
  description:
    "Cómo participar gratis en los encuentros comunitarios de la Fundación Social Mentes Brillantes en Bogotá, cómo apoyar la labor social (voluntariado y donaciones) y datos de contacto institucional. NIT 901.002.849-3.",
  url: `${SITE_URL}${CONTACTO_PATH}`,
  image: `${SITE_URL}/impacto/comunidad-gemb.webp`,
  structuredData: {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "Fundación Social Mentes Brillantes",
    url: SITE_URL,
    taxID: "901.002.849-3",
    email: "fundacionsocial@gimnasioemocionalmb.com",
    telephone: "+573112602355",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Biblioteca Pública Carlos E. Restrepo, localidad Antonio Nariño",
      addressLocality: "Bogotá",
      addressCountry: "CO"
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Atención a la comunidad",
      email: "fundacionsocial@gimnasioemocionalmb.com",
      telephone: "+573112602355",
      availableLanguage: "Spanish"
    }
  }
};

export const PRIVACIDAD_PATH = "/politica-de-privacidad";

export const PRIVACIDAD_SEO = {
  title: "Política de tratamiento de datos | Fundación Social Mentes Brillantes",
  description:
    "Conoce cómo la Fundación Social Mentes Brillantes (NIT 901.002.849-3) protege y trata tus datos personales según la Ley 1581 de 2012.",
  url: `${SITE_URL}${PRIVACIDAD_PATH}`,
  image: `${SITE_URL}/logo-gemb.png`
};

export const PROCESO_PATH = "/mi-proceso";

export const PROCESO_SEO = {
  title: "Mi Proceso | Gimnasio Emocional Mentes Brillantes",
  description: "Área privada para continuar tu proceso con Gimnasio Emocional Mentes Brillantes.",
  url: `${SITE_URL}${PROCESO_PATH}`,
  image: `${SITE_URL}/logo-gemb.png`,
  robots: "noindex, nofollow"
};

export const PROCESS_PAGES = [
  {
    path: "/curso-de-milagros",
    icon: BookOpen,
    label: "Curso de Milagros",
    eyebrow: "Estudio espiritual y práctica diaria",
    title: "Un Curso de Milagros en Colombia | Gimnasio Emocional Mentes Brillantes",
    description: "Estudia y practica Un Curso de Milagros con Gimnasio Emocional Mentes Brillantes. Un recorrido espiritual para sanar la percepción, elegir de nuevo y volver al amor.",
    h1: "Un Curso de Milagros: un entrenamiento de la mente para volver al amor",
    lead: "Cada año abrimos un recorrido de estudio y práctica de Un Curso de Milagros para observar la mente, sanar la percepción, soltar el juicio y elegir de nuevo desde el amor.",
    quote: "No buscamos memorizar ideas espirituales; buscamos entrenar una mirada más limpia, amorosa y responsable en la vida diaria.",
    keywords: ["Un Curso de Milagros", "Curso de Milagros Colombia", "estudio espiritual", "despertar de conciencia"],
    whatsappMessage: "Hola, quiero información sobre el recorrido de Un Curso de Milagros en Gimnasio Emocional Mentes Brillantes.",
    sections: [
      {
        title: "Qué es este recorrido",
        body: "Es un espacio de estudio, práctica y acompañamiento espiritual donde usamos las enseñanzas de Un Curso de Milagros como entrenamiento de la mente. La intención es aprender a mirar las situaciones desde menos miedo, menos culpa y más amor.",
        bullets: ["Lectura y comprensión guiada", "Práctica interior aplicada a la vida cotidiana", "Observación del juicio, la culpa y la defensa", "Elección consciente de una percepción más amorosa"]
      },
      {
        title: "Como lo vivimos en GEMB",
        body: "Dentro de Gimnasio Emocional Mentes Brillantes lo vivimos como una disciplina espiritual acompañada. Integramos conversación honesta, silencio, oración, práctica emocional y ejemplos reales para que la teoría baje a decisiones concretas.",
        bullets: ["Encuentros de estudio y reflexión", "Prácticas para elegir de nuevo", "Acompañamiento desde una mirada humana y espiritual", "Lenguaje claro para personas que están comenzando"]
      },
      {
        title: "Para quien es",
        body: "Es para personas que sienten el llamado a sanar su percepción, revisar sus reacciones, dejar de vivir desde la culpa o el ataque y cultivar una relación más serena con Dios, consigo mismas y con los demás.",
        bullets: ["Quienes buscan un grupo de estudio espiritual", "Personas en proceso de despertar de conciencia", "Quienes quieren unir espiritualidad con práctica emocional", "Personas nuevas o con experiencia previa en UCDM"]
      },
      {
        title: "Qué puedes esperar",
        body: "Puedes esperar profundidad, constancia y una invitación a practicar. No es un espacio para discutir quién tiene la razón, sino para mirar dónde la mente se separa del amor y entrenar una respuesta diferente.",
        bullets: ["Mayor claridad sobre tus pensamientos", "Herramientas para soltar juicio y culpa", "Un lenguaje amoroso para volver al centro", "Comunidad de práctica y acompañamiento"]
      }
    ],
    practice: "Durante siete días, observa un juicio recurrente y escribe: qué creo que está pasando, qué miedo hay debajo y cómo podría elegir mirar esto desde el amor.",
    disclaimer: "Este espacio no representa a la organización oficial de Un Curso de Milagros; es un grupo de estudio, práctica y acompañamiento espiritual desarrollado dentro de Gimnasio Emocional Mentes Brillantes.",
    faq: [
      ["¿Necesito experiencia previa?", "No. Puedes llegar sin experiencia. El recorrido está pensado para estudiar, preguntar y practicar paso a paso."],
      ["¿Es un curso religioso?", "No se presenta como una religión. Es un camino espiritual de entrenamiento de la mente, vivido con respeto por el proceso de cada persona."],
      ["¿Cuándo inicia?", "Abrimos recorridos por ciclos. Lo mejor es escribir por WhatsApp para recibir fechas, horarios y modalidad vigente."],
      ["¿Es presencial o virtual?", "La modalidad puede variar según el ciclo. Te confirmamos los encuentros disponibles cuando solicitas información."],
      ["¿Cómo pido información?", "Puedes escribir por WhatsApp desde esta página y pedir detalles del próximo recorrido de Un Curso de Milagros."]
    ]
  },
  {
    path: "/sala-reduccion-ego",
    icon: Activity,
    label: "Sala de Reducción del Ego",
    eyebrow: "Practica grupal de conciencia",
    title: "Sala de Reducción del Ego | Gimnasio Emocional Mentes Brillantes",
    description: "Participa en la Sala de Reducción del Ego de Gimnasio Emocional Mentes Brillantes, un espacio de entrenamiento emocional y espiritual para reconocer el ego, rendir el control y volver a la conciencia.",
    h1: "Sala de Reducción del Ego: un espacio para reconocer, rendir y transformar",
    lead: "La Sala de Reducción del Ego es un espacio de entrenamiento emocional y espiritual donde aprendemos a observar las reacciones que nacen del miedo, el control, el juicio o la necesidad de tener la razón.",
    quote: "En lugar de pelear con el ego, aprendemos a reconocerlo, rendirlo y volver a una mirada más consciente, amorosa y responsable.",
    keywords: ["Sala de Reducción del Ego", "reducción del ego", "entrenamiento emocional", "conciencia emocional"],
    whatsappMessage: "Hola, quiero información sobre la Sala de Reducción del Ego de Gimnasio Emocional Mentes Brillantes.",
    sections: [
      {
        title: "Qué es la Sala de Reducción del Ego",
        body: "Es un espacio grupal, profundo y humano para entrenar la observación interior. Miramos las formas del ego sin vergüenza y sin dramatizar: control, defensa, orgullo, culpa, miedo, victimismo, juicio y reacción automática.",
        bullets: ["Reconocer el impulso antes de actuar", "Rendir el control desde la honestidad", "Practicar serenidad y responsabilidad", "Volver a la esencia real sin castigo"]
      },
      {
        title: "Qué trabajamos en la sala",
        body: "Trabajamos situaciones reales de la vida: conversaciones difíciles, límites, heridas, comparación, necesidad de aprobación, enojo, culpa o deseo de tener siempre la razón. La sala convierte la reacción en material de conciencia.",
        bullets: ["Control y necesidad de razón", "Juicio, ataque y defensa", "Culpa, miedo y orgullo espiritual", "Entrega, oración y poder superior"]
      },
      {
        title: "Para quien es",
        body: "Es para personas que quieren crecer con honestidad, practicar humildad emocional y salir del piloto automático. No necesitas saber nombrar todo lo que sientes; basta con llegar con disposición a mirar.",
        bullets: ["Personas nuevas en GEMB", "Quienes repiten conflictos o reacciones", "Quienes desean entrenar conciencia emocional", "Quienes buscan una práctica espiritual aterrizada"]
      },
      {
        title: "Qué pasa en una sesión",
        body: "La experiencia combina apertura, compartir consciente, escucha, dirección, práctica interior y cierre. El ambiente cuida la dignidad de cada persona y no se plantea como terapia clínica.",
        bullets: ["Se abre un tema de trabajo", "Se comparte desde la experiencia", "Se observa el patrón del ego", "Se cierra con práctica, serenidad y dirección"]
      }
    ],
    practice: "Antes de reaccionar, respira y nombra en voz baja: ¿estoy defendiendo, controlando o queriendo tener la razón? Esa pausa ya abre una puerta.",
    faq: [
      ["¿Qué significa reducir el ego?", "Significa observar sus mecanismos de miedo, defensa y control para dejar de obedecerlos automáticamente."],
      ["¿Es terapia?", "No. Es un espacio de formación, acompañamiento y entrenamiento emocional/espiritual. No reemplaza atención clínica cuando se necesita."],
      ["¿Puedo asistir si soy nuevo?", "Sí. La sala está pensada para recibir personas nuevas con orientación clara y un ambiente cuidado."],
      ["¿Qué se hace en una sala?", "Se trabaja un tema, se comparte con honestidad, se reconoce el patrón y se practica una forma más consciente de responder."],
      ["¿Cómo pido información?", "Puedes escribir por WhatsApp desde esta página y pedir fechas, modalidad y condiciones de participación."]
    ]
  },
  {
    path: "/entrega-de-pasos",
    icon: Compass,
    label: "Entrega de Pasos",
    eyebrow: "Escritura, honestidad y reparacion",
    title: "Entrega de Pasos | Proceso emocional y espiritual GEMB",
    description: "La Entrega de Pasos en Gimnasio Emocional Mentes Brillantes es un proceso de escritura, honestidad y reparación interior para ordenar la historia personal y avanzar con más paz.",
    h1: "Entrega de Pasos: escribir, reconocer y soltar lo que ya no necesitas cargar",
    lead: "La Entrega de Pasos es un camino de escritura, honestidad y reparacion interior. A traves de los pasos, la persona deja de cargar sola su historia y empieza a ordenar lo vivido.",
    quote: "Escribir no cambia el pasado, pero puede cambiar la forma en que lo cargas, lo comprendes y eliges avanzar.",
    keywords: ["Entrega de Pasos", "12 pasos", "recuperación emocional", "reparación interior"],
    whatsappMessage: "Hola, quiero información sobre la Entrega de Pasos en Gimnasio Emocional Mentes Brillantes.",
    sections: [
      {
        title: "Qué es la Entrega de Pasos",
        body: "Es un proceso acompañado de escritura, reconocimiento y entrega interior, inspirado en caminos de recuperación emocional y espiritual. No se trata de exponerte ni de forzarte, sino de ordenar tu historia con verdad y cuidado.",
        bullets: ["Mirar patrones emocionales", "Reconocer heridas y decisiones antiguas", "Soltar cargas que ya no necesitas llevar", "Abrir espacio para responsabilidad y libertad"]
      },
      {
        title: "Por que escribir ayuda a sanar",
        body: "La escritura permite sacar del cuerpo y de la mente aquello que se repite en silencio. Cuando una persona escribe con guía, puede ver conexiones, nombrar dolores y dejar de vivir gobernada por historias incompletas.",
        bullets: ["Ordena lo vivido", "Reduce confusion interna", "Muestra patrones repetidos", "Ayuda a preparar reparaciones posibles"]
      },
      {
        title: "Cómo se acompaña el proceso",
        body: "El acompañamiento ofrece dirección, preguntas, tiempos y contención. La persona avanza paso a paso, sin prisa artificial, con respeto por su historia y por el momento emocional en el que se encuentra.",
        bullets: ["Orientación para escribir", "Revisión de patrones y aprendizajes", "Cuidado de la confidencialidad", "Enfoque en responsabilidad, paz y reparación"]
      },
      {
        title: "Para quien es",
        body: "Es para quienes sienten que cargan historias, culpas, duelos, resentimientos o ciclos que necesitan ser mirados con honestidad para avanzar con más libertad.",
        bullets: ["Personas que quieren ordenar su historia", "Quienes buscan recuperación emocional", "Quienes desean reparar vínculos desde la conciencia", "Quienes necesitan una ruta profunda y acompañada"]
      }
    ],
    practice: "Escribe una línea diaria durante una semana: hoy reconozco que ya no quiero cargar solo/a con... Luego observa qué emoción aparece.",
    faq: [
      ["¿Debo tener experiencia previa?", "No. El proceso puede iniciar desde cero, con guía para comprender qué se escribe y cómo avanzar."],
      ["¿Qué son los pasos?", "Son una ruta de honestidad, reconocimiento, entrega y reparación interior que ayuda a ordenar la historia personal."],
      ["¿Tengo que compartir mi historia?", "No se fuerza a nadie. El proceso cuida el ritmo personal y se comparte lo necesario dentro del acompañamiento."],
      ["¿Es confidencial?", "Sí. La confidencialidad y el respeto por la historia de cada persona son parte esencial del proceso."],
      ["¿Cómo inicio?", "Puedes escribir por WhatsApp para recibir orientación sobre el primer encuentro y la forma de comenzar."]
    ]
  },
  {
    path: "/sesion-coach",
    icon: User,
    label: "Sesión Coach",
    eyebrow: "Puerta de entrada al proceso GEMB",
    title: "Sesión Coach Emocional | Gimnasio Emocional Mentes Brillantes",
    description: "Agenda una Sesión Coach con Gimnasio Emocional Mentes Brillantes para mirar tu historia, ordenar tu mundo interior y recibir guía en tu proceso emocional.",
    h1: "Sesión Coach: una guía privada para ordenar tu mundo interior",
    lead: "La Sesión Coach es un espacio privado de guía emocional donde miramos tu historia con honestidad, identificamos patrones que se repiten y ordenamos el mundo interior.",
    quote: "La claridad no llega solo por pensar más; llega cuando miras tu historia con dirección, honestidad y una práctica que puedas sostener.",
    keywords: ["sesión coach emocional", "coach emocional", "guía emocional", "Alexandra Ortega"],
    whatsappMessage: "Hola, quiero agendar una Sesión Coach con Gimnasio Emocional Mentes Brillantes.",
    sections: [
      {
        title: "Qué es una Sesión Coach",
        body: "Es la puerta principal de Gimnasio Emocional Mentes Brillantes: un encuentro privado para mirar lo que estás viviendo, ordenar tu mundo interior y recibir una ruta de avance. Puede ser guiada por Alexandra Ortega o por coaches formados en la técnica GEMB.",
        bullets: ["Lectura honesta de tu momento actual", "Identificación de patrones emocionales", "Dirección para tomar decisiones con más conciencia", "Primer mapa de proceso y práctica"]
      },
      {
        title: "Qué puedes trabajar",
        body: "Puedes trabajar relaciones, límites, duelos, cansancio emocional, culpa, miedo, repetición de conflictos, falta de dirección, dependencia emocional o dificultad para sostener cambios.",
        bullets: ["Historia personal y patrones repetidos", "Orden emocional y espiritual", "Límites, decisiones y coherencia", "Ruta hacia sala, pasos, UCDM o seguimiento"]
      },
      {
        title: "Como se vive una sesion",
        body: "La sesión combina escucha, preguntas precisas, lectura del patrón y orientación práctica. No prometemos curas ni resultados médicos; ofrecemos una guía clara para que puedas entrenar una forma diferente de responder.",
        bullets: ["Conversacion privada y cuidada", "Claridad sobre el patron principal", "Practicas para la vida real", "Siguiente paso sugerido dentro de GEMB"]
      },
      {
        title: "Para quien es",
        body: "Es para personas que necesitan ordenar lo que sienten y quieren iniciar un proceso serio, humano y espiritual. También es ideal si no sabes por dónde empezar dentro de GEMB.",
        bullets: ["Quienes buscan guía emocional", "Personas que repiten ciclos y quieren claridad", "Quienes necesitan un primer mapa de proceso", "Personas que desean acompañamiento sin enfoque clínico"]
      }
    ],
    practice: "Antes de la sesión, escribe tres situaciones que se repiten en tu vida y que ya no quieres seguir resolviendo desde la misma reacción.",
    faq: [
      ["¿Es terapia psicológica?", "No. Es una guía emocional y espiritual de entrenamiento interior. No reemplaza atención psicológica, médica o psiquiátrica cuando sea necesaria."],
      ["¿Quién guía la sesión?", "Puede guiarla Alexandra Ortega o un miembro del equipo de coaches formados en la técnica GEMB."],
      ["¿Cuánto dura?", "La duración se confirma al agendar, según la modalidad disponible y el tipo de acompañamiento."],
      ["¿Puedo tomarla online?", "Sí, cuando hay modalidad virtual disponible. Te confirmamos opciones y horarios por WhatsApp."],
      ["¿Cómo agendo?", "Escribe por WhatsApp desde esta página y solicita disponibilidad para tu Sesión Coach."]
    ]
  }
];

export const PROCESS_PAGE_BY_PATH = PROCESS_PAGES.reduce((pages, page) => {
  pages[page.path] = page;
  return pages;
}, {});

export const normalizePath = (path) => {
  const cleanPath = path.replace(/\/+$/, "");
  return cleanPath || "/";
};

export const setMetaTag = ({ name, property, content }) => {
  const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
  let tag = document.head.querySelector(selector);

  if (!tag) {
    tag = document.createElement("meta");
    if (name) tag.setAttribute("name", name);
    if (property) tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }

  tag.setAttribute("content", content);
};

export const setCanonical = (href) => {
  let link = document.head.querySelector('link[rel="canonical"]');

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }

  link.setAttribute("href", href);
};

export const getProcessStructuredData = (page) => [
  {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.label,
    serviceType: "Entrenamiento emocional y espiritual",
    url: `${SITE_URL}${page.path}`,
    description: page.description,
    provider: {
      "@type": "Organization",
      name: "Gimnasio Emocional Mentes Brillantes",
      url: SITE_URL
    },
    areaServed: {
      "@type": "Country",
      name: "Colombia"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faq.map(([question, answer]) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer
      }
    }))
  }
];

/* SEO por ruta — única fuente de verdad, compartida por la app y el prerender. */
export const getSeoForPath = (path) => {
  const p = normalizePath(path || '/');
  if (p === PROCESO_PATH) return PROCESO_SEO;
  if (p === PRIVACIDAD_PATH) return PRIVACIDAD_SEO;
  if (p === FUNDACION_PATH) return FUNDACION_SEO;
  if (p === CONTACTO_PATH) return CONTACTO_SEO;
  if (p === ALEXANDRA_PATH) return ALEXANDRA_SEO;
  const processPage = PROCESS_PAGE_BY_PATH[p];
  if (processPage) {
    return {
      title: processPage.title,
      description: processPage.description,
      url: `${SITE_URL}${processPage.path}`,
      image: `${SITE_URL}/logo-gemb.png`,
      structuredData: getProcessStructuredData(processPage)
    };
  }
  return HOME_SEO;
};


