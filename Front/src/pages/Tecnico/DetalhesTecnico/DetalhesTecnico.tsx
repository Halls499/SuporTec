import "./DetalhesTecnico.css";
import { Link } from "react-router-dom";

function DetalhesTecnico() {
  return (
    <main className="detalhes-tecnico-page">
      <div className="detalhes-tecnico-container">
        <h1>Detalhes do chamado</h1>

        <p className="subtitle">
          Visualize as informações do chamado, responda o cliente e atualize o
          status do atendimento.
        </p>

        {/* Informações */}
        <section className="detalhes-card">
          <h2>Chamado #001</h2>

          <p>
            <strong>👤 Cliente:</strong> João da Silva
          </p>

          <p>
            <strong>👨‍💻 Técnico responsável:</strong> Raul
          </p>

          <p>
            <strong>💻 Problema:</strong> Computador não liga
          </p>

          <p>
            <strong>📂 Categoria:</strong> Hardware
          </p>

          <p>
            <strong>🚨 Prioridade:</strong> Alta
          </p>

          <p>
            <strong>📌 Status:</strong> Em andamento
          </p>

          <p>
            <strong>📅 Aberto em:</strong> 04/07/2026
          </p>

          <p>
            <strong>📝 Descrição:</strong>
          </p>

          <p className="descricao">
            O computador não apresenta nenhum sinal de funcionamento ao
            pressionar o botão de ligar.
          </p>
        </section>

        {/* Histórico */}
        <section className="detalhes-card">
          <div className="detalhes-card">
            <h2>Histórico de mensagens</h2>

            <div className="chat-box">
              <div className="mensagem cliente">
                <strong>👤 João da Silva</strong>
                <p>Meu computador não liga desde ontem.</p>
                <span>04/07/2026 - 09:40</span>
              </div>

              <div className="mensagem tecnico">
                <strong>👨‍💻 Raul</strong>
                <p>Estou analisando o problema.</p>
                <span>04/07/2026 - 10:15</span>
              </div>
            </div>
          </div>
        </section>

        {/* Resposta */}
        <section className="detalhes-card">
          <h2>Responder chamado</h2>
          <textarea placeholder="Digite uma resposta ao cliente..." />
          <button className="btn-enviar">Enviar resposta</button>
        </section>

        {/* Status */}
        <section className="detalhes-card">
          <h2>Atualizar status</h2>

          <select>
            <option>Novo</option>
            <option>Em atendimento</option>
            <option>Aguardando resposta</option>
            <option>Resolvido</option>
          </select>

          <button className="btn-salvar">Salvar alterações</button>
        </section>

        <Link to="/ChamadosTecnico" className="btn-voltar">
          ← Voltar aos chamados
        </Link>
      </div>
    </main>
  );
}

export default DetalhesTecnico;
