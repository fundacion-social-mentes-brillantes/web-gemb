# Mapa del Test de Eneagrama (Lectura Profunda · 135 preguntas)

> **Propósito de este documento:** si algún día el test se daña o alguien necesita modificarlo,
> aquí está explicado cómo funciona pieza por pieza, qué NO se debe tocar y cómo restaurarlo.
> Última actualización: julio 2026.

---

## 1. Dónde vive cada pieza

| Archivo | Qué contiene |
|---|---|
| `src/testConfig.js` | El **banco de las 135 preguntas**, la escala de respuestas, los 10 bloques y el mapeo pregunta→eneatipo. Es la "base de datos" del test. |
| `src/TestEnneagramModal.jsx` | El **modal completo**: pantalla de elección (rápido vs. completo), captura de datos, el cuestionario, el **motor de cálculo** (`calculateFullResult`) y las pantallas de resultado. |
| `src/quickTestConfig.js` | La selección de preguntas del **test rápido** (subconjunto del banco de 135; ver sección 10). |
| `src/App.jsx` | `ENEATYPES`: el catálogo descriptivo de los 9 eneatipos (nombre, motivación, miedo, fortalezas…). Se pasa como prop al modal. |
| `src/components/LeadCaptureForm.jsx` | Formulario de datos personales + consentimiento, obligatorio antes de cualquier test. |
| `src/services/testResponsesService.js` | Guardado en **Firebase/Firestore** (colección `testResponses`). |
| `src/components/reports/EnneagramResultReport.jsx` | La plantilla del **reporte PDF/impresión** del resultado. |
| `src/utils/downloadPdfReport.js` | Generación del PDF (html2canvas + jspdf). |
| `src/components/AdminPanel.jsx` | Panel privado (`/#admin`) que lista las respuestas guardadas. |

El modal se abre desde `App.jsx` (`EnhancedTestEnneagramModal`) con las props:
`isOpen, onClose, eneatypes, waNumber`.

---

## 2. Flujo del usuario (máquina de estados `step`)

```
choice ──► lead ──► full-intro ──► full-quiz ──► full-result
   │          │
   │          └──► quick-quiz ──► quick-result      (test rápido)
   └─ el usuario elige "rápido" o "completo"
```

- `choice`: pantalla "Mapa de Eneatipo" con las dos tarjetas.
- `lead`: SIEMPRE se piden datos primero (`handleTestStart` guarda qué test se eligió y a qué paso saltar después del formulario). Al enviar, `createTestLead()` crea el documento en Firestore y devuelve `responseId`.
- `full-intro`: instrucciones (MUCHO/POCO/NADA, orden P001–P135).
- `full-quiz`: una pregunta a la vez con barra de progreso y bloque visible.
- `full-result`: cálculo, tarjeta del tipo dominante, tabla de características, barras de afinidad, tríadas, detalles del cálculo, PDF/imprimir, compartir por WhatsApp.

---

## 3. El banco de preguntas (`src/testConfig.js`)

- `RAW_QUESTIONS`: arreglo con los **135 textos en orden**. La posición en el arreglo ES el número de pregunta (índice 0 = P001).
- `QUESTION_ENEATYPES`: arreglo paralelo de 135 números (1–9). `QUESTION_ENEATYPES[i]` dice a qué eneatipo puntúa la pregunta `i+1`. **Deben tener exactamente la misma longitud y orden que `RAW_QUESTIONS`.**
- `FULL_STATEMENTS`: se construye automáticamente combinando ambos arreglos. Cada pregunta queda como:
  `{ id: 'P001', order: 1, block: 'B01', text: '...', eneatype: 3 }`
- `FULL_BLOCKS`: 10 bloques (B01–B10). Los rangos están duplicados dentro de `FULL_STATEMENTS` (blockRanges) y en `FULL_BLOCKS`; si se cambian, hay que cambiar ambos.
- `QUESTION_MAPPING_REVISIONS`: registro de 3 revisiones de tipo propuestas (P002: 5→6, P056: 4→1, P119: 1→9). **Ojo:** a julio 2026 solo la de P002 está aplicada en `QUESTION_ENEATYPES` (P056 sigue mapeada al tipo 4 y P119 al tipo 1). Si algún día se decide aplicarlas, se cambia únicamente el número correspondiente en `QUESTION_ENEATYPES` — nunca el orden ni la longitud del arreglo. Ninguna de estas dos preguntas pendientes forma parte del test rápido.

### Distribución real de preguntas por tipo (no es uniforme)

| Tipo | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|
| Preguntas | 14 | 17 | 18 | 11 | 16 | 13 | 15 | 18 | 13 |

Por eso el motor **normaliza por cantidad de preguntas** (ver sección 4): si no lo hiciera,
los tipos 3 y 8 tendrían ventaja injusta sobre el tipo 4.

---

## 4. El motor de cálculo (`calculateFullResult` en `TestEnneagramModal.jsx`)

### Escala de respuestas
`FULL_RESPONSE_OPTIONS`: MUCHO = valor `2`, POCO = valor `1`, NADA = valor `0`.
Las respuestas se guardan en el arreglo `fullAnswers` por índice de pregunta.

### Pesos
`RESPONSE_SCORE_MAP` convierte la respuesta en puntos:

| Respuesta | Valor | Puntos |
|---|---|---|
| MUCHO | 2 | **1.0** |
| POCO | 1 | **0.25** |
| NADA | 0 | **0** |

### Afinidad por tipo
Para cada eneatipo `T`:

```
afinidad(T) = (suma de puntos de las preguntas de T / cantidad de preguntas de T) × 100
```

**Ejemplo:** el tipo 4 tiene 11 preguntas. Si alguien responde MUCHO a 6, POCO a 3 y NADA a 2:
puntos = 6×1 + 3×0.25 + 2×0 = 6.75 → afinidad = 6.75 / 11 × 100 = **61.4 %**.

### Tipo dominante y desempates (`sortTypesWithTieBreak`)
Se ordena de mayor a menor afinidad. Si dos tipos empatan (diferencia ≤ 0.01):
1. Gana quien tenga **más respuestas MUCHO**.
2. Si persiste, gana quien pertenezca al **centro (tríada) con mayor puntaje**.
3. Si persiste, gana quien pertenezca al **grupo armónico con mayor puntaje**.
4. Último recurso: el número de tipo menor.

### Tríadas (centros) y grupos armónicos
- Tríadas: **Visceral** = 8, 9, 1 · **Emocional** = 2, 3, 4 · **Mental** = 5, 6, 7.
- Armónicos: **Reactivos** = 4, 6, 8 · **Positivos** = 2, 7, 9 · **Competentes** = 1, 3, 5.
- El puntaje de un grupo = promedio de las afinidades de sus 3 tipos.
- El **centro dominante** es la tríada con mayor puntaje (empate → orden alfabético en español).

### Qué devuelve
`{ dominantType, affinityByType, affinityTable (ordenada), triads, harmonics, dominantCenter, muchos/pocos/nadas por tipo, puntos y conteos }`.

---

## 5. Persistencia en Firebase (`testResponsesService.js`)

- Colección: **`testResponses`**. Tipos válidos: `initial-assessment`, `enneagram-quick`, `enneagram-full`.
- Dos fases:
  1. `createTestLead({contact, consent, testType})` → crea el documento con `answers: []`, `result: {}`, `followUp.status: 'in_progress'` y datos de origen (UTM, referrer). Usa **autenticación anónima**.
  2. `completeTestResponse(responseId, {answers, result})` → escribe las respuestas y el resultado, `completedAt` y `followUp.status: 'new'`.
- Si falla el guardado, la UI muestra "Reintentar guardado" sin perder las respuestas (`persistCompletion` / `retryPersistCompletion`).
- **Shape del `result` completo** (lo consume el AdminPanel): `dominantType`, `dominantTypeTitle`, `dominantCenter`, `affinityTable`, `triads`, `harmonics`, `calculationDetails`.
- **Shape del `result` rápido**: debe incluir siempre `suggestedType` y `suggestedLabel` — el AdminPanel los usa para mostrar "Eneatipo N - Etiqueta".

---

## 6. Reporte PDF e impresión

- El resultado activo se transforma con `buildFullReportData` / `buildQuickReportData` y se renderiza oculto en `EnneagramResultReport` (`mode: 'full' | 'quick'`).
- "Descargar reporte PDF" usa `downloadPdfReport` (html2canvas + jspdf). "Imprimir" añade la clase `printing-enneagram-report` al `body` y llama `window.print()`.
- El reporte muestra barras de afinidad solo si `affinityTable` tiene más de 1 entrada con números válidos; tríadas/armónicos solo si vienen en el payload.

---

## 7. Reglas de oro para NO dañar el test completo

1. **Nunca** cambies la longitud ni el orden de `RAW_QUESTIONS` sin ajustar `QUESTION_ENEATYPES` en paralelo (misma posición = misma pregunta).
2. Si cambias el tipo de una pregunta, documenta el cambio en `QUESTION_MAPPING_REVISIONS` y ajusta solo `QUESTION_ENEATYPES`.
3. Los rangos de bloques existen en DOS lugares (`FULL_STATEMENTS` y `FULL_BLOCKS`); cámbialos juntos o no los cambies.
4. No cambies los valores 2/1/0 de `FULL_RESPONSE_OPTIONS` sin revisar `RESPONSE_SCORE_MAP` (están acoplados por el valor).
5. No renombres los campos del payload de Firebase (`suggestedType`, `dominantType`, etc.): el AdminPanel y los registros históricos dependen de ellos.
6. El test rápido reutiliza el banco por **ID de pregunta** (ver sección 10): si eliminas o renumeras preguntas del banco, revisa `quickTestConfig.js`.

### Verificación rápida después de cualquier cambio

```bash
npm run build          # debe compilar sin errores
node -e "import('./src/testConfig.js').then(({FULL_STATEMENTS,QUESTION_ENEATYPES})=>{console.log('preguntas:',FULL_STATEMENTS.length,'mapeos:',QUESTION_ENEATYPES.length)})"
# Ambos números deben ser 135
```

Y en el navegador: hacer el test completo respondiendo todo MUCHO a un solo patrón conocido
y revisar que la tabla "Ver detalles del cálculo" cuadre.

---

## 8. Cómo restaurar si se daña

Todo está versionado en git. Para volver a la última versión que funcionaba:

```bash
git log --oneline -- src/TestEnneagramModal.jsx src/testConfig.js   # ver historial
git checkout <commit-bueno> -- src/testConfig.js src/TestEnneagramModal.jsx
npm run build
```

El commit de referencia donde el test completo quedó estable y documentado es el que
introduce este documento (`docs/mapa-test-eneagrama.md`).

---

## 9. Resumen visual del recorrido completo

```
Usuario pulsa "Valoración..." o "Hacer test completo"
        │
        ▼
LeadCaptureForm ──► createTestLead() ──► Firestore (in_progress)
        │
        ▼
135 preguntas (P001→P135, 10 bloques, MUCHO/POCO/NADA)
        │
        ▼
calculateFullResult(fullAnswers)
  ├─ puntos por tipo (1 / 0.25 / 0)
  ├─ afinidad % = puntos / nº preguntas × 100
  ├─ desempates: MUCHOs → tríada → armónico → nº tipo
  ├─ tríadas + armónicos + centro dominante
        │
        ▼
Pantalla de resultado + completeTestResponse() ──► Firestore (new)
        │
        ├─ Descargar PDF / Imprimir (EnneagramResultReport)
        ├─ Compartir por WhatsApp
        └─ AdminPanel (/#admin) muestra el registro
```

---

## 10. El test rápido (Hipótesis inicial · 27 preguntas)

> Esta sección documenta la versión corta creada en julio 2026, que reemplazó al antiguo
> selector de párrafos A/B/C + X/Y/Z.

- **Banco:** `src/quickTestConfig.js` define `QUICK_QUESTION_IDS`: 27 IDs (3 por eneatipo)
  elegidos del banco de 135 por ser los más nucleares y menos confundibles entre tipos.
  Los textos NO están duplicados: `QUICK_STATEMENTS` se construye buscando cada ID dentro de
  `FULL_STATEMENTS`, así cualquier corrección futura del banco se hereda automáticamente.
- **Orden:** las 27 preguntas se muestran intercaladas (nunca 3 seguidas del mismo tipo),
  en un orden fijo y reproducible.
- **Escala y puntuación:** idénticas al test completo (MUCHO=1, POCO=0.25, NADA=0;
  afinidad = puntos/3 × 100 por tipo). Mismo criterio de desempate.
- **Resultado:** eneatipo hipótesis + top 3 con barras + centro dominante estimado,
  siempre etiquetado como "hipótesis inicial, no diagnóstico" con CTA a la lectura profunda.
- **Persistencia:** `testType: 'enneagram-quick'`; el `result` conserva los campos
  `suggestedType` y `suggestedLabel` que el AdminPanel necesita, y añade la tabla de afinidad.
