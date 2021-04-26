const express = require('express');
const router = express.Router();

const { create, categoryById, read, update, remove, list, photo } = require('../controllers/category');
const { isAuth, isAdmin, authenticateToken } = require('../requirements');
const { userById } = require('../controllers/user');

router.get('/get/:categoryId', read)
router.post('/create/:userId', authenticateToken, isAdmin, create);
router.put('/update/:categoryId/:userId', authenticateToken, isAdmin, update);
router.delete('/delete/:categoryId/:userId', authenticateToken, isAdmin, remove);
router.get('/photo/:categoryId', photo);
router.get('/', list)

router.param('categoryId', categoryById)
router.param('userId', userById);

module.exports = router;
