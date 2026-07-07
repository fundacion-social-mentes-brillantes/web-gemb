/* ═══════════════════════════════════════════════════════════════
   CONTENIDO DEL PORTAL DE PROCESO (Fase 1)

   Estructura: KITS → módulos → lecciones → bloques.

   - Cada kit se habilita por persona desde el panel admin (pago).
   - El contenido de aquí es de EJEMPLO / plantilla: demuestra todos
     los tipos de bloque para que, cuando llegue el contenido real,
     solo haya que reemplazar textos y agregar lecciones.
   - Variantes por género: cualquier `text`/`title` puede ser un
     string, o un objeto { masculino, femenino }. El portal muestra
     la versión según el género del perfil (resolveText).

   Tipos de bloque disponibles:
     portada   { title, subtitle }
     texto     { title?, text }
     cita      { text, author? }
     lista     { title?, items: [] }
     imagen    { src, alt, caption? }        (src opcional)
     audio     { title, src? }               (sin src → "próximamente")
     video     { title, url? }               (url de YouTube/Vimeo embed)
     escritura { id, prompt, placeholder? }   (se guarda, privado)
     checklist { id, title?, items: [] }      (se guarda, privado)
     cierre    { title, text }                (última diapositiva)

   NOTA: para la Fase 1 el contenido viaja en el bundle (es de
   ejemplo). Cuando llegue el contenido real y pago, conviene moverlo
   a almacenamiento protegido por reglas para que no quede expuesto.
   ═══════════════════════════════════════════════════════════════ */

export const KIT_ORDER = ['emocional', 'financiero', 'salud'];

const sampleLesson = (id, title, temaEmoji) => ({
  id,
  title,
  blocks: [
    { type: 'portada', title, subtitle: 'Contenido de ejemplo · se reemplazará por el material real' },
    {
      type: 'texto',
      title: {
        masculino: 'Bienvenido a esta lección',
        femenino: 'Bienvenida a esta lección'
      },
      text: {
        masculino: `${temaEmoji} Este es un espacio para que avances a tu ritmo, acompañado por tu coach. Cada diapositiva te invita a leer, observar y practicar.`,
        femenino: `${temaEmoji} Este es un espacio para que avances a tu ritmo, acompañada por tu coach. Cada diapositiva te invita a leer, observar y practicar.`
      }
    },
    { type: 'cita', text: 'Las emociones también se entrenan.', author: 'Alexandra Ortega' },
    {
      type: 'lista',
      title: 'En esta lección vas a:',
      items: ['Reconocer un patrón', 'Practicar una herramienta', 'Dejar registro de tu avance']
    },
    { type: 'audio', title: 'Meditación guiada de apertura' },
    { type: 'video', title: 'Video introductorio' },
    {
      type: 'escritura',
      id: `${id}-reflexion`,
      prompt: '¿Qué se movió en ti al leer esto? Escríbelo aquí (solo tú puedes verlo).',
      placeholder: 'Escribe con libertad…'
    },
    {
      type: 'checklist',
      id: `${id}-compromisos`,
      title: 'Mis compromisos de esta semana',
      items: ['Practicar la herramienta una vez al día', 'Anotar cómo me sentí', 'Compartir con mi coach lo que descubra']
    },
    {
      type: 'cierre',
      title: '¡Lección completada!',
      text: 'Cuando estés listo, marca esta lección como completada. Tu coach podrá ver tu avance para acompañarte mejor.'
    }
  ]
});

export const PROCESS_KITS = [
  {
    id: 'emocional',
    title: 'Kit Emocional',
    subtitle: 'El punto de partida de todo proceso',
    icon: 'heart',
    accent: '#CC5833',
    description: 'Entrena la base: reconocer, comprender y regular tus emociones para responder distinto a la vida.',
    modules: [
      {
        id: 'emocional-m1',
        title: 'Módulo 1 · Reconocer',
        lessons: [
          sampleLesson('emocional-l1', 'Lección 1 · Mirar con verdad', '🌱'),
          sampleLesson('emocional-l2', 'Lección 2 · Nombrar lo que siento', '💛')
        ]
      }
    ]
  },
  {
    id: 'financiero',
    title: 'Kit Transformación Financiera',
    subtitle: 'Salud es Riqueza · tu relación con el dinero',
    icon: 'wallet',
    accent: '#C9A24B',
    theme: 'gold',
    description: 'Reconoce, mide y transforma tu diálogo interno financiero. Abundancia con conciencia y propósito.',
    modules: [
      {
        id: 'financiero-herramientas',
        title: 'Herramientas',
        lessons: [
          {
            id: 'financiero-h1',
            title: 'Herramienta 1 · Inteligencia Financiera',
            subtitle: 'Desocupa tus bolsillos',
            tool: 'slides',
            slides: Array.from({ length: 11 }, (_, i) => `/kits/h1-${i + 1}.jpg`)
          },
          {
            id: 'financiero-h2',
            title: 'Herramienta 2',
            subtitle: 'Guía diseñada del proceso financiero',
            tool: 'slides',
            slides: Array.from({ length: 10 }, (_, i) => `/kits/h2-${i + 1}.jpg`)
          },
          {
            id: 'financiero-h2-escaner',
            title: 'Escáner de Creencias Limitantes hacia el Dinero',
            assignmentOf: 'Herramienta 2',
            tool: 'escaner-creencias'
          }
        ]
      }
    ]
  },
  {
    id: 'salud',
    title: 'Salud es Riqueza',
    subtitle: 'El cuerpo como aliado',
    icon: 'heartPulse',
    accent: '#7FA9D8',
    description: 'Integra cuerpo, mente y hábitos: la salud como base de tu bienestar y tu energía vital.',
    modules: [
      {
        id: 'salud-m1',
        title: 'Módulo 1 · Cuerpo y energía',
        lessons: [
          sampleLesson('salud-l1', 'Lección 1 · Escuchar el cuerpo', '🧘'),
          sampleLesson('salud-l2', 'Lección 2 · Hábitos que sostienen', '☀️')
        ]
      }
    ]
  }
];

export const PROCESS_KITS_BY_ID = PROCESS_KITS.reduce((acc, kit) => {
  acc[kit.id] = kit;
  return acc;
}, {});

export const resolveText = (value, gender) => {
  if (value && typeof value === 'object') {
    return value[gender] || value.masculino || value.femenino || '';
  }
  return value || '';
};

export const getLessonCountForKit = (kit) =>
  (kit.modules || []).reduce((sum, module) => sum + (module.lessons || []).length, 0);
