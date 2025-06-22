const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const cors = require('cors');
const axios = require('axios');

dotenv.config();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.FIREBASE_API_KEY}`,
      { email, password, returnSecureToken: true }
    );
    res.status(201).json({ message: 'Registration successful', userId: response.data.localId });
  } catch (error) {
    const firebaseError = error.response?.data?.error?.message;
    console.error('Registration error:', firebaseError);
    res.status(400).json({ error: firebaseError || 'Registration failed' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
      { email, password, returnSecureToken: true }
    );
    res.status(200).json({ message: 'Login successful', idToken: response.data.idToken });
  } catch (error) {
    const firebaseError = error.response?.data?.error?.message;
    console.error('Login error:', firebaseError);
    res.status(401).json({ error: firebaseError || 'An unexpected login error occurred.' });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'welcome.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/categories', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'categories.html'));
});

app.get('/characters', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'characters.html'));
});

app.get('/details', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'details.html'));
});

app.get('/issues', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'issues.html'));
});

app.get('/movies', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'movies.html'));
});

app.get('/objects', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'objects.html'));
});

app.get('/people', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'people.html'));
});

app.get('/publishers', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'publishers.html'));
});

app.get('/search', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'search.html'));
});

app.get('/series', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'series.html'));
});

app.get('/teams', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'teams.html'));
});

app.get('/volumes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'volumes.html'));
});


app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});