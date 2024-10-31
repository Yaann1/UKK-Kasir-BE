const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "./image"); // Folder untuk menyimpan gambar
    },
    filename: (req, file, callback) => {
        callback(null, `image-${Date.now()}${path.extname(file.originalname)}`);
    }
});

exports.upload = multer({ storage: storage }).any(); // `any()` untuk menerima semua file
