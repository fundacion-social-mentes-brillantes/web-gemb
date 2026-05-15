import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const REPORT_BACKGROUND = '#F2F0E9';

const waitForImages = async (root) => {
  const images = Array.from(root.querySelectorAll('img'));

  await Promise.all(
    images.map((image) => {
      if (image.complete) return Promise.resolve();

      return new Promise((resolve) => {
        image.onload = resolve;
        image.onerror = resolve;
      });
    })
  );
};

const createCaptureSandbox = (reportElement) => {
  const source = reportElement.querySelector('[data-pdf-report]') || reportElement;
  const clone = source.cloneNode(true);
  const sandbox = document.createElement('div');

  sandbox.setAttribute('aria-hidden', 'true');
  Object.assign(sandbox.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    width: '794px',
    minHeight: '1123px',
    background: REPORT_BACKGROUND,
    pointerEvents: 'none',
    transform: 'translateX(-140%)',
    zIndex: '-1'
  });

  sandbox.appendChild(clone);
  document.body.appendChild(sandbox);

  return { sandbox, clone };
};

const addCanvasAsPdfPage = (pdf, canvas, isFirstPage) => {
  const imageData = canvas.toDataURL('image/jpeg', 0.96);
  const imageRatio = canvas.width / canvas.height;
  const pageRatio = A4_WIDTH_MM / A4_HEIGHT_MM;

  let width = A4_WIDTH_MM;
  let height = A4_HEIGHT_MM;
  let x = 0;
  let y = 0;

  if (Math.abs(imageRatio - pageRatio) > 0.01) {
    const scale = Math.min(A4_WIDTH_MM / canvas.width, A4_HEIGHT_MM / canvas.height);
    width = canvas.width * scale;
    height = canvas.height * scale;
    x = (A4_WIDTH_MM - width) / 2;
    y = (A4_HEIGHT_MM - height) / 2;
  }

  if (!isFirstPage) pdf.addPage();
  pdf.addImage(imageData, 'JPEG', x, y, width, height, undefined, 'FAST');
};

const buildPdfReport = async (reportElement) => {
  if (!reportElement) {
    throw new Error('No report element available');
  }

  const { sandbox, clone } = createCaptureSandbox(reportElement);

  try {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    await waitForImages(clone);

    const pages = Array.from(clone.querySelectorAll('[data-pdf-page]'));
    const captureTargets = pages.length ? pages : [clone];
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    for (let index = 0; index < captureTargets.length; index += 1) {
      const page = captureTargets[index];
      const canvas = await html2canvas(page, {
        backgroundColor: REPORT_BACKGROUND,
        scale: Math.min(2.2, window.devicePixelRatio || 2),
        useCORS: true,
        allowTaint: true,
        logging: false,
        windowWidth: page.scrollWidth,
        windowHeight: page.scrollHeight
      });

      addCanvasAsPdfPage(pdf, canvas, index === 0);
    }

    return pdf;
  } finally {
    sandbox.remove();
  }
};

export const createPdfReportBlob = async ({ reportElement }) => {
  const pdf = await buildPdfReport(reportElement);
  return pdf.output('blob');
};

export const downloadPdfReport = async ({
  reportElement,
  fileName = 'resultado-eneagrama-gemb.pdf'
}) => {
  const pdf = await buildPdfReport(reportElement);
  pdf.save(fileName);
};
