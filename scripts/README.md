# Scripts de Utilidad

## Crear Superadmin

Script para crear el primer usuario superadmin en Firebase.

### Uso

```bash
# Cargar variables de entorno y ejecutar
node -r dotenv/config scripts/create-superadmin.js
```

### Qué hace

1. Solicita nombre, email y contraseña
2. Crea el usuario en Firebase Authentication
3. Crea el perfil en Firestore con rol 'superadmin'
4. El usuario puede iniciar sesión inmediatamente

### Requisitos

- Tener configurado el archivo `.env` con las credenciales de Firebase
- Tener instalado `dotenv`: `npm install dotenv`
