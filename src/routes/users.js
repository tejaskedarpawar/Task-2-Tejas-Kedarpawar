const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// ─────────────────────────────────────────────
// CREATE — POST /api/users
// HTTP: POST → CRUD: Create → Returns: 201 Created
// ─────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { email, age } = req.body;

  // Basic validation
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  if (age !== undefined && age < 0) {
    return res.status(400).json({ error: 'Age cannot be negative' });
  }

  try {
    const newUser = await prisma.user.create({
      data: { email, age: age || 0 }
    });
    res.status(201).json(newUser); // 201 = Created
  } catch (error) {
    // Prisma error P2002 = Unique constraint violation (duplicate email)
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Email already exists' }); // 409 = Conflict
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─────────────────────────────────────────────
// READ ALL — GET /api/users
// HTTP: GET → CRUD: Read → Returns: 200 OK
// ─────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany(); // fetch all users
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─────────────────────────────────────────────
// READ ONE — GET /api/users/:id
// HTTP: GET → CRUD: Read → Returns: 200 OK
// ─────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) } // id comes as string, convert to number
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' }); // 404 = Not Found
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─────────────────────────────────────────────
// UPDATE — PUT /api/users/:id
// HTTP: PUT → CRUD: Update → Returns: 200 OK
// ─────────────────────────────────────────────
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { email, age, is_active } = req.body;

  if (age !== undefined && age < 0) {
    return res.status(400).json({ error: 'Age cannot be negative' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { email, age, is_active }
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    if (error.code === 'P2025') { // Record not found
      return res.status(404).json({ error: 'User not found' });
    }
    if (error.code === 'P2002') { // Duplicate email
      return res.status(409).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─────────────────────────────────────────────
// DELETE — DELETE /api/users/:id
// HTTP: DELETE → CRUD: Delete → Returns: 204 No Content
// ─────────────────────────────────────────────
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });
    res.status(204).send(); // 204 = No Content (success, nothing to return)
  } catch (error) {
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;