import React, { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Loader2, ShieldCheck } from 'lucide-react';

const initialContact = {
  fullName: '',
  whatsapp: '',
  email: '',
  city: ''
};

const initialConsent = {
  privacyAccepted: false,
  sensitiveDataAccepted: false
};

const isValidWhatsapp = (value) => {
  const trimmed = value.trim();
  const digits = trimmed.replace(/\D/g, '');
  const plusCount = (trimmed.match(/\+/g) || []).length;

  return (
    digits.length >= 8 &&
    plusCount <= 1 &&
    /^[+\d\s]+$/.test(trimmed) &&
    (plusCount === 0 || trimmed.startsWith('+'))
  );
};

export default function LeadCaptureForm({
  title = 'Antes de continuar',
  description = 'Dejanos tus datos para guardar tu resultado y poder orientarte con seguimiento humano.',
  submitLabel = 'Continuar',
  onSubmit
}) {
  const [contact, setContact] = useState(initialContact);
  const [consent, setConsent] = useState(initialConsent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const whatsappTouched = contact.whatsapp.trim().length > 0;
  const whatsappIsValid = isValidWhatsapp(contact.whatsapp);

  const canSubmit = useMemo(
    () =>
      contact.fullName.trim().length > 1 &&
      whatsappIsValid &&
      consent.privacyAccepted &&
      consent.sensitiveDataAccepted &&
      !isSubmitting,
    [contact.fullName, whatsappIsValid, consent, isSubmitting]
  );

  const updateContact = (field, value) => {
    setContact((current) => ({ ...current, [field]: value }));
  };

  const updateConsent = (field, value) => {
    setConsent((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!canSubmit) {
      setError('Completa nombre, WhatsApp valido y autorizaciones para continuar.');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit?.({
        contact: {
          fullName: contact.fullName.trim(),
          whatsapp: contact.whatsapp.trim(),
          email: contact.email.trim(),
          city: contact.city.trim()
        },
        consent
      });
    } catch (err) {
      setError(
        err?.message ||
          'No pudimos guardar tus datos en este momento. Revisa tu conexion e intenta de nuevo.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
      <div className="rounded-[2.25rem] overflow-hidden border border-white/60 shadow-[0_24px_60px_-36px_rgba(26,26,26,0.45)]">
        <div className="relative px-6 py-7 md:px-8 md:py-9 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.78),_transparent_35%),linear-gradient(135deg,#E9D7C6_0%,#F7EFE7_45%,#E8F0EB_100%)]">
          <div className="absolute inset-y-0 right-0 w-32 bg-[radial-gradient(circle,_rgba(204,88,51,0.18)_0%,_transparent_65%)]"></div>
          <div className="relative flex flex-col md:flex-row md:items-center gap-5">
            <div className="h-14 w-14 rounded-[1.35rem] bg-[#2E4036] text-white flex items-center justify-center shadow-lg">
              <ShieldCheck size={26} />
            </div>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-[#B04A29] mb-2">
                Datos para tu resultado
              </p>
              <h3 className="font-heading text-3xl md:text-4xl text-[#1A1A1A] leading-tight">
                {title}
              </h3>
              <p className="text-sm md:text-base text-[#1A1A1A]/72 leading-relaxed mt-3 max-w-2xl">
                {description}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <label className="space-y-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#2E4036]">
            Nombre completo *
          </span>
          <input
            type="text"
            value={contact.fullName}
            onChange={(event) => updateContact('fullName', event.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#CC5833] focus:ring-4 focus:ring-[#CC5833]/10"
            placeholder="Tu nombre"
            autoComplete="name"
            required
          />
        </label>

        <label className="space-y-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#2E4036]">
            WhatsApp *
          </span>
          <input
            type="tel"
            value={contact.whatsapp}
            onChange={(event) => updateContact('whatsapp', event.target.value)}
            className={`w-full rounded-2xl border bg-white px-4 py-3 text-[#1A1A1A] outline-none transition focus:ring-4 ${
              whatsappTouched && !whatsappIsValid
                ? 'border-[#CC5833] focus:border-[#CC5833] focus:ring-[#CC5833]/10'
                : 'border-gray-200 focus:border-[#CC5833] focus:ring-[#CC5833]/10'
            }`}
            placeholder="+57 300 000 0000"
            autoComplete="tel"
            required
          />
          {whatsappTouched && !whatsappIsValid && (
            <p className="text-xs text-[#B04A29]">
              Usa minimo 8 digitos. Puedes incluir espacios y +.
            </p>
          )}
        </label>

        <label className="space-y-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#2E4036]">
            Email
          </span>
          <input
            type="email"
            value={contact.email}
            onChange={(event) => updateContact('email', event.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#CC5833] focus:ring-4 focus:ring-[#CC5833]/10"
            placeholder="correo@ejemplo.com"
            autoComplete="email"
          />
        </label>

        <label className="space-y-2">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#2E4036]">
            Ciudad
          </span>
          <input
            type="text"
            value={contact.city}
            onChange={(event) => updateContact('city', event.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-[#1A1A1A] outline-none transition focus:border-[#CC5833] focus:ring-4 focus:ring-[#CC5833]/10"
            placeholder="Ciudad"
            autoComplete="address-level2"
          />
        </label>
      </div>

      <div className="space-y-3 rounded-[2rem] border border-[#2E4036]/10 bg-white p-5 shadow-sm">
        <label className="flex items-start gap-3 text-sm text-[#1A1A1A]/78">
          <input
            type="checkbox"
            checked={consent.privacyAccepted}
            onChange={(event) => updateConsent('privacyAccepted', event.target.checked)}
            className="mt-1 h-4 w-4 accent-[#CC5833]"
            required
          />
          <span>
            Acepto la{' '}
            <a
              href="/politica-de-privacidad"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-[#CC5833]/40 underline-offset-2 hover:text-[#CC5833]"
            >
              pol&iacute;tica de tratamiento de datos personales
            </a>
            .
          </span>
        </label>

        <label className="flex items-start gap-3 text-sm text-[#1A1A1A]/78">
          <input
            type="checkbox"
            checked={consent.sensitiveDataAccepted}
            onChange={(event) =>
              updateConsent('sensitiveDataAccepted', event.target.checked)
            }
            className="mt-1 h-4 w-4 accent-[#CC5833]"
            required
          />
          <span>
            Autorizo el tratamiento de mis respuestas, incluyendo informaci&oacute;n
            sensible, con fines de orientaci&oacute;n y seguimiento.
          </span>
        </label>

        <div className="flex gap-3 rounded-[1.5rem] bg-[#F7F4ED] p-4 text-xs leading-relaxed text-[#2E4036]">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#CC5833]" />
          <p>
            Este test es orientativo y no reemplaza una valoraci&oacute;n m&eacute;dica,
            psicol&oacute;gica o cl&iacute;nica. Si est&aacute;s en crisis o necesitas
            atenci&oacute;n inmediata, busca ayuda profesional o una l&iacute;nea de
            emergencia de tu pa&iacute;s.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-2xl border border-[#CC5833]/25 bg-[#FFF3EE] px-4 py-3 text-sm text-[#7A3A25]">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className={`w-full inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 font-bold transition-all ${
          canSubmit
            ? 'bg-[#CC5833] text-white btn-magnetic shadow-[0_0_20px_rgba(204,88,51,0.28)]'
            : 'cursor-not-allowed bg-gray-200 text-gray-400'
        }`}
      >
        {isSubmitting && <Loader2 size={18} className="animate-spin" />}
        {isSubmitting ? 'Guardando...' : submitLabel}
      </button>
    </form>
  );
}
