 # LinkedIn GPT Automation

 This project automates the process of applying to jobs on LinkedIn using GPT-based interactions. It streamlines job searches and applications by leveraging automation scripts.

 ## Table of Contents

 - [Features](#features)
 - [Prerequisites](#prerequisites)
 - [Installation](#installation)
 - [Configuration](#configuration)
 - [Usage](#usage)
 - [Application Flow](#application-flow)
 - [Contributing](#contributing)
 - [License](#license)

 ## Features

 - Automated login to LinkedIn.
 - Search for jobs with the "Easy Apply" feature.
 - Automatically fill out and submit job applications.

 ## Prerequisites

 - [Node.js](https://nodejs.org/) (version 14 or higher)
 - [npm](https://www.npmjs.com/)

 ## Installation

 1. **Clone the Repository:**

   ```bash
   git clone https://github.com/guy16510/linkedInGPTAutomation.git
   cd linkedInGPTAutomation
   ```

 2. **Install Dependencies:**

   ```bash
   npm install
   ```

 ## Configuration

 1. **Environment Variables:**

   - Duplicate the `.env.copy` file and rename the copy to `.env`.
   - Open the `.env` file and fill in your LinkedIn credentials and other necessary configurations.

     ```
     OPENAI_API_KEY=somekey
     EMAIL=your-email@example.com
     PASSWORD=yourpassword
     ```

 2. **Data Files:**

   - Ensure that your resume and other necessary documents are placed in the `data` directory.

 ## Usage

 To start the automation process, run:

 ```bash
 node main.js
 ```

 The script will log in to LinkedIn, search for jobs with the "Easy Apply" feature, and attempt to apply using the provided information.

 ## Application Flow

 ```mermaid
graph TD
    A[Start] --> B[Login to LinkedIn]
    B --> C[Search for Easy Apply Jobs]
    C --> D[Process Job Applications]
    D --> E[Fill Application Form]
    E --> F[Submit Application]
    F --> G[Log Results]
    G --> H[End]
 ```

 ## Contributing

 Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

 ## License

 This project is licensed under the Apache-2.0 License. See the [LICENSE](LICENSE) file for details.