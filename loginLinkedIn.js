const puppeteer = require("puppeteer");
const config = require("./data/config"); // Import config.js

/**
 * Logs in to LinkedIn, handling CAPTCHA if it appears.
 * @param {puppeteer.Page} page - Puppeteer page object.
 * @throws Will throw an error if CAPTCHA isn't solved within 60 seconds.
 */
async function loginLinkedIn(page) {
  const { email, password } = config.linkedin; // Retrieve credentials from config.js

  try {
    // Navigate to LinkedIn login page
    await page.goto("https://www.linkedin.com/login", {
      waitUntil: "networkidle2",
      timeout: 60000,
    });
    console.log("Navigated to LinkedIn login page");

    // Enter email
    await page.waitForSelector("#username", { visible: true });
    await page.type("#username", email, { delay: 50 });
    console.log("Entered email");

    // Enter password
    await page.waitForSelector("#password", { visible: true });
    await page.type("#password", password, { delay: 50 });
    console.log("Entered password");

    // Click login
    await page.waitForSelector('button[type="submit"]', { visible: true });
    await page.click('button[type="submit"]');
    console.log("Clicked login button");

    // Check for CAPTCHA presence and wait for resolution
    let captchaResolved = false;
    let attempts = 0;

    while (!captchaResolved && attempts < 12) { // 12 attempts = 60 seconds (5 seconds interval)
      const captcha = await page.$('#captcha-internal');

      if (captcha) {
        console.log(`CAPTCHA detected. Waiting for you to solve it... (Attempt ${attempts + 1}/12)`);
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds
        attempts++;
      } else {
        console.log("CAPTCHA resolved! Moving forward...");
        captchaResolved = true;;
      }
    }

    if (!captchaResolved) {
      throw new Error("CAPTCHA was not solved within 60 seconds. Exiting...");
    }

    console.log("Login successful!");
  } catch (error) {
    throw new Error(`Login error: ${error.message}`);
  }
}

module.exports = loginLinkedIn;