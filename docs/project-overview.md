# E2E Dashboard Overview

## Objetivo

- Construir um dashboard end-to-end em React (Vite) com Material UI.
- Priorizar UX limpa, responsiva e orientada a dados.
- Encadear o processo em etapas curtas validadas em cada entrega.

## Stack Base

1. **Build Tool:** Vite + React + TypeScript (quando possível, para melhor DX).
2. **UI Library:** Material UI (MUI v5+), com tema customizado minimalista.
3. **State/Data:** React Query para dados remotos, Zustand/Context para estado global simples.
4. **Lint/Format:** ESLint (configs recomendadas do Vite) e Prettier.
5. **Testes:** Vitest + Testing Library.

## Requisitos Funcionais Iniciais

- Tela principal com overview de métricas (cards, gráficos rápidos, tabela resumida).
- Drill-down para seções específicas (ex.: performance, erros, usuários, integrações).
- Filtro temporal global (ex.: últimos 7/30 dias) que propaga para os widgets.

## Requisitos Não Funcionais

- Carregamentos otimistas e esqueleto/shimmers para evitar layouts pulando.
- Acessibilidade AA: contraste, navegação por teclado, labels claros.
- Componentização com Atomic/Feature-based folders.
- Integração contínua: scripts `dev`, `build`, `test` já definidos no `package.json`.

## Próximos Passos

1. Inicializar o projeto com `npm create vite@latest e2e-dashboard -- --template react-ts`.
2. Instalar dependências essenciais (`@mui/material`, `@mui/icons-material`, `@emotion/*`, `@tanstack/react-query`, etc.).
3. Configurar `ThemeProvider` com paleta neutra e tipografia consistente.
4. Criar primeira versão do layout base (App Shell) antes dos widgets.
5. Versionar desde o início (git init) e manter branch principal limpa.
