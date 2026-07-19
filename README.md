# Corrida das Cheetaras de Bacabal — Site

Site oficial da maior corrida do Maranhão.

## Estrutura do projeto

```
inspiracao/            → referências visuais, prints, moodboard (não entra no site, é só para guiar o design)
assets-brutos/
  imagens/              → fotos e imagens originais (ex: exportadas do Google Drive), antes de otimizar
  video/                → vídeos originais (aftermovie, drone, etc.)
  3d/                    → modelos 3D originais (.glb, .gltf, .fbx, .obj)
  logo/                  → arquivos de logo originais (.ai, .psd, .svg, .png em alta resolução)
site/                   → projeto Next.js (criado depois que o Node.js estiver instalado)
```

Os arquivos finais e otimizados para uso no site (compactados, redimensionados, convertidos)
vão para dentro de `site/public/` conforme forem sendo preparados — os arquivos brutos ficam
em `assets-brutos/` como fonte original, sem uso direto no site.

## Git LFS

Este repositório usa [Git LFS](https://git-lfs.github.com/) para arquivos de mídia grandes
(imagens, vídeo, modelos 3D). Rode `git lfs install` uma vez após clonar o repositório.

## Status

- [x] Estrutura de pastas organizada
- [x] Repositório Git + LFS configurado
- [ ] Node.js instalado
- [ ] Projeto Next.js criado
- [ ] Assets brutos recebidos (imagens do Drive, vídeo, 3D, logo)
