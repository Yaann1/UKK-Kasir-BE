// Mengimpor body dari express-validator untuk melakukan validasi input
const { body } = require(`express-validator`);

// Ekspor middleware untuk validasi input
exports.validate = [
    // Validasi password
    body(`password`)
        .isLength({ min: 8 }) // Memastikan panjang password minimal 8 karakter
        .withMessage(`Password terlalu pendek, min 8 karakter`) // Pesan jika validasi gagal
        .notEmpty() // Memastikan password tidak kosong
        .withMessage(`Password must be filled`), // Pesan jika password tidak diisi

    // Validasi username
    body(`username`)
        .notEmpty() // Memastikan username tidak kosong
        .withMessage(`Username tidak boleh kosong`), // Pesan jika username tidak diisi

    // Validasi nama user
    body(`nama_user`)
        .notEmpty() // Memastikan nama pengguna tidak kosong
        .withMessage(`Name of User must be filled`) // Pesan jika nama pengguna tidak diisi
];






//Validasi adalah proses pemeriksaan data yang dimasukkan oleh pengguna untuk memastikan bahwa 
//data tersebut memenuhi kriteria tertentu sebelum diproses lebih lanjut oleh aplikasi.
// Dalam konteks pengembangan perangkat lunak, validasi sangat penting untuk menjaga integritas dan keamanan data.