CREATE DATABASE IF NOT EXISTS railway;
USE railway;

-- 1. Tabela de Organizações (Empresas físicas)
CREATE TABLE IF NOT EXISTS organizacao (
    id_organizacao INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    nome_empresa VARCHAR(100) NOT NULL,
    cnpj VARCHAR(20) DEFAULT NULL,
    plano VARCHAR(50) DEFAULT NULL,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabela de Usuários (Clientes e Técnicos)
CREATE TABLE IF NOT EXISTS usuario (
    id_usuario INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    fk_organizacao INT NULL,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL,
    tipo_usuario ENUM('cliente', 'tecnico') NOT NULL,
    xp INT DEFAULT 0,
    nivel INT DEFAULT 1,
    data_cadastro DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usuario_organizacao
        FOREIGN KEY (fk_organizacao)
        REFERENCES organizacao(id_organizacao)
        ON DELETE SET NULL
);

-- 3. Tabela de Chamados
CREATE TABLE IF NOT EXISTS chamado (
    id_chamado INT AUTO_INCREMENT PRIMARY KEY,
    fk_organizacao INT NOT NULL,
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
    CONSTRAINT fk_chamado_organizacao
        FOREIGN KEY (fk_organizacao)
        REFERENCES organizacao(id_organizacao),
    CONSTRAINT fk_chamado_cliente
        FOREIGN KEY (fk_cliente)
        REFERENCES usuario(id_usuario),
    CONSTRAINT fk_chamado_tecnico
        FOREIGN KEY (fk_tecnico)
        REFERENCES usuario(id_usuario)
);

-- 4. Tabela de categorias
CREATE TABLE IF NOT EXISTS categorias (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100) NOT NULL
);

-- 5. Tabela de Conquistas
CREATE TABLE IF NOT EXISTS conquista (
    id_conquista INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    categoria_id INT,
    CONSTRAINT fk_conquista_categoria
        FOREIGN KEY (categoria_id)
        REFERENCES categorias(id)
        ON DELETE SET NULL
);

-- 6. Tabela de Conquistas do Usuário (Relação N para N)
CREATE TABLE IF NOT EXISTS usuario_conquista (
    fk_usuario INT NOT NULL,
    fk_conquista INT NOT NULL,
    data_desbloqueio DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (fk_usuario, fk_conquista),
    CONSTRAINT fk_uc_usuario
        FOREIGN KEY (fk_usuario)
        REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_uc_conquista
        FOREIGN KEY (fk_conquista)
        REFERENCES conquista(id_conquista) ON DELETE CASCADE
);

-- 7. Tabela de Histórico de Chamados
CREATE TABLE IF NOT EXISTS historico_chamado (
    id_historico INT AUTO_INCREMENT PRIMARY KEY,
    situacao VARCHAR(50) NOT NULL,
    descricao TEXT NOT NULL,
    data_hora DATETIME DEFAULT CURRENT_TIMESTAMP,
    fk_chamado INT NOT NULL,
    CONSTRAINT fk_historico
        FOREIGN KEY (fk_chamado)
        REFERENCES chamado(id_chamado) ON DELETE CASCADE
);

-- 8. Tabela de Mensagens
CREATE TABLE IF NOT EXISTS mensagem (
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
        REFERENCES chamado(id_chamado) ON DELETE CASCADE
);

-- 9. Tabela de Inscrições para Push Notifications
CREATE TABLE IF NOT EXISTS push_subscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    endpoint TEXT NOT NULL,
    p256dh VARCHAR(255) NOT NULL,
    auth VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

--------------------------------------------------
-- CONSULTAS
--------------------------------------------------

DESCRIBE chamado;
SELECT * FROM chamado;
SELECT * FROM mensagem;
SELECT id_usuario, nome, fk_organizacao FROM usuario WHERE id_usuario = 8;
SELECT id_chamado, titulo FROM chamado;

--------------------------------------------------
-- ALTERAÇÕES NAS TABELAS
--------------------------------------------------

ALTER TABLE usuario MODIFY COLUMN fk_organizacao INT NULL;
ALTER TABLE chamado MODIFY COLUMN fk_organizacao INT NULL;
ALTER TABLE mensagem ADD COLUMN fk_remetente INT NOT NULL;
ALTER TABLE mensagem 
ADD CONSTRAINT fk_mensagem_usuario_nova 
FOREIGN KEY (fk_remetente) REFERENCES usuario(id_usuario);
ALTER TABLE mensagem MODIFY COLUMN fk_remetente INT NULL;
UPDATE chamado 
SET situacao = 'Novo', fk_tecnico = NULL 
WHERE id_chamado = 10;

--------------------------------------------------
-- INSERT DE DADOS INICIAIS (Utilizando INSERT IGNORE para evitar duplicidade)
--------------------------------------------------
INSERT INTO mensagem (fk_chamado, fk_usuario, mensagem, data_envio) 
VALUES (8, 8, 'teste de inserção manual', NOW());

INSERT INTO mensagem (fk_chamado, fk_usuario, fk_remetente, mensagem, data_envio) 
VALUES (8, 8, 8, 'teste de inserção manual', NOW());

INSERT INTO chamado (titulo, descricao, prioridade, situacao, fk_cliente, contato, data_abertura) 
VALUES ('Chamado de Teste', 'Testando a listagem', 'Alta', 'Novo', 8, 'teste@email.com', NOW());

INSERT IGNORE INTO categorias (id, nome) VALUES 
(1, 'Volume e Produtividade'),
(2, 'Velocidade e Desempenho'),
(3, 'Especialidades e Áreas Técnicas'),
(4, 'Desafios Combinados e Estratégicos'),
(5, 'Progressão Geral');

INSERT IGNORE INTO conquista (id_conquista, titulo, descricao, categoria_id) VALUES
-- 1. Volume e Produtividade
(1, 'Primeiro Atendimento', 'Conclua seu primeiro chamado.', 1),
(2, 'Atendimento Ágil', 'Resolva 10 chamados em menos de 5 horas.', 1),
(3, 'Maratona Semanal', 'Resolva pelo menos 10 chamados no decorrer de uma semana.', 1),
(4, 'Mestre do Suporte', 'Resolva mais de 100 chamados.', 1),

-- 2. Velocidade e Desempenho
(5, 'Abertura Rápida', 'Abra e resolva um chamado em menos de 1 hora.', 2),
(6, 'Sem Descanso', 'Resolva chamados durante 7 dias consecutivos.', 2),
(7, 'Hora Extra', 'Resolva um chamado fora do horário comercial padrão (antes das 08h, após as 18h ou durante finais de semana).', 2),
(8, 'Alerta Vermelho', 'Resolva um chamado de alta prioridade em menos de 15 minutos.', 2),

-- 3. Especialidades e Áreas Técnicas
(9, 'Especialista em Hardware', 'Conclua 50 chamados de Hardware.', 3),
(10, 'Especialista em Software', 'Conclua 50 chamados de Software.', 3),
(11, 'Especialista em Redes', 'Conclua 50 chamados de Redes.', 3),
(12, 'Especialista em Impressoras', 'Conclua 50 chamados de Impressoras.', 3),

-- 4. Desafios Combinados e Estratégicos
(13, 'Tríplice Coroa', 'Resolva 3 chamados de categorias totalmente diferentes na mesma semana.', 4),
(14, 'Triagem Completa', 'Resolva um chamado de cada prioridade: baixa, média e alta.', 4),
(15, 'Raio-X Técnico', 'Resolva um chamado de Hardware e um de Software no mesmo dia.', 4),
(16, 'Versatilidade Total', 'Resolva tanto um chamado presencial quanto um remoto no mesmo dia.', 4),

-- 5. Progressão Geral
(17, 'Lenda do Suporte', 'Alcance o nível máximo na plataforma.', 5),
(18, 'Especialista Dedicado', 'Conclua 7 chamados seguidos da mesma categoria.', 5),
(19, 'Emblema Inicial', 'Desbloqueie suas primeiras 3 conquistas.', 5),
(20, 'Meio do Caminho', 'Alcance o nível 250 na plataforma.', 5);