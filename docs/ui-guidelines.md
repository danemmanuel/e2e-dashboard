# UI & Material Guidelines

## Estilo Visual

- **Minimal Material:** tons neutros (cinzas + destaque em teal/indigo), muito espaço em branco.
- **Tipografia:** `"IBM Plex Sans"` como primária; fallback `"Segoe UI"`, `sans-serif`.
- **Iconografia:** MUI Icons; manter coerência sem misturar estilos outline/filled no mesmo bloco.

## Layout

- App Shell com header fino, sidebar compacta e conteúdo com grid responsivo.
- Breakpoints do MUI (xs, sm, md, lg) mapeados para colunas 1/2/3/4.
- Cards com bordas suaves (`borderRadius: 12`) e sombras leves (`1/2` do MUI).

## Componentização

- Criar `components/common` para peças reutilizáveis (Card, MetricChip, TrendLine).
- Páginas/feature modules em `features/<nome>/` com hooks próprios (`use<Feature>Data`).
- `theme.ts` centraliza paleta, tipografia, espaçamentos e overrides.

## Interações

- Microanimações usando `theme.transitions.create` (duração 120-200ms).
- Feedback visual imediato (hover, focus, active) alinhado ao tema.
- Skeleton loaders antes dos dados; evitar placeholders vazios.

## Acessibilidade

- Contraste mínimo 4.5:1 para texto normal.
- Controles com foco visível (outline custom no tema).
- `aria-live` em mensagens de atualização ou toasts.

## Referências Úteis

- https://mui.com/design-kit/
- https://material.io/design/color/the-color-system.html
