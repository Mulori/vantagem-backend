const rota = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const md5 = require("md5");
const middleware = require("../../middlewares/autenticacao");

//ota.use(middleware);

rota.post("/api/v1/usuariofinanceiro", middleware, async (req, res) => {
  const { codigo_usuario, tipo_chave_pix, chave_pix } = req.body;

  var now = new Date();
  now.setHours(now.getHours() - 3);

  if (!codigo_usuario || !tipo_chave_pix || !chave_pix) {
    return res
      .status(400)
      .send("Solicitação Incorreta. Preencha todos os campos!");
  }

  const usuario_existe = await prisma.usuario.findFirst({
    where: {
      codigo: parseInt(codigo_usuario),
    },
  });

  if (!usuario_existe) {
    return res.status(404).send("Nenhum usuário encontrado com ID informado.");
  }

  const usuario_financeiro = await prisma.usuario_financeiro.findFirst({
    where: {
      codigo_usuario: parseInt(codigo_usuario),
    },
  });

  if (usuario_financeiro) {
    await prisma.usuario_financeiro
      .update({
        where: {
          codigo: parseInt(usuario_financeiro.codigo),
        },
        data: {
          tipo_chave_pix: parseInt(tipo_chave_pix),
          chave_pix: chave_pix.trim(),
          alterado: now,
        },
      })
      .then((ret) => {
        return res
          .status(200)
          .send("As informações financeiras foram alteradas com sucesso!");
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(500)
          .send("Ocorreu um erro interno de servidor. Tente novamente!");
      });
  } else {
    await prisma.usuario_financeiro
      .create({
        data: {
          codigo_usuario: parseInt(codigo_usuario),
          tipo_chave_pix: parseInt(tipo_chave_pix),
          chave_pix: chave_pix.trim(),
          cadastrado: now,
          alterado: now,
        },
      })
      .then((ret) => {
        return res
          .status(200)
          .send("As informações financeiras foram inseridas com sucesso!");
      })
      .catch((err) => {
        console.log(err);
        return res
          .status(500)
          .send("Ocorreu um erro interno de servidor. Tente novamente!");
      });
  }
});

module.exports = rota;
