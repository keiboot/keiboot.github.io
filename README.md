# Keitoo — Portafolio 2026 (KietoStudy)

Portafolio personal de **Keitoo**, editor de video para creadores de contenido y marcas.

Esta es la **versión nueva** del sitio. La original sigue intacta en `keiboot.portafolio/`.

## Estructura

```
.
├── index.html          Portada (hero, showreel, servicios, proceso,
│                       testimonios, garantías, programas, FAQ, CTA)
├── proyectos/          Portafolio con filtros y modal de video
├── contacto/           Formulario (Web3Forms) + redes
├── gracias/            Página de confirmación tras enviar el formulario
├── 404.html            Página de error
├── style.css           Todos los estilos
├── script.js           JS compartido (menú, modal, filtros, FAQ, animaciones)
├── robots.txt
├── sitemap.xml
└── assets/img/         Fotos de clientes y logos de programas
```

## Cómo verlo en local

Ábrelo con un servidor local (no con `file://`, porque las rutas usan `/`):

```bash
python -m http.server 8000
```

Luego entra a <http://localhost:8000>.

En VS Code también sirve la extensión **Live Server**.

## Qué revisar antes de publicar

- [x] **Formulario**: la `access_key` de Web3Forms es la misma que la del sitio viejo y el `redirect` apunta a `https://keiboot.github.io/gracias/`.
- [x] **Métricas del hero**: 4 años, 24–48 h y 6 meses de backup, las mismas que usa el copy del sitio (meta description y "Sobre mí").
- [x] **Porcentajes de habilidades**: Premiere 82%, After Effects 57%, Photoshop 45%.
- [x] **Enlaces e imágenes**: todas las páginas y rutas locales responden, y los 35 IDs de YouTube del portafolio existen.
- [x] **Subir esta versión**: publicada el 20/10/2026 en `keiboot.github.io` (commit `e28128c`).
- [x] **Imagen del hero**: `assets/img/kevin.jpg` subida; responde 200 en producción.
- [x] **Redes**: Instagram `@kietoobtx`, X `@kietoo_` y TikTok `@__keitoo` en todas las páginas.
- [ ] **Día 19 del reto**: la tarjeta "Reto app en 30 días — Día 19" usa el mismo vídeo que el Día 10 (`srqLkFamv3k`). Cambia su `data-video` por el ID correcto o borra la tarjeta (y actualiza los contadores de los filtros).

## Publicar

El repo `keiboot.github.io` se sirve desde la raíz. Para publicar esta versión,
copia el contenido de esta carpeta sobre la raíz del repo y haz commit.

## Notas técnicas

- Sin dependencias ni build. Solo HTML, CSS y JS.
- Las miniaturas de la página de proyectos se cargan como imágenes desde
  `i.ytimg.com`; el iframe de YouTube solo se crea al hacer clic. Antes se
  cargaban 9 reproductores a la vez.
- Los embeds usan `youtube-nocookie.com`.
- Las imágenes están redimensionadas al tamaño real en que se muestran
  (128 px las fotos y logos, 1200×630 la portada para compartir): 1352 KB → 109 KB.
- Respeta `prefers-reduced-motion`.
- Sin JS el sitio sigue siendo legible: las animaciones de entrada solo se
  activan si existe la clase `.js` en `<html>`.
