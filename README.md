# Projeto Front-End — React + TypeScript + Vite + Bootstrap

Aplicação SPA construída em **React 18 + TypeScript**, empacotada com **Vite**, estilizada com **Bootstrap 5** e comunicação HTTP via **Axios**.

---

## 1) Requisitos

- **Node.js 18+** (recomendado LTS)
- **npm 9+** (ou **pnpm/yarn**, se preferir)
- Acesso à URL base da API (informada pelo avaliador)

---

## 2) Clonar o repositório

```bash
git clone <URL-DO-SEU-REPO>.git
cd <nome-da-pasta>
```

---

## 3) Variáveis de ambiente

Crie um arquivo `.env` na raiz (ou use `.env.local`) com a URL base da API:

```env
VITE_API_URL=https://<sua-base-da-api>
```

> Dica: inclua um `.env.example` no repositório com a mesma chave e um valor fictício.  
> **Nunca** versione `.env` reais.

---

## 4) Instalação

```bash
npm install
# ou
pnpm install
# ou
yarn
```

---

## 5) Executar em desenvolvimento

```bash
npm run dev
```

- Endereço padrão do Vite: `http://localhost:5173`
- O app lê `VITE_API_URL` em tempo de **build** (reinicie o dev server após alterar `.env`).

---

## 6) Build de produção

```bash
npm run build
```

- Saída em `dist/`.

### Preview local do build

```bash
npm run preview
```

---

## 7) Scripts disponíveis (npm)

```json
{
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}
```

> Caso use ESLint/Prettier/Testes, adicione os scripts correspondentes (`lint`, `format`, `test`) e documente aqui.

---

## 8) Estrutura (resumo)

```
src/
  api/           # serviços HTTP (Axios)
  components/    # componentes reutilizáveis
  pages/         # páginas/rotas
  router/        # react-router
  styles/        # estilos globais (Bootstrap importado aqui)
  types/         # tipos/DTOs
  utils/         # utilitários
```

---

## 9) Como apontar para outra API

1. Abra `.env` e altere `VITE_API_URL`.
2. Rode novamente `npm run dev` (ou refaça o `build`).

---

## 10) Solução de problemas (rápido)

- **401/403 após login**: confirme `VITE_API_URL`, token e CORS da API. Limpe `localStorage` e faça novo login.
- **.env não surte efeito**: verifique prefixo `VITE_`, reinicie o dev server e confirme que o arquivo está na raiz do projeto.
- **Porta ocupada**: `npm run dev -- --port 3000` para trocar a porta.

---

## 11) Deploy (genérico)

- Gere o build: `npm run build`.
- Publique o conteúdo de `dist/` no seu provedor (Vercel, Netlify, S3/CloudFront, Nginx etc).
- Configure variáveis de ambiente do provedor com `VITE_API_URL` **antes** do build.

---

## 12) Licença

Uso exclusivo para avaliação técnica do processo seletivo.
