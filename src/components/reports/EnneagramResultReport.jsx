import React from 'react';

const BRAND = {
  cream: '#F2F0E9',
  ink: '#1A1A1A',
  green: '#2E4036',
  orange: '#CC5833',
  gold: '#C9A85A',
  muted: '#766F66'
};

const CENTER_MESSAGES = {
  Visceral: 'Tu lectura se organiza alrededor del cuerpo, los limites, la accion y la forma en que tomas espacio en el mundo.',
  Emocional: 'Tu lectura se organiza alrededor del vinculo, la identidad, la imagen y la manera en que buscas ser visto y amado.',
  Mental: 'Tu lectura se organiza alrededor de la seguridad, la claridad, la anticipacion y la forma en que procesas la incertidumbre.'
};

const TYPE_CENTERS = {
  1: 'Visceral',
  2: 'Emocional',
  3: 'Emocional',
  4: 'Emocional',
  5: 'Mental',
  6: 'Mental',
  7: 'Mental',
  8: 'Visceral',
  9: 'Visceral'
};

const formatDate = (value) => {
  const date = value ? new Date(value) : new Date();

  if (Number.isNaN(date.getTime())) {
    return new Intl.DateTimeFormat('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(new Date());
  }

  return new Intl.DateTimeFormat('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  }).format(date);
};

const formatPercent = (value) => {
  if (!Number.isFinite(value)) return 'Orientativo';
  return `${value.toFixed(1)}%`;
};

const getCleanTypeName = (typeData, dominantType) => {
  if (!typeData?.type) return `Eneatipo ${dominantType}`;
  return typeData.type.replace(/^Eneatipo\s+\d+:\s*/i, '');
};

const clampBarWidth = (value) => {
  if (!Number.isFinite(value)) return 100;
  return Math.min(100, Math.max(4, value));
};

const SectionTitle = ({ eyebrow, title, children }) => (
  <div className="report-section-heading">
    {eyebrow && <p className="report-eyebrow">{eyebrow}</p>}
    <h2>{title}</h2>
    {children && <p>{children}</p>}
  </div>
);

const MiniCard = ({ label, value, tone = 'light' }) => (
  <div className={`report-mini-card report-mini-card-${tone}`}>
    <p>{label}</p>
    <strong>{value}</strong>
  </div>
);

export default function EnneagramResultReport({ report }) {
  if (!report) return null;

  const {
    mode = 'full',
    personName,
    generatedAt,
    dominantType,
    dominantTypeData,
    dominantCenter,
    affinityTable = [],
    triads,
    harmonics,
    typeCatalog = {},
    waNumber
  } = report;

  const typeData = dominantTypeData || typeCatalog[dominantType] || {};
  const centerLabel = dominantCenter?.label || TYPE_CENTERS[dominantType] || 'Centro por validar';
  const dominantAffinity =
    affinityTable.find((entry) => Number(entry.type) === Number(dominantType))?.affinity ??
    report.dominantAffinity;
  const hasAffinityTable = affinityTable.length > 1 && affinityTable.some((entry) => Number.isFinite(entry.affinity));
  const sortedAffinity = hasAffinityTable
    ? affinityTable
    : [{ type: dominantType, affinity: undefined, center: centerLabel }];
  const typeName = getCleanTypeName(typeData, dominantType);
  const isQuick = mode === 'quick';
  const subtitle = isQuick
    ? 'Hipotesis inicial · test rapido · punto de partida'
    : 'Lectura profunda · 135 preguntas · 10 bloques';
  const resultLabel = isQuick ? 'Eneatipo sugerido' : 'Eneatipo dominante';
  const affinityLabel = isQuick && !Number.isFinite(dominantAffinity)
    ? 'Pendiente con test completo'
    : formatPercent(dominantAffinity);
  const interpretation = isQuick
    ? `Este resultado rapido sugiere una primera afinidad con el Eneatipo ${dominantType}. Usalo como una hipotesis de trabajo y, para una lectura mas precisa, continua con el test completo.`
    : `Tu mapa emocional muestra una afinidad principal con el Eneatipo ${dominantType}. Esta lectura no define quien eres: te ofrece un espejo practico para observar patrones, fortalezas y puntos de trabajo.`;
  const centerMessage = CENTER_MESSAGES[centerLabel] || 'Este centro muestra el canal principal desde el que sueles organizar tu energia, tus respuestas y tu manera de relacionarte.';
  const strengths = typeData.strengths?.length ? typeData.strengths : [typeData.motivation, typeData.desire].filter(Boolean);
  const risks = [typeData.blindSpot, typeData.pressure, typeData.defense].filter(Boolean);
  const traits = [typeData.subtitle, typeData.motivation, typeData.relation].filter(Boolean);
  const practice = typeData.growth || 'Elegir una pausa diaria de 5 minutos para observar cuerpo, emocion y pensamiento antes de responder en automatico.';
  const whatsappHref = waNumber ? `https://wa.me/${waNumber}` : null;

  return (
    <article className="gemb-report" data-pdf-report>
      <style>{`
        .gemb-report-render-layer {
          position: fixed;
          left: -12000px;
          top: 0;
          width: 794px;
          background: ${BRAND.cream};
          pointer-events: none;
          z-index: -1;
        }

        .gemb-report {
          width: 794px;
          background: ${BRAND.cream};
          color: ${BRAND.ink};
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          line-height: 1.35;
        }

        .gemb-report * {
          box-sizing: border-box;
        }

        .gemb-report-page {
          position: relative;
          width: 794px;
          min-height: 1123px;
          overflow: hidden;
          padding: 42px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.72) 0%, rgba(242,240,233,0.95) 62%, rgba(242,240,233,1) 100%);
          break-after: page;
          page-break-after: always;
        }

        .gemb-report-page:last-child {
          break-after: auto;
          page-break-after: auto;
        }

        .gemb-report-page::before {
          content: "";
          position: absolute;
          inset: 18px;
          border: 1px solid rgba(46,64,54,0.14);
          border-radius: 20px;
          pointer-events: none;
        }

        .gemb-report-page::after {
          content: "";
          position: absolute;
          right: -110px;
          top: -120px;
          width: 260px;
          height: 260px;
          border: 1px solid rgba(204,88,51,0.18);
          border-radius: 999px;
          pointer-events: none;
        }

        .report-content {
          position: relative;
          z-index: 1;
          display: flex;
          min-height: 1039px;
          flex-direction: column;
          gap: 22px;
        }

        .report-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 22px;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .report-brand {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .report-logo {
          width: 82px;
          height: 62px;
          object-fit: contain;
        }

        .report-brand-copy p,
        .report-eyebrow,
        .report-meta p,
        .report-footer,
        .report-pill,
        .report-table-head {
          margin: 0;
          font-size: 10px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: ${BRAND.orange};
          font-weight: 800;
        }

        .report-brand-copy h1 {
          margin: 3px 0 0;
          max-width: 320px;
          color: ${BRAND.green};
          font-size: 18px;
          line-height: 1.05;
          font-weight: 900;
        }

        .report-meta {
          min-width: 190px;
          text-align: right;
          color: ${BRAND.muted};
          font-size: 12px;
        }

        .report-meta strong {
          display: block;
          margin-top: 4px;
          color: ${BRAND.ink};
          font-size: 13px;
        }

        .report-hero {
          display: grid;
          grid-template-columns: 1.22fr 0.78fr;
          gap: 20px;
          align-items: stretch;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .report-hero-main,
        .report-hero-result,
        .report-card,
        .report-mini-card,
        .report-affinity,
        .report-practice,
        .report-cta,
        .report-note {
          border: 1px solid rgba(46,64,54,0.12);
          border-radius: 18px;
          box-shadow: 0 20px 45px -35px rgba(26,26,26,0.48);
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .report-hero-main {
          padding: 28px;
          background: ${BRAND.green};
          color: #fff;
        }

        .report-hero-main .report-eyebrow {
          color: rgba(255,255,255,0.72);
        }

        .report-hero-main h2 {
          margin: 12px 0 10px;
          font-size: 36px;
          line-height: 0.96;
          letter-spacing: 0;
          font-weight: 950;
        }

        .report-hero-main .subtitle {
          margin: 0;
          max-width: 440px;
          color: rgba(255,255,255,0.82);
          font-size: 15px;
        }

        .report-stamp {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 22px;
          padding: 8px 12px;
          border: 1px solid rgba(255,255,255,0.22);
          border-radius: 999px;
          color: #fff;
          font-size: 11px;
          font-weight: 800;
        }

        .report-stamp span {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: ${BRAND.gold};
        }

        .report-hero-result {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 24px;
          background: #fff;
        }

        .report-type-number {
          width: 92px;
          height: 92px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 24px;
          background: ${BRAND.orange};
          color: #fff;
          font-size: 58px;
          line-height: 1;
          font-weight: 950;
        }

        .report-result-copy h3 {
          margin: 16px 0 5px;
          color: ${BRAND.green};
          font-size: 25px;
          line-height: 1.05;
        }

        .report-result-copy p {
          margin: 0;
          color: ${BRAND.muted};
          font-size: 13px;
        }

        .report-mini-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .report-mini-card {
          padding: 13px;
          background: #fff;
        }

        .report-mini-card-dark {
          background: ${BRAND.green};
          color: #fff;
        }

        .report-mini-card p {
          margin: 0 0 5px;
          color: ${BRAND.muted};
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .report-mini-card-dark p {
          color: rgba(255,255,255,0.68);
        }

        .report-mini-card strong {
          display: block;
          color: inherit;
          font-size: 17px;
          line-height: 1.1;
        }

        .report-section-heading {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .report-section-heading h2 {
          margin: 5px 0 0;
          color: ${BRAND.green};
          font-size: 25px;
          line-height: 1.05;
          font-weight: 950;
        }

        .report-section-heading > p:not(.report-eyebrow) {
          margin: 7px 0 0;
          color: ${BRAND.muted};
          font-size: 13px;
        }

        .report-interpretation {
          display: grid;
          grid-template-columns: 1fr 0.8fr;
          gap: 16px;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .report-card {
          padding: 18px;
          background: #fff;
        }

        .report-card h3,
        .report-affinity h3,
        .report-practice h3,
        .report-cta h3 {
          margin: 0 0 9px;
          color: ${BRAND.green};
          font-size: 17px;
          line-height: 1.1;
          font-weight: 900;
        }

        .report-card p,
        .report-practice p,
        .report-cta p,
        .report-note p {
          margin: 0;
          color: ${BRAND.muted};
          font-size: 13px;
          line-height: 1.48;
        }

        .report-card ul {
          margin: 0;
          padding: 0;
          list-style: none;
          display: grid;
          gap: 8px;
        }

        .report-card li {
          position: relative;
          padding-left: 18px;
          color: ${BRAND.muted};
          font-size: 13px;
          line-height: 1.35;
        }

        .report-card li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 7px;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: ${BRAND.orange};
        }

        .report-map-box {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 12px;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .report-map-box .report-card {
          min-height: 138px;
        }

        .report-page-two-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .report-affinity {
          padding: 18px;
          background: #fff;
        }

        .report-affinity-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 13px;
        }

        .report-affinity-header p {
          margin: 0;
          color: ${BRAND.muted};
          font-size: 12px;
        }

        .report-pill {
          padding: 7px 10px;
          border-radius: 999px;
          border: 1px solid rgba(204,88,51,0.22);
          background: rgba(204,88,51,0.08);
          white-space: nowrap;
        }

        .report-bars {
          display: grid;
          gap: 8px;
        }

        .report-bar-row {
          display: grid;
          grid-template-columns: 34px 1fr 62px;
          gap: 9px;
          align-items: center;
        }

        .report-bar-type {
          width: 34px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: rgba(46,64,54,0.08);
          color: ${BRAND.green};
          font-weight: 950;
        }

        .report-bar-row.is-dominant .report-bar-type {
          background: ${BRAND.orange};
          color: #fff;
        }

        .report-bar-copy {
          min-width: 0;
        }

        .report-bar-copy p {
          margin: 0 0 4px;
          color: ${BRAND.ink};
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .report-bar-track {
          height: 9px;
          overflow: hidden;
          border-radius: 999px;
          background: #E6E0D4;
        }

        .report-bar-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, ${BRAND.green}, #6F8677);
        }

        .report-bar-row.is-dominant .report-bar-fill {
          background: linear-gradient(90deg, ${BRAND.orange}, #E09055);
        }

        .report-bar-value {
          text-align: right;
          color: ${BRAND.green};
          font-size: 12px;
          font-weight: 900;
        }

        .report-center-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
        }

        .report-center-card {
          padding: 12px;
          border: 1px solid rgba(46,64,54,0.12);
          border-radius: 14px;
          background: #FCFBF7;
        }

        .report-center-card.is-dominant {
          border-color: rgba(204,88,51,0.34);
          background: #FFF6F0;
        }

        .report-center-card p {
          margin: 0;
          color: ${BRAND.muted};
          font-size: 10px;
        }

        .report-center-card strong {
          display: block;
          margin-bottom: 4px;
          color: ${BRAND.green};
          font-size: 14px;
        }

        .report-bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
          break-inside: avoid;
          page-break-inside: avoid;
        }

        .report-practice {
          padding: 18px;
          background: ${BRAND.green};
        }

        .report-practice h3,
        .report-practice p {
          color: #fff;
        }

        .report-practice p {
          color: rgba(255,255,255,0.78);
        }

        .report-cta {
          padding: 18px;
          background: #fff;
        }

        .report-cta a {
          display: inline-flex;
          margin-top: 12px;
          color: ${BRAND.orange};
          font-size: 12px;
          font-weight: 900;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .report-note {
          display: grid;
          grid-template-columns: 30px 1fr;
          gap: 10px;
          align-items: flex-start;
          padding: 13px 15px;
          background: rgba(255,255,255,0.72);
          box-shadow: none;
        }

        .report-note strong {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          border-radius: 10px;
          background: rgba(204,88,51,0.12);
          color: ${BRAND.orange};
        }

        .report-footer {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          margin-top: auto;
          padding-top: 10px;
          border-top: 1px solid rgba(46,64,54,0.14);
          color: ${BRAND.muted};
          letter-spacing: 0.08em;
        }

        @media print {
          @page {
            size: A4;
            margin: 0;
          }

          html,
          body {
            width: 210mm;
            background: ${BRAND.cream} !important;
          }

          body.printing-enneagram-report * {
            visibility: hidden !important;
          }

          body.printing-enneagram-report .enneagram-print-layer,
          body.printing-enneagram-report .enneagram-print-layer * {
            visibility: visible !important;
          }

          body.printing-enneagram-report .enneagram-print-layer {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            background: ${BRAND.cream} !important;
            z-index: 999999 !important;
            pointer-events: auto !important;
          }

          body.printing-enneagram-report .gemb-report {
            width: 210mm !important;
          }

          body.printing-enneagram-report .gemb-report-page {
            width: 210mm !important;
            min-height: 297mm !important;
            padding: 11mm !important;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body.printing-enneagram-report .report-content {
            min-height: calc(297mm - 22mm) !important;
          }
        }
      `}</style>

      <section className="gemb-report-page" data-pdf-page="1">
        <div className="report-content">
          <header className="report-header">
            <div className="report-brand">
              <img
                className="report-logo"
                src="/logo-gemb.png"
                alt="Gimnasio Emocional Mentes Brillantes"
                crossOrigin="anonymous"
              />
              <div className="report-brand-copy">
                <p>Informe GEMB</p>
                <h1>Gimnasio Emocional Mentes Brillantes</h1>
              </div>
            </div>

            <div className="report-meta">
              <p>Fecha del resultado</p>
              <strong>{formatDate(generatedAt)}</strong>
              <p style={{ marginTop: 10 }}>Persona</p>
              <strong>{personName || 'No especificado'}</strong>
            </div>
          </header>

          <div className="report-hero">
            <div className="report-hero-main">
              <p className="report-eyebrow">Resultado del Test de Eneagrama</p>
              <h2>Tu mapa emocional</h2>
              <p className="subtitle">{subtitle}</p>
              <div className="report-stamp">
                <span />
                Documento orientativo oficial GEMB
              </div>
            </div>

            <div className="report-hero-result">
              <div>
                <div className="report-type-number">{dominantType}</div>
                <div className="report-result-copy">
                  <h3>{resultLabel}</h3>
                  <p>{typeData.type || `Eneatipo ${dominantType}`}</p>
                </div>
              </div>
              <div className="report-mini-grid">
                <MiniCard label="Centro dominante" value={centerLabel} />
                <MiniCard label="Afinidad" value={affinityLabel} tone="dark" />
              </div>
            </div>
          </div>

          <div className="report-interpretation">
            <div className="report-card">
              <h3>Frase interpretativa</h3>
              <p>{interpretation}</p>
            </div>
            <div className="report-card">
              <h3>Resultado principal destacado</h3>
              <ul>
                <li>{`Eneatipo ${dominantType}: ${typeName}`}</li>
                <li>{`Centro dominante: ${centerLabel}`}</li>
                <li>{`Afinidad: ${affinityLabel}`}</li>
              </ul>
            </div>
          </div>

          <SectionTitle eyebrow="Lectura base" title="Que significa este resultado">
            Esta seccion traduce el resultado en lenguaje practico: que te mueve, que suele ayudarte y donde conviene observar automatismos.
          </SectionTitle>

          <div className="report-map-box">
            <div className="report-card">
              <h3>Motivacion</h3>
              <p>{typeData.motivation || typeData.desc || 'Observar que necesidad emocional se activa con mas frecuencia.'}</p>
            </div>
            <div className="report-card">
              <h3>Deseo central</h3>
              <p>{typeData.desire || 'Reconocer el estado interno que intentas proteger o alcanzar cuando reaccionas.'}</p>
            </div>
            <div className="report-card">
              <h3>Miedo o tension</h3>
              <p>{typeData.fear || typeData.pressure || 'Identificar que amenaza percibida dispara el patron.'}</p>
            </div>
          </div>

          <div className="report-card">
            <h3>Lectura profunda del eneatipo</h3>
            <p>{typeData.desc || interpretation}</p>
          </div>

          <footer className="report-footer">
            <span>GEMB · Resultado de Eneagrama</span>
            <span>Pagina 1 / 2</span>
          </footer>
        </div>
      </section>

      <section className="gemb-report-page" data-pdf-page="2">
        <div className="report-content">
          <header className="report-header">
            <div className="report-brand">
              <img
                className="report-logo"
                src="/logo-gemb.png"
                alt="Gimnasio Emocional Mentes Brillantes"
                crossOrigin="anonymous"
              />
              <div className="report-brand-copy">
                <p>Reporte de seguimiento</p>
                <h1>{`Eneatipo ${dominantType}: ${typeName}`}</h1>
              </div>
            </div>
            <div className="report-pill">{isQuick ? 'Hipotesis inicial' : 'Lectura profunda'}</div>
          </header>

          <div className="report-page-two-grid">
            <div className="report-card">
              <h3>Caracteristicas principales</h3>
              <ul>
                {traits.slice(0, 4).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="report-card">
              <h3>Fortalezas</h3>
              <ul>
                {strengths.slice(0, 4).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="report-page-two-grid">
            <div className="report-card">
              <h3>Riesgos o puntos de trabajo</h3>
              <ul>
                {(risks.length ? risks : ['Observar donde reaccionas en automatico y pedir retroalimentacion confiable.']).slice(0, 4).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="report-card">
              <h3>Centro dominante</h3>
              <p>{centerMessage}</p>
            </div>
          </div>

          {triads && (
            <div className="report-card">
              <h3>Distribucion por centros</h3>
              <div className="report-center-grid">
                {Object.values(triads)
                  .slice()
                  .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
                  .map((triad) => (
                    <div
                      key={triad.key}
                      className={`report-center-card ${triad.label === centerLabel ? 'is-dominant' : ''}`}
                    >
                      <strong>{triad.label}</strong>
                      <p>{`Tipos ${triad.members?.join(' + ') || '-'}`}</p>
                      <p>{Number.isFinite(triad.score) ? `${triad.score.toFixed(1)} pts` : 'Orientativo'}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}

          <div className="report-affinity">
            <div className="report-affinity-header">
              <div>
                <h3>Afinidad por eneatipo</h3>
                <p>{hasAffinityTable ? 'Barras ordenadas de mayor a menor afinidad.' : 'El test rapido no calcula porcentajes; confirma con la lectura profunda.'}</p>
              </div>
              <span className="report-pill">{`Dominante: ${dominantType}`}</span>
            </div>
            <div className="report-bars">
              {sortedAffinity.map((entry) => {
                const entryTypeData = typeCatalog[entry.type] || {};
                const isDominant = Number(entry.type) === Number(dominantType);
                const rowLabel = entryTypeData.type || `Eneatipo ${entry.type}`;

                return (
                  <div key={entry.type} className={`report-bar-row ${isDominant ? 'is-dominant' : ''}`}>
                    <div className="report-bar-type">{entry.type}</div>
                    <div className="report-bar-copy">
                      <p>{rowLabel}</p>
                      <div className="report-bar-track">
                        <div className="report-bar-fill" style={{ width: `${clampBarWidth(entry.affinity)}%` }} />
                      </div>
                    </div>
                    <div className="report-bar-value">{Number.isFinite(entry.affinity) ? formatPercent(entry.affinity) : 'Guia'}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {isQuick && (
            <div className="report-card">
              <h3>Como usar esta hipotesis inicial</h3>
              <ul>
                <li>Tomala como una primera pista, no como una etiqueta fija.</li>
                <li>Observa durante la semana donde aparece este patron en decisiones, vinculos y tension.</li>
                <li>Haz la lectura profunda de 135 preguntas para confirmar afinidad, centro y matices.</li>
              </ul>
            </div>
          )}

          {harmonics && (
            <div className="report-card">
              <h3>Patrones de apoyo</h3>
              <p>
                {Object.values(harmonics)
                  .slice()
                  .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
                  .map((item) => `${item.label}: ${Number.isFinite(item.score) ? item.score.toFixed(1) : 'orientativo'}`)
                  .join(' · ')}
              </p>
            </div>
          )}

          <div className="report-bottom-grid">
            <div className="report-practice">
              <h3>Recomendacion de practica</h3>
              <p>{practice}</p>
            </div>
            <div className="report-cta">
              <h3>Siguiente paso sugerido</h3>
              <p>
                Agenda una sesion o acompanamiento con GEMB para leer este mapa con contexto humano,
                aterrizarlo a tu vida diaria y convertirlo en practica emocional concreta.
              </p>
              {whatsappHref && <a href={whatsappHref}>Contactar por WhatsApp</a>}
            </div>
          </div>

          <div className="report-note">
            <strong>!</strong>
            <p>
              Este resultado es orientativo y no reemplaza una valoracion medica,
              psicologica o clinica.
            </p>
          </div>

          <footer className="report-footer">
            <span>Gimnasio Emocional Mentes Brillantes</span>
            <span>Pagina 2 / 2</span>
          </footer>
        </div>
      </section>
    </article>
  );
}
