import fs from 'fs';
import path from 'path';

// Function to save a JSON object to a file under the battles/ directory
export const saveJsonToFile = (fileName: string, data: object): void => {
    try {
        const dirPath = path.join(__dirname, `battles/`);
        const filePath = path.join(dirPath, `${fileName}.json`);

        // Ensure the battles directory exists
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        // Write the JSON data to the file
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`Data saved successfully to ${filePath}`);
    } catch (error) {
        console.error('Error saving data:', error);
    }
};

// Function to read a JSON object from a file under the battles/ directory
export const readJsonFromFile = (fileName: string): object | null => {
    try {
        const filePath = path.join(__dirname, 'battles', `${fileName}.json`);

        if (!fs.existsSync(filePath)) {
            console.log(`File ${filePath} does not exist. Returning null.`);
            return null;
        }

        const fileContent = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error) {
        console.error('Error reading data:', error);
        return null;
    }
};

// Example usage
const exampleData = {
    id: 1,
    name: 'Example Dungeon',
    difficulty: 5,
    creatures: [
        { name: 'Goblin', strength: 5, health: 20 },
        { name: 'Orc', strength: 10, health: 40 },
    ],
};