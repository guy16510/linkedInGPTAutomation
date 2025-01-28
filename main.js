const puppeteer = require("puppeteer");
const path = require("path");
const loginLinkedIn = require("./loginLinkedIn");
const searchEasyApplyJobs = require("./searchEasyApplyJobs");
const processJobApplications = require("./processJobApplications"); // Import the job application processing function

const USER_DATA_PATH = path.resolve(__dirname, "user_data"); // Path to store user data

(async () => {
  // Launch Puppeteer with userDataDir
  const browser = await puppeteer.launch({
    headless: false, // Set to true for headless mode
    devtools: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    defaultViewport: null,
    userDataDir: USER_DATA_PATH, // Specify the user data directory
  });

  const page = await browser.newPage();

  try {
    // Navigate to LinkedIn
    await page.goto("https://www.linkedin.com/jobs");
    await page.waitForTimeout(3000); // Wait for LinkedIn to load

    // Check if logged in
    const isLoggedIn = await page.evaluate(() => {
      return !!document.querySelector(".global-nav__me-photo"); // Adjust if LinkedIn changes the selector
    });

    if (!isLoggedIn) {
      console.log("Not logged in. Logging in now...");
      await loginLinkedIn(page);
      console.log("Logged in successfully.");
    } else {
      console.log("Already logged in. Proceeding to job search...");
    }

    // Step 1: Search for Easy Apply Jobs and get job IDs
    console.log("Navigating to Jobs section...");
    // const jobIds = await searchEasyApplyJobs(page);
    const jobIds = [4103768621]
    
    console.log("Found Job IDs:", jobIds);

    // Step 2: Go through each job ID and apply
    if (jobIds.length > 0) {
      await processJobApplications(page, jobIds);
    } else {
      console.log("No jobs to apply to.");
    }
  } catch (error) {
    console.error("An error occurred:", error.message);
  } finally {
    // Close the browser
    await browser.close();
  }
})();