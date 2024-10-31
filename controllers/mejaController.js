// Mengimpor model untuk tabel meja
let modelMeja = require("../models/index").meja; // model meja

// 1. Fungsi untuk mengambil semua data meja dari database
exports.getDataMeja = (request, response) => {
    modelMeja.findAll() // Mengambil semua data dari tabel meja
    .then(result => {
        return response.json(result); // Mengembalikan hasil dalam format JSON
    })
    .catch(error => {
        return response.json({
            message: error.message // Mengembalikan pesan error jika gagal
        });
    });
};

// 2. Fungsi untuk menambahkan data meja baru ke database
exports.addDataMeja = (request, response) => {
    // Menampung data meja baru dari request body
    let newMeja = {
        nomor_meja: request.body.nomor_meja, // Nomor meja
        status_meja: request.body.status_meja, // Status meja (tersedia/tidak tersedia)
    };

    modelMeja.create(newMeja) // Menyimpan data meja baru ke database
        .then(result => {
            return response.json({
                message: `Data meja berhasil ditambahkan`
            });
        })
        .catch(error => {
            return response.json({
                message: error.message // Mengembalikan pesan error jika gagal
            });
        });
};

// 3. Fungsi untuk mengedit data meja yang sudah ada berdasarkan id_meja
exports.editDataMeja = (request, response) => {
    let id = request.params.id_meja; // ID meja yang akan diedit
    let dataMeja = {
        nomor_meja: request.body.nomor_meja, // Nomor meja baru
        status_meja: request.body.status_meja, // Status meja baru
    };
    
    modelMeja.update(dataMeja, { where: { id_meja: id } }) // Mengupdate data meja di database
        .then(result => {
            return response.json({
                message: `Data meja berhasil diedit`
            });
        })
        .catch(error => {
            return response.json({
                message: error.message // Mengembalikan pesan error jika gagal
            });
        });
};

// 4. Fungsi untuk menghapus data meja berdasarkan id_meja
exports.deleteDataMeja = (request, response) => {
    let id = request.params.id_meja; // ID meja yang akan dihapus

    modelMeja.destroy({ where: { id_meja: id } }) // Menghapus data meja di database berdasarkan ID
        .then(result => {
            return response.json({
                message: `Data meja berhasil dihapus`
            });
        })
        .catch(error => {
            return response.json({
                message: error.message // Mengembalikan pesan error jika gagal
            });
        });
};
