const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const { body, validationResult, param, query } = require('express-validator');

// ============================================
// ADMIN ROUTES
// ============================================

// Middleware to check admin role (placeholder - should verify JWT)
const requireAdmin = async (req, res, next) => {
  // TODO: Implement proper JWT verification and role check
  const adminToken = req.headers['x-admin-token'];
  if (!adminToken) {
    // For development, allow access. In production, uncomment below:
    // return res.status(401).json({ error: 'Admin authentication required' });
  }
  next();
};

router.use(requireAdmin);

// ============================================
// USER MANAGEMENT
// ============================================

// GET /api/admin/users - List all users with filters
router.get('/users', async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;

    const where = {};
    if (role) {
      where.role = role;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          lastLogin: true,
          createdAt: true
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where })
    ]);

    res.json({
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/users/:id/role - Change user role
router.put('/users/:id/role', [
  param('id').isUUID(),
  body('role').isIn(['PATIENT', 'DOCTOR', 'LAB_OWNER', 'ADMIN', 'STAFF'])
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { role } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });

    res.json(user);
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    next(error);
  }
});

// DELETE /api/admin/users/:id - Soft delete user (deactivate)
router.delete('/users/:id', [
  param('id').isUUID()
], async (req, res, next) => {
  try {
    const { id } = req.params;

    // Instead of hard delete, we could add an isActive field
    // For now, just delete
    await prisma.user.delete({ where: { id } });

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    next(error);
  }
});

// ============================================
// LAB MANAGEMENT
// ============================================

// GET /api/admin/labs - List all labs
router.get('/labs', async (req, res, next) => {
  try {
    const { status, search, page = 1, limit = 20 } = req.query;

    const where = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const [labs, total] = await Promise.all([
      prisma.lab.findMany({
        where,
        include: {
          owners: {
            select: { id: true, name: true, email: true }
          },
          _count: {
            select: { tests: true, testBookings: true }
          }
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.lab.count({ where })
    ]);

    res.json({
      labs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// DOCTOR MANAGEMENT
// ============================================

// GET /api/admin/doctors - List all doctors
router.get('/doctors', async (req, res, next) => {
  try {
    const { specialtyId, search, page = 1, limit = 20 } = req.query;

    const where = {};
    if (specialtyId) {
      where.specialtyId = specialtyId;
    }
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const [doctors, total] = await Promise.all([
      prisma.doctor.findMany({
        where,
        include: {
          specialty: true,
          _count: {
            select: { appointments: true }
          }
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.doctor.count({ where })
    ]);

    res.json({
      doctors,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// PLATFORM ANALYTICS
// ============================================

// GET /api/admin/analytics - Platform-wide analytics
router.get('/analytics', async (req, res, next) => {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalDoctors,
      totalLabs,
      totalBookings,
      recentBookings,
      totalAppointments,
      recentAppointments,
      revenueData
    ] = await Promise.all([
      prisma.user.count(),
      prisma.doctor.count(),
      prisma.lab.count(),
      prisma.testBooking.count(),
      prisma.testBooking.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      }),
      prisma.appointment.count(),
      prisma.appointment.count({
        where: { createdAt: { gte: thirtyDaysAgo } }
      }),
      prisma.paymentTransaction.aggregate({
        where: {
          paymentStatus: 'PAID',
          createdAt: { gte: thirtyDaysAgo }
        },
        _sum: { finalAmount: true },
        _count: true
      })
    ]);

    // User breakdown by role
    const usersByRole = await prisma.user.groupBy({
      by: ['role'],
      _count: true
    });

    // Booking status breakdown
    const bookingsByStatus = await prisma.testBooking.groupBy({
      by: ['status'],
      _count: true
    });

    res.json({
      overview: {
        totalUsers,
        totalDoctors,
        totalLabs,
        totalBookings,
        totalAppointments
      },
      recent30Days: {
        bookings: recentBookings,
        appointments: recentAppointments,
        revenue: revenueData._sum.finalAmount || 0,
        transactions: revenueData._count
      },
      breakdowns: {
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item.role] = item._count;
          return acc;
        }, {}),
        bookingsByStatus: bookingsByStatus.reduce((acc, item) => {
          acc[item.status] = item._count;
          return acc;
        }, {})
      }
    });
  } catch (error) {
    next(error);
  }
});

// ============================================
// COUPON MANAGEMENT (Admin access to all coupons)
// ============================================

// GET /api/admin/coupons - List all coupons (including inactive)
router.get('/coupons', async (req, res, next) => {
  try {
    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: 'desc' }
    });

    res.json(coupons);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
