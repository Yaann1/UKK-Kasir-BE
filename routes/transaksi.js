const express = require(`express`);
const app = express();
const transaksiController = require("../controllers/transaksiController");
const authorization = require("../middlewares/authorization");

app.use(express.json());

// endpoint get data transaksi
app.get("/", authorization.authorization, transaksiController.getDataTransaksi);

// Hanya 'manager' yang bisa mengakses endpoint berikut
app.post("/tgl", authorization.authorization, transaksiController.filterTgl);

// endpoint add data transaksi
app.post("/", authorization.authorization, transaksiController.addDataTransaksi);

// endpoint edit transaksi
app.put("/:id_transaksi", authorization.authorization, transaksiController.editDataTransaksi);

// endpoint delete transaksi
app.delete("/:id_transaksi", authorization.authorization, transaksiController.deleteDataTransaksi);

// endpoint cetak struk
app.get("/cetak/:id_transaksi", authorization.authorization, transaksiController.printReceipt);

module.exports = app;
