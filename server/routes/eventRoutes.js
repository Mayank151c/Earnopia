const express = require('express');
const router = express.Router();
const eventService = require('../services/events');

// Fetch all events
router.get('/', async (req, res) => {
  try {
    const events = await eventService.getAll(req.user.username);
    res.status(200).json(events);
  } catch (err) {
    console.error('\nError fetching events:', err);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Insert a event
router.post('/', async (req, res) => {
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
router.delete('/:eventId', async (req, res) => {
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

module.exports = router;