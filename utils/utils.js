/**
 * Scrolls within the specified container to trigger lazy loading of job cards.
 * @param {puppeteer.Page} page - Puppeteer page object.
 */
async function autoScroll(page) {
  await page.evaluate(async () => {
      await new Promise((resolve) => {
          let totalHeight = 0;
          const distance = 100;
          const timer = setInterval(() => {
              const scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;
              if (totalHeight >= scrollHeight) {
                  clearInterval(timer);
                  resolve();
              }
          }, 100);
      });
  });
}

module.exports = {
  autoScroll,
};