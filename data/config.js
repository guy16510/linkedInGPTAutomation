const path = require('path');
require('dotenv').config();

module.exports = {
  linkedin: {
      email: process.env.EMAIL,
      password: process.env.PASSWORD,
  },
  jobSearch: {
      title: "Senior Engineer", // Job title
      location: "San Francisco",  // Location
  },
  jobApplication: {
      "first name": "John",            // First name of the applicant
      "last name": "Public",               // Last name of the applicant
      "email": "johnQPublic@example.com",// Email address
      "mobile phone number": "8684884561",    // Phone number
      "current company": "A Company", // Current company the user is working at
      "job title": "Software Engineer", // Current job title
      "citycity": "Jupiter, Florida",             // City where the user is based
      "country": "United States",      // Country
      "education": "BSc in Computer Science, University of XYZ", // Education information
      "skills": "JavaScript, Node.js, React, Web Development, Team Leadership", // Skills
      "linkedin profile": "https://www.linkedin.com/in/johnQPublic", // LinkedIn profile URL
      "portfolio": "https://johnQ.made.up.site.dev", // Portfolio URL (optional)
      "disability status": "No, I do not have a disability and have not had one in the past", // Disability status
      "ethnicity": "White",
      "gender": "Male",
      "location preference": "Remote"
  },
  questionAnswers: path.resolve(__dirname, '..', 'data', 'question_answers.csv'),
  resumeLocation: path.resolve(__dirname, '..', 'data', 'resume.pdf'),
};