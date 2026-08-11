const fs = require('fs');
const path = require('path');
const { getDocument } = require('pdfjs-dist/legacy/build/pdf.js');
const { createCanvas } = require('canvas');
const PptxGenJS = require('pptxgenjs');

async function convertPdfToPptx(pdfPath) {
  console.log('Reading PDF:', pdfPath);
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  
  const loadingTask = getDocument({ data, disableFontFace: true });
  const pdfDocument = await loadingTask.promise;
  console.log(`Loaded PDF with ${pdfDocument.numPages} pages.`);
  
  let pptx = new PptxGenJS();
  
  for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);
    const viewport = page.getViewport({ scale: 2.0 }); // High res
    
    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext('2d');
    
    await page.render({ canvasContext: context, viewport: viewport }).promise;
    
    const imgData = canvas.toDataURL('image/jpeg', 0.8);
    
    let slide = pptx.addSlide();
    slide.background = { data: imgData };
    console.log(`Rendered page ${pageNum}`);
  }
  
  const outPath = pdfPath.replace('.pdf', '.pptx');
  await pptx.writeFile({ fileName: outPath });
  console.log(`Successfully created: ${outPath}`);
}

convertPdfToPptx(path.join(__dirname, '../public/resources/Ideathon_Presentation_Guide.pdf'))
  .catch(console.error);
