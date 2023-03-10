const rota = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const middleware = require("../../middlewares/autenticacao");
const prisma = new PrismaClient();

const { uploadAvatar } = require("../../libs/multer");

const { uploadFileAvatar } = require("../../controllers/index.controllers");

rota.post("/api/v1/upload/avatar/:id", uploadAvatar, uploadFileAvatar);

/*
const multer = require("multer");
const parser = multer({ dest: "public/uploads/" });

const storage = multer.diskStorage ({
  destination: "public/uploads/",
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_image_${file.originalname}`);
  },
});

const upload = multer({ storage: storage }).single("avatar");

rota.post("/api/v1/upload/avatar/:id", upload, async function (req, res) {
  const id = req.params.id;

  var now = new Date();
  now.setHours(now.getHours() - 3);

  await prisma.usuario
    .update({
      where: { codigo: parseInt(id) },
      data: { url_avatar: req.file.path, alterado: now },
    })
    .then(() => {
      return res.status(200).send("E-mail alterado com sucesso!");
    })
    .catch(() => {
      return res
        .status(500)
        .send("Ocorreu um erro inesperado ao alterar o e-mail da conta.");
    });
});

*/

module.exports = rota;
