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