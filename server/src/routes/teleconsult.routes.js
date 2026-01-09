const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { body, validationResult, param } = require('express-validator');

// ============================================
// TELESESSION (Telemedicine) ROUTES
// ============================================

// POST /api/teleconsult/sessions - Create a new telemedicine session
router.post('/sessions', [
  body('appointmentId').isUUID(),
  body('patientId').isUUID(),
  body('doctorId').isUUID(),
  body('mode').isIn(['VIDEO', 'VOICE', 'CHAT', 'IN_PERSON']),
  body('scheduledAt').isISO8601()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { appointmentId, patientId, doctorId, mode, scheduledAt } = req.body;

    // Check if session already exists for this appointment
    const existing = await prisma.teleSession.findUnique({
      where: { appointmentId }
    });

    if (existing) {
      return res.status(400).json({ error: 'Session already exists for this appointment' });
    }

    // Generate a room ID for video/voice calls
    const roomId = mode === 'VIDEO' || mode === 'VOICE' 
      ? `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      : null;

    const session = await prisma.teleSession.create({
      data: {
        appointmentId,
        patientId,
        doctorId,
        mode,
        scheduledAt: new Date(scheduledAt),
        roomId,
        chatHistory: []
      }
    });

    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
});

// GET /api/teleconsult/sessions/:id - Get session details
router.get('/sessions/:id', [
  param('id').isUUID()
], async (req, res, next) => {
  try {
    const { id } = req.params;

    const session = await prisma.teleSession.findUnique({
      where: { id }
    });

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    next(error);
  }
});

// PUT /api/teleconsult/sessions/:id/start - Start a session
router.put('/sessions/:id/start', [
  param('id').isUUID()
], async (req, res, next) => {
  try {
    const { id } = req.params;

    const session = await prisma.teleSession.update({
      where: { id },
      data: {
        status: 'IN_PROGRESS',
        startedAt: new Date()
      }
    });

    res.json(session);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Session not found' });
    }
    next(error);
  }
});

// PUT /api/teleconsult/sessions/:id/end - End a session
router.put('/sessions/:id/end', [
  param('id').isUUID(),
  body('notes').optional().trim()
], async (req, res, next) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const currentSession = await prisma.teleSession.findUnique({ where: { id } });
    if (!currentSession) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const endedAt = new Date();
    const duration = currentSession.startedAt 
      ? Math.round((endedAt - new Date(currentSession.startedAt)) / 60000)
      : 0;

    const session = await prisma.teleSession.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        endedAt,
        duration,
        notes
      }
    });

    res.json(session);
  } catch (error) {
    next(error);
  }
});

// POST /api/teleconsult/sessions/:id/chat - Add chat message
router.post('/sessions/:id/chat', [
  param('id').isUUID(),
  body('senderId').isUUID(),
  body('senderType').isIn(['patient', 'doctor']),
  body('message').trim().notEmpty()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { senderId, senderType, message } = req.body;

    const session = await prisma.teleSession.findUnique({ where: { id } });
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    const chatMessage = {
      id: `msg_${Date.now()}`,
      senderId,
      senderType,
      message,
      timestamp: new Date().toISOString()
    };

    const updatedSession = await prisma.teleSession.update({
      where: { id },
      data: {
        chatHistory: [...session.chatHistory, chatMessage]
      }
    });

    res.json({ message: chatMessage, session: updatedSession });
  } catch (error) {
    next(error);
  }
});

// GET /api/teleconsult/doctor/:doctorId - Get doctor's sessions
router.get('/doctor/:doctorId', [
  param('doctorId').isUUID()
], async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { status } = req.query;

    const where = { doctorId };
    if (status) {
      where.status = status;
    }

    const sessions = await prisma.teleSession.findMany({
      where,
      orderBy: { scheduledAt: 'desc' }
    });

    res.json(sessions);
  } catch (error) {
    next(error);
  }
});

// GET /api/teleconsult/patient/:patientId - Get patient's sessions
router.get('/patient/:patientId', [
  param('patientId').isUUID()
], async (req, res, next) => {
  try {
    const { patientId } = req.params;

    const sessions = await prisma.teleSession.findMany({
      where: { patientId },
      orderBy: { scheduledAt: 'desc' }
    });

    res.json(sessions);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
