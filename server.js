const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON bodies
app.use(express.json());

// Handle POST requests to /ask
app.post('/ask', (req, res) => {
    const userInput = req.body.userInput;

    if (userInput) {
        // Execute the Python script with user input
        exec(`python3 ama.py "${userInput}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return res.status(500).json({ answer: "Sorry, I encountered an error processing your request." });
            }
            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return res.status(500).json({ answer: "Sorry, there was an error with the request." });
            }

            try {
                const output = JSON.parse(stdout);
                res.json(output);
            } catch (parseError) {
                console.error(`JSON parse error: ${parseError}`);
                res.status(500).json({ answer: "Sorry, I couldn't understand the response from the server." });
            }
        });
    } else {
        res.status(400).json({ answer: "No input provided." });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
