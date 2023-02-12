const rota = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const md5 = require("md5");
const validator = require("email-validator");
const jwt = require("jsonwebtoken");
const authConfig = require("../../config/autenticacao.json");
const validaDocumento = require("../../middlewares/validaCpfCnpj");

function GenerateToken(param = {}) {
  return jwt.sign({ param }, authConfig.secret);
}

rota.post("/api/v1/registro", async (req, res) => {
  const {
    nome,
    sobrenome,
    email,
    confirma_email,
    senha,
    tipo_cadastro,
    documento,
    data_nascimento,
    celular,
    rg,
    endereco,
    numero,
    complemento,
    cep,
    codigo_bairro,
  } = req.body;

  var now = new Date();
  var date = new Date(data_nascimento);
  var acesso = 0;
  now.setHours(now.getHours() - 3);

  if (
    !nome ||
    !sobrenome ||
    !email ||
    !confirma_email ||
    !senha ||
    !tipo_cadastro ||
    !documento ||
    !data_nascimento ||
    !celular ||
    !rg ||
    !endereco ||
    !numero ||
    !cep ||
    !codigo_bairro
  ) {
    return res
      .status(400)
      .send("Solicitação Incorreta. Por favor valide os campos.");
  }

  if (!validator.validate(email.trim())) {
    return res.status(400).send("O e-mail informado é inválido.");
  }

  if (!validaDocumento(documento)) {
    return res.status(400).send("O CPF ou CNPJ informado é invalido.");
  }

  const validaEmail = await prisma.usuario.findFirst({
    where: { email: email.trim() },
  });

  if (validaEmail) {
    return res.status(400).send("O e-mail informado já está cadastrado.");
  }

  if (confirma_email.trim() !== email.trim()) {
    return res.status(400).send("Os e-mails não são correspondentes.");
  }

  const validaDoc = await prisma.usuario.findFirst({
    where: { documento: documento.trim() },
  });

  if (validaDoc) {
    return res
      .status(403)
      .send("Já existe um usuário com o CPF ou CNPJ informado.");
  }

  const validaRG = await prisma.usuario.findFirst({
    where: { rg: rg.trim() },
  });

  if (validaRG) {
    return res.status(403).send("Já existe um usuário com o RG informado.");
  }

  const validaBairro = await prisma.bairro.findFirst({
    where: { codigo: parseInt(codigo_bairro) },
  });

  if (!validaBairro) {
    return res
      .status(404)
      .send("Nenhum bairro foi encontrado em nossa base com o ID informado.");
  }

  if (senha.length < 6) {
    return res.status(400).send("A senha deve conter no mínimo 6 caractéres.");
  }

  switch (parseInt(tipo_cadastro)) {
    case 1: //Conta de Aluno já fica liberada.
      acesso = 1;
      break;
    case 2: //Conta de motorista tem que passar por aprovação.
      acesso = 0;
      break;
  }

  await prisma.usuario
    .create({
      data: {
        nome: nome.trim(),
        sobrenome: sobrenome.trim(),
        email: email.trim(),
        senha: md5(senha.trim()),
        tipo_cadastro: parseInt(tipo_cadastro),
        documento: documento.trim(),
        cadastrado: now,
        alterado: now,
        data_nascimento: date,
        celular: celular.trim(),
        rg: rg.trim(),
        endereco: endereco.trim(),
        numero: numero.trim(),
        complemento: complemento.trim(),
        cep: cep.trim(),
        codigo_bairro: parseInt(codigo_bairro),
        acesso: parseInt(acesso),
        excluido: 0,
      },
    })
    .then((e) => {
      return res.status(200).send({
        codigo: e.codigo.toString(),
        nome: e.nome,
        sobrenome: e.sobrenome,
        email: e.email,
        cadastrado: e.cadastrado,
        tipo_cadastro: e.tipo_cadastro,
      });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send("Ocorreu um erro inesperado.");
    });
});

rota.post("/api/v1/acesso", async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res
      .status(400)
      .send("Solicitação Incorreta. Por favor valide os campos.");
  }

  if (!validator.validate(email.trim())) {
    return res.status(400).send("O e-mail informado é inválido.");
  }

  if (senha.length < 6) {
    return res.status(400).send("A senha deve conter no mínimo 6 caractéres.");
  }

  const validaUsuario = await prisma.usuario.findFirst({
    where: { email: email.trim(), senha: md5(senha.trim()), excluido: 0 },
  });

  if (!validaUsuario) {
    return res.status(404).send("E-mail e/ou senha incorretos.");
  }

  if (validaUsuario.acesso === 0) {
    return res
      .status(403)
      .send(
        "Sua conta ainda não foi verificada. Por favor, aguarde mais um tempo para que a mesma seja autorizada."
      );
  }

  return res.status(200).send({
    codigo: validaUsuario.codigo.toString(),
    nome: validaUsuario.nome,
    sobrenome: validaUsuario.sobrenome,
    email: validaUsuario.email,
    tipo_cadastro: validaUsuario.tipo_cadastro,
    cadastrado: validaUsuario.cadastrado,
    token:
      "Bearer " + GenerateToken({ codigo: validaUsuario.codigo.toString() }),
  });
});

module.exports = rota;
