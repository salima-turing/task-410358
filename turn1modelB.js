// Async function

const fs = require('fs');
const readline = require('readline');

async function processFileAsync(filePath) {
    const rl = readline.createInterface({
        input: fs.createReadStream(filePath),
        output: process.stdout,
        terminal: false
    });

    for await (const line of rl) {
        // Process each line here
        await processLine(line);
    }

    rl.close();
}

async function processLine(line) {
    // Your processing logic here
    const data = JSON.parse(line);
    // Do something with the data
}

processFileAsync('./data/data.txt');

// map reduce function
const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Chunk method to process large datasets in batches
function chunk(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

function processData(data) {
    const processedData = data
        .map((item) => item * 2) // Example processing: Double each item
        .reduce((acc, item) => acc + item, 0); // Sum the processed items

    return processedData;
}

const batchSize = 10;
const batchedData = chunk(data, batchSize);
const results = batchedData.map(processData);
console.log('Final result:', results.reduce((acc, result) => acc + result, 0));

// hash maps
const data2 = [
    { id: 1, name: 'apple' },
    { id: 2, name: 'banana' },
    { id: 3, name: 'orange' },
    // Add more entries
];

const idSet = new Set();
const nameMap = new Map();

data2.forEach((item) => {
    idSet.add(item.id);
    nameMap.set(item.name, item);
});

function findById(id) {
    return idSet.has(id) ? nameMap.get(id) : null;
}

function findByName(name) {
    return nameMap.get(name);
}

console.log('Find by ID:', findById(2));
console.log('Find by name:', findByName('banana'));

// algorithms for sorting and searching
const numbers = [64, 34, 25, 12, 22, 11, 90];

numbers.sort((a, b) => a - b);

function binarySearch(array, target) {
    let low = 0;
    let high = array.length - 1;

    while (low <= high) {
        const mid = (low + high) >> 1;
        if (array[mid] === target) {
            return mid;
        } else if (array[mid] < target) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    return -1;
}

const index = binarySearch(numbers, 34);
console.log('Index of 34:', index);
