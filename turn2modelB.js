const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const processCSV = (filePath) => {
    const results = [];
    let temporaryBuffer = []; // For buffering failed rows

    const processRows = (stream) => {
        stream
            .on('data', (data) => {
                try {
                    if (data.age > 30) {
                        results.push(data);
                    }
                } catch (err) {
                    // Catch processing errors for a specific row
                    console.error('Error processing row:', data, err);
                    // Buffer the failed row for retrying
                    temporaryBuffer.push(data);
                }
            })
            .on('end', () => {
                if (temporaryBuffer.length > 0) {
                    console.log('Some rows failed to process. Retrying...');
                    retryFailedRows();
                } else {
                    console.log('Processing completed without errors');
                    console.log(`Total Records Processed: ${results.length}`);
                }
            })
            .on('error', (err) => {
                console.error('Stream error:', err);
                // Handle stream errors, e.g., you could try reopening the stream
                handleStreamError(err, filePath);
            });
    };

    const handleStreamError = (err, filePath) => {
        // For certain types of errors, you might want to retry or fall back
        if (err.code === 'EPIPE') {
            // Pipe error, possibly due to a downstream process failure
            console.log('Pipe error. Buffering data for retry.');
            temporaryBuffer = fs.createReadStream(filePath).pipe(csv()).read();
        } else {
            // More critical error, log and exit
            console.error('Critical error processing file:', filePath, err);
            process.exit(1);
        }
    };

    const retryFailedRows = () => {
        // Simplistic retry: Process the buffered rows again
        fs.createWriteStream(path.join(__dirname, 'error_log.txt'), { flags: 'a' })
            .write('Retrying failed rows at ' + new Date() + '\n');

        temporaryBuffer.forEach((row) => {
            processCSVInternal(row);
        });
        temporaryBuffer = [];
    };

    const processCSVInternal = (row) => {
        try {
            if (row.age > 30) {
                results.push(row);
            }
        } catch (err) {
            fs.createWriteStream(path.join(__dirname, 'error_log.txt'), { flags: 'a' })
                .write('Failed to process row even after retry: ' + JSON.stringify(row) + '\n');
        }
    };

    const startProcessing = () => {
        console.log('Starting to process the CSV file...');
        const stream = fs.createReadStream(filePath).pipe(csv());
        processRows(stream);
    };

    startProcessing();
};

// Execute the function with your CSV file path
processCSV('large_data.csv');
