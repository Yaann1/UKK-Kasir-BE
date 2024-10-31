const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8080;

// Middleware untuk memungkinkan komunikasi lintas domain
app.use(cors());

// Middleware untuk menerima data JSON
app.use(express.json());

// Mengatur folder statis untuk file yang di-upload
app.use(express.static(__dirname + "/image"));

// Daftar routes
let routes = [
    { prefix: '/menu', route: require('./routes/menu') },
    { prefix: '/meja', route: require('./routes/meja') },
    { prefix: '/user', route: require('./routes/user') }, // Pastikan ini ada
    { prefix: '/transaksi', route: require('./routes/transaksi') },
    { prefix: '/detail', route: require('./routes/detail') },
];

// Memasukkan semua routes ke dalam server
for (let i = 0; i < routes.length; i++) {
    app.use(routes[i].prefix, routes[i].route);
}

// Menjalankan server pada port yang telah ditentukan
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
