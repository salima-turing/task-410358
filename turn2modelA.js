const fs = require('fs');
const csv = require('csv-parser');

const MAX_RETRIES = 3;

// Retry function with exponential backoff
const retryWithBackoff = async (fn, retries = MAX_RETRIES) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            const waitTime = Math.pow(2, i) * 100; // Exponential backoff
            console.error(`Attempt ${i + 1} failed. Retrying in ${waitTime} ms...`);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
    }
    throw new Error('Max retries reached');
};

const processRecord = async (data) => {
    // Simulate processing and possible failure
    if (Math.random() < 0.2) { // Simulating a 20% failure rate
        throw new Error("Processing error");
    }
    console.log('Processed data:', data);
    // More processing logic here
};

const processCSV = (filePath) => {
    const results = [];

    const startProcessing = async () => {
        console.log('Starting to process the CSV file...');

        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', async (data) => {
                try {
                    // Retry processing the record
                    await retryWithBackoff(() => processRecord(data));
                    results.push(data); // If success, add to results
                } catch (error) {
                    console.error('Failed to process record:', error.message);
                    // Optionally add to a DLQ or log for future processing
                }
            })
            .on('end', () => {
                console.log('Processing completed');
                console.log(`Total Records Processed: ${results.length}`);
            })
            .on('error', (err) => {
                console.error('Error reading the file:', err);
            });
    };

    startProcessing();
};

processCSV('./large_data.csv'); // Replace with the actual CSV file path
