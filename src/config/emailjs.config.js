// EmailJS Configuration
// Get your credentials from: https://dashboard.emailjs.com/

export const emailConfig = {
   serviceId: 'service_9hkdkqj',
   templateId: 'template_0cpk66c', // Necesitas verificar este ID en Email Templates
   publicKey: 'lh79VBbBJh_wZ2wP6'
}

/*
INSTRUCCIONES PARA CONFIGURAR EMAILJS:

1. Crear cuenta en https://www.emailjs.com/
2. Agregar un servicio de email (Gmail, Outlook, etc.)
3. Crear un template con estas variables:
   - {{from_name}} - Nombre del remitente
   - {{from_email}} - Email del remitente
   - {{phone}} - Teléfono (opcional)
   - {{message}} - Mensaje
   - {{to_email}} - Email de destino (se configura desde admin)

4. Copiar tus credenciales aquí:
   - Service ID: En "Email Services"
   - Template ID: En "Email Templates"
   - Public Key: En "Account" > "General"

Template sugerido:
---
Subject: Nuevo mensaje de contacto - {{from_name}}

Hola,

Has recibido un nuevo mensaje desde el formulario de contacto de tu sitio web.

Nombre: {{from_name}}
Email: {{from_email}}
Teléfono: {{phone}}

Mensaje:
{{message}}

---
Enviado desde: CCTV Pro Website
---
*/
