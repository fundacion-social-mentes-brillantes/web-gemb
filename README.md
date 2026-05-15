# web-gemb

Sitio oficial de **Gimnasio Emocional Mentes Brillantes (GEMB)**, construido con React + Vite + Tailwind y publicado en Vercel desde GitHub.

Produccion: https://www.gimnasioemocionalmb.com/

## Stack

| Tecnologia | Uso |
|---|---|
| React | Interfaz de usuario |
| Vite | Build y servidor local |
| Tailwind CSS | Estilos responsive |
| Firebase | Firestore, Auth con Google y Analytics opcional |
| Vercel | Hosting y despliegue automatico |

## Instalar y correr local

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Scripts

| Comando | Descripcion |
|---|---|
| `npm run dev` | Servidor local de desarrollo |
| `npm run build` | Build de produccion en `dist/` |
| `npm run preview` | Vista previa del build |
| `npm run lint` | Revision de lint |

## Configurar Firebase local

1. Copia `.env.example` como `.env.local`.
2. Completa los valores reales del proyecto Firebase `gemb-web-tests`.
3. No subas `.env.local` a GitHub. El `.gitignore` ya excluye archivos `*.local`.

Variables requeridas:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
```

`VITE_FIREBASE_MEASUREMENT_ID` es opcional para Analytics. El codigo solo carga Analytics en navegador cuando esa variable existe.

## Configurar variables en Vercel

En Vercel, entra al proyecto y agrega estas variables en **Settings > Environment Variables**:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

Luego redeploya el proyecto para que Vercel compile con las variables.

## Firebase Authentication

En Firebase Authentication deben estar habilitados estos proveedores:

- **Anonymous** para visitantes que responden tests. El sitio firma al visitante de forma anonima antes de crear el lead y guarda `createdByUid`.
- **Google** para administradores del panel privado.

Por ahora el panel admin solo permite el correo:

```txt
fundacionsocial@gimnasioemocionalmb.com
```

Ese usuario tambien debe tener un documento en `adminUsers/{uid}`.

## Firestore

La coleccion principal es:

```txt
testResponses
```

Cada test crea primero un lead en estado `in_progress` con el UID anonimo del visitante. Al finalizar, el mismo UID puede actualizar solo ese documento para guardar respuestas y resultado con estado `new`.

Reglas incluidas en `firestore.rules`:

- Solo visitantes autenticados anonimamente pueden crear un lead valido de test.
- El mismo UID que creo el lead puede completar el test una sola vez mientras el estado sea `in_progress`.
- Solo el admin con Google, email `fundacionsocial@gimnasioemocionalmb.com` y documento `adminUsers/{uid}` puede leer respuestas.
- Solo ese admin puede actualizar seguimiento y notas despues.
- Nadie puede borrar respuestas desde cliente.
- `adminUsers` no se puede escribir desde cliente.

Publica estas reglas desde Firebase Console o Firebase CLI antes de usar el panel en produccion.

```bash
firebase deploy --only firestore:rules --project gemb-web-tests
```

## Crear el primer admin

1. Entra una vez al panel con Google:

```txt
https://www.gimnasioemocionalmb.com/#admin
```

2. Usa el correo `fundacionsocial@gimnasioemocionalmb.com`.
3. Copia el UID del usuario en Firebase Authentication. El panel tambien lo muestra cuando la cuenta no esta autorizada.
4. En Firestore crea:

```txt
coleccion: adminUsers
documento: {UID}
```

Campos:

```js
{
  role: "admin",
  email: "fundacionsocial@gimnasioemocionalmb.com",
  createdAt: new Date()
}
```

5. Vuelve a entrar al panel con la misma cuenta Google.

## Probar guardado de respuestas

1. Configura `.env.local` o las variables en Vercel.
2. Corre `npm run dev`.
3. Abre la landing y haz la **Valoracion inicial**.
4. Antes de responder, completa nombre, WhatsApp y consentimientos.
5. Finaliza el test y revisa en Firestore la coleccion `testResponses`.
6. Repite con **Eneagrama rapido** y **Eneagrama completo**.
7. Entra a `/#admin` con un admin autorizado y confirma que se ven filtros, detalle, notas y exportacion CSV.

## Panel admin

URL de produccion:

```txt
https://www.gimnasioemocionalmb.com/#admin
```

Funciones:

- Login privado con Google Auth.
- Validacion contra `adminUsers/{uid}`.
- Tabla de respuestas.
- Filtros por test, alerta y estado de seguimiento.
- Detalle con contacto, respuestas y resultado.
- Notas internas y estado de seguimiento.
- Boton para abrir WhatsApp.
- Exportacion CSV.

## App Check

App Check no esta implementado en este MVP. Se recomienda activarlo despues en Firebase para reducir abuso de creacion de documentos desde clientes no autorizados.

## Deploy

Flujo normal:

```bash
npm run build
git add .
git commit -m "feat: add Firebase test responses and admin panel"
git push
```

El push a GitHub activa el deploy automatico en Vercel. Si la CLI de Vercel esta autenticada, tambien se puede ejecutar:

```bash
vercel --prod
```
