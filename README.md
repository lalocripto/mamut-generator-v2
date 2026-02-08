# 🚀 Espacio Cripto - Generador de Contenido IA

Generador de contenido con la voz y tono entrenado de Espacio Cripto.

## Estructura del proyecto

```
/
├── index.html      # Interfaz del generador
├── api/
│   └── generate.js # Proxy para la API de Anthropic
├── vercel.json     # Configuración de Vercel
└── README.md       # Este archivo
```

## Cómo usar

1. Despliega en Vercel (ver instrucciones abajo)
2. Ingresa tu API key de Claude (sk-ant-...)
3. Pega el transcript del podcast
4. Selecciona los formatos que quieras generar
5. ¡Listo!

## Desplegar en Vercel

### Opción 1: Desde GitHub

1. Sube este repositorio a GitHub (privado)
2. Ve a [vercel.com/new](https://vercel.com/new)
3. Importa el repositorio
4. Click en Deploy

### Opción 2: CLI de Vercel

```bash
npm i -g vercel
vercel
```

## Formatos disponibles

- 📰 Newsletter Semanal (estilo "Navegando")
- 🧵 Hilo de Twitter/X
- 𝕏 Posts de Twitter/X
- 💼 Post de LinkedIn
- 📝 Artículo para Blog SEO
- ✈️ Mensaje de Telegram
- 🎬 Sugerencias de Clips

## Notas

- Cada usuario debe ingresar su propia API key de Claude
- Las API keys se guardan en localStorage (solo en su navegador)
- El proxy `/api/generate` evita problemas de CORS

---

Hecho con 💛 para Espacio Cripto
