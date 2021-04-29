const express = require('express');
const router = express.Router();


const { create, productById, read, remove, update, list, photo, nopaginatelist, reviews } = require('../controllers/product');

const { authenticateToken, isAuth, isAdmin } = require('../requirements');
const { userById } = require('../controllers/user');


router.post('/create/:userId', authenticateToken, isAdmin, create);
router.get('/get/:productId', read)
router.delete('/delete/:productId/:userId', authenticateToken, isAdmin, remove);
router.put('/update/:productId/:userId', authenticateToken, isAdmin, update);
router.get('/sort', nopaginatelist);
router.get('/photo/:productId', photo);
router.get('/', list);
router.post('/reviews/:productId', authenticateToken, reviews)

router.param('userId', userById);
router.param('productId', productById);

module.exports = router;
