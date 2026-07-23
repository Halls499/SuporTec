import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./AbrirChamado.css";

// 1. Variantes do Framer Motion idênticas às do Login
const boxVariants = {
  hidden: {
    opacity: 0,
    y: 40,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08, // Levemente mais rápido por ter mais campos
    },
  },
};

const fieldVariants = {
  hidden: {
    opacity: 0,
    x: -20,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
    },
  },
};

const textVariants = {
  hidden: {
    opacity: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

function AbrirChamado() {
  const navigate = useNavigate();

  // Estados com os nomes exatamente iguais aos do Banco e Backend (snake_case)
  const [tipo_atendimento, setTipoAtendimento] = useState("");
  const [tipo_local, setTipoLocal] = useState("");
  const [tipo_contato, setTipoContato] = useState("");

  // Estados dos campos de endereço/empresa
  const [endereco, setEndereco] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [setor, setSetor] = useState("");
  const [sala, setSala] = useState("");

  // Estados dos demais campos do formulário
  const [contato, setContato] = useState("");
  const [titulo, setTitulo] = useState("");
  const [nomeSolicitante, setNomeSolicitante] = useState("");
  const [categoria, setCategoria] = useState("");
  const [prioridade, setPrioridade] = useState("");
  const [horarioContato, setHorarioContato] = useState("");
  const [descricao, setDescricao] = useState("");

  // Função de envio para a API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

    try {
      const resposta = await fetch(`${baseUrl}/chamados`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          titulo,
          descricao,
          categoria,
          prioridade,
          tipo_atendimento,
          tipo_contato,
          contato,
          endereco: endereco || null,
          empresa: empresa || null,
          setor: setor || null,
          sala: sala || null,
        }),
      });

      if (resposta.ok) {
        alert("Chamado criado com sucesso!");
        navigate("/chamados");
      } else {
        const erro = await resposta.json();
        alert(erro.erro || erro.mensagem || "Erro ao criar chamado.");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Falha ao se conectar com o servidor.");
    }
  };

  return (
    <main className="abrir-chamado-page">
      <motion.div
        className="chamado-container"
        variants={boxVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={textVariants}>Abrir novo chamado</motion.h1>

        <motion.p variants={textVariants}>
          Descreva o problema encontrado para que nossa equipe possa ajudar.
        </motion.p>

        {/* Formulario */}
        <motion.form
          className="chamado-form"
          onSubmit={handleSubmit}
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Tipo de atendimento */}
          <motion.label variants={fieldVariants}>
            Tipo de atendimento
          </motion.label>
          <motion.select
            variants={fieldVariants}
            value={tipo_atendimento}
            onChange={(e) => {
              setTipoAtendimento(e.target.value);
              setTipoLocal("");
            }}
            required
          >
            <option value="" disabled>
              Selecione o tipo de atendimento
            </option>
            <option value="Remoto">Remoto</option>
            <option value="Presencial">Presencial</option>
          </motion.select>

          {/* Se for presencial */}
          {tipo_atendimento === "Presencial" && (
            <>
              <motion.label variants={fieldVariants}>
                O atendimento será:
              </motion.label>
              <motion.select
                variants={fieldVariants}
                value={tipo_local}
                onChange={(e) => setTipoLocal(e.target.value)}
              >
                <option value="" disabled>
                  Selecione
                </option>
                <option value="residencial">Residencial</option>
                <option value="empresa">Empresa</option>
              </motion.select>
            </>
          )}

          {/* Formulário residencial */}
          {tipo_local === "residencial" && (
            <>
              <motion.label variants={fieldVariants}>Endereço</motion.label>
              <motion.input
                variants={fieldVariants}
                type="text"
                placeholder="Ex: Av. Paulista, 1000"
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
            </>
          )}

          {/* Formulário empresa */}
          {tipo_local === "empresa" && (
            <>
              <motion.label variants={fieldVariants}>Empresa</motion.label>
              <motion.input
                variants={fieldVariants}
                type="text"
                placeholder="Ex: Google Brasil"
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
              />

              <motion.label variants={fieldVariants}>Setor</motion.label>
              <motion.input
                variants={fieldVariants}
                type="text"
                placeholder="Ex: TI"
                value={setor}
                onChange={(e) => setSetor(e.target.value)}
              />

              <motion.label variants={fieldVariants}>
                Sala / Andar / Bloco
              </motion.label>
              <motion.input
                variants={fieldVariants}
                type="text"
                placeholder="Ex: 17º Andar"
                value={sala}
                onChange={(e) => setSala(e.target.value)}
              />

              <motion.label variants={fieldVariants}>Endereço</motion.label>
              <motion.input
                variants={fieldVariants}
                type="text"
                placeholder="Ex: Av. Brigadeiro Faria Lima..."
                value={endereco}
                onChange={(e) => setEndereco(e.target.value)}
              />
            </>
          )}

          {/* Tipo de Contato */}
          <motion.label variants={fieldVariants}>Tipo de Contato</motion.label>
          <motion.select
            variants={fieldVariants}
            value={tipo_contato}
            onChange={(e) => {
              setTipoContato(e.target.value);
              setContato("");
            }}
            required
          >
            <option value="" disabled>
              Selecione o tipo de Contato
            </option>
            <option value="Telefone">Telefone</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Email">Email</option>
            <option value="Teams">Teams</option>
            <option value="LinkedIn">LinkedIn</option>
          </motion.select>

          {/* Formulário whatsapp */}
          {tipo_contato === "WhatsApp" && (
            <>
              <motion.label variants={fieldVariants}>
                Número do WhatsApp
              </motion.label>
              <motion.input
                variants={fieldVariants}
                type="text"
                placeholder="Ex: (11) 99999-9999"
                value={contato}
                onChange={(e) => setContato(e.target.value)}
                required
              />
            </>
          )}

          {/* Formulário email */}
          {tipo_contato === "Email" && (
            <>
              <motion.label variants={fieldVariants}>Email</motion.label>
              <motion.input
                variants={fieldVariants}
                type="email"
                placeholder="Ex: joao.silva@empresa.com"
                value={contato}
                onChange={(e) => setContato(e.target.value)}
                required
              />
            </>
          )}

          {/* Formulário telefone */}
          {tipo_contato === "Telefone" && (
            <>
              <motion.label variants={fieldVariants}>Telefone</motion.label>
              <motion.input
                variants={fieldVariants}
                type="text"
                placeholder="Ex: (11) 3333-3333"
                value={contato}
                onChange={(e) => setContato(e.target.value)}
                required
              />
            </>
          )}

          {/* Formulário teams */}
          {tipo_contato === "Teams" && (
            <>
              <motion.label variants={fieldVariants}>
                Conta do Teams
              </motion.label>
              <motion.input
                variants={fieldVariants}
                type="text"
                placeholder="Ex: joao.silva@empresa.com"
                value={contato}
                onChange={(e) => setContato(e.target.value)}
                required
              />
            </>
          )}

          {/* Formulário linkedin */}
          {tipo_contato === "LinkedIn" && (
            <>
              <motion.label variants={fieldVariants}>
                Perfil do LinkedIn
              </motion.label>
              <motion.input
                variants={fieldVariants}
                type="text"
                placeholder="Ex: linkedin.com/in/joaodasilva"
                value={contato}
                onChange={(e) => setContato(e.target.value)}
                required
              />
            </>
          )}

          <motion.label variants={fieldVariants}>
            Título do problema
          </motion.label>
          <motion.input
            variants={fieldVariants}
            type="text"
            placeholder="Ex: Computador não liga"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />

          <motion.label variants={fieldVariants}>
            Nome do solicitante
          </motion.label>
          <motion.input
            variants={fieldVariants}
            type="text"
            placeholder="Ex: João da Silva"
            value={nomeSolicitante}
            onChange={(e) => setNomeSolicitante(e.target.value)}
          />

          <motion.label variants={fieldVariants}>Categoria</motion.label>
          <motion.select
            variants={fieldVariants}
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
          >
            <option value="" disabled>
              Selecione uma categoria
            </option>
            <option value="Hardware">Hardware</option>
            <option value="Software">Software</option>
            <option value="Rede">Rede</option>
            <option value="Acesso">Acesso</option>
          </motion.select>

          <motion.label variants={fieldVariants}>Prioridade</motion.label>
          <motion.select
            variants={fieldVariants}
            value={prioridade}
            onChange={(e) => setPrioridade(e.target.value)}
            required
          >
            <option value="" disabled>
              Selecione a prioridade
            </option>
            <option value="Baixa">Baixa</option>
            <option value="Media">Média</option>
            <option value="Alta">Alta</option>
          </motion.select>

          <motion.label variants={fieldVariants}>
            Melhor horário para contato
          </motion.label>
          <motion.input
            variants={fieldVariants}
            placeholder="Ex: Segunda-feira, 9h às 18h"
            value={horarioContato}
            onChange={(e) => setHorarioContato(e.target.value)}
          />

          <motion.label variants={fieldVariants}>Descrição</motion.label>
          <motion.textarea
            variants={fieldVariants}
            placeholder="Explique o problema com detalhes..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />

          <motion.button
            type="submit"
            variants={fieldVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            Enviar chamado
          </motion.button>
        </motion.form>
      </motion.div>
    </main>
  );
}

export default AbrirChamado;
