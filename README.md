# Gestión de Usuarios y Recuperación de Contraseñas - Proyecto Backend II

Este proyecto es una aplicación web desarrollada con Node.js, Express, Handlebars, y MongoDB. 

Proporciona funcionalidades de gestión de usuarios, incluyendo un sistema de recuperación de contraseña basado en tokens seguros, integración con JWT y un flujo modularizado con servicios, repositorios y DTOs.

# Características
Gestión de Usuarios:

--Registro de nuevos usuarios.
.Inicio de sesión con autenticación mediante Passport y JWT.
.Recuperación de contraseña con tokens seguros y expiración.
.Recuperación de Contraseña:

--Generación de un token único para restablecer la contraseña.
.Validación del token en el lado del servidor.
.Restablecimiento seguro de la contraseña con validaciones.

--Arquitectura Modular:
.Uso de la estructura DAO (Data Access Object) para la gestión de datos.
.Implementación de DTOs (Data Transfer Objects) para mantener una estructura clara en el intercambio de datos.
.Servicios y repositorios para desacoplar la lógica de negocio y el acceso a datos.
    
    El flujo sería el siguiente:
     
     userModel.js --> userDAO.js --> UserRepository.js --> userService.js --> userController.js --> users.js


# Tecnologías Utilizadas
--Backend:
Node.js
Express
Passport.js
MongoDB con Mongoose
Handlebars como motor de plantillas

--Gestión de Estado y Autenticación:
JWT
Cookie-parser
Infraestructura:
Configuración a través de variables de entorno con dotenv.

--------------------------------------------------------------------------

# Instalación y Verificación

Iniciar la aplicación con el script: 

npm start


Para facilitar la corrección y la verficación de endpoints... ya hay usuarios creados

En Postman se pueden verificar de la siguiente manera

Metodo POST para realizar un login de un usuario en esta url:  http://localhost:3000/api/sessions/login

Usuario de ejemplo (pueden tambien crearlo en la interfaz o mediante Postman) -->

key        value
----       ------
email     robertf.coder@gmail.com
password  789

Si el inicio funciona correctamente habrá un mensaje JSON de inicio de sesión exitoso y un token, en caso de utilizar el renderizado para hacer las verificaciones se renderizará el mensaje JSON con el token

Si se desea verificar cual es el usuario que está con la sesión inciada se deberá utilizar el token dado 

y hacer un método GET a esta url http://localhost:3000/api/sessions/current, caso exitoso devolverá en formato JSON el id y el email debido al uso de Data Transfer Object para devolver únicamente los valores que no son sensibles

Para probar el endpoint de adición de productos dependiendo el role de usuario se deberá usar el endpoint POST http://localhost:3000/api/products ingresar el token previamente dado, e ingresar un body con la siguiente estructura de producto

{
    "name": "Producto 2",
    "price": 100,
    "description": "Descripción del producto"
}

Se verificará con los middlewares correspondientes si el usuario esta autorizado, si lo está se devolverá el json con un id de producto, caso contrario se devolverá un mensaje JSON aclarando el acceso

Para poder agregar un producto a un cart el endpoint seria el siguiente POST http://localhost:3000/api/cart/add-to-cart/:productid
 674dec2f08ad46d399fa2046  (id de producto ya en la base de datos), al igual que en el caso anterior con el token del usuario se devolverá un mensaje json con el producto agregado al carrito, dependiendo si esta autorizado o no

--Flujo del Sistema de Recuperación de Contraseña

.Generación de Token:
Un usuario solicita recuperar su contraseña mediante un formulario.
Se genera un token único asociado al usuario y se guarda en la base de datos con un tiempo de expiración.
El token se envía por correo electrónico (nodemailer) al usuario y se renderizará (en caso de verificar el codigo por interfaz) con un mensaje JSON diciendo que el correo fue enviado
La URL pertinente a este paso seria la siguiente http://localhost:3000/password-reset/send-reset

.Validación del Token:
El usuario accede al enlace proporcionado con el token 
El servidor valida el token: verifica su existencia y si ha expirado.

.Restablecimiento de Contraseña:
El email llegaría a la casilla de correo proporcionada, al ingresar se renderiza una vista handlebars con un formulario para cambiar la contraseña
El usuario envía su nueva contraseña.
El servidor valida el token nuevamente y actualiza la contraseña en la base de datos, en caso de escribir la misma contraseña se vería un mensaje en formato json aclarando que no se puede usar la misma contraseña, en caso de cambiarla correctamente, ocurriría lo mismo con un mensaje satisfactorio

--Endpoint compra de carrito

POST http://localhost:3000/api/cart/:cid/purchase

:cid: Es el ID único del carrito que se desea procesar, ejemplo...(675740c6a2461317b42cc0f0), id de carrito creado ya en la base de datos, para que funcione tiene que usarse el token del usuario con el que se hizo el login

Si la respuesta es exitosa esto seria lo que se veria en postman

{
    "message": "Compra procesada",
    "notPurchased": [],
    "totalAmount": 500
}

y en la consola:
Ticket generado: {
  code: '1657154f7cf265c53e1a23c03b3515d1',
  amount: 500,
  purchaser: 'robert.facundo@hotmail.com',
  _id: new ObjectId('6757412e31095e034f671f8f'),
  purchase_datetime: 2024-12-09T19:12:46.450Z
}

# Agradecimientos

Quiero expresar mi agradecimiento a mis tutores y profesores del curso. 

Este proyecto es el resultado del aprendizaje adquirido durante el curso y representa mi compromiso por seguir creciendo en este fascinante mundo del desarrollo web.

# Job Hunting

Actualmente estoy en la búsqueda activa de mi primer empleo como desarrollador web, una oportunidad que no solo marcaría mi inicio en el mundo IT, sino que representaría un significativo cambio en mi vida.

A mis tutores y profesores: dado que ustedes ya forman parte del sector IT, tal vez estén al tanto de alguna vacante o conozcan personas en busca de talento emergente. Cualquier recomendación o consejo sería invaluable para mí, y estaré profundamente agradecido por su apoyo en esta etapa inicial de mi carrera.

Si desean conocer más sobre mi trabajo, les invito a visitar mi portfolio personal, donde encontrarán otros proyectos en los que he trabajado, mis habilidades técnicas, y más información sobre mí como profesional en desarrollo.

Portfolio: https://robertfacundo.netlify.app/

¡No duden en contactarme si tienen alguna oportunidad, recomendación o idea de colaboración en mente!

Gracias por tomarte el tiempo de llegar hasta acá.

Atentamente,

Facundo Robert



