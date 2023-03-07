const express = require("express");

const cors = require("cors");

const inicio = require("./rotas/inicio");
const usuario = require("./rotas/usuarios");
const autenticacao = require("./rotas/autenticacao");
const veiculo = require("./rotas/veiculo");
const usuarioFinanceiro = require("./rotas/usuariosFinanceiro");
const cep = require("./rotas/cep");
const escola = require("./rotas/escola");
const periodo = require("./rotas/periodo");
const tipoTransporte = require("./rotas/tipoTransporte");
const fileUploads = require("./rotas/upload");

const { application } = require("express");

const server = express();

//Liberar o Cors
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, cep, usuario"
  );
  if (req.method === "OPTIONS") {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization, cep, usuario"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    return res.status(200).json({});
  }
  next();
  ("");
});

server.use(express.json());
server.use(cors());
server.use(autenticacao);
server.use(inicio);
server.use(usuario);
server.use(veiculo);
server.use(usuarioFinanceiro);
server.use(cep);
server.use(escola);
server.use(periodo);
server.use(tipoTransporte);
server.use(fileUploads);

server.use("/public", express.static("public"));
server.use(express.static("public"));

server.listen(process.env.PORT || 2258, () => {
  console.log("AVISO: Sucesso ao iniciar o serviço da API!");
});
