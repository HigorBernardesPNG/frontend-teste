# Projeto Front-End — React + TypeScript + Vite + Bootstrap

Aplicação SPA construída em **React 18 + TypeScript**, empacotada com **Vite** e estilizada com **Bootstrap 5** e comunicação HTTP via **Axios**.

---

## 1) Requisitos

* **Node.js 18+** (recomendado LTS)
* **npm 9+** (ou **pnpm/yarn**, se preferir)
* Acesso à URL base da API (informada pelo avaliador)

---

## 2) Clonar o repositório

```bash
git clone <https://github.com/HigorBernardesPNG/frontend-teste.git>
cd frontend-teste
```

---

## 3) Variáveis de ambiente

> **Importante:** As variáveis precisam começar com `VITE_` para ficarem acessíveis no front-end.

Crie um arquivo `.env` na raiz com, no mínimo:

```ini
# URL base da API (ex.: render, railway, localhost)
VITE_API_URL=https://entrevista-front-end-xm3k.onrender.com
```

O cliente HTTP usa `import.meta.env.VITE_API_URL` em `src/api/api.ts`. Se não estiver definida, o app registra um erro no console e tenta usar `/` como base.

---

## 4) Instalação

```bash
npm install
```

**ou**

```bash
pnpm install
```

**ou**

```bash
yarn install
```

---

## 5) Executar em desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173` (porta padrão do Vite).

---

## 6) Build de produção

```bash
npm run build
```

Os arquivos finais serão gerados em `dist/`.

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

---

## 8) Estrutura (resumo)

```
src/
├── api/                  # clientes axios e serviços (auth, usuarios, tipos, contatos)
├── auth/                 # contexto de autenticação e hooks
├── chart/                # tema de charts
├── components/           # componentes compartilhados (Shell, ProtectedRoute, AlertHost)
├── context/              # AlertContext (mensageria global)
├── hooks/                # hooks utilitários (ex.: useActiveInactive)
├── pages/                # páginas (Login, Usuarios, Tipos, Contatos, Relatorios)
├── router/               # AppRouter (rotas e guards)
├── main.tsx              # entrada e imports de CSS/Bootstrap
└── App.tsx               # providers e composição principal
```
---

## 9) Solução de problemas (rápido)

* Verifique sua versão do Node (`node -v`) e pacote (`npm -v`).

* Portas em uso? Feche processos na `5173` ou altere a porta.

* **VITE_API_URL não definida**: crie `.env` com `VITE_API_URL=...` e rode `npm run dev` novamente.

* **401 após login**: o interceptor limpa o token e redireciona para `/login`. Verifique credenciais e validade do token.

* **CORS ao chamar a API**: habilite o domínio do front na API ou use um proxy em desenvolvimento.

* **404 em rotas internas no deploy estático**: configure fallback para SPA (Netlify `_redirects` com `/* /index.html 200` ou Vercel com `rewrites` para `index.html`).

* **Bootstrap não aplicado**: garanta os imports no `src/main.tsx` (`bootstrap/dist/css/bootstrap.min.css` e `bootstrap-icons`).

---

## 10) Funcionalidades (resumo)

* **Autenticação** com token (login e proteção de rotas usando `ProtectedRoute` e `AuthContext`).
* **Usuários**: listagem (ativos/inativos), criação e alternância de status.
* **Tipos**: listagem (ativos/inativos), criação e alternância de status.
* **Contatos**: listagem (ativos/inativos), criação e alternância de status.
* **Relatórios**: página de relatórios com base em `react-chartjs-2`/`chart.js`.
* **Alertas globais** com `AlertContext` e `AlertHost`.

**Endpoints esperados** (ajuste conforme sua API):

```
POST /token/              # autenticação (ou variantes: /auth/token, /api/token)
GET  /usuarios/ativos/
GET  /usuarios/inativos/
POST /usuario/
GET  /tipos/ativos/
GET  /tipos/inativos/
POST /tipo/
GET  /contatos/ativos/
GET  /contatos/inativos/
POST /contato/
```

---

### Notas rápidas

* O roteamento usa `react-router-dom` com `BrowserRouter` e fallback para `/login`.
* O tema de gráficos é carregado uma única vez em `src/chart/theme.ts`.
* Os componentes de UI utilizam Bootstrap 5 e Bootstrap Icons.
