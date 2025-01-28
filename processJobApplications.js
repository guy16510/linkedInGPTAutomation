const puppeteer = require("puppeteer");
const fillForm = require("./fillForm"); // Import the fillForm function
const { jobApplication } = require("./data/config"); // Import the jobApplication data

/**
 * Processes each job ID to fill out and submit the Easy Apply form.
 * @param {puppeteer.Page} page - Puppeteer page object.
 * @param {Array} jobIds - Array of job IDs to apply to.
 */
async function processJobApplications(page, jobIds) {
    for (let jobId of jobIds) {
        try {
            // Step 1: Go to the individual job page
            const jobUrl = `https://www.linkedin.com/jobs/view/${jobId}`;
            await page.goto(jobUrl, { waitUntil: 'networkidle2' });

            // Check if the "Easy Apply" button exists
            const applyButton = await page.$('.jobs-apply-button--top-card .jobs-apply-button', { visible: true, timeout: 3000 });

            if (applyButton) {
                // Step 2: Click the "Apply" button
                await applyButton.click();
                await page.waitForSelector('.jobs-easy-apply-modal form', { visible: true });

                // Step 3: Fill out the form using the fillForm function
                await fillForm(page, jobApplication);

                // Step 4: Submit the form
                console.log(`Successfully applied to job ${jobId}`);

                // Step 5: Wait for a brief moment to ensure the form is submitted before moving to the next
                await page.waitForTimeout(3000); // Adjust as necessary
            } else {
                // If apply button doesn't exist, assume you applied. log already applied
                console.log(`Already applied to job ${jobId}`);
            }

        } catch (error) {
            console.error(`Error applying to job ${jobId}:`, error.message);
        }
    }
}

module.exports = processJobApplications;