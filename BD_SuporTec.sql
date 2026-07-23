CREATE DATABASE railway;
USE railway;

CREATE TABLE usuario (
    id_usuario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('cliente', 'tecnico') NOT NULL,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conquista (
    id_conquista INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL
);

CREATE TABLE chamado (
    id_chamado INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    categoria ENUM('Hardware', 'Software', 'Rede', 'Acesso') NOT NULL,
    prioridade ENUM('Baixa', 'Media', 'Alta') NOT NULL,
    situacao ENUM('Novo', 'Em andamento', 'Aguardando cliente', 'Resolvido', 'Cancelado') NOT NULL DEFAULT 'Novo',
    tipo_atendimento ENUM('Presencial', 'Remoto') NOT NULL,
    endereco VARCHAR(255) DEFAULT NULL,
    empresa VARCHAR(100) DEFAULT NULL,
    setor VARCHAR(100) DEFAULT NULL,
    sala VARCHAR(50) DEFAULT NULL,
    tipo_contato ENUM('WhatsApp', 'Telefone', 'Email', 'Teams', 'LinkedIn') NOT NULL,
    contato VARCHAR(100) NOT NULL,
    data_abertura DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_fechamento DATETIME DEFAULT NULL,
    ultima_atualizacao DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    fk_cliente INT NOT NULL,
    fk_tecnico INT DEFAULT NULL,
    CONSTRAINT fk_chamado_cliente
        FOREIGN KEY (fk_cliente)
        REFERENCES usuario(id_usuario),
    CONSTRAINT fk_chamado_tecnico
        FOREIGN KEY (fk_tecnico)
        REFERENCES usuario(id_usuario)
);

CREATE TABLE mensagem (
    id_mensagem INT AUTO_INCREMENT PRIMARY KEY,
    mensagem TEXT NOT NULL,
    data_envio DATETIME DEFAULT CURRENT_TIMESTAMP,
    fk_usuario INT NOT NULL,
    fk_chamado INT NOT NULL,
    CONSTRAINT fk_mensagem_usuario
        FOREIGN KEY (fk_usuario)
        REFERENCES usuario(id_usuario),
    CONSTRAINT fk_mensagem_chamado
        FOREIGN KEY (fk_chamado)
        REFERENCES chamado(id_chamado)
);

CREATE TABLE historico_chamado (
    id_historico INT AUTO_INCREMENT PRIMARY KEY,
    situacao VARCHAR(50) NOT NULL,
    descricao TEXT NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    fk_chamado INT NOT NULL,
    CONSTRAINT fk_historico
        FOREIGN KEY (fk_chamado)
        REFERENCES chamado(id_chamado)
);

CREATE TABLE avaliacao (
    id_avaliacao INT AUTO_INCREMENT PRIMARY KEY,
    nota INT NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT, 
    data DATETIME DEFAULT CURRENT_TIMESTAMP,
    fk_chamado INT NOT NULL UNIQUE,
    CONSTRAINT fk_avaliacao
        FOREIGN KEY (fk_chamado)
        REFERENCES chamado(id_chamado)
);

CREATE TABLE usuario_conquista (
    fk_usuario INT NOT NULL,
    fk_conquista INT NOT NULL,
    data_desbloqueio DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (fk_usuario, fk_conquista),
    CONSTRAINT fk_uc_usuario
        FOREIGN KEY (fk_usuario)
        REFERENCES usuario(id_usuario),
    CONSTRAINT fk_uc_conquista
        FOREIGN KEY (fk_conquista)
        REFERENCES conquista(id_conquista)
);

SHOW TABLES;