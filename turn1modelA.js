const fs = require('fs');
const csv = require('csv-parser');

const processCSV = (filePath) => {
    const results = [];

    const startProcessing = () => {
        console.log('Starting to process the CSV file...');

        // Using a readable stream to process the CSV file line by line
        fs.createReadStream(filePath)
            .pipe(csv()) // Stream data through the csv parser
            .on('data', (data) => {
                // Perform your transformation or processing here
                // (Example: Aggregate or filter)
                if (data.age > 30) { // Example filtering condition
                    results.push(data);
                }
            })
            .on('end', () => {
                console.log('Processing completed');
                console.log(`Total Records Processed: ${results.length}`);
                // Handle results, e.g., save to a database or file
            })
            .on('error', (err) => {
                console.error('Error reading the file:', err);
            });
    };

    startProcessing();
};

// Execute the function with your CSV file path
processCSV('./large_data.csv'); // Replace with the actual CSV file path
