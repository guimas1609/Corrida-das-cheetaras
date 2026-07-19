# Corrida das Cheetaras — site

Projeto Next.js (App Router + TypeScript + Tailwind) do site da Corrida das
Cheetaras de Bacabal.

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Estrutura

- `app/` — páginas e componentes
- `app/components/CheetaraHead3D.tsx` — onça 3D (react-three-fiber), prévia estilizada
- `public/logo/` — assets de logo processados (lockup completo, mark, favicons)
- `public/images`, `public/video`, `public/models-3d` — assets finais otimizados para o site

Assets originais/brutos (pré-otimização) ficam em `../assets-brutos/` na raiz do repositório.

## Deploy

Hospedado na Vercel, com Root Directory configurado como `site`.
