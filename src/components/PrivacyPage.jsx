import React from 'react';
import { ShieldCheck, Mail, MessageCircle, MapPin } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   Política de tratamiento de datos personales
   Fundación Social Mentes Brillantes
   (Ley 1581 de 2012 y Decreto 1377 de 2013 — Colombia)
   ═══════════════════════════════════════════════════════════════ */

const CONTACT_EMAIL = 'fundacionsocial@gimnasioemocionalmb.com';
const CONTACT_PHONE = '+57 311 260 2355';

const Section = ({ number, title, children }) => (
  <section className="mb-10">
    <h2 className="font-heading text-xl md:text-2xl font-bold text-[#2E4036] mb-3">
      <span className="font-mono text-sm text-[#B04A29] mr-2">{number}.</span>
      {title}
    </h2>
    <div className="space-y-3 text-[15px] leading-relaxed text-[#1A1A1A]/80">{children}</div>
  </section>
);

export default function PrivacyPage(props) {
  const { GlobalStyles, Navbar, Footer, onOpenTest } = props;
  return (
    <>
      <GlobalStyles />
      <div className="noise-overlay"></div>
      <Navbar onOpenTest={onOpenTest} darkAtTop />

      <main className="bg-[#F2F0E9] min-h-screen">
        <div className="mx-auto max-w-3xl px-6 pb-24 pt-32 md:pt-40">
          <div className="mb-10">
            <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[#2E4036] text-[#E2C17D]">
              <ShieldCheck size={26} />
            </div>
            <h1 className="font-heading text-3xl font-bold text-[#1A1A1A] md:text-4xl">
              Política de tratamiento de datos personales
            </h1>
            <p className="mt-3 text-sm text-[#1A1A1A]/70">
              Fundación Social Mentes Brillantes · NIT 901.002.849-3
              <br />
              Última actualización: julio de 2026
            </p>
          </div>

          <Section number="1" title="Quiénes somos (responsable del tratamiento)">
            <p>
              La <strong>Fundación Social Mentes Brillantes</strong> (en adelante, “la
              Fundación”), identificada con NIT 901.002.849-3, con domicilio en Bogotá, Colombia, es la
              responsable del tratamiento de los datos personales recogidos a través de este sitio web
              (gimnasioemocionalmb.com) y de sus programas.
            </p>
            <ul className="list-none space-y-2 rounded-2xl border border-[#2E4036]/10 bg-white p-5">
              <li className="flex items-center gap-3">
                <Mail size={16} className="shrink-0 text-[#2E4036]" />
                <a href={`mailto:${CONTACT_EMAIL}`} className="underline decoration-[#2E4036]/30 underline-offset-4 hover:text-[#2E4036]">{CONTACT_EMAIL}</a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle size={16} className="shrink-0 text-[#2E4036]" />
                <span>WhatsApp: {CONTACT_PHONE}</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={16} className="shrink-0 text-[#2E4036]" />
                <span>Bogotá, Colombia</span>
              </li>
            </ul>
          </Section>

          <Section number="2" title="Qué datos recogemos">
            <p>Según cómo uses el sitio, podemos recoger:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>
                <strong>Datos de contacto:</strong> nombre, teléfono, correo electrónico y ciudad, cuando los
                escribes en nuestros formularios para pedir información o presentar un test.
              </li>
              <li>
                <strong>Respuestas de tests y valoraciones:</strong> las respuestas que eliges al presentar
                nuestros tests de valoración inicial, eneagrama u otras herramientas de autoconocimiento.
              </li>
              <li>
                <strong>Datos de acceso al portal privado:</strong> si participas en un proceso acompañado, tu
                correo de Google al iniciar sesión, tu perfil (nombre, teléfono, género) y tu avance en las
                herramientas del proceso.
              </li>
            </ul>
          </Section>

          <Section number="3" title="Datos sensibles y tu diario privado">
            <p>
              Algunas de nuestras herramientas tocan tu bienestar emocional. Estos datos son{' '}
              <strong>sensibles</strong> y los tratamos con especial cuidado: responder es siempre{' '}
              <strong>voluntario</strong>, solo el equipo autorizado de la Fundación puede verlos y nunca se
              usan para fines distintos a tu acompañamiento.
            </p>
            <p>
              Lo que escribes en el <strong>diario privado</strong> del portal de proceso solo lo puedes leer
              tú: ni la coach ni los administradores tienen acceso a su contenido.
            </p>
          </Section>

          <Section number="4" title="Para qué usamos tus datos (finalidades)">
            <ul className="list-disc space-y-2 pl-6">
              <li>Contactarte para responder tus solicitudes y entregarte los resultados de tus tests.</li>
              <li>Enviarte información sobre programas, procesos y actividades de la Fundación.</li>
              <li>Acompañar tu proceso personal cuando participas en nuestros programas.</li>
              <li>Elaborar estadísticas internas de forma anónima para mejorar nuestras herramientas.</li>
            </ul>
          </Section>

          <Section number="5" title="Con quién compartimos tus datos">
            <p>
              <strong>No vendemos ni alquilamos tus datos personales.</strong> Para funcionar, el sitio usa
              proveedores tecnológicos que almacenan la información con medidas de seguridad (Google Firebase
              para bases de datos y autenticación, y Vercel para el alojamiento web). Estos proveedores actúan
              como encargados del tratamiento y no usan tus datos para fines propios.
            </p>
          </Section>

          <Section number="6" title="Tus derechos (habeas data)">
            <p>De acuerdo con la Ley 1581 de 2012, tienes derecho a:</p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Conocer, actualizar y rectificar tus datos personales.</li>
              <li>Solicitar prueba de la autorización otorgada.</li>
              <li>Ser informado sobre el uso que se ha dado a tus datos.</li>
              <li>Revocar la autorización y/o solicitar la supresión de tus datos.</li>
              <li>Presentar quejas ante la Superintendencia de Industria y Comercio.</li>
            </ul>
            <p>
              Para ejercer cualquiera de estos derechos, escríbenos a{' '}
              <a href={`mailto:${CONTACT_EMAIL}`} className="underline decoration-[#2E4036]/30 underline-offset-4 hover:text-[#2E4036]">{CONTACT_EMAIL}</a>{' '}
              indicando tu nombre y tu solicitud. Responderemos en los plazos que establece la ley.
            </p>
          </Section>

          <Section number="7" title="Menores de edad">
            <p>
              Nuestros servicios están dirigidos a personas adultas. El tratamiento de datos de menores de
              edad solo se realiza con la autorización expresa de sus padres o representantes legales, y
              respetando siempre sus derechos prevalentes.
            </p>
          </Section>

          <Section number="8" title="Seguridad y conservación">
            <p>
              Aplicamos medidas técnicas y organizativas razonables para proteger tu información (conexión
              cifrada HTTPS, reglas de acceso por usuario y almacenamiento en proveedores certificados). Los
              datos se conservan mientras exista una finalidad legítima y podrás solicitar su supresión en
              cualquier momento.
            </p>
          </Section>

          <Section number="9" title="Cambios a esta política">
            <p>
              Cualquier cambio sustancial a esta política será publicado en esta misma página con su fecha de
              actualización. El uso continuado del sitio implica la aceptación de la versión vigente.
            </p>
          </Section>
        </div>
      </main>

      <Footer />
    </>
  );
}
