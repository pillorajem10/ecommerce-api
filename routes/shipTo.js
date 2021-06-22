const express = require('express');
const router = express.Router();

const { create, shipToById, read, update, remove, list, addSubCity, listSubCities } = require('../controllers/shipTo');
const { isAuth, isAdmin, authenticateToken } = require('../requirements');
const { userById } = require('../controllers/user');

router.get('/:shipToId', read)
router.post('/:userId', authenticateToken, isAdmin, create);
router.post('/addSubCity/:shipToId/:userId', authenticateToken, isAdmin, addSubCity);
router.put('/:shipToId/:userId', authenticateToken, isAdmin, update);
router.delete('/:shipToId/:userId', authenticateToken, isAdmin, remove);
router.get('/', list);
router.get('/list/subcities', listSubCities)

router.param('shipToId', shipToById)
router.param('userId', userById);

module.exports = router;
