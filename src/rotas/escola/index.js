const rota = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const md5 = require("md5");
const middleware = require("../../middlewares/autenticacao");

//rota.use(middleware);

rota.get("/api/v1/escola/cidade/:nome", middleware, async (req, res) => {
  const nome = req.params.nome;

  if (!nome) {
    return res.status(400).send("Solicitação incorreta.");
  }

  await prisma.escola
    .findMany({
      where: {
        cidade_escola: nome.trim(),
      },
      orderBy: {
        nome_escola: "asc",
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
