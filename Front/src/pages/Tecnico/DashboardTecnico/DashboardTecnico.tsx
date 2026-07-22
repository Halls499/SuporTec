import { Link } from "react-router-dom";
import "./DashboardTecnico.css";

function DashboardTecnico() {
  return (
    <main className="home-login-page">
      <section className="DashboardTecnico-container">
        <div className="welcome">
          <h1>Bem-vindo, Técnico Raul</h1>

          {/* Barra */}
          <div className="xp-bar">
            <div className="xp-progress">
              Nível 4 - Especialista <br /> 320 / 400 XP
            </div>
          </div>
          <p>
            Gerencie os chamados atribuídos a você e acompanhe o andamento dos
            atendimentos.
          </p>
          <p>⚠️ Você possui 5 chamados novos aguardando atendimento.</p>
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <span>📥</span>
            <p>Novos</p>
          </div>

          <div className="summary-card">
            <span>✅</span>
            <p>Resolvidos</p>
          </div>

          <div className="summary-card">
            <span>⏳</span>
            <p>Em andamento</p>
          </div>

          <div className="summary-card">
            <span>💬</span>
            <p>Aguardando resposta</p>
          </div>
        </div>

        <div className="conquistas">
          <h2>🏆 Conquistas</h2>

          <h3>8 de 15 conquistas desbloqueadas</h3>

          {/* Suporte Geral */}

          <h4>📋 Suporte Geral</h4>

          <div className="conquistas-grid">
            <div className="conquista-card desbloqueada">
              <span>🏆</span>
              <h5>Mestre do Suporte</h5>
              <p>Resolva mais de 100 chamados.</p>
            </div>

            <div className="conquista-card desbloqueada">
              <span>⚡</span>
              <h5>Atendimento Ágil</h5>
              <p>Resolva 10 chamados em menos de 3 horas.</p>
            </div>

            <div className="conquista-card desbloqueada">
              <span>🎯</span>
              <h5>Precisão no Diagnóstico</h5>
              <p>Resolva 95% dos chamados corretamente.</p>
            </div>

            <div className="conquista-card bloqueada">
              <span>💬</span>
              <h5>Comunicador</h5>
              <p>Responda 50 chamados em menos de 1 hora.</p>
            </div>

            <div className="conquista-card bloqueada">
              <span>🔥</span>
              <h5>Sem Descanso</h5>
              <p>Resolva chamados durante 7 dias consecutivos.</p>
            </div>
          </div>

          {/* Especializações */}

          <h4>💻 Especializações</h4>

          <div className="conquistas-grid">
            <div className="conquista-card desbloqueada">
              <span>💻</span>
              <h5>Especialista em Hardware</h5>
              <p>Conclua 50 chamados de Hardware.</p>
            </div>

            <div className="conquista-card desbloqueada">
              <span>🖥️</span>
              <h5>Especialista em Software</h5>
              <p>Conclua 50 chamados de Software.</p>
            </div>

            <div className="conquista-card bloqueada">
              <span>🌐</span>
              <h5>Especialista em Redes</h5>
              <p>Conclua 50 chamados de Redes.</p>
            </div>

            <div className="conquista-card bloqueada">
              <span>🖨️</span>
              <h5>Especialista em Impressoras</h5>
              <p>Conclua 50 chamados de Impressoras.</p>
            </div>

            <div className="conquista-card bloqueada">
              <span>🔐</span>
              <h5>Especialista em Segurança</h5>
              <p>Conclua 30 chamados relacionados à segurança.</p>
            </div>
          </div>

          {/* Qualidade */}

          <h4>⭐ Qualidade</h4>

          <div className="conquistas-grid">
            <div className="conquista-card desbloqueada">
              <span>⭐</span>
              <h5>Excelência no Atendimento</h5>
              <p>Receba média superior a 4,5 estrelas.</p>
            </div>

            <div className="conquista-card desbloqueada">
              <span>🤝</span>
              <h5>Cliente Satisfeito</h5>
              <p>Receba 50 avaliações com 5 estrelas.</p>
            </div>

            <div className="conquista-card bloqueada">
              <span>🌙</span>
              <h5>Plantonista</h5>
              <p>Resolva 10 chamados fora do horário comercial.</p>
            </div>

            <div className="conquista-card desbloqueada">
              <span>🚀</span>
              <h5>Primeiro Atendimento</h5>
              <p>Conclua seu primeiro chamado.</p>
            </div>

            <div className="conquista-card bloqueada">
              <span>💯</span>
              <h5>Cem por Cento</h5>
              <p>Receba 10 avaliações cinco estrelas consecutivas.</p>
            </div>
          </div>
        </div>

        <Link to="/ChamadosTecnico" className="new-ticket">
          Ver todos os chamados
        </Link>
      </section>
    </main>
  );
}

export default DashboardTecnico;
