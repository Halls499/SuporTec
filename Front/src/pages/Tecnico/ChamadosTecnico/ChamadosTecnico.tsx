import "./ChamadosTecnico.css";
import { useNavigate } from "react-router-dom";

interface Chamado {
  id: number;
  cliente: string;
  problema: string;
  prioridade: string;
  status: string;
  dataAbertura: string;
}

function ChamadosTecnico() {
  const navigate = useNavigate();

  const chamados: Chamado[] = [
    {
      id: 1,
      cliente: "João da Silva",
      problema: "Computador não liga",
      prioridade: "🔴 Alta",
      status: "📥 Novo",
      dataAbertura: "07/07/2026",
    },
    {
      id: 2,
      cliente: "Maria Souza",
      problema: "Impressora sem conexão",
      prioridade: "🟡 Média",
      status: "🔧 Em atendimento",
      dataAbertura: "06/07/2026",
    },
    {
      id: 3,
      cliente: "Carlos Henrique",
      problema: "Erro no Outlook",
      prioridade: "🟢 Baixa",
      status: "💬 Aguardando resposta",
      dataAbertura: "05/07/2026",
    },
    {
      id: 4,
      cliente: "Ana Paula",
      problema: "Internet muito lenta",
      prioridade: "🔴 Alta",
      status: "✅ Resolvido",
      dataAbertura: "04/07/2026",
    },
  ];

  function handleChamadoClick(chamadoId: number) {
    navigate(`/tecnico/chamados/${chamadoId}`);
  }

  return (
    <main className="chamados-tecnico-page">
      <div className="chamados-tecnico-container">
        <h1>Chamados atribuídos</h1>

        <p className="subtitle">
          Gerencie os chamados sob sua responsabilidade.
        </p>

        <div className="chamados-list">
          {chamados.length > 0 ? (
            chamados.map((chamado) => (
              <div key={chamado.id} className="chamado-card">
                <h2>Chamado #{String(chamado.id).padStart(3, "0")}</h2>

                <p>
                  <strong>👤 Cliente:</strong> {chamado.cliente}
                </p>

                <p>
                  <strong>💻 Problema:</strong> {chamado.problema}
                </p>

                <p>
                  <strong>🚨 Prioridade:</strong> {chamado.prioridade}
                </p>

                <p>
                  <strong>📌 Status:</strong> {chamado.status}
                </p>

                <p>
                  <strong>📅 Aberto em:</strong> {chamado.dataAbertura}
                </p>

                <button
                  className="btn-atender"
                  onClick={() => handleChamadoClick(chamado.id)}
                >
                  Atender chamado
                </button>
              </div>
            ))
          ) : (
            <p className="sem-chamados">Nenhum chamado atribuído no momento.</p>
          )}
        </div>
      </div>
    </main>
  );
}

export default ChamadosTecnico;
