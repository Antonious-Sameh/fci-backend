const express = require('express');
const router = express.Router();
const { getCareers, getCareer, createCareer, updateCareer, deleteCareer } = require('../controllers/careerController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, getCareers);
router.get('/:slug', protect, getCareer);
router.post('/', protect, adminOnly, createCareer);
router.put('/:id', protect, adminOnly, updateCareer);
router.delete('/:id', protect, adminOnly, deleteCareer);

module.exports = router;
