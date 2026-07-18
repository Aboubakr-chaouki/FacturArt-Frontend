import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Fonction pour convertir une URL relative en URL absolue
function getAbsoluteUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  // Ajouter le domaine de base pour les URLs relatives
  const baseUrl = window.location.origin;
  return `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
}

// Fonction pour charger une image et la convertir en Data URL
async function imageToDataUrl(imageSrc: string): Promise<string> {
  return new Promise((resolve) => {
    // Si c'est déjà une data URL, retourner directement
    if (imageSrc.startsWith('data:')) {
      resolve(imageSrc);
      return;
    }

    const absoluteUrl = getAbsoluteUrl(imageSrc);
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        try {
          resolve(canvas.toDataURL('image/png'));
        } catch {
          resolve('');
        }
      }
    };

    img.onerror = () => {
      resolve('');
    };

    img.src = absoluteUrl;
  });
}

export async function generatePDFFromHTML(
  element: HTMLElement,
  filename: string,
  options: {
    orientation?: 'portrait' | 'landscape';
    format?: 'a4' | 'letter';
    scale?: number;
  } = {}
) {
  try {
    // Cacher les éléments non-print avant de générer le PDF
    const printHiddenElements = document.querySelectorAll('.print\\:hidden');
    printHiddenElements.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });

    // Attendre le chargement de TOUTES les images et les convertir en data URLs
    const images = Array.from(element.querySelectorAll('img'));


    // Convertir toutes les images en data URLs
    const imagePromises = images.map(async (img) => {
      if (!img.src) return;

      try {
        const dataUrl = await imageToDataUrl(img.src);
        if (dataUrl) {
          img.src = dataUrl;
          img.crossOrigin = 'anonymous';
        }
      } catch (error) {
      }
    });

    await Promise.all(imagePromises);

    // Attendre que le DOM soit stable et les polices chargées
    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 500));

    // Générer le canvas avec les bonnes options
    const canvas = await html2canvas(element, {
      scale: options.scale || 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true,
      imageTimeout: 10000,
      windowHeight: element.scrollHeight || undefined,
      windowWidth: element.scrollWidth || undefined,
      ignoreElements: (el) => {
        return el.classList.contains('print:hidden');
      }
    });

    // Restaurer les éléments
    printHiddenElements.forEach(el => {
      (el as HTMLElement).style.display = '';
    });

    const { orientation = 'portrait', format = 'a4' } = options;
    const isLandscape = orientation === 'landscape';
    const isLetter = format === 'letter';

    const pageWidth = isLandscape
      ? (isLetter ? 279.4 : 297)
      : (isLetter ? 215.9 : 210);
    const pageHeight = isLandscape
      ? (isLetter ? 215.9 : 210)
      : (isLetter ? 279.4 : 297);

    const marginLeft = 15;
    const marginRight = 15;
    const marginTop = 15;
    const marginBottom = 15;

    const contentWidth = pageWidth - marginLeft - marginRight;
    const contentHeight = pageHeight - marginTop - marginBottom;

    // Calculer les dimensions de l'image
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = canvasHeight / canvasWidth;

    // Calculer la hauteur de l'image pour qu'elle tienne sur une page
    const imgWidth = contentWidth;
    const imgHeight = imgWidth * ratio;

    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: format
    });

    // Découper l'image si elle est trop grande
    if (imgHeight > contentHeight) {
      // Utiliser le canvas en entier et adapter à plusieurs pages si nécessaire
      const totalPages = Math.ceil(imgHeight / contentHeight);

      for (let i = 0; i < totalPages; i++) {
        if (i > 0) {
          pdf.addPage();
        }

        // Calcul de la portion de canvas à afficher
        const sourceY = (i * contentHeight * canvasHeight) / imgHeight;
        const sourceHeight = Math.min(
          (contentHeight * canvasHeight) / imgHeight,
          canvasHeight - sourceY
        );

        // Créer un canvas pour cette portion
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvasWidth;
        pageCanvas.height = Math.min(sourceHeight, canvasHeight);
        const ctx = pageCanvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(
            canvas,
            0, sourceY,
            canvasWidth, Math.min(sourceHeight, canvasHeight),
            0, 0,
            canvasWidth, Math.min(sourceHeight, canvasHeight)
          );

          const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.85);
          const pageImgHeight = (sourceHeight / canvasHeight) * imgHeight;
          pdf.addImage(pageImgData, 'JPEG', marginLeft, marginTop, imgWidth, pageImgHeight);
        }
      }
    } else {
      const imgData = canvas.toDataURL('image/jpeg', 0.85);
      pdf.addImage(imgData, 'JPEG', marginLeft, marginTop, imgWidth, imgHeight);
    }

    pdf.save(filename);
  } catch (error) {
    throw error;
  }
}

export async function getPDFBlobFromHTML(
  element: HTMLElement,
  options: {
    orientation?: 'portrait' | 'landscape';
    format?: 'a4' | 'letter';
    scale?: number;
  } = {}
): Promise<Blob> {
  try {
    // Cacher les éléments non-print avant de générer le PDF
    const printHiddenElements = document.querySelectorAll('.print\\:hidden');
    printHiddenElements.forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });

    // Attendre le chargement de TOUTES les images et les convertir en data URLs
    const images = Array.from(element.querySelectorAll('img'));

    // Convertir toutes les images en data URLs
    const imagePromises = images.map(async (img) => {
      if (!img.src) return;
      try {
        const dataUrl = await imageToDataUrl(img.src);
        if (dataUrl) {
          img.src = dataUrl;
          img.crossOrigin = 'anonymous';
        }
      } catch (error) {
      }
    });

    await Promise.all(imagePromises);

    // Attendre que le DOM soit stable
    await document.fonts.ready;
    await new Promise(resolve => setTimeout(resolve, 500));

    // Générer le canvas
    const canvas = await html2canvas(element, {
      scale: options.scale || 1.5,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true,
      imageTimeout: 10000,
      windowHeight: element.scrollHeight || undefined,
      windowWidth: element.scrollWidth || undefined,
      ignoreElements: (el) => {
        return el.classList.contains('print:hidden');
      }
    });

    // Restaurer les éléments
    printHiddenElements.forEach(el => {
      (el as HTMLElement).style.display = '';
    });

    const { orientation = 'portrait', format = 'a4' } = options;
    const isLandscape = orientation === 'landscape';
    const isLetter = format === 'letter';

    const pageWidth = isLandscape ? (isLetter ? 279.4 : 297) : (isLetter ? 215.9 : 210);
    const pageHeight = isLandscape ? (isLetter ? 215.9 : 210) : (isLetter ? 279.4 : 297);

    const marginLeft = 15;
    const marginRight = 15;
    const marginTop = 15;
    const marginBottom = 15;

    const contentWidth = pageWidth - marginLeft - marginRight;
    const contentHeight = pageHeight - marginTop - marginBottom;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = canvasHeight / canvasWidth;

    const imgWidth = contentWidth;
    const imgHeight = imgWidth * ratio;

    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: format
    });

    if (imgHeight > contentHeight) {
      const totalPages = Math.ceil(imgHeight / contentHeight);
      for (let i = 0; i < totalPages; i++) {
        if (i > 0) pdf.addPage();
        const sourceY = (i * contentHeight * canvasHeight) / imgHeight;
        const sourceHeight = Math.min((contentHeight * canvasHeight) / imgHeight, canvasHeight - sourceY);

        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = canvasWidth;
        pageCanvas.height = Math.min(sourceHeight, canvasHeight);
        const ctx = pageCanvas.getContext('2d');

        if (ctx) {
          ctx.drawImage(canvas, 0, sourceY, canvasWidth, Math.min(sourceHeight, canvasHeight), 0, 0, canvasWidth, Math.min(sourceHeight, canvasHeight));
          const pageImgData = pageCanvas.toDataURL('image/jpeg', 0.85);
          const pageImgHeight = (sourceHeight / canvasHeight) * imgHeight;
          pdf.addImage(pageImgData, 'JPEG', marginLeft, marginTop, imgWidth, pageImgHeight);
        }
      }
    } else {
      const imgData = canvas.toDataURL('image/jpeg', 0.85);
      pdf.addImage(imgData, 'JPEG', marginLeft, marginTop, imgWidth, imgHeight);
    }

    return pdf.output('blob');
  } catch (error) {
    throw error;
  }
}
