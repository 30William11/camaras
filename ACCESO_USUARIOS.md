# Cómo Acceder al Módulo de Usuarios

## El Problema

El menú de "Usuarios" (👥) en el sidebar **solo es visible para usuarios con rol `superadmin`**. Si no ves este menú, es porque:

1. No has iniciado sesión, o
2. Tu usuario actual no tiene el rol `superadmin`

## Solución: Crear un Usuario Superadmin

Tienes **3 opciones** para crear un superadmin:

---

### Opción 1: Usar el Script Automatizado (Recomendado)

He creado un script que te ayudará a crear el primer superadmin:

```bash
# 1. Instalar dotenv si no lo tienes
npm install dotenv

# 2. Ejecutar el script
node -r dotenv/config scripts/create-superadmin.js
```

El script te pedirá:

- Nombre completo
- Email
- Contraseña (mínimo 6 caracteres)

Y creará automáticamente el usuario con rol `superadmin`.

---

### Opción 2: Usar la Consola de Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Authentication** → **Users** → **Add user**
4. Crea un usuario con email y contraseña
5. Copia el **UID** del usuario creado
6. Ve a **Firestore Database** → **users** (colección)
7. Crea un documento con el **UID** como ID y estos campos:
   ```json
   {
     "displayName": "Admin Principal",
     "email": "admin@ejemplo.com",
     "role": "superadmin",
     "active": true,
     "createdAt": "2025-12-02T14:00:00.000Z"
   }
   ```

---

### Opción 3: Usar la Interfaz de Usuarios (Una vez tengas acceso)

Una vez que tengas un superadmin y puedas acceder al módulo de usuarios:

1. Inicia sesión como superadmin
2. Ve a "Usuarios" en el sidebar
3. Haz clic en "Crear Usuario"
4. Llena el formulario con rol "Super Admin"

---

## Verificar que Funciona

1. **Cierra sesión** si ya estás autenticado
2. **Inicia sesión** con el email y contraseña del superadmin
3. Verifica que en el sidebar aparezca el menú **"Usuarios" (👥)**
4. Haz clic en "Usuarios" para ver la tabla

---

## Roles Disponibles

- **`trabajador`**: Solo ve Dashboard y Cotizaciones
- **`admin`**: Ve Dashboard, Cotizaciones y Productos
- **`superadmin`**: Ve todo, incluyendo Usuarios

---

## Solución de Problemas

### No veo el menú de Usuarios después de iniciar sesión

1. Verifica en la consola del navegador (F12) que tu perfil tenga `role: "superadmin"`
2. Ejecuta en la consola:
   ```javascript
   import { useAuthStore } from "@/stores/auth";
   const authStore = useAuthStore();
   console.log(authStore.profile);
   ```
3. Si el rol no es `superadmin`, actualiza el documento en Firestore

### El script da error

Asegúrate de que:

- Tu archivo `.env` tenga todas las variables de Firebase configuradas
- Las variables comiencen con `VITE_` (ejemplo: `VITE_FIREBASE_API_KEY`)
- Hayas instalado `dotenv`: `npm install dotenv`
