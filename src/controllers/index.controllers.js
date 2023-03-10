const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const uploadFileAvatar = async (req, res) => {
  const id = req.params.id;

  var now = new Date();
  now.setHours(now.getHours() - 3);

  await prisma.usuario
    .update({
      where: { codigo: parseInt(id) },
      data: { url_avatar: req.file.location, alterado: now },
    })
    .then(() => {
      return res.status(200).send("Imagem alterada com sucesso!");
    })
    .catch(() => {
      return res.status(500).send("Ocorreu um erro inesperado");
    });
};

module.exports = {
  uploadFileAvatar,
};
