// Mengimpor model untuk tabel detail transaksi dan menu
let modelDetail = require("../models/index").detail; // model detail transaksi
let modelMenu = require("../models/index").menu;     // model menu

// 1. Fungsi untuk mengambil semua data detail transaksi
exports.getDataDetail = (request, response) => {
    modelDetail.findAll() // Mengambil semua data dari tabel detail transaksi
    .then(result => {
        return response.json(result); // Mengembalikan hasil dalam format JSON
    })
    .catch(error => {
        return response.json({
            message: error.message // Mengembalikan pesan error jika gagal
        });
    });
};

// 2. Fungsi untuk menambahkan data detail transaksi baru ke database
exports.addDataDetail = async (request, response) => {
    try {
      // Mengambil data menu berdasarkan id_menu dari body untuk mendapatkan harga menu
      let menu = await modelMenu.findOne({ where: { id_menu: request.body.id_menu } });
  
      if (!menu) {
        return response.status(404).json({ message: "Menu tidak ditemukan" });
      }
  
      // Menghitung total harga dengan mengalikan jumlah pesanan (qty) dengan harga menu
      let total = request.body.qty * menu.harga;
  
      // Data detail transaksi baru yang akan disimpan ke database
      let newDetail = {
        id_transaksi: request.body.id_transaksi, // ID transaksi
        id_menu: request.body.id_menu,           // ID menu
        qty: request.body.qty,                   // Jumlah item
        total: total,                            // Total harga
      };
  
      await modelDetail.create(newDetail); // Menyimpan data detail transaksi baru ke database
      return response.json({ message: "Data detail berhasil ditambahkan" });
    } catch (error) {
      return response.json({ message: error.message });
    }
};

// 3. Fungsi untuk memperbarui data detail transaksi berdasarkan id_detail
exports.editDataDetail = async (request, response) => {
    let id = request.params.id_detail; // ID detail transaksi yang akan diubah
    
    try {
      // Mengambil data menu berdasarkan id_menu dari body
      let menu = await modelMenu.findOne({ where: { id_menu: request.body.id_menu } });
  
      if (!menu) {
        return response.status(404).json({ message: "Menu tidak ditemukan" });
      }
  
      // Menghitung total harga (qty * harga menu)
      let total = request.body.qty * menu.harga;
  
      // Data detail transaksi yang akan diperbarui
      let dataDetail = {
        id_transaksi: request.body.id_transaksi,
        id_menu: request.body.id_menu,
        qty: request.body.qty,
        total: total,
      };
  
      await modelDetail.update(dataDetail, { where: { id_detail: id } }); // Mengupdate data detail transaksi
      return response.json({ message: "Data detail berhasil diedit" });
    } catch (error) {
      return response.json({ message: error.message });
    }
};

// 4. Fungsi untuk menghapus data detail transaksi berdasarkan id_detail
exports.deleteDataDetail = (request, response) => {
    let id = request.params.id_detail; // ID detail transaksi yang akan dihapus

    modelDetail.destroy({ where: { id_detail: id } }) // Menghapus data berdasarkan ID
        .then(result => {
            return response.json({
                message: `Data detail berhasil dihapus`
            });
        })
        .catch(error => {
            return response.json({
                message: error.message
            });
        });
};
