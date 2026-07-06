import { FULL_STATEMENTS } from './testConfig';

/* ═══════════════════════════════════════════════════════════════
   TEST RÁPIDO · Hipótesis inicial de eneatipo (27 preguntas)

   Subconjunto del banco oficial de 135 preguntas: las 3 más
   nucleares y menos confundibles de cada eneatipo, seleccionadas
   y validadas de forma cruzada en julio 2026 (ver
   docs/mapa-test-eneagrama.md, sección 10).

   Los textos NO se duplican aquí: se referencian por ID para que
   cualquier corrección futura del banco se herede automáticamente.

   El orden está intercalado a mano para que nunca aparezcan dos
   preguntas seguidas del mismo eneatipo:
   - Ronda 1 (tipos 1→9): P035 P018 P077 P014 P053 P023 P052 P010 P049
   - Ronda 2 (5 9 2 7 1 8 4 6 3): P067 P133 P022 P074 P078 P015 P042 P107 P064
   - Ronda 3 (8 3 6 9 7 2 5 1 4): P114 P037 P060 P121 P117 P013 P134 P097 P005
   ═══════════════════════════════════════════════════════════════ */

export const QUICK_QUESTION_IDS = [
  'P035', 'P018', 'P077', 'P014', 'P053', 'P023', 'P052', 'P010', 'P049',
  'P067', 'P133', 'P022', 'P074', 'P078', 'P015', 'P042', 'P107', 'P064',
  'P114', 'P037', 'P060', 'P121', 'P117', 'P013', 'P134', 'P097', 'P005'
];

const STATEMENTS_BY_ID = new Map(FULL_STATEMENTS.map((statement) => [statement.id, statement]));

/* Si algún ID dejara de existir en el banco (por una edición futura),
   se omite con aviso en consola en lugar de romper toda la página.
   La puntuación se normaliza por conteo real, así que el cálculo
   sigue siendo válido aunque falte un ítem. */
export const QUICK_STATEMENTS = QUICK_QUESTION_IDS
  .map((id) => {
    const statement = STATEMENTS_BY_ID.get(id);
    if (!statement && typeof console !== 'undefined') {
      console.error(`[test rápido] La pregunta ${id} ya no existe en el banco de 135. Revisa quickTestConfig.js.`);
    }
    return statement;
  })
  .filter(Boolean);

export const QUICK_TYPE_DISTRIBUTION = QUICK_STATEMENTS.reduce((acc, statement) => {
  acc[statement.eneatype] = (acc[statement.eneatype] || 0) + 1;
  return acc;
}, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 });
