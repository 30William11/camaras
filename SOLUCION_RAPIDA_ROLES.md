# Solución Rápida: Actualizar Rol en Firestore

Si los menús de "Productos" y "Usuarios" no aparecen, es porque el rol en Firestore tiene mayúsculas incorrectas.

## Opción 1: Actualizar desde Firebase Console (Más Rápido)

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Firestore Database**
4. Busca la colección **`users`**
5. Encuentra tu documento de usuario (usa tu email para identificarlo)
6. Edita el campo **`role`** y cámbialo a: **`superadmin`** (todo en minúsculas)
7. Guarda los cambios
8. Recarga la aplicación (Ctrl + Shift + R)

## Opción 2: Verificar en la Consola del Navegador

1. Abre http://localhost:5173
2. Presiona F12 para abrir DevTools
3. Ve a la pestaña Console
4. Ejecuta este código:

```javascript
// Ver tu perfil actual
const authStore = useAuthStore();
console.log("Mi perfil:", authStore.profile);
console.log("Mi rol:", authStore.profile?.role);
```

5. Si el rol NO es exactamente `"superadmin"` (minúsculas), actualízalo en Firestore (Opción 1)

## Valores Correctos de Roles

Asegúrate de usar estos valores EXACTOS (todo en minúsculas):

- ✅ `trabajador`
- ✅ `admin`
- ✅ `superadmin`

❌ NO uses: `Trabajador`, `Admin`, `Superadmin`, `SUPERADMIN`, etc.

## Después de Actualizar

1. Cierra sesión
2. Vuelve a iniciar sesión
3. Los menús deberían aparecer automáticamente
