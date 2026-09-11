# vorcaro

Mapa de pessoas (grafo) — caso Banco Master / Operação Compliance Zero.

React 19 · Vite 7 · @xyflow/react · motion · Tailwind v4 · d3-force.

## Comandos

```bash
npm install
npm run dev            # http://localhost:5173
npm run build          # dist/ (base /vorcaro/, override: BASE_PATH)
npm run preview        # serve dist/ em :4173
npm run evidence       # baixa/rearquiva evidências em public/evidence/ (+ manifest)
```

## Estrutura

```
src/data/graph.js               # PEOPLE (nós) e LINKS (arestas) — fonte única de dados
src/data/evidence-manifest.json # url → PDF local (gerado)
src/data/evidence.js            # helper localPdf(url)
public/evidence/*.pdf           # capturas arquivadas (assets estáticos)
scripts/build-evidence.mjs      # gerador das capturas
.github/workflows/deploy.yml    # GitHub Pages (actions/deploy-pages)
```

## Schema

PEOPLE: `{ id, name, role, group, status, initials, photo?, since, born?, bio?, contacts?, notes?, x, y }`
— `since`: mês (YYYY-MM) do primeiro fato relevante (entrada no mapa).

LINKS: `{ source, target, kind, label, when, why, evidence: [{ label, url }] }`
— `when`: mês do fato documentado; `why`: explicação; `evidence`: fontes (PDF arquivado + URL original).

TIMELINE: derivado de `since`/`when` (`{ min, max, months }`).

## Evidências

```bash
node scripts/build-evidence.mjs           # pula existentes
node scripts/build-evidence.mjs --force   # recaptura tudo
```

Captura do HTML público (fallback: r.jina.ai), texto extraído e renderizado em PDF (pdfkit).
`ok: false` no manifest = captura parcial (paywall/consentimento) — URL original permanece no app.

## Deploy

GitHub Actions em `.github/workflows/deploy.yml` (push em `main`).
Requer Pages: Settings → Pages → Source: GitHub Actions.
Base ajustada automaticamente: `--base=/${{ github.event.repository.name }}/`.
