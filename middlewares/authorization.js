const jwt = require('jsonwebtoken');

exports.authorization = (request, response, next) => {
    const header = request.headers.authorization;
    const token = header && header.split(" ")[1]; // Mengambil token setelah 'Bearer'

    if (!token) {
        return response.status(401).json({
            message: 'Unauthorized - Token not provided'
        });
    }

    //Digunakan dalam proses enkripsi dan dekripsi data 
    //Dalam konteks JSON Web Tokens (JWT)
    const secretKey = 'Sequelize itu sangat menyenangkan';

    jwt.verify(token, secretKey, (error, user) => {
        if (error) {
            return response.status(403).json({
                message: 'Invalid Token'
            });
        }

        // Akses untuk kasir
        if (user.role === 'kasir') {
            // Transaksi dan cetak nota hanya dapat diakses kasir
            if (request.originalUrl.includes("/transaksi") || 
                request.originalUrl.includes("/cetak") || 
                request.originalUrl.includes("/meja") || 
                request.originalUrl.includes("/menu")) {
                return next();
            } else {
                return response.status(403).json({
                    message: 'Token Salah'
                });
            }
        }

        // Akses untuk manajer
        if (user.role === 'manajer') {
            // Detail dan filtering tanggal hanya dapat diakses manajer
            if (request.originalUrl.includes("/detail") || 
                request.originalUrl.includes("/tgl")) {
                return next();
            } else {
                return response.status(403).json({
                    message: 'Token Salah'
                });
            }
        }

        // Akses untuk admin
        if (user.role === 'admin') {
            // User menu dan meja hanya dapat diakses admin
            if (request.originalUrl.includes("/user") || 
                request.originalUrl.includes("/meja") || 
                request.originalUrl.includes("/menu")) {
                return next();
            } else {
                return response.status(403).json({
                    message: 'Token Salah'
                });
            }
        }

        // Jika tidak ada yang cocok
        return response.status(403).json({
            message: 'Token Salah'
        });
    });
};
