export type Tipo = {
  id: number;
  nome: string;
  descricao: string;
  ativo: boolean;
};

export type Usuario = {
  id: number;
  nome: string;
  email: string;
  ativo: boolean;
};

export type Contato = {
  id: number;
  nome: string;
  valor: string;
  idtipo: number;
  
  idusuario: number;
  ativo: boolean;
};

