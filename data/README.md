# data/ — fonte única do grafo

Edite estes arquivos para contribuir. PRs passam por `node scripts/validate-data.mjs` (CI).

| Arquivo | Conteúdo | Editável à mão |
|---|---|---|
| `people.json` | Nós (pessoas/objetos) | sim |
| `links.json` | Arestas (conexões + evidências) | sim |
| `../src/data/evidence-manifest.json` | Captura PDF por URL | **não** (gerado por `npm run evidence`) |

## people.json — schema

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `id` | string | ✓ | slug único (`kebab-case`) |
| `name` | string | ✓ | |
| `role` | string | ✓ | legenda curta |
| `group` | enum | ✓ | `finance` `politics` `church` `stf` `family` `legal` `personal` `movie` |
| `status` | string | ✓ | chip do nó |
| `initials` | string | ✓ | fallback sem foto (≤3) |
| `since` | `YYYY-MM` | ✓ | primeiro fato → quando o nó entra na timeline |
| `photo` | string | | URL Wikimedia etc. |
| `born` | string | | |
| `bio` | string | | resumo factual |
| `contacts` | array | | `{ label, url?, text? }` |
| `notes` | string | | ressalvas |
| `x`, `y` | number | | posição inicial (layout de força ajusta) |
| `kind` | `"movie"` | | objeto (não pessoa) |

## links.json — schema

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---|---|
| `source`, `target` | id | ✓ | precisam existir em people.json |
| `kind` | enum | ✓ | `family` `personal` `church` `politics` `business` `campaign` `legal` `investigation` `intro` `stf` `movie` |
| `label` | string | ✓ | curto (exibido na aresta) |
| `when` | `YYYY-MM` | ✓ | mês do fato → posição na timeline |
| `why` | string | ✓ | explicação com datas/valores (≥40 caracteres) |
| `evidence` | array | ≥1 | `{ label, url }` — URL deve ser pública e http(s) |

## Regras

- Datas sempre `YYYY-MM`.
- Toda conexão exige `why` + ≥1 evidência.
- Indício ≠ condenação: redija `why`/`bio` como reportagem, não como sentença.
