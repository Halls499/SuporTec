import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import './EditarPerfil.css';

export function EditarPerfil() {
  const [nome, setNome] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [mensagemSucesso, setMensagemSucesso] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Carrega os dados atuais do localStorage para preencher os campos ou pegar o ID
    const usuarioAtual = JSON.parse(localStorage.getItem('usuario') || '{}');
    if (usuarioAtual) {
      setUserId(usuarioAtual.id || usuarioAtual.id_usuario);
      if (usuarioAtual.nome) setNome(usuarioAtual.nome);
      if (usuarioAtual.foto) setFotoUrl(usuarioAtual.foto);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    const usuarioAtual = JSON.parse(localStorage.getItem('usuario') || '{}');
    
    try {
      const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

      // Se houver ID e rota no backend para atualizar perfil, fazemos a requisição:
      if (userId) {
        const resposta = await fetch(`${baseUrl}/api/usuarios/${userId}`, {
          method: "PUT", // ou PATCH dependendo da sua API
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            nome: nome || usuarioAtual.nome,
            foto: fotoUrl || usuarioAtual.foto,
          }),
        });

        if (!resposta.ok) {
          console.warn("Aviso: Não foi possível atualizar no backend, salvando apenas localmente.");
        }
      }

      // Atualiza o localStorage com os novos dados
      const usuarioAtualizado = {
        ...usuarioAtual,
        nome: nome || usuarioAtual.nome,
        foto: fotoUrl || usuarioAtual.foto,
      };

      localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado));

      // Dispara o evento para atualizar o Header em tempo real
      window.dispatchEvent(new Event("login"));

      setMensagemSucesso(true);
      setTimeout(() => setMensagemSucesso(false), 3000);
    } catch (erro) {
      console.error("Erro ao atualizar perfil:", erro);
      alert("Erro ao atualizar perfil no servidor.");
    }
  };

  return (
    <div className="editar-perfil-page">
      <motion.div 
        className="auth-box"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <h1>Editar Perfil</h1>
        <p>Atualize suas informações pessoais</p>

        {mensagemSucesso && (
          <motion.div 
            className="mensagem-sucesso"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            Perfil atualizado com sucesso!
          </motion.div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="nome">Novo Nome de Usuário</label>
            <motion.input
              id="nome"
              type="text"
              placeholder="Digite seu novo nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              whileFocus={{ scale: 1.01 }}
            />
          </div>

          <div className="input-group">
            <label htmlFor="foto">URL da Foto de Perfil</label>
            <motion.input
              id="foto"
              type="text"
              placeholder="Cole o link da sua nova foto"
              value={fotoUrl}
              onChange={(e) => setFotoUrl(e.target.value)}
              whileFocus={{ scale: 1.01 }}
            />
          </div>

          <motion.button 
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Salvar Alterações
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default EditarPerfil;