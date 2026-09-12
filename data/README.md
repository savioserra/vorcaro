# data/ — fonte única do grafo

Edite estes arquivos para contribuir. PRs passam por `node scripts/validate-data.mjs` (CI).

| Arquivo | Conteúdo | Editável à mão |
|---|---|---|
| `entities.json` | Entidades (pessoas, órgãos, filmes...) | sim |
| `facts.json` | Fatos — cada fato gera as conexões do mapa | sim |
| `../src/data/evidence-manifest.json` | Captura PDF por URL | **não** (gerado por `npm run evidence`) |

Tudo no app é derivado destes dois arquivos: timeline = meses dos fatos, arestas = fatos com ≥2 entidades, data de entrada de cada entidade = primeiro fato que a menciona.

## entities.json — schema

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | string | ✓ | slug único (`kebab-case`) |
| `name` | string | ✓ | |
| `type` | string | ✓ | `person` → nó de pessoa; qualquer outro (`org`, `movie`...) → nó-objeto |
| `role` | string | ✓ | legenda curta |
| `group` | string | ✓ | chave livre; estilos conhecidos em `GROUP_STYLES` (desconhecidos recebem estilo neutro) |
| `status` | string | ✓ | chip do nó |
| `initials` | string | ✓ | fallback sem foto (≤3) |
| `photo` | string | | URL Wikimedia etc. |
| `born` | string | | |
| `bio` | string | | resumo factual |
| `contacts` | array | | `{ label, url?, text? }` |
| `notes` | string | | ressalvas |
| `x`, `y` | number | | posição inicial (layout de força ajusta) |

## facts.json — schema

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | string | ✓ | slug único |
| `category` | string | ✓ | chave livre; rótulo/cor em `CATEGORY_STYLES` (desconhecidos recebem estilo neutro) |
| `timestamp` | `YYYY-MM` ou `YYYY-MM-DD` | ✓ | quando o fato ocorreu |
| `title` | string | ✓ | curto (exibido na aresta) |
| `description` | string | ✓ | explicação com datas/valores (≥40 caracteres) |
| `entities` | array de id | ≥1 | entidades envolvidas; ≥2 gera aresta (primeira → demais) |
| `evidence` | array | ≥1 | `{ label, url }` — URL pública e http(s) |

## Regras

- Toda conexão do mapa é um fato com ≥2 entidades + `why` + ≥1 evidência.
- Indício ≠ condenação: redija `description`/`bio` como reportagem, não como sentença.
