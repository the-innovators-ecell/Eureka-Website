import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import canvasModule from 'canvas';
import pptxgen from 'pptxgenjs';

// Setup pdfjs-dist for Node.js
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputFileName = 'Ideathon_Presentation_Guide.pdf';
const inputPath = path.join(__dirname, '..', 'public', 'resources', inputFileName);

async function convertPdfToPptx() {
  console.log(`\nStarting conversion for: ${inputFileName}`);
  
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: Could not find ${inputPath}`);
    console.error('Please make sure the PDF file exists in the public/resources directory.');
    process.exit(1);
  }

  try {
    const data = new Uint8Array(fs.readFileSync(inputPath));
    
    // Disable workers for Node.js environment
    pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/legacy/build/pdf.worker.mjs';
    
    const loadingTask = pdfjsLib.getDocument({
      data,
      disableFontFace: true,
      standardFontDataUrl: path.join(__dirname, '../node_modules/pdfjs-dist/standard_fonts/').replace(/\\/g, '/') + '/'
    });
    
    const pdfDocument = await loadingTask.promise;
    const numPages = pdfDocument.numPages;
    console.log(`Successfully loaded PDF with ${numPages} pages.`);
    
    let pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9'; 
    
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      process.stdout.write(`Rendering page ${pageNum}/${numPages}... `);
      
      const page = await pdfDocument.getPage(pageNum);
      // Scale 2.0 provides a good balance of high fidelity and reasonable file size
      const viewport = page.getViewport({ scale: 2.0 }); 
      
      const canvas = canvasModule.createCanvas(viewport.width, viewport.height);
      const context = canvas.getContext('2d');
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };
      
      await page.render(renderContext).promise;
      
      // Convert to base64 JPEG
      const imgData = canvas.toDataURL('image/jpeg', 0.9);
      
      // Add slide and set background
      let slide = pptx.addSlide();
      slide.background = { data: imgData };
      
      console.log('Done.');
    }
    
    const outFileName = inputFileName.replace('.pdf', '.pptx');
    const outPath = path.join(__dirname, '..', 'public', 'resources', outFileName);
    
    console.log(`\nSaving generated PowerPoint to ${outFileName}...`);
    
    await pptx.writeFile({ fileName: outPath });
    
    console.log(`\n✅ Success! Saved to: ${outPath}`);
  } catch (error) {
    console.error('\n❌ Conversion failed:', error);
    process.exit(1);
  }
}

convertPdfToPptx();
