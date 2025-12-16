# E2E Dashboard

Aplicacao em Vite + React utilizada para acompanhar os resultados dos pipelines E2E (Playwright) de diferentes squads. Os dados comecam em modo mock e podem ser sincronizados com os repositorios GitLab para mostrar as branches reais e seus ultimos commits.

## Requisitos

- Node.js 20+
- npm 10+

## Configuracao rapida

1. Instale dependencias: `npm install`
2. Copie o arquivo `.env.example` para `.env` e ajuste as variaveis (detalhes abaixo)
3. Execute o servidor: `npm run dev`
4. Acesse `http://localhost:5173`

### Variaveis de ambiente

| Variavel              | Obrigatoria                                         | Descricao                                   |
| --------------------- | --------------------------------------------------- | ------------------------------------------- |
| `VITE_GITLAB_API_URL` | Nao (padrao `https://git.datasystec.com.br/api/v4`) | Endpoint base da API GitLab                 |
| `VITE_GITLAB_TOKEN`   | Sim para sincronizar                                | Personal Access Token com escopo `read_api` |

Sem o token, o dashboard segue usando os mocks e mostra um aviso solicitando a configuracao. Quando o token e definido, o app busca todas as branches diretamente do GitLab e atualiza as paginas de projetos/branches automaticamente.

## Estrutura de dados

- `src/features/projects/data/projects.ts`: mocks iniciais com metadados dos projetos e link (`urlGit`) para o repositorio.
- `src/features/projects/api/gitlab.ts`: utilitario responsavel por converter o `urlGit` em chamadas REST e normalizar as branches.
- `src/features/projects/hooks/useProjectsData.ts`: hook com React Query que hidrata os mocks com as informacoes reais.

## Scripts uteis

- `npm run dev`: inicia o servidor Vite com hot reload.
- `npm run build`: gera a versao otimizda do dashboard.
- `npm run test`: executa os testes com Vitest.

## Relatorios Playwright

Os relatorios HTML gerados pelo Playwright ficam em `reports/` e sao servidos de forma estatica. Cada branch aponta para o relatorio correspondente, permitindo abrir o report completo diretamente pela interface.
