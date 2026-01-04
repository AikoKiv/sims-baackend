require('dotenv').config(); // ✅ REQUIRED

const express = require('express');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());

const DATA_FILE = 'students.json';

/* =========================
   SAFE DATA LOADER
   ========================= */
function loadStudents() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }
    return JSON.parse(fs.readFileSync(DATA_FILE));
  } catch (err) {
    console.error('Error loading students.json:', err);
    return [];
  }
}

/* =========================
   STUDENT ROUTES
   ========================= */

// GET all students
app.get('/students', (req, res) => {
  const data = loadStudents();
  res.json(data.slice(0, 50));
});

// POST add student
app.post('/students', (req, res) => {
  const students = loadStudents();
  students.push(req.body);
  fs.writeFileSync(DATA_FILE, JSON.stringify(students, null, 2));
  res.json({ message: 'Student added
