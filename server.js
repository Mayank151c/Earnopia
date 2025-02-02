// Config environment variables
require('dotenv').config({ path: '.env' });

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authService = require('./server/services/auth');
const app = express();
const port = 3001;

app.use(cors({ credentials: true, origin: process.env.ORIGIN }));
app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`\n${req.method} : ${req.url}\nResponse Time: ${duration}ms`);
    });
    next();
})

/*********************
 * Unprotected routes
 *********************/ 
app.post('/api/signup', async (req, res) => {
  try {
    const result = await authService.signUp(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const result = await authService.signIn(req.body);
    res.cookie('token', result.token, { httpOnly: true, secure: false, maxAge: 3600000 });
    res.status(200).json(result.message);
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
});

/************************************
 * Middleware for token verification
 ************************************/
app.use(async (req, res, next) => {
  // get cookies
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const user = await authService.validateToken(token);
    req.user = user;
    next();
  } catch (err) {
    console.error('\nError verifying token:', err);
    res.status(401).json({ error: 'Unauthorized' });
  }
});

/*******************
 * Protected routes
 *******************/
// Check user authenticity
app.get('/api/auth', async (req, res) => res.status(200).json({ isAuthenticated: true }));

// Get user profile
app.get('/api/profile', async (req, res) => {
  try {
    const userData = await authService.getUser(req.user.id);
    res.status(200).json(userData);
  } catch (err) {
    console.error('\nError checking authentication:', err);
    res.status(404).json({ error: err.message, isAuthenticated: false });
  }
});

// Update user profile
app.put('/api/profile', async (req, res) => {
  try {
    const userData = await authService.updateUser(req.user.id, req.body);
    res.status(200).json(userData);
  } catch (err) {
    console.error('\nError checking authentication:', err);
    res.status(404).json({ error: err.message, isAuthenticated: false });
  }
});

app.use('/api/tasks', require('./server/routes/taskRouter'));
app.use('/api/events', require('./server/routes/eventRoutes'));

// Start the server
app.listen(port, () => {
  console.clear();
  console.log(`Server is running on port ${port}`);
});