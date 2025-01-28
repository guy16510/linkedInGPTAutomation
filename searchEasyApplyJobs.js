const puppeteer = require("puppeteer");
const config = require("./data/config"); // Import config.js
const { autoScroll } = require("./utils/utils"); // Import scrollToBottom from utils

/**
 * Searches LinkedIn for jobs based on title and location.
 * @param {puppeteer.Page} page - Puppeteer page object.
 */
async function searchEasyApplyJobs(page) {
    const { title, location } = config.jobSearch; // Get the job title and location from config

    try {
        // Open the LinkedIn Jobs search page
        await page.goto(`https://www.linkedin.com/jobs/search/?f_AL=true&f_WT=2&keywords=${title}&location=${location}&origin=JOB_SEARCH_PAGE_JOB_FILTER&sortBy=R`);

        // Wait for the job cards to load
        await page.waitForSelector('.scaffold-layout__list-detail-container .job-card-list');

        // Scroll to the bottom to trigger lazy loading of job cards
        await autoScroll(page);
        //TODO scroll doesn't work..

        // Extract job IDs and filter out applied ones
        const jobIds = await page.evaluate(() => {
            const jobCards = document.querySelectorAll('.scaffold-layout__list-detail-container .job-card-list');
            const jobIds = [];

            jobCards.forEach((card) => {
                // Check if the job is already applied
                const appliedStatus = card.querySelector('.job-card-container__footer-job-state');
                if (appliedStatus && appliedStatus.textContent.includes('Applied')) {
                    // Skip jobs that are already applied
                    return;
                }
                const jobId = card.getAttribute('data-job-id');
                if (jobId) {
                    jobIds.push(jobId);
                }
            });
            return jobIds;
        });
        return jobIds;
    } catch (error) {
        console.error('An error occurred:', error.message);
    }
}

module.exports = searchEasyApplyJobs;