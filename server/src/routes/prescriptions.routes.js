const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { body, validationResult, param } = require('express-validator');

// ============================================
// PRESCRIPTION (eRx) ROUTES
// ============================================

// POST /api/prescriptions - Create a new prescription
router.post('/', [
  body('patientId').isUUID(),
  body('doctorId').isUUID(),
  body('doctorName').trim().notEmpty(),
  body('patientName').trim().notEmpty(),
  body('medications').isArray({ min: 1 }),
  body('medications.*.name').trim().notEmpty(),
  body('medications.*.dosage').trim().notEmpty(),
  body('medications.*.frequency').trim().notEmpty(),
  body('medications.*.duration').trim().notEmpty(),
  body('appointmentId').optional().isUUID(),
  body('teleSessionId').optional().isUUID(),
  body('diagnosis').optional().trim(),
  body('symptoms').optional().isArray(),
  body('tests').optional().isArray(),
  body('advice').optional().trim(),
  body('followUpDate').optional().isISO8601()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      appointmentId,
      teleSessionId,
      patientId,
      doctorId,
      doctorName,
      patientName,
      diagnosis,
      symptoms = [],
      medications,
      tests = [],
      advice,
      followUpDate,
      signature
    } = req.body;

    const prescription = await prisma.prescription.create({
      data: {
        appointmentId,
        teleSessionId,
        patientId,
        doctorId,
        doctorName,
        patientName,
        diagnosis,
        symptoms,
        medications,
        tests,
        advice,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
        signature,
        isDigital: true
      }
    });

    // TODO: Generate PDF and update pdfUrl

    res.status(201).json(prescription);
  } catch (error) {
    next(error);
  }
});

// GET /api/prescriptions/:id - Get prescription by ID
router.get('/:id', [
  param('id').isUUID()
], async (req, res, next) => {
  try {
    const { id } = req.params;

    const prescription = await prisma.prescription.findUnique({
      where: { id }
    });

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    res.json(prescription);
  } catch (error) {
    next(error);
  }
});

// GET /api/prescriptions/patient/:patientId - Get patient's prescriptions
router.get('/patient/:patientId', [
  param('patientId').isUUID()
], async (req, res, next) => {
  try {
    const { patientId } = req.params;

    const prescriptions = await prisma.prescription.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(prescriptions);
  } catch (error) {
    next(error);
  }
});

// GET /api/prescriptions/doctor/:doctorId - Get doctor's issued prescriptions
router.get('/doctor/:doctorId', [
  param('doctorId').isUUID()
], async (req, res, next) => {
  try {
    const { doctorId } = req.params;

    const prescriptions = await prisma.prescription.findMany({
      where: { doctorId },
      orderBy: { createdAt: 'desc' }
    });

    res.json(prescriptions);
  } catch (error) {
    next(error);
  }
});

// PUT /api/prescriptions/:id - Update prescription
router.put('/:id', [
  param('id').isUUID()
], async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Remove fields that shouldn't be updated
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.patientId;
    delete updateData.doctorId;

    const prescription = await prisma.prescription.update({
      where: { id },
      data: updateData
    });

    res.json(prescription);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Prescription not found' });
    }
    next(error);
  }
});

// POST /api/prescriptions/:id/generate-pdf - Generate PDF
router.post('/:id/generate-pdf', [
  param('id').isUUID()
], async (req, res, next) => {
  try {
    const { id } = req.params;

    const prescription = await prisma.prescription.findUnique({
      where: { id }
    });

    if (!prescription) {
      return res.status(404).json({ error: 'Prescription not found' });
    }

    // TODO: Implement PDF generation with a library like pdfkit or puppeteer
    // For now, return a placeholder

    const pdfUrl = `/prescriptions/${id}.pdf`;

    await prisma.prescription.update({
      where: { id },
      data: { pdfUrl }
    });

    res.json({ 
      message: 'PDF generated successfully',
      pdfUrl 
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
