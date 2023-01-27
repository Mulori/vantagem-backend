const rota = require("express").Router();

rota.get("/", async (requisicao, resposta) => {
  var now = new Date();

  return resposta
    .status(200)
    .send("Olá! Seja bem-vindo ao VANTAGEM. v1.0.0 \n\r Acessado em: " + now);
});

module.exports = rota;
