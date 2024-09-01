const data = [{name:"Faith And Spiritual Growth",url:"/F&S.html"},
                {name:"Praise And Worship",url:"/P&W.html"},
                {name:"Healing and Restoration",url:"/H&R.html"}];

import { OpenAI } from "openai"
import cors from 'cors'
import {config} from 'dotenv'
import express from 'express'
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import path from "path";

config();
const app = express()
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies
const port = 5505
app.use(cors())


// Determine the directory name using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the frontend public directory
app.use(express.static(path.join(__dirname, '../frontend/public')));

const ai = new OpenAI({
    apiKey: process.env.API_KEY
});

app.get("/home", async (req, res) => {
    try {
        // Serve the index.html file directly from the public directory
        res.sendFile(path.join(__dirname, '../frontend/public/index.html'));
    } catch (error) {
        console.error('Error reading file:', error);
        res.status(500).send('Error loading page');
    }
});

app.post("/home", async(req,res) => {
    const {userInput} = req.body;
    try {
        // Call the OpenAI API to generate a response based on user input
        const completion = await ai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant. You must read the input and choose which of the themes Faith and Spiritual Growth,Healing and Restoration,Praise and Worship it is closest to. Only state the closest theme no need for introductions or explanations" },
                { role: "user", content: `${userInput}` },
            ],
        });

        const reply = completion.choices[0].message.content;

        console.log({userInput})

        console.log("Received input: ", reply)

        // Find the matching theme
        const match = data.find(item => item.name.toLowerCase() == reply.toLowerCase());

        if (match) {
            console.log(match.url)
            // Send the URL back to the frontend
            res.json({ url: match.url });
        } else {
            res.status(404).send('No matching theme found');
        }

    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        res.status(500).send('Internal Server Error');
    }
})

app.listen(port, 'localhost', () => {
    console.log(`App is running at http://localhost:${port}/home`);
});

