const rota = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const middleware = require("../../middlewares/autenticacao");

rota.use(middleware);

rota.post("/api/v1/veiculo", async (req, res) => {
  const {
    codigo_usuario,
    codigo_motorista,
    veiculo_modelo,
    veiculo_marca,
    veiculo_ano,
    veiculo_placa,
    veiculo_renavam,
    veiculo_lugares,
  } = req.body;

  if (
    !codigo_usuario ||
    !codigo_motorista ||
    !veiculo_modelo ||
    !veiculo_marca ||
    !veiculo_ano ||
    !veiculo_placa ||
    !veiculo_renavam ||
    !veiculo_lugares
  ) {
    return res.status(400).send("Solicitação Incorreta.");
  }

  var now = new Date();
  now.setHours(now.getHours() - 3);

  if (veiculo_modelo.lenght < 5) {
    return res
      .status(400)
      .send("O modelo do veiculo precisa conter ao menos 5 caracteres.");
  }

  if (veiculo_modelo.lenght < 2) {
    return res
      .status(400)
      .send("A marca do veiculo precisa conter ao menos 2 caracteres.");
  }

  if (parseInt(veiculo_lugares) < 5) {
    return res.status(400).send("O veiculo precisa conter ao menos 5 lugares.");
  }

  const usuario_existe = prisma.usuario.findFirst({
    where: {
      codigo: parseInt(codigo_usuario),
    },
  });

  if (!usuario_existe) {
    return res
      .status(401)
      .send("Não foi encontrado nenhum usuário com o código informado.");
  }

  const motorista_existe = prisma.usuario.findFirst({
    where: {
      codigo: parseInt(codigo_motorista),
    },
  });

  if (!motorista_existe) {
    return res
      .status(401)
      .send("Não foi encontrado nenhum motorista com o código informado.");
  }

  const placa_existe = await prisma.veiculo_motorista.findFirst({
    where: {
      veiculo_placa: veiculo_placa.trim(),
    },
  });

  if (placa_existe) {
    return res
      .status(401)
      .send("Já existe um veículo cadastrado com a placa informada.");
  }

  const renavam_existe = await prisma.veiculo_motorista.findFirst({
    where: {
      veiculo_renavam: veiculo_renavam.trim(),
    },
  });

  if (renavam_existe) {
    return res
      .status(401)
      .send("Já existe um veículo cadastrado com o renavam informado.");
  }

  await prisma.veiculo_motorista
    .create({
      data: {
        codigo_usuario: parseInt(codigo_usuario),
        codigo_motorista: parseInt(codigo_motorista),
        veiculo_modelo: veiculo_modelo.trim(),
        veiculo_marca: veiculo_marca.trim(),
        veiculo_ano: veiculo_ano.trim(),
        veiculo_placa: veiculo_placa.trim(),
        veiculo_renavam: veiculo_renavam.trim(),
        veiculo_lugares: parseInt(veiculo_lugares),
        cadastrado: now,
        alterado: now,
        ativo: 1,
        excluido: 0,
      },
    })
    .then((e) => {
      res.status(200).json(e);
    })
    .catch(() => {
      res.status(500).send("Ocorreu um erro interno de servidor.");
    });
});

rota.put("/api/v1/veiculo/:id", async (req, res) => {
  const { id } = req.params;

  const {
    codigo_usuario,
    codigo_motorista,
    veiculo_modelo,
    veiculo_marca,
    veiculo_ano,
    veiculo_placa,
    veiculo_renavam,
    veiculo_lugares,
  } = req.body;

  if (
    !codigo_usuario ||
    !codigo_motorista ||
    !veiculo_modelo ||
    !veiculo_marca ||
    !veiculo_ano ||
    !veiculo_placa ||
    !veiculo_renavam ||
    !veiculo_lugares
  ) {
    return res.status(400).send("Solicitação Incorreta.");
  }

  var now = new Date();
  now.setHours(now.getHours() - 3);

  if (veiculo_modelo.lenght < 5) {
    return res
      .status(400)
      .send("O modelo do veiculo precisa conter ao menos 5 caracteres.");
  }

  if (veiculo_modelo.lenght < 2) {
    return res
      .status(400)
      .send("A marca do veiculo precisa conter ao menos 2 caracteres.");
  }

  if (parseInt(veiculo_lugares) < 5) {
    return res.status(400).send("O veiculo precisa conter ao menos 5 lugares.");
  }

  const veiculo_existe = prisma.veiculo_motorista.findFirst({
    where: {
      codigo: parseInt(id),
    },
  });

  if (!veiculo_existe) {
    return res
      .status(404)
      .send("Não foi encontrado nenhum veiculo com o código informado.");
  }

  const usuario_existe = prisma.usuario.findFirst({
    where: {
      codigo: parseInt(codigo_usuario),
    },
  });

  if (!usuario_existe) {
    return res
      .status(404)
      .send("Não foi encontrado nenhum usuário com o código informado.");
  }

  const motorista_existe = prisma.usuario.findFirst({
    where: {
      codigo: parseInt(codigo_motorista),
    },
  });

  if (!motorista_existe) {
    return res
      .status(404)
      .send("Não foi encontrado nenhum motorista com o código informado.");
  }

  const placa_existe = await prisma.veiculo_motorista.findFirst({
    where: {
      veiculo_placa: veiculo_placa.trim(),
      NOT: {
        codigo: parseInt(id),
      },
    },
  });

  if (placa_existe) {
    return res
      .status(401)
      .send("Já existe um veículo cadastrado com a placa informada.");
  }

  const renavam_existe = await prisma.veiculo_motorista.findFirst({
    where: {
      veiculo_renavam: veiculo_renavam.trim(),
      NOT: {
        codigo: parseInt(id),
      },
    },
  });

  if (renavam_existe) {
    return res
      .status(401)
      .send("Já existe um veículo cadastrado com o renavam informado.");
  }

  await prisma.veiculo_motorista
    .update({
      where: {
        codigo: parseInt(id),
      },
      data: {
        codigo_motorista: parseInt(codigo_motorista),
        veiculo_modelo: veiculo_modelo.trim(),
        veiculo_marca: veiculo_marca.trim(),
        veiculo_ano: veiculo_ano.trim(),
        veiculo_placa: veiculo_placa.trim(),
        veiculo_renavam: veiculo_renavam.trim(),
        veiculo_lugares: parseInt(veiculo_lugares),
        alterado: now,
      },
    })
    .then(() => {
      res.status(200).send("O veiculo foi atualizado com sucesso!");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Ocorreu um erro interno de servidor.");
    });
});

rota.delete("/api/v1/veiculo/:id", async (req, res) => {
  const { id } = req.params;
  const { usuario } = req.headers;

  if (!usuario) {
    return res.status(400).send("Solicitação Incorreta.");
  }

  var now = new Date();
  now.setHours(now.getHours() - 3);

  const usuario_existe = prisma.usuario.findFirst({
    where: {
      codigo: parseInt(usuario),
    },
  });

  if (!usuario_existe) {
    return res
      .status(404)
      .send("Não foi encontrado nenhum usuário com o código informado.");
  }

  const veiculo_existe = prisma.veiculo_motorista.findFirst({
    where: {
      codigo: parseInt(id),
    },
  });

  if (!veiculo_existe) {
    return res
      .status(404)
      .send("Não foi encontrado nenhum veiculo com o código informado.");
  }

  await prisma.veiculo_motorista
    .update({
      where: {
        codigo: parseInt(id),
      },
      data: {
        excluido: 1,
        alterado: now,
      },
    })
    .then(() => {
      res.status(200).send("O veiculo foi excluido com sucesso!");
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Ocorreu um erro interno de servidor.");
    });
});

rota.get("/api/v1/veiculo", async (req, res) => {
  const id = req.headers.usuario;

  if (!id) {
    return res.status(400).send("Solicitação Incorreta");
  }

  const usuario_existe = await prisma.usuario.findFirst({
    where: {
      codigo: parseInt(id),
    },
  });

  if (!usuario_existe) {
    return res
      .status(404)
      .send("Nenhum usuário foi encontrado com o ID informado.");
  }

  await prisma.veiculo_motorista
    .findMany({
      where: {
        codigo_usuario: parseInt(id),
        excluido: 0,
        ativo: 1,
      },
    })
    .then((e) => {
      return res.status(200).json(e);
    })
    .catch(() => {
      return res.status(500).send("Ocorreu um erro interno de servidor.");
    });
});

rota.get("/api/v1/veiculo/:id", async (req, res) => {
  const usuario = req.headers.usuario;
  const veiculo = req.params.id;

  if (!usuario) {
    return res.status(400).send("Solicitação Incorreta. Informe o usuário.");
  }

  if (!veiculo) {
    return res.status(400).send("Solicitação Incorreta. Informe o veiculo.");
  }

  const usuario_existe = await prisma.usuario.findFirst({
    where: {
      codigo: parseInt(usuario),
    },
  });

  if (!usuario_existe) {
    return res
      .status(404)
      .send("Nenhum usuário foi encontrado com o ID informado.");
  }

  await prisma.veiculo_motorista
    .findFirst({
      where: {
        codigo: parseInt(veiculo),
        codigo_usuario: parseInt(usuario),
        excluido: 0,
        ativo: 1,
      },
    })
    .then((e) => {
      return res.status(200).json(e);
    })
    .catch(() => {
      return res.status(500).send("Ocorreu um erro interno de servidor.");
    });
});

module.exports = rota;
