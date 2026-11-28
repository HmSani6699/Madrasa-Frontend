// High-fidelity hidden-iframe print engine for A4 Portrait & Landscape
// Preserves Tailwind v4 CSS rules, gradients, SVG graphics, and @page sizing

export const printHtmlElement = ({
  elementId,
  title = "Madrasa Print Document",
  orientation = "portrait", // "portrait" | "landscape"
  marginMm = 8,
}) => {
  const target = document.getElementById(elementId);
  if (!target) {
    throw new Error("প্রিন্ট কন্টেইনার পাওয়া যায়নি");
  }

  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.visibility = "hidden";
  document.body.appendChild(iframe);

  const doc = iframe.contentWindow.document;
  const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
    .map((node) => node.outerHTML)
    .join("\n");

  const pageSize = orientation === "landscape" ? "A4 landscape" : "A4 portrait";

  doc.open();
  doc.write(`
    <!DOCTYPE html>
    <html lang="bn">
      <head>
        <meta charset="UTF-8" />
        <title>${title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Baloo+Da+2:wght@400;500;600;700;800&family=Hind+Siliguri:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        ${styles}
        <style>
          @page {
            size: ${pageSize};
            margin: ${marginMm}mm;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
            box-sizing: border-box;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            font-family: 'Baloo Da 2', 'Hind Siliguri', 'Outfit', sans-serif !important;
          }
          .font-arabic {
            font-family: 'Amiri', serif !important;
          }
          .print-page-break {
            page-break-after: always;
            break-after: page;
          }
          .print-page-break:last-child {
            page-break-after: auto;
            break-after: auto;
          }
          .avoid-break {
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .no-print {
            display: none !important;
          }
        </style>
      </head>
      <body>
        <div class="print-root">
          ${target.innerHTML}
        </div>
      </body>
    </html>
  `);
  doc.close();

  const triggerPrint = () => {
    try {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
    } finally {
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 1500);
    }
  };

  if (iframe.contentWindow.document.readyState === "complete") {
    setTimeout(triggerPrint, 650);
  } else {
    iframe.onload = () => setTimeout(triggerPrint, 650);
  }
};
