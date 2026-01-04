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


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));