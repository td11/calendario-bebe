# Calendario de Votación - Bebé 🍼

Calendario interactivo para votar el día de nacimiento de la bebé.

## Características

- Calendario del 21 de Septiembre al 25 de Octubre 2025
- Votación con nombre
- Leaderboard / Porra con gráficas
- Persistencia en Vercel KV

## Despliegue en Vercel

1. Sube el código a un repositorio de GitHub
2. Conecta el repositorio en [vercel.com/new](https://vercel.com/new)
3. Configura la integración de **Upstash Redis** desde el Marketplace de Vercel
4. Vercel configurará automáticamente las variables de entorno `KV_REST_API_URL` y `KV_REST_API_TOKEN`
5. ¡Despliega!

## Desarrollo local

```bash
npm install
npm run dev
```

## Estructura

- `src/app/page.tsx` - Página principal con calendario y leaderboard
- `src/app/api/votes/route.ts` - API para votar y obtener resultados
- `src/app/layout.tsx` - Layout de la aplicación
- `src/app/globals.css` - Estilos globales
