const express = require('express');
const router = express.Router();
const taskService = require('../services/tasks');

// Fetch all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await taskService.getAll(req.user.username);
    res.status(200).json(tasks);
  } catch (err) {
    console.error('\nError fetching tasks:', err);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create a task
router.post('/', async (req, res) => {
  try {
    await taskService.insert({ ...req.body, username: req.user.username });
    res.status(201).json({ message: 'Task created successfully' });
  } catch (err) {
    console.error('\nError creating task:', err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update a task
router.put('/:taskId', async (req, res) => {
    try {
        await taskService.update(req.params.taskId, req.body);
        res.status(200).json({ message: 'Task updated successfully' });
    } catch (err) {
        console.error('\nError updating task:', err);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// Delete a task
router.delete('/:taskId', async (req, res) => {
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

module.exports = router;