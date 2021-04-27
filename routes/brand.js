const express = require('express');
const router = express.Router();

const { create, brandById, read, update, remove, list, photo } = require('../controllers/brand');
const { isAuth, isAdmin, authenticateToken } = require('../requirements');
const { userById } = require('../controllers/user');

router.get('/get/:brandId', read)
router.post('/create/:userId', authenticateToken, isAdmin, create);
router.put('/update/:brandId/:userId', authenticateToken, isAdmin, update);
router.delete('/delete/:brandId/:userId', authenticateToken, isAdmin, remove);
router.get('/', list)

router.param('brandId', brandById)
router.param('userId', userById);

module.exports = router;
