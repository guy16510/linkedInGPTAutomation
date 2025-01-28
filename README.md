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
 - [Disclaimer](#disclaimer)
 - [Terms-and-Conditions](#terms-and-conditions)

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


 ## Disclaimer
This program is for educational purposes only. By downloading, using, copying, replicating, or interacting with this program or its code, you acknowledge and agree to abide by all the Terms, Conditions, Policies, and Licenses mentioned, which are subject to modification without prior notice. The responsibility of staying informed of any changes or updates bears upon yourself. For the latest Terms & Conditions, Licenses, or Policies, please refer to Linkedin GPT Automation. Additionally, kindly adhere to and comply with LinkedIn's terms of service and policies pertaining to web scraping. Usage is at your own risk. The creators and contributors of this program emphasize that they bear no responsibility or liability for any misuse, damages, or legal consequences resulting from its usage.

## Terms-and-Conditions
Please consider the following:

LinkedIn Policies: LinkedIn has specific policies regarding web scraping and data collection. The responsibility to review and comply with these policies before engaging, interacting, or undertaking any actions with this program bears upon yourself. Be aware of the limitations and restrictions imposed by LinkedIn to avoid any potential violation(s).

No Warranties or Guarantees: This program is provided as-is, without any warranties or guarantees of any kind. The accuracy, reliability, and effectiveness of the program cannot be guaranteed. Use it at your own risk.

Disclaimer of Liability: The creators and contributors of this program shall not be held responsible or liable for any damages or consequences arising from the direct or indirect use, interaction, or actions performed with this program. This includes but is not limited to any legal issues, loss of data, or other damages incurred.

Use at Your Own Risk: It is important to exercise caution and ensure that your usage, interactions, and actions with this program comply with the applicable laws and regulations. Understand the potential risks and consequences associated with web scraping and data collection activities.