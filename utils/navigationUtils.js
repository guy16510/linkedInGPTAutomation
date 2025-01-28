/**
 * Clicks the "Next" or "Review" button if available.
 * @param {puppeteer.Page} page - Puppeteer page object.
 * @returns {Promise<boolean>} True if the button was clicked, false otherwise.
 */
async function clickNextOrReviewButton(page) {
    const buttonClicked = await page.evaluate(() => {
        const nextButton = document.querySelector('button[aria-label="Continue to next step"]') ||
            document.querySelector('.artdeco-button--primary');

        const reviewButton = document.querySelector('button[aria-label="Review your application"]');
        if (nextButton) {
            nextButton.click();
            return true;
        }

        if (reviewButton) {
            reviewButton.click();
            return true;
        }

        return false;
    });

    return buttonClicked;
}

/**
 * Unchecks the "Follow Company" checkbox if it is checked.
 * @param {puppeteer.Page} page - Puppeteer page object.
 */
async function uncheckFollowCompanyCheckbox(page) {
    const checkboxHandle = await page.$('#follow-company-checkbox');
    if (checkboxHandle) {
        debugger;
        const isChecked = await checkboxHandle.evaluate(el => el.checked);
        if (isChecked) {
            await checkboxHandle.evaluate(el => (el.checked = false));
            console.log('Unchecked "Follow Company" checkbox.');
        }
    }
}

module.exports = { clickNextOrReviewButton, uncheckFollowCompanyCheckbox };