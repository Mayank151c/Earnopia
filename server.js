// Config environment variables
require('dotenv').config({ path: '.env' });

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const eventService = require('./server/services/events');
const taskService = require('./server/services/tasks');
const authService = require('./server/services/auth');
const app = express();
const port = 3001;

app.use(cors({ credentials: true }));
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
app.get('/api/auth', async (req, res) => {
  try {
    res.status(200).json({ isAuthenticated: true });
  } catch (err) {
    console.error('\nError checking authentication:', err);
    res.status(404).json({ error: err.message, isAuthenticated: false });
  }
});

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

// Fetch all events
app.get('/api/events', async (req, res) => {
  try {
    const events = await eventService.getAll(req.user.username);
    res.status(200).json(events);
  } catch (err) {
    console.error('\nError fetching events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Insert a event
app.post('/api/events', async (req, res) => {
  try {
    const { desc, points } = req.body;
    const { username } = req.user;

    await eventService.insert({
      desc,
      points,
      username,
      date: new Date(),
    });

    res.status(201).json({ message: 'Event created successfully' });
  } catch (err) {
    console.error('\nError creating event:', err);
    res.status(500).json({ error: 'Failed to create event' });
  }
});

// Delete a event
app.delete('/api/events/:eventId', async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const result = await eventService.remove(eventId);

    if (result.success) {
      res.status(200).json({
        success: true,
        message: `Event with _id: ${eventId} deleted successfully.`,
      });
    } else {
      res.status(404).json({
        success: false,
        message: `No event found with _id: ${eventId}.`,
      });
    }
  } catch (err) {
    console.error('\nError deleting event:', err);
    res.status(500).json({ success: false, message: 'An error occurred while deleting the event.' });
  }
});

// Fetch all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await taskService.getAll(req.user.username);
    res.status(200).json(tasks);
  } catch (err) {
    console.error('\nError fetching tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create a task
app.post('/api/tasks', async (req, res) => {
  try {
    await taskService.insert({ ...req.body, username: req.user.username });
    res.status(201).json({ message: 'Task created successfully' });
  } catch (err) {
    console.error('\nError creating task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update a task
app.put('/api/tasks/:taskId', async (req, res) => {
    try {
        await taskService.update(req.params.taskId, req.body);
        res.status(200).json({ message: 'Task updated successfully' });
    } catch (err) {
        console.error('\nError updating task:', err);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Delete a task
app.delete('/api/tasks/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const result = await taskService.remove(taskId); // Using service function

    if (result.success) {
      res.status(200).json({
        success: true,
        message: `Task with _id: ${taskId} deleted successfully.`,
      });
    } else {
      console.log(`\n${result.message}`);
      res.status(404).json({
        success: false,
        message: `No task found with _id: ${taskId}.`,
      });
    }
  } catch (err) {
    console.error('\nError deleting task:', err);
    res.status(500).json({ success: false, message: 'An error occurred while deleting the task.' });
  }
});

// Start the server
app.listen(port, () => {
  console.clear();
  console.log(`Server is running on port ${port}`);
});