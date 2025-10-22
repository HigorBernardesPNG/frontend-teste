import { useActiveInactive } from '../../hooks/useActiveInactive';
import { listarContatosAtivos, listarContatosInativos, alternarStatusContato, criarContato } from '../../api/contatos';
import type { Contato } from '../../types';

type CreateContato = { idtipo: number; idusuario: number; nome: string; valor: string };

export function useContatos() {
  return useActiveInactive<Contato, CreateContato>({
    listActive: listarContatosAtivos,
    listInactive: listarContatosInativos,
    toggle: alternarStatusContato,
    create: criarContato,
    validateCreate: (p) => {
      if (!p.nome.trim() || !p.valor.trim() || !p.idtipo || !p.idusuario) {
        return 'Preencha nome, valor, tipo (ID numérico) e usuário (ID numérico).';
      }
      return null;
    },
  });
}
