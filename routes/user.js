const express = require('express');
const router = express.Router();

// Memanggil userController
const userController = require('../controllers/userController');

// Memanggil middlewares
const userValidator = require('../middlewares/userValidator');
const authorization = require('../middlewares/authorization');

// Endpoint untuk mendapatkan data user (memerlukan otorisasi)
router.get('/', authorization.authorization, userController.getDatauser);

// Endpoint untuk mencari user berdasarkan keyword (memerlukan otorisasi)
router.post('/find', authorization.authorization, userController.findUser);

// Endpoint untuk menambahkan data user (memerlukan validasi dan otorisasi)
router.post('/register', [
    userValidator.validate, // Validasi data input
    authorization.authorization 
], userController.addDatauser);

// Endpoint untuk mengedit data user berdasarkan ID (memerlukan validasi dan otorisasi)
router.put('/:id_user', [
    userValidator.validate, // Validasi data input
    authorization.authorization 
], userController.editDatauser);

// Endpoint untuk menghapus data user berdasarkan ID (memerlukan otorisasi)
router.delete('/:id_user', authorization.authorization, userController.deleteDatauser);

// Endpoint untuk otentikasi/login (tidak memerlukan otorisasi)
router.post('/auth', userController.authentication);

module.exports = router;
