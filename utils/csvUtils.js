const fs = require('fs');
const csv = require('csv-parser');
const { stringify } = require('csv-stringify/sync'); // For writing CSV data
const { questionAnswers } = require('../data/config'); // Import file path from config.js

/**
 * Loads question-answer pairs from a CSV file.
 * @returns {Promise<Object>} A promise that resolves to an object with question-answer mappings.
 */
async function loadAnswersFromCSV() {
    const answers = {};
    try {
        return new Promise((resolve, reject) => {
            const stream = fs.createReadStream(questionAnswers);
            stream
                .pipe(csv())
                .on('data', (row) => {
                    if (row.question && row.answer) {
                        answers[row.question.trim().toLowerCase()] = row.answer.trim();
                    }
                })
                .on('end', () => resolve(answers))
                .on('error', (err) => reject(new Error(`Error reading CSV file: ${err.message}`)));
        });
    } catch (err) {
        console.error(err);
        throw new Error('Failed to load answers from CSV.');
    }
}

/**
 * Saves answers to a CSV file.
 * @param {Object} answers - The answers object to save.
 */
async function saveAnswersToCSV(answers) {
    const rows = Object.entries(answers).map(([question, answer]) => ({
        question,
        answer
    }));
    const csvContent = stringify(rows, { header: true, columns: ['question', 'answer'] });

    try {
        await fs.promises.writeFile(questionAnswers, csvContent);
        console.log('Answers successfully saved to CSV.');
    } catch (err) {
        console.error('Error saving answers to CSV:', err.message);
        throw new Error('Failed to save answers to CSV.');
    }
}

module.exports = { loadAnswersFromCSV, saveAnswersToCSV };