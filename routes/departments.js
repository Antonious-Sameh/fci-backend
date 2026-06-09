// routes/departments.js
const express = require('express');
const router = express.Router();
const { getDepartments, getDepartment, createDepartment, updateDepartment, deleteDepartment } = require('../controllers/departmentController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getDepartments);
router.get('/:slug', protect, getDepartment);
router.post('/', protect, adminOnly, createDepartment);
router.put('/:id', protect, adminOnly, updateDepartment);
router.delete('/:id', protect, adminOnly, deleteDepartment);

module.exports = router;
