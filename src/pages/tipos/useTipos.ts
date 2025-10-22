import { useActiveInactive } from '../../hooks/useActiveInactive';
import { listarTiposAtivos, listarTiposInativos, alternarStatusTipo, criarTipo } from '../../api/tipos';
import type { Tipo } from '../../types';

export function useTipos() {
  return useActiveInactive<Tipo, { nome: string }>({
    listActive: listarTiposAtivos,
    listInactive: listarTiposInativos,
    toggle: alternarStatusTipo,
    create: criarTipo,
    validateCreate: (p) => (!p.nome.trim() ? 'Informe o nome do tipo.' : null),
  });
}
