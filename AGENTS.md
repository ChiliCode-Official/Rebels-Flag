# GUÍA DE CONTEXTO Y DIRECTRICES DEL PROYECTO: REBELS FLAG FOOTBALL

Este archivo contiene todo el contexto operativo, arquitectónico, técnico y de diseño para que cualquier Inteligencia Artificial o desarrollador entienda de qué trata este proyecto, qué reglas debe seguir y cómo interactuar con el repositorio.

---

## 1. ¿De qué trata el proyecto?
- **Nombre:** Rebels Flag Football Club (Sitio Oficial).
- **Deporte:** Tocho Bandera / Flag Football.
- **Identidad de Marca:**
  - **Nombre del Club:** "Rebels" / "Rebels Flag Football".
  - **Lema / Hero:** *"La rebeldía es un síntoma de inteligencia."*
  - **Paleta de Colores:** Fondo oscuro deportivo (`#0e0e0e`, `#151515`, `#1b1b1b`) con acento en **Azul Rayo Eléctrico** (`#00d2ff` y `#0099ff`), en lugar de los colores verdes de la plantilla original.
  - **Logo Oficial:** [`logo rebel.png`](./framerusercontent.com/images/logo_rebel.png).

---

## 2. Repositorio y Despliegue (Hosting)
- **Ruta local del repositorio:** `C:\Users\usuario09\Documents\GitHub\Rebels-Flag`
- **Hosting:** **GitHub Pages** (Alojamiento 100% estático).
- **Regla Fundamental:** La web debe ser 100% estática (HTML5, CSS3, Vanilla JS). No se deben usar servidores Node.js dinámicos, SSR ni backends pesados que impidan el funcionamiento directo en GitHub Pages.
- **Control de Versiones:** El usuario sube los cambios mediante **GitHub Desktop**. Cada cambio debe ser limpio y sin archivos basura (.tmp, logs, carpetas de respaldo).

---

## 3. Base de Datos y Marcador en Vivo
- **Base de Datos:** **Firebase (Plan Spark 100% Gratuito)**:
  - Base de datos Cloud Firestore / Realtime Database.
  - Archivo de configuración: [`js/firebase-config.js`](./js/firebase-config.js).
- **Fallback Gratuito Automático:** Si no hay credenciales de Firebase configuradas, el sistema utiliza `LocalStorage` sincronizado instantáneamente.
- **Panel de Administración Móvil:** [`admin.html`](./admin.html):
  - Diseñado con UX Mobile-First para actualizar marcadores, sumar puntos (+1, +3, +6), programar partidos y cambiar la cuenta regresiva directamente desde un teléfono móvil.
  - Sincronizador en la web: [`js/live-sync.js`](./js/live-sync.js).

---

## 4. Estructura de Archivos y Responsabilidades

```text
/
├── index.html                  # Página de inicio con Hero, Countdown, Sponsors y Partidos
├── admin.html                  # Panel de control táctil para celular (marcador y calendario)
├── table.html                  # Tabla de posiciones y clasificación de la liga
├── schedule.html               # Calendario de juegos
├── results.html                # Historial de resultados
├── about-us.html               # Historia y valores del club
├── news.html                   # Artículos y noticias
├── tickets.html                # Boletos para juegos
├── .gitignore                  # Filtro para ignorar temporales y basura
├── js/
│   ├── firebase-config.js      # Configuración de Firebase Firestore y fallback local
│   ├── live-sync.js            # Script ligero de sincronización de marcador y countdown
│   └── rebels-lock.css         # Estilos visuales inamovibles (Azul Rayo, logo, sponsors, etc.)
└── framerusercontent.com/
    └── images/                 # Todos los assets locales (fotos, logos, escudos)
        ├── logo_rebel.png      # Logo oficial de Rebels
        └── rebels_hero.jpg     # Imagen oficial del Hero (tocho bandera)
```

---

## 5. Reglas Cruciales que la IA DEBE Seguir Siempre

1. **PROHIBIDO bucles infinitos en JS:**
   - **NUNCA** utilices `MutationObserver` globales que modifiquen el DOM de forma recursiva o ejecuten `TreeWalker` continuos. Esto provoca el error *"Page Unresponsive"* y satura la CPU del navegador.
   - Todo ajuste estético o de diseño debe resolverse preferentemente mediante **CSS** en [`js/rebels-lock.css`](./js/rebels-lock.css).

2. **Cero dependencias de servidores de Framer:**
   - La página proviene de una plantilla deportiva premium, pero **no debe enviar telemetría a `events.framer.com`** ni mostrar marcas de agua como *"Made in Framer"*.
   - Todos los recursos e imágenes deben cargarse localmente desde `./framerusercontent.com/images/`.

3. **Idioma y Tono:**
   - Todo el contenido debe estar en **Español**.
   - Terminología de **Tocho Bandera / Flag Football** (emparrillado, rutas, touchdowns, intercepciones, banderas, etc.).

4. **Regla de Alternativas Gratuitas:**
   - Siempre que se proponga o integre una herramienta externa, se debe priorizar una **solución 100% gratuita** (ej. Firebase Spark, Google Fonts, GitHub Pages, Imgur).

5. **Responsividad Total:**
   - Cualquier sección nueva (como el banner de sponsors o el panel móvil) debe adaptarse a pantallas móviles (smartphones) y de escritorio.
