# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

---

## Base de datos (db.json)

La aplicación usa [json-server](https://github.com/typicode/json-server) para persistir las facturas en el archivo `src/db.json`.: cada vez que se guarda una factura desde el formulario, esta se escribe automáticamente en la base de datos.

### Cómo ejecutar

Ejecuta esta sola instrucción desde la raíz del proyecto:

```sh
npm run dev
```

Esto levanta simultáneamente:
- la API REST en `http://localhost:3001` usando `src/db.json`
- la app en `http://localhost:5173`

Las facturas guardadas se conservan en `src/db.json` aunque reinicies la app.
