// Mengimpor model untuk tabel menu
let modelMenu = require("../models/index").menu; // model menu
let path = require("path"); // modul path untuk menangani dan mengubah path file
let fs = require("fs"); // modul file system untuk operasi file

// 1. Fungsi untuk mendapatkan semua data menu dari database
exports.getDataMenu = (request, response) => {
    modelMenu.findAll() // mengambil semua data dari tabel menu
    .then(result => {
        return response.json(result); // mengembalikan hasil dalam format JSON
    })
    .catch(error => {
        return response.json({
            message: error.message // mengembalikan pesan error jika gagal
        });
    });
};

// 2. Fungsi untuk menambahkan data menu baru ke database
exports.addDataMenu = (request, response) => {
    if (request.files.length === 0) { // Mengecek apakah ada file yang di-upload
        return response.json({
            message: `Tidak ada file yang diupload`
        });
    }

    // Menampung data menu baru dari request body dan file upload
    let newMenu = {
        nama_menu: request.body.nama_menu, // nama menu
        jenis: request.body.jenis, // jenis menu (makanan/minuman)
        deskripsi: request.body.deskripsi, // deskripsi menu
        harga: request.body.harga, // harga menu
        image: request.files[0].filename // mengambil nama file pertama yang diupload
    };

    modelMenu.create(newMenu) // menyimpan data menu baru ke database
        .then(result => {
            return response.json({
                message: `Data menu berhasil ditambahkan`
            });
        })
        .catch(error => {
            return response.json({
                message: error.message // mengembalikan pesan error jika gagal
            });
        });
};

// 3. Fungsi untuk mengedit data menu yang sudah ada berdasarkan id_menu
exports.editDataMenu = async (request, response) => {
    let id = request.params.id_menu; // ID menu yang akan diedit
    let dataMenu = {
        nama_menu: request.body.nama_menu, // nama menu baru
        jenis: request.body.jenis, // jenis menu baru
        deskripsi: request.body.deskripsi, // deskripsi menu baru
        harga: request.body.harga // harga menu baru
    };

    if (request.file) { // jika ada file baru yang di-upload
        // Mengambil data menu berdasarkan ID untuk mendapatkan file gambar lama
        let menu = await modelMenu.findOne({ where: { id_menu: id } });
        let oldFileName = menu.image; // nama file lama

        // Hapus file gambar lama
        let location = path.join(__dirname, "../image", oldFileName);
        fs.unlink(location, error => console.log(error));

        // Update data menu dengan file gambar baru
        dataMenu.image = request.file.filename;
    }

    modelMenu.update(dataMenu, { where: { id_menu: id } }) // mengupdate data menu di database
        .then(result => {
            return response.json({
                message: `Data menu berhasil diedit`
            });
        })
        .catch(error => {
            return response.json({
                message: error.message // mengembalikan pesan error jika gagal
            });
        });
};

// 4. Fungsi untuk menghapus data menu berdasarkan id_menu
exports.deleteDataMenu = async (request, response) => {
    let id = request.params.id_menu; // ID menu yang akan dihapus

    // Mengambil data filename untuk dihapus dari file sistem
    let menu = await modelMenu.findOne({ where: { id_menu: id } });
    
    if (menu) { // jika data menu ditemukan
        let oldFileName = menu.image; // nama file gambar lama

        // Hapus file gambar dari file sistem
        let location = path.join(__dirname, "../image", oldFileName);
        fs.unlink(location, error => console.log(error));
    }

    modelMenu.destroy({ where: { id_menu: id } }) // menghapus data menu dari database
        .then(result => {
            return response.json({
                message: `Data menu berhasil dihapus`
            });
        })
        .catch(error => {
            return response.json({
                message: error.message // mengembalikan pesan error jika gagal
            });
        });
};
