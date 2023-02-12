const rota = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

rota.get("/api/v1/cep/estado", async (req, res) => {
  await prisma.estado
    .findMany({ orderBy: { nome: "asc" } })
    .then((e) => {
      return res.status(200).json(e);
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .send("Ocorreu um erro de servidor. Tente Novamente!");
    });
});

rota.get("/api/v1/cep/estado/:uf/cidade", async (req, res) => {
  const { uf } = req.params;

  if (!uf) {
    return res.status(400).send("Solicitação Incorreta. Nenhuma UF informada.");
  }

  await prisma.cidade
    .findMany({
      where: {
        UF: uf,
      },
      orderBy: { nome: "asc" },
    })
    .then((e) => {
      return res.status(200).json(e);
    })
    .catch((err) => {
      console.log(err);
      return res
        .status(500)
        .send("Ocorreu um erro de servidor. Tente Novamente!");
    });
});

rota.get("/api/v1/cep/estado/cidade/:id/bairro", async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .send("Solicitação Incorreta. Nenhum ID de cidade informado.");
  }

  await prisma.bairro
    .findMany({
      where: {
        id_cidade: parseInt(id),
      },
      orderBy: { nome: "asc" },
    })
    .then((e) => {
      return res.status(200).json(e);
    })
    .catch((err) => {
      return res
        .status(500)
        .send("Ocorreu um erro de servidor. Tente Novamente!");
    });
});

module.exports = rota;
