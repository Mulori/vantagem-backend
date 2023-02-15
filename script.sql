
//Preenchido pela API
create table estado(
	codigo int AUTO_INCREMENT primary key,
	nome varchar(150) not null,
	uf char(2) not null,
	regiao varchar(100) not null
);

//Preenchido pela API
create table cidade(
	codigo int AUTO_INCREMENT primary key,
	id_cidade int not null,
	UF char(2) not null,
	ibge_id int not null,
	nome varchar(255) not null
);

//Preenchido pela API
create table bairro(
	codigo int AUTO_INCREMENT primary key,
	id_cidade int not null,
	id_bairro int not null,
	nome varchar(255) not null
);

//Preenchido pelo VANTAGEM
create table tipo_transporte (
	codigo int AUTO_INCREMENT primary key,
	descricao varchar(255) not null
);

//Preenchido pelo VANTAGEM
create table periodo (
	codigo int AUTO_INCREMENT primary key,
	descricao varchar(255) not null
);

//Preenchido pelo VANTAGEM
create table opcional (
	codigo int AUTO_INCREMENT primary key,
	descricao varchar(255) not null
);

insert into opcional (descricao) VALUES ('Ar Condicionado');
insert into opcional (descricao) VALUES ('TV/DVD/Multimedia');
insert into opcional (descricao) VALUES ('Wifi');
insert into opcional (descricao) VALUES ('Leito');
insert into opcional (descricao) VALUES ('Semi-Leito');
insert into opcional (descricao) VALUES ('Banheiro');
insert into opcional (descricao) VALUES ('Freezer');

//Preenchido pelo VANTAGEM
create table escola (
	codigo int AUTO_INCREMENT primary key,
	nome_escola varchar(150) not null,
	endereco_escola varchar(255) not null,
	bairro_escola varchar(100) not null,
	numero_escola varchar(20) not null,
	cidade_escola varchar(150) not null,
	estado_escola varchar(150) not null,
	cep_escola varchar(20) not null,
	ativo int not null
);

create table usuario (
	codigo int AUTO_INCREMENT primary key,
	nome varchar(100) not null,
	sobrenome varchar(100) not null,
	email varchar(255) not null,
	senha varchar(1000) not null,
	tipo_cadastro int not null,
	documento varchar(15) not null,
	cadastrado datetime not null,	
	alterado datetime not null,
	data_nascimento date,
	url_avatar varchar(8000),
	cnh varchar(15),
	celular varchar(12),
	sobre_mim varchar(500),
	rg varchar(15) not null,
	endereco varchar(100) not null,
	numero varchar(10) not null,
	complemento varchar(150),
	cep varchar(10) not null,
	codigo_bairro int not null,
	acesso int not null,
	excluido int not null,
	constraint fk_usuario_bairro foreign key (codigo_bairro) references bairro (codigo)
);

create table usuario_escola(
	codigo int AUTO_INCREMENT primary key,
	codigo_usuario int not null,
	codigo_escola int not null,
	ativo int not null,
	constraint fk_codigo_usuario foreign key (codigo_usuario) references usuario (codigo),
	constraint fk_codigo_escolaa foreign key (codigo_escola) references escola (codigo)	
);

create table rota_usuario(
	codigo int AUTO_INCREMENT primary key,
	nome_rota varchar(100) not null,
	codigo_usuario int not null,
	constraint fk_codigo_usuario_rota foreign key (codigo_usuario) references usuario (codigo)
);

create table detalhe_rota_usuario(
	codigo int AUTO_INCREMENT primary key,
	codigo_rota int not null,
	id_bairro int not null,
	constraint fk_id_bairro_rota foreign key (id_bairro) references bairro (codigo)
);

create table veiculo_motorista (
	codigo int AUTO_INCREMENT primary key,
	codigo_usuario int not null,
	codigo_motorista int not null,
	veiculo_modelo varchar(150) not null,
	veiculo_marca varchar(100) not null,
	veiculo_ano varchar(20) not null,
	veiculo_placa varchar(10) not null,
	veiculo_renavam varchar(13) not null,
	veiculo_lugares int not null,
	cadastrado datetime not null,
	alterado datetime not null,
	ativo int not null,
	excluido int not null,
	constraint fk_usuario_veiculo foreign key (codigo_usuario) references usuario (codigo),
	constraint fk_motorista_veiculo foreign key (codigo_motorista) references usuario (codigo)
);

create table veiculo_motorista_opcional (
	codigo int AUTO_INCREMENT primary key,
	codigo_veiculo_motorista int not null,
	codigo_opcional int not null,
	possui char(3) not null,
	constraint fk_veiculo_motorista foreign key (codigo_veiculo_motorista) references veiculo_motorista (codigo),
	constraint fk_opcional foreign key (codigo_opcional) references opcional (codigo)
);

create table veiculo_motorista_imagem(
	codigo int AUTO_INCREMENT primary key,
	codigo_veiculo_motorista int not null,
	url_imagem varchar(5000) not null,
	constraint fk_imagem_veiculo_motorista foreign key (codigo_veiculo_motorista) references veiculo_motorista (codigo)
);

create table responsavel_aluno (
	codigo int AUTO_INCREMENT primary key,
	codigo_motorista int not null,
	nome_completo varchar(255) not null,
	cpf_cnpj varchar(14) not null,
	data_nascimento date,
	email varchar(255) not null,
	telefone varchar(30),
	celular varchar(30) not null,
	cadastrado datetime not null,
	alterado datetime not null,
	ativo int not null,
	excluido int not null,
	constraint fk_codigo_motorista_responsavel foreign key (codigo_motorista) references usuario (codigo)
);


create table aluno(
	codigo int AUTO_INCREMENT primary key,
	codigo_motorista int not null,
	codigo_escola int not null,
	codigo_periodo int not null,
	codigo_tipo_transporte int not null,
	codigo_responsavel int not null,
	codigo_veiculo int not null,
	nome_completo varchar(255) not null,
	documento varchar(50),
	data_nascimento date not null,
	valor_mensalidade decimal(14,2) not null,
	vencimento_mensalidade datetime not null,
	observacao varchar(5000),
	constraint fk_codigo_escola_aluno foreign key (codigo_escola) references escola (codigo),
	constraint fk_codigo_periodo_aluno foreign key (codigo_periodo) references periodo (codigo),
	constraint fk_codigo_veiculo_aluno foreign key (codigo_veiculo) references veiculo_motorista (codigo),
	constraint fk_codigo_tipo_transporte_aluno foreign key (codigo_tipo_transporte) references tipo_transporte (codigo),
	constraint fk_codigo_motorista_aluno foreign key (codigo_motorista) references usuario (codigo)
);

create table mensalidade(
	codigo int AUTO_INCREMENT primary key,
	codigo_motorista int not null,
	codigo_aluno int not null,
	ano int not null,
	janeiro_valor decimal(14,2) not null,
	janeiro_recebido decimal(14,2) not null,
	janeiro_pagamento datetime,
	fevereiro_valor decimal(14,2) not null,
	fevereiro_recebido decimal(14,2) not null,
	fevereiro_pagamento datetime,
	marco_valor decimal(14,2) not null,
	marco_recebido decimal(14,2) not null,
	marco_pagamento datetime,
	abril_valor decimal(14,2) not null,
	abril_recebido decimal(14,2) not null,
	abril_pagamento datetime,
	maio_valor decimal(14,2) not null,
	maio_recebido decimal(14,2) not null,
	maio_pagamento datetime,
	junho_valor decimal(14,2) not null,
	junho_recebido decimal(14,2) not null,
	junho_pagamento datetime,
	julho_valor decimal(14,2) not null,
	julho_recebido decimal(14,2) not null,
	julho_pagamento datetime,
	agosto_valor decimal(14,2) not null,
	agosto_recebido decimal(14,2) not null,
	agosto_pagamento datetime,
	setembro_valor decimal(14,2) not null,
	setembro_recebido decimal(14,2) not null,
	setembro_pagamento datetime,
	outubro_valor decimal(14,2) not null,
	outubro_recebido decimal(14,2) not null,
	outubro_pagamento datetime,
	novembro_valor decimal(14,2) not null,
	novembro_recebido decimal(14,2) not null,
	novembro_pagamento datetime,
	dezembro_valor decimal(14,2) not null,
	dezembro_recebido decimal(14,2) not null,
	dezembro_pagamento datetime,
	constraint fk_codigo_motorista_mensalidade foreign key (codigo_motorista) references usuario (codigo),
	constraint fk_codigo_aluno_mensalidade foreign key (codigo_aluno) references aluino (codigo)
);

create table usuario_financeiro (
	codigo int AUTO_INCREMENT primary key,
	codigo_usuario int not null,
	tipo_chave_pix int not null,
	chave_pix varchar(500) not null,
	cadastrado datetime not null,
	alterado datetime not null,
	constraint fk_usuario_financeiro foreign key (codigo_usuario) references usuario (codigo)
);

