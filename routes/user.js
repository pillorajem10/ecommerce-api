const express = require('express')
const router = express.Router()

const { authenticateToken, isAuth, isAdmin} = require('../requirements');

const {userById,read,update} = require('../controllers/user');

router.get('/secret/:userId', authenticateToken, isAuth, isAdmin,(req, res)=>{
  res.json({
    user:req.profile
  });
});

router.get('/get/:userId', authenticateToken, isAuth, read);
router.put('/update/:userId', authenticateToken, isAuth,update);

router.param('userId', userById)

module.exports = router;
