const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();


app.use(cors());
app.use(express.json());


const DATA_FILE = 'students.json';


// GET all students
app.get('/students', (req, res) => {
const data = JSON.parse(fs.readFileSync(DATA_FILE));
res.json(data.slice(0, 50));
});


// POST add student
app.post('/students', (req, res) => {
const students = JSON.parse(fs.readFileSync(DATA_FILE));
students.push(req.body);
fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));
res.json({ message: 'Student added successfully' });
});


// DELETE student
app.delete('/students/:id', (req, res) => {
let students = JSON.parse(fs.readFileSync(DATA_FILE));
students = students.filter(s => s.studentId !== req.params.id);
fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));
res.json({ message: 'Student deleted' });
});

/* =========================
   LLM DATA ANALYSIS FEATURE
   ========================= */

const axios = require('axios');

app.post('/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;

    // Load REAL student data
    const students = JSON.parse(fs.readFileSync(DATA_FILE));

    if (!students.length) {
      return res.json({ reply: 'No student records available.' });
    }

    // Build prompt for LLM
    const prompt = `
You are an assistant for a Student Information Management System.

Student Data (JSON):
${JSON.stringify(students, null, 2)}

User Question:
${userMessage}

Rules:
- Answer ONLY using the student data
- Do not invent information
- If the question cannot be answered, say so clearly
- Keep answers concise
`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json({
      reply: response.data.choices[0].message.content
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      reply: 'LLM service is currently unavailable.'
    });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
