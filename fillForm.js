const { loadAnswersFromCSV, saveAnswersToCSV } = require('./utils/csvUtils');
const { getUnfilledFields, fillField } = require('./utils/fieldUtils');
const { clickNextOrReviewButton, uncheckFollowCompanyCheckbox } = require('./utils/navigationUtils');

async function fillForm(page) {
    const answersFromCSV = await loadAnswersFromCSV();
    const updatedAnswers = { ...answersFromCSV };

    try {
        while (true) {
            const unfilledFields = await getUnfilledFields(page);

            if (unfilledFields.length > 0) {
                for (const field of unfilledFields) {
                    await fillField(page, field, updatedAnswers);

                    const { label, selector } = field;
                    const elementHandle = await page.$(`[id="${selector}"], [name="${selector}"]`);
                    if (elementHandle) {
                        const currentValue = await elementHandle.evaluate(el => el.value.trim());
                        if (currentValue) {
                            updatedAnswers[label] = currentValue;
                            console.log(`Saved updated value for field "${label}": "${currentValue}"`);

                            // Save updated answers after each field is filled
                            await saveAnswersToCSV(updatedAnswers);
                            console.log('Updated answers saved to CSV after filling field.');
                        }
                    }
                }
            }

            await uncheckFollowCompanyCheckbox(page);

            const buttonClicked = await clickNextOrReviewButton(page);
            if (!buttonClicked) {
                console.log('No "Next" or "Review" button found. Form submission may be complete.');
                break;
            }

            await page.waitForTimeout(2000);
        }

        console.log('Form filling completed.');
    } catch (error) {
        console.error('Error occurred during form filling:', error);
    }
}

module.exports = fillForm;