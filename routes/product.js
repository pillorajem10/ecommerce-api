const express = require('express');
const router = express.Router();


const { create, productById, read, remove, update, list, nopaginatelist, reviews, reviewById, reviewDel, reviewUpdate, getReviews, addVariant, variantById, readVariant } = require('../controllers/product');

const { authenticateToken, isAuth, isAdmin } = require('../requirements');
const { userById } = require('../controllers/user');


router.post('/create/:userId', authenticateToken, isAdmin, create);
router.get('/get/:productId', read)
router.get('/get/variant/:productId/:variantId', readVariant)
router.delete('/delete/:productId/:userId', authenticateToken, isAdmin, remove);
router.put('/update/:productId/:userId', authenticateToken, isAdmin, update);
router.get('/sort', nopaginatelist);
router.get('/', list);
router.get('/reviews', getReviews);
router.post('/reviews/add/:productId', authenticateToken, reviews);
router.post('/variants/add/:productId', authenticateToken, addVariant);
router.delete('/reviews/delete/:productId/:reviewId', authenticateToken, reviewDel);
router.put('/reviews/update/:productId/:reviewId', authenticateToken, reviewUpdate)

router.param('userId', userById);
router.param('productId', productById);
router.param('reviewId', reviewById);
router.param('variantId', variantById);

module.exports = router;
