const { generateAIResponse } = require('./aiUtils');
const { createPdfFromText } = require('./pdfUtils');
const { jobApplication } = require('../data/config'); // Import jobApplication from config.js


/**
 * Extracts unfilled fields from the form.
 * @param {puppeteer.Page} page - Puppeteer page object.
 * @param {Object} jobApplication - The job application object containing any additional field info (e.g., ethnicity).
 * @returns {Promise<Array>} A promise that resolves to an array of unfilled fields.
 */
/**
 * Extracts unfilled fields from the form.
 * @param {puppeteer.Page} page - Puppeteer page object.
 * @returns {Promise<Array>} A promise that resolves to an array of unfilled fields.
 */
async function getUnfilledFields(page) {
    return page.evaluate((jobApplication) => {
        const fields = [];
        const inputs = document.querySelectorAll('.jobs-easy-apply-modal form input, .jobs-easy-apply-modal form textarea, .jobs-easy-apply-modal form select');
        
        inputs.forEach((input) => {
            if (input.tagName === 'SELECT') {
                const selectedOption = input.options[input.selectedIndex];
                if (selectedOption && selectedOption.value === "Select an option") {
                    const label = input.closest('label') || document.querySelector(`label[for="${input.id}"]`);
                    if (label) {
                        fields.push({
                            label: label.textContent.trim().toLowerCase(),
                            selector: input.getAttribute('id') || input.getAttribute('name'),
                        });
                    } else {
                        const isRaceEthnicityField = Array.from(input.options).some(option =>
                            option.value.toLowerCase().includes(jobApplication.ethnicity?.toLowerCase())
                        );
                        if (isRaceEthnicityField) {
                            fields.push({
                                label: 'ethnicity',
                                selector: input.getAttribute('id') || input.getAttribute('name'),
                            });
                        } else {
                            console.error('There is another select field without a label next to it.');
                        }
                    }
                }
            } else if (!input.value) {
                const label = input.closest('label') || document.querySelector(`label[for="${input.id}"]`);
                if (label) {
                    fields.push({
                        label: label.textContent.trim().toLowerCase(),
                        selector: input.getAttribute('id') || input.getAttribute('name'),
                    });
                }
            } 
            // TODO fix fieldset support..
            // else if (input.tagName === 'FIELDSET') {
            //     const isRequired = input.querySelector('[data-test-checkbox-form-required]') !== null;
            //     debugger;
            //     if (isRequired) {
            //       const checkboxes = input.querySelectorAll('input[type="checkbox"]');
            //       const isAnyChecked = Array.from(checkboxes).some((checkbox) => checkbox.checked);
            //       if (!isAnyChecked) {
            //         fields.push({
            //           id: input.id,
            //           label: input.querySelector('legend span.visually-hidden')?.textContent.trim() || 'Unknown Fieldset',
            //         });
            //       }
            //     }
            //   } 
        });

        return fields;
    }, jobApplication); // Pass `jobApplication` to the browser context
}

/**
 * Fill a field with either AI-generated text or values from config.js or CSV.
 * @param {puppeteer.Page} page - Puppeteer page object.
 * @param {Object} field - The field object containing label and selector.
 * @param {Object} answersFromCSV - The answers loaded from the CSV.
 */
async function fillField(page, field, answersFromCSV) {
    const { label, selector } = field;

    if (label.includes('resume')) {
        console.log(`Skipping field: "${label}" (resume field)`);
        return;
    }

    const elementHandle = await page.$(`[id="${selector}"], [name="${selector}"]`);
    if (!elementHandle) {
        console.error(`Could not find element for selector: "${selector}"`);
        return;
    }

    // Check if the element is a <select> dropdown by its tag name
    const tagName = await page.evaluate(element => element.tagName, elementHandle);
    if (tagName === 'SELECT') {
        console.log(`Filling select dropdown for field "${label}"`);

        // Get the value from the job application or CSV
        const value = jobApplication[label] || answersFromCSV[label];

        if (value) {
            // Use Puppeteer's select method to select the option
            await page.select(`#${selector}`, value);  // Assumes the option values match the field value
            console.log(`Selected "${value}" in dropdown field "${label}"`);
        } else {
            console.log(`No value found for dropdown field "${label}"`);
        }

        return;
    }

    // Handle typeahead dropdowns (city/location)
    if (label.includes('city') || label.includes('location')) {
        console.log(`Filling typeahead dropdown for field "${label}"`);
        const value = jobApplication[label] || answersFromCSV[label];
        // Type the value into the input field
        await elementHandle.click({ clickCount: 3 }); // Select all text
        await page.keyboard.type(value, { delay: 500 });

        // Wait for the dropdown options to appear
        await page.waitForSelector('.basic-typeahead__triggered-content', { timeout: 5000 }); // Replace with the actual dropdown class
        await page.keyboard.press('ArrowDown', { delay: 500 });
        await page.keyboard.press('Enter');
        return;
    }

    // Handle cover letter/summary fields (special handling)
    if (label.includes('summary') || label.includes('cover letter')) {
        const jobTitle = await page.$eval('h1', (element) => element.textContent.trim());
        const jobSummary = await page.$eval('.jobs-box__html-content', (element) => element.textContent.trim());
        const companyName = await page.$eval('.job-details-jobs-unified-top-card__company-name', (element) => element.textContent.trim());

        const prompt = label.includes('summary') ? 'summary' : 'cover letter';
        const aiResponse = await generateAIResponse(prompt, jobTitle, jobSummary, companyName);

        if (label.includes('cover letter')) {
            const pdfPath = await createPdfFromText(aiResponse, companyName);
            const fileInput = await page.$(`[id="${selector}"], [name="${selector}"]`);
            if (fileInput) {
                await fileInput.uploadFile(pdfPath);
                console.log(`Uploaded PDF to field "${label}"`);
            }
            return;
        } else {
            // For job summary, you can decide how to handle it
            await page.type(`[id="${selector}"], [name="${selector}"]`, aiResponse, { delay: 100 });
            console.log(`Filled field "${label}" with AI-generated content`);
            debugger;
            return;
        }
    }

    // Normalize label to lowercase to match jobApplication keys
    const normalizedLabel = label.toLowerCase();

    // Use value from jobApplication or CSV
    const value = jobApplication[normalizedLabel] || answersFromCSV[normalizedLabel];
    if (value) {
        // Type value using page.type instead of directly setting el.value
        await elementHandle.click({ clickCount: 3 }); // Select all text in the input field
        await page.type(`[id="${selector}"], [name="${selector}"]`, value, { delay: 100 }); // Adds typing delay to simulate human input
        console.log(`Filled field "${label}" with value: "${value}"`);
    } else {
        console.log(`No value found for field: "${label}"`);
    }
}

module.exports = { getUnfilledFields, fillField };