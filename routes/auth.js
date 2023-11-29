const { Router } = require('express');
const router = new Router();

router.post('/register', require('../controllers/authController/register.js'));

module.exports = router;
