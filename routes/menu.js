const express = require("express");
const menuController = require("../controllers/menuController");
const uploadImage = require("../middlewares/uploadImage");
const authorization = require("../middlewares/authorization");

const router = express.Router();

// Endpoint untuk mendapatkan data menu
router.get("/", authorization.authorization, menuController.getDataMenu);

// Endpoint untuk menambahkan data menu (hanya untuk admin)
router.post("/", [
    uploadImage.upload, // Menggunakan upload.any()
    authorization.authorization // Hanya admin yang bisa menambah menu
], menuController.addDataMenu);

// Endpoint untuk mengedit data menu (hanya untuk admin)
router.put("/:id_menu", [
    uploadImage.upload, // Menggunakan upload untuk file
    authorization.authorization // Hanya admin yang bisa mengedit menu
], menuController.editDataMenu);

// Endpoint untuk menghapus data menu (hanya untuk admin)
router.delete("/:id_menu", authorization.authorization, menuController.deleteDataMenu); // Hanya admin yang bisa menghapus menu

module.exports = router;
