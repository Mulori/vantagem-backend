const rota = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const md5 = require("md5");
const middleware = require("../../middlewares/autenticacao");

rota.use(middleware);

rota.get("/api/v1/tipotransporte", async (req, res) => {
  await prisma.tipo_transporte
    .findMany({
      orderBy: {
        codigo: "asc",
      },
    })
    .then((e) => {
      return res.status(200).json(e);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).json("Ocorreu um erro do servidor");
    });
});

module.exports = rota;
