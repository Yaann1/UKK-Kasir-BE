// Memanggil library md5 untuk hashing password
const md5 = require("md5");
// Memanggil library jsonwebtoken untuk membuat token JWT
const jwt = require("jsonwebtoken");

// Mengimpor validationResult dari express-validator untuk validasi input
const { validationResult } = require("express-validator");

// Memanggil model user dari file model
const modeluser = require("../models/index").user;

// Fungsi untuk mengambil semua data user
exports.getDatauser = (request, response) => {
    modeluser.findAll()
        .then(result => response.json(result))
        .catch(error => response.json({ message: error.message }));
};

// Fungsi untuk mencari user berdasarkan keyword
exports.findUser = async (request, response) => {
    const keyword = request.body.keyword;
    const { Op } = require("sequelize");

    try {
        const datauser = await modeluser.findAll({
            where: {
                [Op.or]: [
                    { username: { [Op.like]: `%${keyword}%` } },
                    { nama_user: { [Op.like]: `%${keyword}%` } },
                    { role: { [Op.like]: `%${keyword}%` } }
                ]
            }
        });
        return response.json(datauser);
    } catch (error) {
        return response.json({ message: error.message });
    }
};

// Fungsi untuk menambahkan data user baru
exports.addDatauser = (request, response) => {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.json(errors.array());
    }

    const newuser = {
        nama_user: request.body.nama_user,
        username: request.body.username,
        password: md5(request.body.password),
        role: request.body.role,
    };

    modeluser.create(newuser)
        .then(() => response.json({ message: "Data user berhasil ditambahkan" }))
        .catch(error => response.json({ message: error.message }));
};

// Fungsi untuk mengedit data user yang sudah ada
exports.editDatauser = (request, response) => {
    const id = request.params.id_user;
    const datauser = {
        nama_user: request.body.nama_user,
        username: request.body.username,
        password: md5(request.body.password),
        role: request.body.role,
    };

    modeluser.update(datauser, { where: { id_user: id } })
        .then(() => response.json({ message: "Data user berhasil diedit" }))
        .catch(error => response.json({ message: error.message }));
};

// Fungsi untuk menghapus data user berdasarkan id_user
exports.deleteDatauser = (request, response) => {
    const id = request.params.id_user;

    modeluser.destroy({ where: { id_user: id } })
        .then(() => response.json({ message: "Data user berhasil dihapus" }))
        .catch(error => response.json({ message: error.message }));
};

// Fungsi untuk melakukan autentikasi user
exports.authentication = async (request, response) => {
    const data = {
        username: request.body.username,
        password: md5(request.body.password),
    };

    try {
        const result = await modeluser.findOne({ where: data });

        if (result) {
            const payload = JSON.stringify(result);
            const secretKey = "Sequelize itu sangat menyenangkan";
            const token = jwt.sign(payload, secretKey);

            return response.json({
                logged: true,
                token: token,
                dataUser: result,
            });
        } else {
            return response.json({
                logged: false,
                message: "invalid username or password",
            });
        }
    } catch (error) {
        return response.json({ message: error.message });
    }
};
