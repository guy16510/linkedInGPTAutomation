const fs = require('fs');
const path = require('path');
const { PDFDocument, StandardFonts } = require('pdf-lib'); // Use StandardFonts for Helvetica
const { resumeLocation, jobApplication } = require('../data/config'); // Assuming resumeLocation is from config.js

/**
 * Reads the text content from a PDF file.
 * @returns {Promise<string>} A promise that resolves to the text content of the PDF.
 */
async function readPdf() {
    try {
        const dataBuffer = fs.readFileSync(resumeLocation);
        const data = await require('pdf-parse')(dataBuffer);
        return data.text;
    } catch (err) {
        console.error('Error reading PDF file:', err);
        throw err;
    }
}

/**
 * Create a temporary PDF from the provided text.
 * @param {string} text - The text to convert into a PDF.
 * @returns {Promise<string>} - Path to the saved PDF file.
 */
async function createPdfFromText(text, companyName) {
    try {
        const pdfDoc = await PDFDocument.create();
        let page = pdfDoc.addPage([600, 800]); // Create the first page
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica); // Use StandardFonts for Helvetica
        const fontSize = 12;

        const margin = 40; // Set a margin for the text
        const lineHeight = fontSize * 1.1; // Reduced line height multiplier (smaller spacing)
        const pageWidth = page.getWidth() - margin * 2;
        const pageHeight = page.getHeight() - margin;

        // Split text into lines based on '\n' and ensure spaces are preserved
        const paragraphs = text.split('\n');

        let y = pageHeight; // Start at the top of the page

        for (const paragraph of paragraphs) {
            const words = paragraph.split(' ');
            let currentLine = '';

            for (const word of words) {
                const testLine = currentLine ? `${currentLine} ${word}` : word;
                const textWidth = font.widthOfTextAtSize(testLine, fontSize);

                if (textWidth > pageWidth) {
                    // Draw the current line on the PDF
                    page.drawText(currentLine, {
                        x: margin,
                        y: y,
                        size: fontSize,
                        font,
                    });
                    y -= lineHeight;

                    // Start a new line
                    currentLine = word;

                    // If we run out of space on the page, add a new page
                    if (y - lineHeight < margin) {
                        page = pdfDoc.addPage([600, 800]);
                        y = page.getHeight() - margin;
                    }
                } else {
                    currentLine = testLine;
                }
            }

            // Draw the last line of the paragraph
            if (currentLine) {
                page.drawText(currentLine, {
                    x: margin,
                    y: y,
                    size: fontSize,
                    font,
                });
                y -= lineHeight;
            }

            // Add extra spacing between paragraphs (reduced spacing)
            y -= lineHeight * 0.5; // Reduced paragraph spacing

            if (y - lineHeight < margin) {
                page = pdfDoc.addPage([600, 800]);
                y = page.getHeight() - margin;
            }
        }

        // Save the PDF to a file
        const pdfBytes = await pdfDoc.save();
        // Path to save temporary PDFs
        const tempPdfPath = path.resolve(__dirname, '..', 'temp', `${jobApplication['first name']}-${jobApplication['last name']}-CoverLetter-${companyName}.pdf`);
        await fs.promises.mkdir(path.dirname(tempPdfPath), { recursive: true }); // Ensure the directory exists
        await fs.promises.writeFile(tempPdfPath, pdfBytes);

        console.log(`PDF saved to: ${tempPdfPath}`);
        return tempPdfPath;
    } catch (error) {
        console.error('Error creating PDF:', error);
        throw error;
    }
}

// Export the functions
module.exports = { readPdf, createPdfFromText };