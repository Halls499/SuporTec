// Função para criar um objeto de usuário seguro, excluindo informações sensíveis
export default function UsuarioSeguro(usuario) {
    const { id_usuario, nome, email, tipo_usuario, data_cadastro } = usuario;

    return {
        id_usuario,
        nome,
        email,
        tipo_usuario,
        data_cadastro
    };
}