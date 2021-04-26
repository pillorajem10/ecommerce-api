const express = require('express');
const router = express.Router();

const {create, categoryById, read, update, remove, list} = require('../controllers/category');
const { isAuth, isAdmin, authenticateToken } = require('../requirements');
const { userById } = require('../controllers/user');

router.get('/get/:categoryId', read)
router.post('/create/:userId', authenticateToken, isAuth, isAdmin, create);
router.put('/update/:categoryId/:userId', authenticateToken, isAuth, isAdmin, update);
router.delete('/delete/:categoryId/:userId', authenticateToken, isAuth, isAdmin, remove);
router.get('/', authenticateToken, list)

router.param('categoryId', categoryById)
router.param('userId', userById);

module.exports = router;
