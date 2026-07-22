CREATE DATABASE BD_SuporTec;
USE BD_SuporTec;

CREATE TABLE Usuario (
    id_usuario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('cliente', 'tecnico') NOT NULL,
    data_cadastro DATETIME NOT NULL
);

CREATE TABLE Conquista (
    id_conquista INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL
);

CREATE TABLE Chamado (
    id_chamado INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    categoria ENUM('Hardware', 'Software', 'Rede', 'Acesso') NOT NULL,
    prioridade ENUM('Baixa', 'Media', 'Alta') NOT NULL,
    situacao ENUM(
        'Novo',
        'Em andamento',
        'Aguardando cliente',
        'Resolvido',
        'Cancelado'
    ) NOT NULL,
    tipo_atendimento ENUM('Presencial', 'Remoto') NOT NULL,
    endereco VARCHAR(255),
    empresa VARCHAR(100),
    setor VARCHAR(100),
    sala VARCHAR(50),
    tipo_contato ENUM(
        'WhatsApp',
        'Telefone',
        'Email',
        'Teams',
        'LinkedIn'
    ) NOT NULL,
    contato VARCHAR(100) NOT NULL,
    data_abertura DATETIME NOT NULL,
    data_fechamento DATETIME,
    fk_cliente INT NOT NULL,
    fk_tecnico INT,

    FOREIGN KEY (fk_cliente)
        REFERENCES Usuario(id_usuario),

    FOREIGN KEY (fk_tecnico)
        REFERENCES Usuario(id_usuario)
);

CREATE TABLE Mensagem (
    id_mensagem INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    mensagem TEXT NOT NULL,
    data_envio DATETIME NOT NULL,
    fk_usuario INT NOT NULL,
    fk_chamado INT NOT NULL,

    FOREIGN KEY (fk_usuario)
        REFERENCES Usuario(id_usuario),

    FOREIGN KEY (fk_chamado)
        REFERENCES Chamado(id_chamado)
);

CREATE TABLE HistoricoChamado (
    id_historico INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    situacao VARCHAR(50) NOT NULL,
    descricao TEXT NOT NULL,
    data_hora DATETIME NOT NULL,
    fk_chamado INT NOT NULL,

    FOREIGN KEY (fk_chamado)
        REFERENCES Chamado(id_chamado)
);

CREATE TABLE Avaliacao (
    id_avaliacao INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nota INT NOT NULL CHECK (nota BETWEEN 1 AND 5),
    comentario TEXT,
    data DATETIME NOT NULL,
    fk_chamado INT NOT NULL UNIQUE,

    FOREIGN KEY (fk_chamado)
        REFERENCES Chamado(id_chamado)
);

CREATE TABLE Usuario_Conquista (
    fk_usuario INT NOT NULL,
    fk_conquista INT NOT NULL,
    data_desbloqueio DATETIME NOT NULL,

    PRIMARY KEY (fk_usuario, fk_conquista),

    FOREIGN KEY (fk_usuario)
        REFERENCES Usuario(id_usuario),

    FOREIGN KEY (fk_conquista)
        REFERENCES Conquista(id_conquista)
);