import { useActiveInactive } from '../../hooks/useActiveInactive';
import { listarUsuariosAtivos, listarUsuariosInativos, alternarStatusUsuario, criarUsuario } from '../../api/usuarios';
import type { Usuario } from '../../types';

type CreateUsuario = { nome: string; email: string; senha: string };

export function useUsuarios() {
  return useActiveInactive<Usuario, CreateUsuario>({
    listActive: listarUsuariosAtivos,
    listInactive: listarUsuariosInativos,
    toggle: alternarStatusUsuario,
    create: criarUsuario,
    validateCreate: (p) => {
      if (!p.nome.trim() || !p.email.trim() || !p.senha.trim()) {
        return 'Preencha nome, email e senha.';
      }
      return null;
    },
  });
}
