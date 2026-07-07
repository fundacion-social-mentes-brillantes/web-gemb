/* ═══════════════════════════════════════════════════════════════
   ESCÁNER DE CREENCIAS LIMITANTES HACIA EL DINERO
   Kit Financiero · Herramienta 2 (Gimnasio Emocional Mentes Brillantes)

   Basado en el "Cuaderno de Autoevaluación · Diagnóstico de Creencias
   Limitantes Hacia el Dinero" (Kit Transformación Financiera).

   Escala 1-10:  1 = totalmente en desacuerdo · 10 = totalmente de acuerdo.
   Puntaje alto (8-10) = creencia fuerte y activa → se prioriza para trabajar.

   Cada creencia trae su "decodificación": la versión empoderante que se le
   muestra a la persona cuando marca esa creencia entre 8 y 10.
   ═══════════════════════════════════════════════════════════════ */

export const SCANNER_META = {
  kicker: 'Kit Transformación Financiera · Herramienta 2',
  title: 'Diagnóstico de Creencias Limitantes hacia el Dinero',
  subtitle: 'Reconoce, mide y transforma tu diálogo interno financiero.',
  scaleLow: '1 · Totalmente en desacuerdo',
  scaleHigh: '10 · Totalmente de acuerdo'
};

export const SCANNER_INSTRUCTIONS = [
  {
    title: 'Marca 1 o 10, casi siempre',
    text: 'Para cada frase pregúntate: ¿esta idea vive en mí o no? Si NO te identificas, marca 1. Si te identificas por completo, marca 10. Usa un punto medio (como 5) solo cuando de verdad dudes: que sea la excepción, no la regla.'
  },
  {
    title: 'Mide intensidad, no culpa',
    text: 'Un puntaje alto no significa que estés mal. Significa que encontraste una creencia activa que ahora puedes trabajar con claridad.'
  },
  {
    title: 'Responde sin negociar contigo',
    text: 'La meta no es quedar bien, es detectar qué ideas todavía influyen en tus decisiones con el dinero. Responde en un momento tranquilo y con honestidad.'
  }
];

/* Las 65 creencias, en grupos de 10 (como el cuaderno original).
   text = creencia limitante · decoded = creencia decodificada (empoderante). */
export const BELIEF_GROUPS = [
  {
    title: 'Bloque 1 · El dinero y la moral',
    beliefs: [
      { id: 'c01', text: 'El dinero es la raíz de todo mal.', decoded: 'El dinero es energía neutral: amplifica lo que ya soy. En manos conscientes se vuelve una herramienta de bien y de servicio.' },
      { id: 'c02', text: 'Es mejor ser pobre que ser rico.', decoded: 'La abundancia no me aleja de mi bondad; me da más recursos para cuidar, crear y aportar. Merezco vivir con holgura.' },
      { id: 'c03', text: 'La mayoría de los ricos probablemente hicieron algo malo o deshonesto para enriquecerse.', decoded: 'Muchas personas prosperan con honestidad y servicio. Yo también puedo generar riqueza desde mis valores.' },
      { id: 'c04', text: 'Tener dinero me hace menos espiritual y puro.', decoded: 'Mi espíritu no compite con mi bienestar material: puedo ser próspero y profundamente espiritual a la vez.' },
      { id: 'c05', text: 'Para ser rico tengo que trabajar y luchar mucho.', decoded: 'La prosperidad también nace del foco, la estrategia y el valor que aporto, no solo del sacrificio.' },
      { id: 'c06', text: 'Tener mucho dinero es una responsabilidad que me asusta.', decoded: 'Administrar la abundancia se aprende paso a paso; esa responsabilidad me hace crecer en lugar de asustarme.' },
      { id: 'c07', text: 'Mi probabilidad de ser rico es muy poca.', decoded: 'Mis posibilidades aumentan cada vez que aprendo, decido y actúo. Yo influyo directamente en mi economía.' },
      { id: 'c08', text: 'Ser rico es cuestión del destino o de suerte.', decoded: 'La prosperidad se construye con decisiones y hábitos. No dependo de la suerte: soy parte activa de mis resultados.' },
      { id: 'c09', text: 'Ser rico no es para personas como yo.', decoded: 'La abundancia no pide un origen especial, pide disposición a aprender. Personas como yo prosperan cada día.' },
      { id: 'c10', text: 'Si trabajo para ser rico no me quedará mucho tiempo para hacer algo más en la vida.', decoded: 'Puedo prosperar y cuidar mi vida a la vez; el dinero bien manejado me devuelve tiempo, no me lo quita.' }
    ]
  },
  {
    title: 'Bloque 2 · Riqueza y vínculos',
    beliefs: [
      { id: 'c11', text: 'Para ser rico, tendré que usar a las personas y aprovecharme de ellas.', decoded: 'Creo riqueza sirviendo y sumando valor a otros. Mi prosperidad puede nacer del respeto, no del abuso.' },
      { id: 'c12', text: 'Si yo soy rico, todo el mundo querrá pedirme algo.', decoded: 'Puedo ser generoso y a la vez poner límites sanos. Tener más me permite elegir a quién y cómo ayudo.' },
      { id: 'c13', text: 'Si me enriquezco, habrá personas a las que no les gustará ni mi riqueza, ni yo.', decoded: 'No necesito encogerme para que me acepten. Quienes de verdad me quieren celebran mi crecimiento.' },
      { id: 'c14', text: 'Si yo tengo mucho dinero, eso significa que otra persona tendrá mucho menos.', decoded: 'La riqueza no es un pastel fijo: cuando creo valor genero abundancia que también beneficia a otros.' },
      { id: 'c15', text: 'Tener dinero en exceso significa que soy codicioso.', decoded: 'Tener abundancia no es codicia; codicia es acumular sin conciencia. Puedo tener mucho y compartir con propósito.' },
      { id: 'c16', text: 'Yo no soy muy bueno con el dinero y las finanzas.', decoded: 'Las finanzas son una habilidad que se aprende. Cada día puedo volverme más hábil administrando mi dinero.' },
      { id: 'c17', text: 'Si yo consigo mucho dinero, lo podría perder todo.', decoded: 'Aprendo a cuidar, diversificar y sostener lo que construyo. La educación financiera protege mi abundancia.' },
      { id: 'c18', text: 'Si yo me esfuerzo para ser rico y no lo logro, me sentiré fracasado.', decoded: 'Cada intento me enseña y me acerca. Mi valor no depende del resultado: el camino también me construye.' },
      { id: 'c19', text: 'Yo no nací con el potencial para ser rico.', decoded: 'El potencial no se hereda, se desarrolla. Tengo todo lo necesario para aprender y prosperar.' },
      { id: 'c20', text: 'Este no es el mejor momento para empezar a trabajar en mis finanzas.', decoded: 'El mejor momento para ordenar mi dinero es hoy. Un primer paso pequeño ya cambia mi rumbo.' }
    ]
  },
  {
    title: 'Bloque 3 · El valor del dinero',
    beliefs: [
      { id: 'c21', text: 'Yo no quiero ser rico o no lo había pensado.', decoded: 'Elijo con conciencia qué significa la prosperidad para mí y me permito desearla sin culpa.' },
      { id: 'c22', text: 'El dinero en realidad no es tan importante.', decoded: 'El dinero no lo es todo, pero es una herramienta valiosa para cuidar lo que amo y ampliar mi libertad.' },
      { id: 'c23', text: 'No se puede aspirar a ser rico y estar feliz y pleno al mismo tiempo.', decoded: 'La abundancia y la plenitud pueden ir de la mano. Puedo prosperar mientras cultivo una vida feliz.' },
      { id: 'c24', text: 'El dinero puede causar muchos problemas.', decoded: 'El dinero no crea los problemas: los revela o los alivia. Con conciencia, se vuelve solución y tranquilidad.' },
      { id: 'c25', text: 'No es correcto tener mucho más dinero que mis padres.', decoded: 'Honro a mis padres creciendo, no quedándome pequeño. Mi prosperidad puede ser un regalo para mi linaje.' },
      { id: 'c26', text: 'No se puede ser rico haciendo lo que se ama.', decoded: 'Lo que amo también puede sostenerme. Cuando aporto valor desde mi pasión, la abundancia encuentra su camino.' },
      { id: 'c27', text: 'Tratar de ganar dinero es toda una lucha.', decoded: 'Ganar dinero puede ser un proceso fluido cuando aprendo, sirvo y confío. No todo tiene que doler.' },
      { id: 'c28', text: 'Se necesita dinero para ganar más dinero.', decoded: 'El capital ayuda, pero mi conocimiento, mi creatividad y mi acción también generan riqueza desde donde estoy.' },
      { id: 'c29', text: 'Las personas sólo deberían tener el dinero necesario para vivir cómodamente.', decoded: 'Me permito desear más que lo justo: la abundancia me da margen para crear, disfrutar y contribuir.' },
      { id: 'c30', text: 'Luchar por la riqueza puede causar estrés y problemas de salud.', decoded: 'Puedo prosperar cuidando mi salud. La abundancia sana nace del equilibrio, no del desgaste.' }
    ]
  },
  {
    title: 'Bloque 4 · Mis posibilidades',
    beliefs: [
      { id: 'c31', text: 'En estos días es muy difícil volverse rico.', decoded: 'En cada época surgen nuevas oportunidades. Mi capacidad de adaptarme abre caminos también hoy.' },
      { id: 'c32', text: 'La mayoría de las oportunidades buenas ya pasaron.', decoded: 'Siempre hay oportunidades nuevas para quien está atento y dispuesto. La mía puede estar comenzando ahora.' },
      { id: 'c33', text: 'Dado mi pasado, es difícil que yo sea rico.', decoded: 'Mi pasado no dicta mi futuro. Desde hoy escribo una nueva historia con mis decisiones.' },
      { id: 'c34', text: 'No soy lo suficientemente inteligente para ser rico.', decoded: 'La prosperidad no exige ser un genio, sino aprender y persistir. Mi inteligencia crece con la práctica.' },
      { id: 'c35', text: 'No soy lo suficientemente educado para ser rico.', decoded: 'El conocimiento que necesito está a mi alcance. Puedo aprender a prosperar sin importar mi título.' },
      { id: 'c36', text: 'Soy muy joven/viejo para volverme rico.', decoded: 'Mi edad es una ventaja: tengo justo la energía o la experiencia que este momento pide. Siempre es buen momento para empezar.' },
      { id: 'c37', text: 'No soy rico porque no heredé nada.', decoded: 'No necesito heredar para prosperar: puedo ser yo el inicio de la abundancia en mi familia.' },
      { id: 'c38', text: 'Como mujer, es mucho más difícil volverse rica.', decoded: 'Mi ser mujer es fuerza, no límite. Cada vez más mujeres prosperan, y yo puedo ser una de ellas.' },
      { id: 'c39', text: 'No me gusta vender o promocionar.', decoded: 'Vender es compartir con honestidad algo que aporta valor. Puedo aprender a hacerlo desde mi autenticidad.' },
      { id: 'c40', text: 'Desearía no tener que lidiar con el dinero.', decoded: 'Relacionarme con mi dinero es un acto de autocuidado. Puedo hacerlo con calma en lugar de evitarlo.' }
    ]
  },
  {
    title: 'Bloque 5 · Administrar y merecer',
    beliefs: [
      { id: 'c41', text: 'Yo no disfruto manejando el dinero.', decoded: 'Manejar mi dinero puede volverse un hábito amable cuando lo entiendo. El orden financiero me da paz.' },
      { id: 'c42', text: 'No tengo tiempo para administrar el dinero.', decoded: 'Cuidar mi dinero toma pocos minutos que me ahorran grandes dolores. Priorizarlo es cuidarme.' },
      { id: 'c43', text: 'No necesito saber administrar mi dinero porque tengo muy poco o no tengo nada.', decoded: 'Justo cuando tengo poco, administrar bien marca la diferencia. Cada peso ordenado construye mi futuro.' },
      { id: 'c44', text: 'No está bien que yo sea rico, cuando otros no tienen nada.', decoded: 'Mi escasez no alivia la de nadie; mi abundancia sí me permite ayudar de verdad. Prosperar me hace más útil.' },
      { id: 'c45', text: 'La seguridad financiera viene de tener un buen trabajo y un sueldo fijo.', decoded: 'Un sueldo es una fuente, no la única. Mi verdadera seguridad está en mis habilidades y en diversificar mis ingresos.' },
      { id: 'c46', text: 'Si no naces rico lo más probable es que nunca serás rico.', decoded: 'El origen no define el destino. Muchas personas construyeron su riqueza desde cero, y yo también puedo.' },
      { id: 'c47', text: 'Los ricos no son felices.', decoded: 'La felicidad no depende del dinero, pero la abundancia sí puede acompañar una vida plena. Puedo tener ambas.' },
      { id: 'c48', text: 'Si el éxito llega fácil, en realidad no tiene mérito.', decoded: 'El éxito no tiene que doler para ser válido. Merezco resultados también cuando llegan con fluidez.' },
      { id: 'c49', text: 'Yo estoy muy ocupado para dedicarle tiempo y energía a aprender.', decoded: 'Aprender es la mejor inversión. Unos minutos hoy me abren caminos mañana.' },
      { id: 'c50', text: 'Si me vuelvo rico, está muy bien, si no, también está bien.', decoded: 'Me permito elegir la abundancia con intención. Desearla con claridad ordena mis decisiones.' }
    ]
  },
  {
    title: 'Bloque 6 · Recibir y sostener',
    beliefs: [
      { id: 'c51', text: 'Tengo mis resentimientos hacia las personas extremadamente ricas.', decoded: 'Suelto el resentimiento y aprendo de quienes prosperaron. Admirar la abundancia ajena abre la mía.' },
      { id: 'c52', text: 'Soy bueno para dar, pero no soy bueno para recibir.', decoded: 'Recibir también es un acto de amor. Me permito recibir con gratitud tanto como doy.' },
      { id: 'c53', text: 'Es mejor que me paguen por mi tiempo que por mis resultados.', decoded: 'Mi valor no está limitado por las horas. Cuando cobro por resultados, mi ingreso puede crecer sin techo.' },
      { id: 'c54', text: 'Estoy relativamente cómodo y no necesito presionarme a mí mismo.', decoded: 'Puedo honrar mi tranquilidad y a la vez crecer. Salir suavemente de mi zona cómoda expande mi vida.' },
      { id: 'c55', text: 'Si yo tengo amor, salud y felicidad, no es tan importante el dinero.', decoded: 'El amor y la salud son lo primero, y el dinero los cuida y los sostiene. No tengo que elegir entre ellos.' },
      { id: 'c56', text: 'Yo soy capaz de ser exitoso por mí mismo. No necesito la ayuda de nadie.', decoded: 'Pedir y recibir apoyo multiplica lo que puedo lograr. La prosperidad también se construye en comunidad.' },
      { id: 'c57', text: 'La única razón para trabajar es ganar dinero.', decoded: 'Trabajo por dinero y también por propósito. Cuando ambos se unen, la abundancia se vuelve significativa.' },
      { id: 'c58', text: 'No tiene sentido ganar más dinero porque voy a tener que pagar más impuestos.', decoded: 'Ganar más siempre me deja más, incluso después de impuestos. Crecer me conviene.' },
      { id: 'c59', text: 'Una vez tenga mucho dinero, yo me sentiré seguro.', decoded: 'Mi seguridad nace primero por dentro. Cuando la cultivo, el dinero la acompaña en lugar de reemplazarla.' },
      { id: 'c60', text: 'Volverse rico no es una habilidad que se pueda aprender.', decoded: 'Prosperar es una habilidad que se aprende y se entrena, como cualquier otra. Yo puedo desarrollarla.' }
    ]
  },
  {
    title: 'Bloque 7 · Crecer e invertir',
    beliefs: [
      { id: 'c61', text: 'Volverse rico pondrá a prueba mis capacidades.', decoded: 'Cada reto financiero es una oportunidad de crecer. Estoy dispuesto a expandir mis capacidades.' },
      { id: 'c62', text: 'Dios decidirá si soy rico, pobre o de clase media.', decoded: 'Confío en lo divino y también asumo mi parte. Mis decisiones son la manera en que colaboro con la abundancia.' },
      { id: 'c63', text: 'El mundo de las inversiones es complicado y difícil de entender.', decoded: 'Invertir se puede aprender por pasos. Con información clara, lo complejo se vuelve comprensible.' },
      { id: 'c64', text: 'Las inversiones son para personas que tienen mucho dinero.', decoded: 'Hoy se puede empezar a invertir con montos pequeños. Lo importante es comenzar y aprender en el camino.' },
      { id: 'c65', text: 'Todas las inversiones diferentes a las de los bancos son muy riesgosas.', decoded: 'El riesgo se aprende a medir y a manejar. Con conocimiento, elijo opciones acordes a mí.' }
    ]
  }
];

export const ALL_BELIEFS = BELIEF_GROUPS.flatMap((group) => group.beliefs);
export const TOTAL_BELIEFS = ALL_BELIEFS.length;
export const HIGH_THRESHOLD = 8; // 8-10 se cuenta como creencia fuerte a trabajar

// Id de la asignación (escáner). La coach lee sus resultados con este id.
export const SCANNER_TOOL_ID = 'financiero-h2-escaner';
