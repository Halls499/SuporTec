import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AbrirChamado.css";

function AbrirChamado() {
  const navigate = useNavigate();

  // Estados dos seletores condicionais
  const [Tipo_atendimento, settipo_atendimento] = useState("");
  const [Tipo_local, setTipo_local] = useState("");
  const [Tipo_contato, setTipo_contato] = useState("");
  const [contato, setContato] = useState(""); // <--- 1. Criado estado do contato

  // Estados dos campos do formulário
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [prioridade, setPrioridade] = useState("");

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
          prioridade,
          categoria,
          tipo_atendimento: Tipo_atendimento, // <--- Mapeado em minúsculo
          tipo_contato: Tipo_contato,          // <--- Mapeado em minúsculo
          contato,                             // <--- Enviado para o backend
        }),
      });

      if (resposta.ok) {
        alert("Chamado criado com sucesso!");
        navigate("/chamados");
      } else {
        const erro = await resposta.json();
        alert(erro.mensagem || "Erro ao criar chamado.");
      }
    } catch (err) {
      console.error("Erro na requisição:", err);
      alert("Falha ao se conectar com o servidor.");
    }
  };

  return (
    <main className="abrir-chamado-page">
      <div className="chamado-container">
        <h1>Abrir novo chamado</h1>

        <p>
          Descreva o problema encontrado para que nossa equipe possa ajudar.
        </p>

        <form className="chamado-form" onSubmit={handleSubmit}>
          {/* Tipo de atendimento */}
          <label>Tipo de atendimento</label>
          <select
            value={Tipo_atendimento}
            onChange={(e) => {
              settipo_atendimento(e.target.value);
              setTipo_local("");
            }}
            required
          >
            <option value="" disabled>
              Selecione o tipo de atendimento
            </option>
            <option value="remoto">Remoto</option>
            <option value="presencial">Presencial</option>
          </select>

          {/* Se for presencial */}
          {Tipo_atendimento === "presencial" && (
            <>
              <label>O atendimento será:</label>
              <select
                value={Tipo_local}
                onChange={(e) => setTipo_local(e.target.value)}
              >
                <option value="" disabled>
                  Selecione
                </option>
                <option value="residencial">Residencial</option>
                <option value="empresa">Empresa</option>
              </select>
            </>
          )}

          {/* Tipo de Contato */}
          <label>Tipo de Contato</label>
          <select
            value={Tipo_contato}
            onChange={(e) => {
              setTipo_contato(e.target.value);
              setTipo_local("");
              setContato("");
            }}
            required
          >
            <option value="" disabled>
              Selecione o tipo de Contato
            </option>
            <option value="telefone">Telefone</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
            <option value="teams">Teams</option>
            <option value="linkedin">LinkedIn</option>
          </select>

          {/* Inputs de contato com value e onChange vinculados */}
          {Tipo_contato === "whatsapp" && (
            <>
              <label>Número do WhatsApp</label>
              <input 
                type="text" 
                placeholder="Ex: (11) 99999-9999" 
                value={contato}
                onChange={(e) => setContato(e.target.value)}
                required
              />
            </>
          )}

          {Tipo_contato === "email" && (
            <>
              <label>Email</label>
              <input 
                type="email" 
                placeholder="Ex: joao.silva@empresa.com" 
                value={contato}
                onChange={(e) => setContato(e.target.value)}
                required
              />
            </>
          )}

          {Tipo_contato === "telefone" && (
            <>
              <label>Telefone</label>
              <input 
                type="text" 
                placeholder="Ex: (11) 3333-3333" 
                value={contato}
                onChange={(e) => setContato(e.target.value)}
                required
              />
            </>
          )}

          {Tipo_contato === "teams" && (
            <>
              <label>Conta do Teams</label>
              <input 
                type="text" 
                placeholder="Ex: joao.silva@empresa.com" 
                value={contato}
                onChange={(e) => setContato(e.target.value)}
                required
              />
            </>
          )}

          {Tipo_contato === "linkedin" && (
            <>
              <label>Perfil do LinkedIn</label>
              <input
                type="text"
                placeholder="Ex: linkedin.com/in/joaodasilva"
                value={contato}
                onChange={(e) => setContato(e.target.value)}
                required
              />
            </>
          )}

          {/* Título do problema */}
          <label>Título do problema</label>
          <input
            type="text"
            placeholder="Ex: Computador não liga"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />

          {/* Categoria */}
          <label>Categoria</label>
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            required
          >
            <option value="" disabled>
              Selecione uma categoria
            </option>
            <option value="hardware">Hardware</option>
            <option value="software">Software</option>
            <option value="rede">Rede</option>
            <option value="acesso">Acesso</option>
          </select>

          {/* Prioridade */}
          <label>Prioridade</label>
          <select
            value={prioridade}
            onChange={(e) => setPrioridade(e.target.value)}
            required
          >
            <option value="" disabled>
              Selecione a prioridade
            </option>
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>

          {/* Descrição */}
          <label>Descrição</label>
          <textarea
            placeholder="Explique o problema com detalhes..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
          />

          <button type="submit">Enviar chamado</button>
        </form>
      </div>
    </main>
  );
}

export default AbrirChamado;