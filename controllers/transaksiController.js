const PDFDocument = require('pdfkit'); // Mengimpor PDFKit untuk membuat file PDF
const fs = require('fs'); // Mengimpor modul filesystem untuk menangani file sistem

// Mengimpor model untuk transaksi, detail transaksi, dan menu
let modelTransaksi = require("../models/index").transaksi;
let modelDetail = require("../models/index").detail;
let modelMenu = require("../models/index").menu;

// Fungsi untuk mengambil semua data transaksi
exports.getDataTransaksi = async (request, response) => {
  try {
    // Mengambil data semua transaksi beserta detailnya
    let data = await modelTransaksi.findAll({
      include: [
        {
          model: modelDetail,
          as: "detail",
          include: [
            {
              model: modelMenu,
              as: "menu",
            },
          ],
        },
      ],
      attributes: [
        'id_transaksi',       // Mengambil id transaksi
        'tgl_transaksi',      // Mengambil tanggal transaksi
        'id_user',            // Mengambil id user
        'id_meja',            // Mengambil id meja
        'nama_pelanggan',     // Mengambil nama pelanggan
        'status',             // Mengambil status transaksi
        'total_harga'         // Mengambil total harga transaksi
      ],
    });

    // Menghitung total harga untuk setiap transaksi berdasarkan detail transaksi
    data.forEach((transaksi) => {
      let totalHarga = 0;

      // Menghitung total harga per item (qty * harga) dan menjumlahkannya
      transaksi.detail.forEach((detail) => {
        detail.dataValues.total = detail.qty * detail.menu.harga;
        totalHarga += detail.dataValues.total;
      });

      // Menyimpan hasil total harga di transaksi
      transaksi.dataValues.total_harga = totalHarga;
    });

    return response.json(data); // Mengirimkan data transaksi sebagai respons JSON
  } catch (error) {
    return response.status(500).json({
      message: error.message, // Mengembalikan pesan kesalahan jika terjadi error
    });
  }
};

// Fungsi untuk memfilter transaksi berdasarkan tanggal
exports.filterTgl = async (request, response) => {
  let start = request.body.start; 
  let end = request.body.end;

  let sequelize = require(`sequelize`);
  let Op = sequelize.Op;

  try {
    // Mendapatkan transaksi berdasarkan rentang tanggal
    let data = await modelTransaksi.findAll({
      include: [
        {
          model: modelDetail,
          as: "detail",
          include: ["menu"],
        },
      ],
      where: {
        tgl_transaksi: {
          [Op.between]: [new Date(start), new Date(end)], // Filter transaksi di antara start dan end
        },
      },
    });

    if (data.length > 0) {
      // Jika transaksi ditemukan, hitung total harga untuk setiap transaksi
      data.forEach((transaksi) => {
        let totalHarga = 0;

        // Menghitung total harga per item dan menambahkannya ke total transaksi
        transaksi.detail.forEach((detail) => {
          detail.dataValues.total = detail.qty * detail.menu.harga;
          totalHarga += detail.dataValues.total;
        });

        transaksi.dataValues.total_harga = totalHarga;
      });

      return response.json({
        message: "Data ditemukan",
        data: data
      });
    } else {
      // Jika tidak ada transaksi pada rentang tanggal yang diberikan
      return response.json({
        message: "Tidak ada data transaksi pada rentang tanggal yang diberikan"
      });
    }
  } catch (error) {
    return response.status(500).json({
      message: error.message,
    });
  }
};

// Fungsi untuk menambahkan data transaksi baru
exports.addDataTransaksi = async (request, response) => {
  // Membuat objek transaksi baru berdasarkan data yang diterima
  let newTransaksi = {
    tgl_transaksi: new Date(),               // Tanggal transaksi saat ini
    id_user: request.body.id_user,           // Id user dari body request
    id_meja: request.body.id_meja,           // Id meja dari body request
    nama_pelanggan: request.body.nama_pelanggan, // Nama pelanggan
    status: request.body.status,             // Status transaksi
  };

  try {
    // Insert data transaksi baru ke database
    let result = await modelTransaksi.create(newTransaksi);
    
    let detail = request.body.detail; // Menampung data detail transaksi
    let id = result.id_transaksi;     // Mengambil id transaksi dari hasil insert
    let totalHarga = 0;               // Variabel untuk total harga transaksi

    for (let i = 0; i < detail.length; i++) {
      // Mencari data menu berdasarkan id_menu pada detail transaksi
      let menu = await modelMenu.findOne({
        where: { id_menu: detail[i].id_menu }
      });

      if (!menu) {
        // Jika menu tidak ditemukan, kirimkan error
        return response.status(404).json({
          message: `Menu with id ${detail[i].id_menu} not found`,
        });
      }

      // Tambahkan detail transaksi dengan harga menu yang diambil dari database
      detail[i].id_transaksi = id;
      detail[i].harga = menu.harga;
      detail[i].qty = detail[i].qty;
      totalHarga += menu.harga * detail[i].qty; // Hitung total harga
    }

    await modelDetail.bulkCreate(detail); // Menyimpan data detail transaksi

    // Update total harga transaksi
    await modelTransaksi.update(
      { total_harga: totalHarga }, 
      { where: { id_transaksi: id } }
    );

    return response.json({
      message: `Data Transaksi telah ditambahkan dengan total harga Rp${totalHarga}`,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message,
    });
  }
};

// Fungsi untuk mengedit data transaksi yang sudah ada
exports.editDataTransaksi = (request, response) => {
  let id = request.params.id_transaksi; // Mengambil id_transaksi dari parameter URL
  let dataTransaksi = {
    tgl_transaksi: request.body.tgl_transaksi, // Tanggal transaksi baru
    id_user: request.body.id_user,             // Id user baru
    id_meja: request.body.id_meja,             // Id meja baru
    nama_pelanggan: request.body.nama_pelanggan, // Nama pelanggan baru
    status: request.body.status,               // Status transaksi baru
  };

  modelTransaksi
    .update(dataTransaksi, { where: { id_transaksi: id } }) // Update transaksi berdasarkan id_transaksi
    .then(() => {
      return response.json({
        message: `Data transaksi berhasil diedit`,
      });
    })
    .catch((error) => {
      return response.json({
        message: error.message,
      });
    });
};

// Fungsi untuk menghapus data transaksi berdasarkan id_transaksi
exports.deleteDataTransaksi = (request, response) => {
  let id = request.params.id_transaksi; // Mengambil id_transaksi dari parameter URL

  modelTransaksi
    .destroy({ where: { id_transaksi: id } }) // Hapus transaksi berdasarkan id_transaksi
    .then(() => {
      return response.json({
        message: `Data transaksi berhasil dihapus`,
      });
    })
    .catch((error) => {
      return response.json({
        message: error.message,
      });
    });
};

// Fungsi untuk mencetak struk transaksi dalam bentuk PDF
exports.printReceipt = async (request, response) => {
  let id = request.params.id_transaksi; // Mengambil id_transaksi dari parameter URL

  try {
    // Mengambil data transaksi berdasarkan id_transaksi
    let data = await modelTransaksi.findOne({
      where: { id_transaksi: id },
      include: [
        {
          model: modelDetail,
          as: "detail",
          include: [
            {
              model: modelMenu,
              as: "menu", // Mengambil data menu terkait
            }
          ],
        },
        {
          model: require("../models/index").user, // Mengambil data user sebagai kasir
          as: "user",
        }
      ],
      attributes: [
        'id_transaksi',
        'tgl_transaksi',
        'nama_pelanggan',
        'status',
        'total_harga',
        'id_meja'
      ]
    });

    if (!data) {
      return response.status(404).json({
        message: `Transaksi dengan id ${id} tidak ditemukan`
      });
    }

    // Menghitung total harga jika belum disimpan
    let totalHarga = 0;
    data.detail.forEach(item => {
      item.dataValues.total = item.qty * item.menu.harga;
      totalHarga += item.dataValues.total;
    });

    // Menyimpan total_harga di data transaksi jika belum ada
    if (!data.total_harga) {
      data.total_harga = totalHarga;
    }

    // Inisiasi PDF
    const doc = new PDFDocument();

    // Menentukan nama file dan path untuk menyimpan PDF
    let filename = `receipt_${data.id_transaksi}.pdf`;
    let filePath = `./receipts/${filename}`;

    // Pastikan direktori receipts ada, jika tidak, buat folder baru
    if (!fs.existsSync('./receipts')) {
      fs.mkdirSync('./receipts');
    }

    doc.pipe(fs.createWriteStream(filePath)); // Menyimpan hasil PDF ke file

    // Header struk
    doc.fontSize(20).text('Cafe Wikusama', { align: 'center' });
    doc.fontSize(12).text('Jl. Danau Ranau No. 123, Malang', { align: 'center' });
    doc.moveDown();
    doc.text(`Tanggal Transaksi: ${new Date(data.tgl_transaksi).toLocaleString()}`);
    doc.text(`Kasir: ${data.user.nama_user}`);
    doc.text(`Nama Pelanggan: ${data.nama_pelanggan}`);
    doc.text(`ID Meja: ${data.id_meja}`);
    doc.moveDown();
    doc.text('Pesanan:', { underline: true });

    // Detail pesanan
    data.detail.forEach(item => {
      doc.text(`${item.menu.nama_menu} x ${item.qty} @ Rp${item.menu.harga} = Rp${item.qty * item.menu.harga}`);
    });

    // Footer struk
    doc.moveDown();
    doc.text(`Total Harga: Rp${data.total_harga}`);
    doc.text(`Status: ${data.status}`);
    doc.moveDown();
    doc.text('Terima kasih telah berkunjung!', { align: 'center' });

    doc.end(); // Mengakhiri pembuatan PDF

    // Setelah PDF selesai, kirimkan file ke client
    doc.on('finish', () => {
      return response.download(filePath, filename, (err) => {
        if (err) {
          return response.status(500).json({ message: 'Error generating PDF: ' + err.message });
        }
      });
    });

  } catch (error) {
    return response.status(500).json({
      message: error.message,
    });
  }
};
