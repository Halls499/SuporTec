import { useState } from "react";
import "./AbrirChamado.css";

function AbrirChamado() {
  const [tipoAtendimento, setTipoAtendimento] = useState("");
  const [tipoLocal, setTipoLocal] = useState("");
  const [tipoContato, setTipoContato] = useState("");

  return (
    <main className="abrir-chamado-page">
      <div className="chamado-container">
        <h1>Abrir novo chamado</h1>

        <p>
          Descreva o problema encontrado para que nossa equipe possa ajudar.
        </p>

        <form className="chamado-form">
          {/* Tipo de atendimento */}

          <label>Tipo de atendimento</label>

          <select
            value={tipoAtendimento}
            onChange={(e) => {
              setTipoAtendimento(e.target.value);
              setTipoLocal("");
            }}
          >
            <option value="" disabled>
              Selecione o tipo de atendimento
            </option>

            <option value="remoto">Remoto</option>
            <option value="presencial">Presencial</option>
          </select>

          {/* Se for presencial */}

          {tipoAtendimento === "presencial" && (
            <>
              <label>O atendimento será:</label>

              <select
                value={tipoLocal}
                onChange={(e) => setTipoLocal(e.target.value)}
              >
                <option value="" disabled>
                  Selecione
                </option>

                <option value="residencial">Residencial</option>
                <option value="empresa">Empresa</option>
              </select>
            </>
          )}

          {/* Formulário residencial */}
          {tipoLocal === "residencial" && (
            <>
              <label>Endereço</label>
              <input type="text" placeholder="Ex: Av. Paulista, 1000" />
            </>
          )}

          {/* Formulário empresa */}
          {tipoLocal === "empresa" && (
            <>
              <label>Empresa</label>
              <input type="text" placeholder="Ex: Google Brasil" />

              <label>Setor</label>
              <input type="text" placeholder="Ex: TI" />

              <label>Sala / Andar / Bloco</label>
              <input type="text" placeholder="Ex: 17º Andar" />

              <label>Endereço</label>

              <input
                type="text"
                placeholder="Ex: Av. Brigadeiro Faria Lima..."
              />
            </>
          )}

           {/* Tipo de Contato */}

          <label>Tipo de Contato</label>

          <select
            value={tipoContato}
            onChange={(e) => {
              setTipoContato(e.target.value);
              setTipoLocal("");
            }}
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

          {/* Formulário whatsapp */}
          {tipoContato === "whatsapp" && (
            <>
              <label>Número do WhatsApp</label>
              <input type="text" placeholder="Ex: (11) 99999-9999" />
            </>
          )}

          {/* Formulário email */}
          {tipoContato === "email" && (
            <>
              <label>Email</label>
              <input type="email" placeholder="Ex: joao.silva@empresa.com" />
            </>
          )}

          {/* Formulário telefone */}
          {tipoContato === "telefone" && (
            <>
              <label>Telefone</label>
              <input type="text" placeholder="Ex: (11) 3333-3333" />
            </>
          )}

          {/* Formulário teams */}
          {tipoContato === "teams" && (
            <>
              <label>Conta do Teams</label>
              <input type="text" placeholder="Ex: joao.silva@empresa.com" />
            </>
          )}

          {/* Formulário linkedin */}
          {tipoContato === "linkedin" && (
            <>
              <label>Perfil do LinkedIn</label>
              <input type="text" placeholder="Ex: linkedin.com/in/joaodasilva" />
            </>
          )}

          <label>Título do problema</label>
          <input type="text" placeholder="Ex: Computador não liga" />

          <label>Nome do solicitante</label>
          <input type="text" placeholder="Ex: João da Silva" />

          <label>Categoria</label>

          <select defaultValue="">
            <option value="" disabled>
              Selecione uma categoria
            </option>

            <option value="hardware">Hardware</option>
            <option value="software">Software</option>
            <option value="rede">Rede</option>
            <option value="acesso">Acesso</option>
          </select>

          <label>Prioridade</label>

          <select defaultValue="">
            <option value="" disabled>
              Selecione a prioridade
            </option>

            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>

          <label>Melhor horário para contato</label>
          <input placeholder="Ex: Segunda-feira, 9h às 18h" />

          <label>Descrição</label>
          <textarea placeholder="Explique o problema com detalhes..." />

          <button type="submit">Enviar chamado</button>
        </form>
      </div>
    </main>
  );
}

export default AbrirChamado;
