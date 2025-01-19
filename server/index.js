const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' });
const eventService = require('./services/events');
const taskService = require('./services/tasks');
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`\n${req.method} : ${req.url}\nResponse Time: ${duration}ms`);
    });
    next();
})

// Fetch all events
app.get('/api/events', async (req, res) => {
  try {
    const events = await eventService.getAll();
    res.status(200).json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Insert a event
app.post('/api/events', async (req, res) => {
  try {
    const { desc, points } = req.body;

    await eventService.insert({
      desc,
      points,
      date: new Date(),
    });

    res.status(201).json({ message: 'Event created successfully' });
  } catch (err) {
    console.error('Error creating event:', err);
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
    console.error('Error deleting event:', err);
    res.status(500).json({ success: false, message: 'An error occurred while deleting the event.' });
  }
});

// Fetch all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await taskService.getAll();
    res.status(200).json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Insert a task
app.post('/api/tasks', async (req, res) => {
  try {
    await taskService.insert(req.body);
    res.status(201).json({ message: 'Task created successfully' });
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update a task
app.put('/api/tasks/:taskId', async (req, res) => {
    try {
        await taskService.update(req.params.taskId, req.body);
        res.status(200).json({ message: 'Task updated successfully' });
    } catch (err) {
        console.error('Error updating task:', err);
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
      res.status(404).json({
        success: false,
        message: `No task found with _id: ${taskId}.`,
      });
    }
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ success: false, message: 'An error occurred while deleting the task.' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});