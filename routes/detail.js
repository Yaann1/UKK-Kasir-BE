const express = require(`express`);
const app = express();
const detailController = require("../controllers/detailController");
const authorization = require("../middlewares/authorization");

app.use(express.json());

// Hanya 'manager' yang bisa mengakses endpoint berikut
app.get("/", authorization.authorization, detailController.getDataDetail);
app.post("/", authorization.authorization, detailController.addDataDetail);
app.put("/:id_detail", authorization.authorization, detailController.editDataDetail);
app.delete("/:id_detail", authorization.authorization, detailController.deleteDataDetail);

module.exports = app;
