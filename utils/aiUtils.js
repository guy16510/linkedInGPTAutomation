const { OpenAI } = require("openai");
const { readPdf } = require("./pdfUtils");
require('dotenv').config();

// Initialize OpenAI client with your API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure the API key is in your environment variables
});

/**
 * Function to generate AI response using OpenAI API.
 * @param {string} label - The label of the field for context.
 * @returns {Promise<string>} The AI-generated response.
 */
async function generateAIResponse(label, jobTitle, jobSummary, companyName) {
    try {
        // Extract resume details from PDF
        const resumeDetails = await readPdf();

        // Prepare the prompt with strong instructions to avoid placeholders or bracketed text
        const prompt = `You are writing to a job recruiter at the company: ${companyName} based on my resume: ${JSON.stringify(resumeDetails)}. 
        Write a ${label} for this job title: ${jobTitle}, with this job description: ${jobSummary}.
        This shoudl be professional, coherent, and written in the first person, entirely from my perspective. 
        Use generic language if specifics like position title or company name are missing, but avoid using placeholders 
        like "[Insert Position Title]" or "[Company Name]". Instead, structure the response to remain clear and natural 
        without any bracketed or implied content. The response should be roughly 1-2 paragraphs in length.`;

        // Generate the AI response using OpenAI's API
        const completion = await openai.chat.completions.create({
            messages: [
                { role: "system", content: "You are an assistant that generates responses based on user input." },
                { role: "user", content: prompt },
            ],
            model: "gpt-3.5-turbo", // Choose the model you prefer, e.g., gpt-3.5-turbo or gpt-4
            max_tokens: 300, // Adjust as necessary
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Error generating AI response:", error.message);
        throw error;
    }
}

// generateAIResponse('cover letter').then(val => {
//     createPdfFromText(val);
// })
module.exports = { generateAIResponse };