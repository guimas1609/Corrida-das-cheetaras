# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Site institucional (Next.js) da Corrida das Cheetaras de Bacabal, single-page app com seções de scroll (hero 3D, kit, premiação, percurso). Textos e comentários no código estão em português — mantenha esse padrão.

## Repo layout

```
inspiracao/        referências visuais/moodboard — não entra no site
assets-brutos/     mídia original pré-otimização (imagens, vídeo, 3D, logo) — nunca lida pelo build
site/              projeto Next.js real — é aqui que se trabalha no dia a dia
```

Todo trabalho de código acontece dentro de `site/`. Os outros diretórios são só armazenamento de fonte para assets que, depois de otimizados, são copiados manualmente para `site/public/`.

## Commands (run from `site/`)

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
npm run lint
```

Não há suíte de testes configurada.

## Architecture

- Next.js App Router, TypeScript, Tailwind v4, React Three Fiber/drei/three para o 3D.
- `app/page.tsx` monta a página empilhando seções de `app/components/`: `ScrollJaguarSection` (hero) → `KitSection` → `PrizesSection` → `RouteSection`.
- `app/layout.tsx` renderiza `HolographicBackground` uma vez (fundo fixo global, fora do fluxo das seções) e aplica as fontes Geist.
- Cores da marca (`--color-cheetara-pink` #f02090, `--color-cheetara-purple` #602088) e o fundo holográfico são definidos em `app/globals.css` via custom properties + `@theme inline`; usar as classes utilitárias `bg-gradient-cheetara` / `text-gradient-cheetara` em vez de repetir os tons.
- `CheetaraHead3D.tsx` extrude o SVG do mark da marca (path em `cheetaraMarkPath.ts`) em 3D com gradiente por vértice; gira sozinho e é arrastável, independente de scroll — não acoplar a scroll.
- Imagens do site vêm do Google Drive do organizador mas **nunca** são linkadas direto — passam por `app/api/drive-image/route.ts`, que faz proxy server-side com allowlist de IDs/larguras e cache na CDN da Vercel (link direto do Drive quebra com ORB do Chrome). Para adicionar uma imagem nova do Drive: incluir o ID em `ALLOWED_IDS` (com comentário do que é) nessa rota.
- Vídeo de fundo é servido estático de `public/video/` (não via proxy) porque precisa de Range requests para seek, que o Drive não garante.
- `PhotoPlaceholder.tsx` é o placeholder genérico usado enquanto uma foto real não chega do organizador — trocar por `<Image>` quando a foto for entregue.

## Assets

- Arquivos de mídia grandes em `assets-brutos/` usam Git LFS (`*.mp4`, `*.glb`, `*.hdr` etc. — ver `.gitattributes`).
- Tudo dentro de `site/` (inclusive `site/public/`) é sempre blob normal do Git, mesmo mídia — a Vercel não busca objetos LFS no build, então qualquer arquivo servido pelo site precisa estar acessível direto.

## Deploy

Vercel, com Root Directory configurado como `site`.
