 import { useCallback, useEffect, useState } from 'react';
import { getHttpErrorMessage } from '../utils/http';

type CrudConfig<TItem, TCreate> = {
  // chamadas de dados
  listActive: () => Promise<TItem[]>;
  listInactive: () => Promise<TItem[]>;
  toggle: (id: number) => Promise<unknown>;
  create: (payload: TCreate) => Promise<unknown>;

  validateCreate?: (payload: TCreate) => string | null;
  autoLoad?: boolean;
};

export function useActiveInactive<TItem, TCreate>(
  cfg: CrudConfig<TItem, TCreate>
) {
  const {
    listActive,
    listInactive,
    toggle,
    create,
    validateCreate,
    autoLoad = true,
  } = cfg;

  const [ativos, setAtivos] = useState<TItem[]>([]);
  const [inativos, setInativos] = useState<TItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const carregar = useCallback(async () => {
    setLoading(true);
    setErr(null);
    try {
      const [a, i] = await Promise.all([listActive(), listInactive()]);
      setAtivos(a);
      setInativos(i);
    } catch (e: unknown) {
      setErr(getHttpErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [listActive, listInactive]);

  useEffect(() => {
    if (autoLoad) void carregar();
  }, [autoLoad, carregar]);

  const toggleStatus = useCallback(
    async (id: number) => {
      setErr(null);
      try {
        await toggle(id);
        await carregar();
      } catch (e: unknown) {
        setErr(getHttpErrorMessage(e));
      }
    },
    [toggle, carregar]
  );

  const createItem = useCallback(
    async (payload: TCreate) => {
      if (validateCreate) {
        const message = validateCreate(payload);
        if (message) {
          setErr(message);
          return false;
        }
      }
      setErr(null);
      try {
        await create(payload);
        await carregar();
        return true;
      } catch (e: unknown) {
        setErr(getHttpErrorMessage(e));
        return false;
      }
    },
    [create, validateCreate, carregar]
  );

  return {
    // dados
    ativos,
    inativos,

    // ui
    loading,
    err,
    setErr,

    // ações
    carregar,
    toggle: toggleStatus,
    create: createItem,
  };
}
