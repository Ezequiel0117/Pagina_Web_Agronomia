================================================================================
          DOCUMENTACIÓN DEL PROYECTO WEB - MERCADO SOSTENIBLE
================================================================================

PROYECTO: Página Web de Mercado de Producción Sostenible
FRAMEWORK: Django 5.2.8
LENGUAJE: Python
BASE DE DATOS: SQLite3
CONTROL DE VERSIONES: Git/GitHub
FECHA: Noviembre 2025

================================================================================
1. INTRODUCCIÓN
================================================================================

Este proyecto es una aplicación web desarrollada con Django para un mercado
de productos agrícolas sostenibles. La plataforma conecta productores locales
con consumidores, ofreciendo productos acuícolas, pesqueros, ganaderos y 
vegetales.

El proyecto está diseñado para trabajo colaborativo, donde cada miembro del
equipo desarrolla una sección específica de la aplicación.


================================================================================
2. CONFIGURACIÓN INICIAL DEL PROYECTO
================================================================================

2.1 CREACIÓN DEL ENTORNO VIRTUAL
---------------------------------
Para aislar las dependencias del proyecto, se creó un entorno virtual de Python:

Comando utilizado:
    python -m venv venv

Activación del entorno virtual:
    - Windows: venv\Scripts\activate
    - Linux/Mac: source venv/bin/activate

Beneficios:
    - Aislamiento de dependencias
    - Evita conflictos con otros proyectos
    - Facilita la portabilidad del proyecto


2.2 INSTALACIÓN DE DJANGO
--------------------------
Una vez activado el entorno virtual, se instaló Django:

Comando:
    pip install django

Versión instalada: Django 5.2.8


2.3 INICIO DEL PROYECTO DJANGO
-------------------------------
Se creó el proyecto principal con el nombre "config":

Comando:
    django-admin startproject config .

El punto (.) al final indica que se cree en el directorio actual.

Estructura generada:
    config/
        __init__.py      - Marca el directorio como paquete Python
        asgi.py          - Configuración para servidores ASGI
        settings.py      - Configuración principal del proyecto
        urls.py          - Enrutamiento principal de URLs
        wsgi.py          - Configuración para servidores WSGI

    manage.py            - Script de administración de Django


================================================================================
3. CONFIGURACIÓN DEL PROYECTO (config)
================================================================================

3.1 ARCHIVO: settings.py
------------------------
Configuraciones principales realizadas:

DEBUG = True
    - Modo de desarrollo activado (mostrar errores detallados)
    - IMPORTANTE: Cambiar a False en producción

ALLOWED_HOSTS = []
    - Lista de hosts permitidos (vacía en desarrollo)

INSTALLED_APPS:
    - django.contrib.admin         (Panel de administración)
    - django.contrib.auth          (Sistema de autenticación)
    - django.contrib.contenttypes  (Gestión de tipos de contenido)
    - django.contrib.sessions      (Manejo de sesiones)
    - django.contrib.messages      (Sistema de mensajes)
    - django.contrib.staticfiles   (Gestión de archivos estáticos)
    - productos                    (Aplicación personalizada creada)

TEMPLATES:
    - DIRS: [os.path.join(BASE_DIR, 'templates')]
    - Configuración para buscar plantillas HTML en carpeta 'templates'

DATABASES:
    - Motor: SQLite3
    - Archivo: db.sqlite3
    - Base de datos ligera ideal para desarrollo

STATIC_URL = '/static/'
STATICFILES_DIRS = [os.path.join(BASE_DIR, 'static')]
    - Configuración para servir archivos estáticos (CSS, JS, imágenes)
    - Los archivos se buscan en la carpeta 'static' del proyecto


3.2 ARCHIVO: urls.py
--------------------
Configuración de rutas principales:

    from django.contrib import admin
    from django.urls import path, include

    urlpatterns = [
        path('admin/', admin.site.urls),
        path('', include('productos.urls')),
    ]

Explicación:
    - 'admin/': Acceso al panel de administración de Django
    - '': La raíz del sitio incluye las URLs de la app 'productos'


================================================================================
4. APLICACIÓN PRODUCTOS
================================================================================

4.1 CREACIÓN DE LA APLICACIÓN
------------------------------
Se creó la aplicación 'productos' para manejar la lógica del negocio:

Comando:
    python manage.py startapp productos

Estructura generada:
    productos/
        __init__.py
        admin.py         - Configuración del panel de administración
        apps.py          - Configuración de la aplicación
        models.py        - Definición de modelos de datos
        tests.py         - Pruebas unitarias
        views.py         - Lógica de las vistas
        urls.py          - Rutas específicas de la aplicación (creado manualmente)
        migrations/      - Historial de cambios en la base de datos


4.2 ARCHIVO: views.py
---------------------
Contiene la función que renderiza la página principal:

    from django.shortcuts import render

    def pagina_principal(request):
        return render(request, 'index.html')

Función:
    - Recibe peticiones HTTP
    - Renderiza la plantilla 'index.html'
    - Retorna la respuesta al navegador


4.3 ARCHIVO: urls.py (productos)
---------------------------------
Creado manualmente para definir las rutas de la aplicación:

    from django.urls import path
    from . import views

    urlpatterns = [
        path('', views.pagina_principal, name='principal'),
    ]

Explicación:
    - Ruta vacía ('') apunta a la función pagina_principal
    - name='principal': nombre de referencia para la URL


4.4 REGISTRO EN settings.py
----------------------------
La aplicación 'productos' fue agregada a INSTALLED_APPS para que Django
la reconozca y pueda utilizarla.


================================================================================
5. PLANTILLAS HTML (Templates)
================================================================================

Se creó la carpeta 'templates' en la raíz del proyecto para almacenar los
archivos HTML.


5.1 ARCHIVO: base.html
----------------------
Plantilla base que contiene la estructura común de todas las páginas.

PROPÓSITO:
    - Evitar duplicación de código
    - Mantener consistencia en el diseño
    - Facilitar el mantenimiento

COMPONENTES PRINCIPALES:

a) HEAD - Configuración y recursos externos:
   -----------------------------------------
   - Meta charset UTF-8 para caracteres especiales
   - Viewport responsive para dispositivos móviles
   - Título dinámico con bloques de Django
   - Tailwind CSS (framework CSS mediante CDN)
   - Google Fonts: Inter (tipografía moderna)
   - Archivo CSS personalizado (style.css)
   - Configuración de colores personalizados de Tailwind:
     * forest-green (#2B601E)
     * earth-taupe (#A88D66)
     * leaf-green (#91D956)
     * sky-blue (#A1C8E8)
     * golden-harvest (#D1A24E)

b) NAVBAR - Barra de navegación:
   -----------------------------
   - Logo del sitio con ícono SVG de carrito de compras
   - Nombre del sitio: "Mercado Sostenible"
   - Enlaces de navegación a secciones:
     * Productos Acuícolas 🐟
     * Productos Pesqueros 🦐
     * Productos Ganaderos 🥩
     * Productos Vegetales 🥬
   - Menú responsive (hamburguesa) para dispositivos móviles
   - Efecto de blur (desenfoque) en el fondo
   - Posición sticky (se mantiene visible al hacer scroll)
   - Efectos hover con cambios de color y escala

c) CONTENIDO PRINCIPAL:
   --------------------
   - Bloque {% block content %}{% endblock %}
   - Permite que otras plantillas inyecten su contenido específico
   - Uso de herencia de plantillas de Django

d) FOOTER - Pie de página:
   -----------------------
   - Información de la empresa
   - Enlaces rápidos a secciones
   - Datos de contacto:
     * Email: info@mercadosostenible.com
     * Teléfono: +593 123 456 789
     * Ubicación: Milagro, Guayas, Ecuador
   - Copyright 2025
   - Diseño en grid responsive de 3 columnas

e) CHATBOT - Asistente Virtual Interactivo:
   ----------------------------------------
   BOTÓN FLOTANTE:
     - Posición fija en la esquina inferior derecha
     - Ícono de mensaje/chat
     - Gradiente de colores verde (forest-green a leaf-green)
     - Efecto hover con escala aumentada
     - Sombra elevada para destacar

   VENTANA DE CHAT:
     - Diseño tipo mensajero moderno
     - Header con indicador de estado (punto verde pulsante)
     - Área de mensajes con scroll automático
     - Input de texto con diseño redondeado
     - Botón de envío con ícono de papel de avión
     - Oculta por defecto, se muestra al hacer clic en el botón

   FUNCIONALIDAD DEL CHATBOT:
     Sistema de menús estructurado con contexto:

     MENÚ PRINCIPAL (currentContext = 'main_menu'):
       1. Información sobre Productos Acuícolas 🐟
       2. Información sobre Productos Pesqueros 🦐
       3. Información sobre Productos Ganaderos 🥩
       4. Información sobre Productos Vegetales 🥬
       5. Preguntas Frecuentes (FAQ) ❓
       6. Contacto y Horarios 📞
       7. Volver al menú principal 🏠

     SUBMENÚ FAQ (currentContext = 'faq_menu'):
       1. ¿Cuáles son los precios promedio? 💰
       2. ¿Ofrecen envío a domicilio? 🚚
       3. ¿Son productos sostenibles/ecológicos? 🌱
       4. ¿Dónde están ubicados? 📍
       5. Volver al menú principal 🏠

     RESPUESTAS AUTOMÁTICAS:
       - Opción 1 (Acuícolas): Información sobre tilapia y camarones ($12.50/kg)
       - Opción 2 (Pesqueros): Pescado y marisco fresco ($18.00/kg)
       - Opción 3 (Ganaderos): Carnes y lácteos ($9.75/kg)
       - Opción 4 (Vegetales): Frutas y verduras de temporada ($3.50/kg)
       - Opción 5 (FAQ): Muestra submenú de preguntas frecuentes
       - Opción 6 (Contacto): Teléfono, email y horarios de atención

     CARACTERÍSTICAS TÉCNICAS:
       - Variable currentContext para rastrear el estado del menú
       - Función addMessage() para mostrar mensajes del bot y usuario
       - Función displayMainMenu() para mostrar opciones principales
       - Función displayFAQMenu() para mostrar preguntas frecuentes
       - Función handleBotResponse() con switch/case para procesar opciones
       - Indicador de "escribiendo" (typing indicator) con animación
       - Sistema de emojis para respuestas contextuales
       - Scroll automático al fondo al recibir mensajes
       - Mensajes del usuario alineados a la derecha (gris oscuro)
       - Mensajes del bot alineados a la izquierda (gradiente azul-verde)
       - Validación de entrada numérica
       - Navegación entre menús con timeouts para mejor UX
       - Mensajes con saltos de línea HTML (<br>) para formato limpio

     ANIMACIONES:
       - Efecto slide-in para mensajes del bot
       - Efecto slide-in-right para mensajes del usuario
       - Indicador de escritura con puntos animados
       - Transiciones suaves en hover y focus


5.2 ARCHIVO: index.html
-----------------------
Página de inicio que extiende de base.html.

ESTRUCTURA:
    {% extends 'base.html' %}
    {% load static %}
    {% block title %}Inicio - Mercado Sostenible{% endblock %}
    {% block content %}
        [Contenido específico]
    {% endblock %}

SECCIONES:

a) HERO SECTION (Sección principal):
   ---------------------------------
   - Fondo degradado (azul-morado-rosa)
   - Patrón de fondo SVG decorativo
   - Título principal en 2 líneas
   - Subtítulo descriptivo
   - 2 botones de llamado a la acción (CTA):
     * "Ver Productos" (fondo blanco)
     * "Contáctanos" (borde blanco)
   - Diseño responsive con tamaños adaptativos

b) SECCIÓN DE PRODUCTOS:
   ---------------------
   Grid de 4 tarjetas de productos (responsive: 1-2-4 columnas)

   TARJETA 1 - PRODUCTOS ACUÍCOLAS:
     - Imagen: img/acuicolas.png
     - Emoji: 🐟
     - Descripción: Tilapia, camarones en sistemas controlados
     - Precio: $12.50 / kg
     - Badge de precio con gradiente azul-morado
     - Botón "Comprar Ahora" con gradiente matching

   TARJETA 2 - PRODUCTOS PESQUEROS:
     - Imagen: img/pesqueros.png
     - Emoji: 🦐
     - Descripción: Pescado y marisco de captura responsable
     - Precio: $18.00 / kg
     - Badge de precio con gradiente rosa-rojo
     - Botón "Comprar Ahora" con gradiente matching

   TARJETA 3 - PRODUCTOS GANADEROS:
     - Imagen: img/carnes.png
     - Emoji: 🥩
     - Descripción: Carnes y lácteos de ganado ético
     - Precio: $9.75 / kg
     - Badge de precio con gradiente cyan-azul
     - Botón "Comprar Ahora" con gradiente matching

   TARJETA 4 - PRODUCTOS VEGETALES:
     - Imagen: img/cultivo.png
     - Emoji: 🥬
     - Descripción: Frutas y verduras sin pesticidas
     - Precio: $3.50 / kg
     - Badge de precio con gradiente verde-esmeralda
     - Botón "Comprar Ahora" con gradiente matching

   EFECTOS DE LAS TARJETAS:
     - Efecto glassmorphism (vidrio esmerilado)
     - Hover: elevación con sombra aumentada
     - Hover en imagen: zoom suave (scale 1.1)
     - Overlay oscuro en hover sobre la imagen
     - Transiciones suaves en todos los elementos

c) SECCIÓN DE BENEFICIOS:
   ----------------------
   Fondo degradado azul-morado claro
   Grid de 3 tarjetas con íconos emoji:

   TARJETA 1 - 100% Sostenible:
     - Emoji: 🌱
     - Descripción: Prácticas agrícolas sostenibles

   TARJETA 2 - Entrega Rápida:
     - Emoji: 🚚
     - Descripción: Entrega en menos de 24 horas

   TARJETA 3 - Calidad Garantizada:
     - Emoji: ✅
     - Descripción: Controles de calidad rigurosos

   Efectos:
     - Hover: elevación de -8px
     - Sombra aumentada en hover
     - Fondo blanco con bordes redondeados

d) CALL TO ACTION FINAL:
   ---------------------
   - Fondo degradado azul-morado
   - Título llamativo
   - Descripción de beneficios
   - Botón grande "Comenzar Ahora 🚀"
   - Efectos hover con escala y sombra


================================================================================
6. ARCHIVOS ESTÁTICOS (Static Files)
================================================================================

Carpeta: static/
Configurada en settings.py con STATICFILES_DIRS


6.1 ARCHIVO: style.css
----------------------
Hoja de estilos personalizada con diseño moderno.

CONFIGURACIONES GLOBALES:
  - Fuente: 'Inter' de Google Fonts
  - Fondo: Degradado sutil gris-azul claro
  - Transiciones suaves globales en color y background-color

ANIMACIONES DEFINIDAS:

  @keyframes fadeInUp:
    - Efecto de aparición desde abajo
    - De: opacidad 0, translateY(30px)
    - A: opacidad 1, translateY(0)
    - Duración: 0.6s ease-out

  @keyframes slideIn:
    - Deslizamiento desde la izquierda
    - Para mensajes del chatbot
    - Duración: 0.3s ease

  @keyframes slideInRight:
    - Deslizamiento desde la derecha
    - Para mensajes del usuario
    - Duración: 0.3s ease

  @keyframes typing:
    - Animación de puntos "escribiendo"
    - Movimiento vertical (translateY -10px)
    - Cambio de opacidad (0.7 a 1)
    - Duración: 1.4s infinite

CLASES PERSONALIZADAS:

  .fade-in-up:
    - Aplica animación fadeInUp

  .glass-card:
    - Efecto glassmorphism
    - Fondo semi-transparente blanco
    - Backdrop blur de 10px
    - Borde blanco semi-transparente

  .gradient-acuicola:
    - Gradiente morado (#667eea a #764ba2)
  
  .gradient-pesquero:
    - Gradiente rosa-rojo (#f093fb a #f5576c)
  
  .gradient-ganadero:
    - Gradiente cyan-azul (#4facfe a #00f2fe)
  
  .gradient-vegetal:
    - Gradiente verde (#43e97b a #38f9d7)

  .product-card:
    - Posición relativa para overlay
    - Transición cubic-bezier personalizada
    - Pseudo-elemento ::before con gradiente blanco
    - Hover: translateY(-12px) y sombra aumentada

  .product-image-wrapper:
    - Overflow hidden para efecto zoom
    - Imagen con transición transform 0.5s
    - Hover: scale(1.1) en imagen

  .product-overlay:
    - Gradiente negro de transparente a 70% opacidad
    - Opacidad 0 por defecto
    - Hover: opacidad 1

  .btn-modern:
    - Pseudo-elemento ::before con efecto ripple
    - Hover: círculo blanco expandido (300px)
    - Active: scale(0.95)

  .navbar-blur:
    - Backdrop filter blur 10px
    - Fondo azul semi-transparente (rgba 95%)

  .logo-animate:
    - Hover: scale(1.05)

  .price-badge:
    - Padding, border-radius personalizado
    - Sombra suave
    - Pseudo-elemento ::after con gradiente blanco

  .icon-shine:
    - Hover: brightness(1.2) y drop-shadow blanco

  .typing-indicator:
    - 3 puntos animados
    - Gap de 4px entre puntos
    - Cada punto: 8px x 8px, circular, gris

ESTILOS PARA CHATBOT:

  #chat-messages::-webkit-scrollbar:
    - Ancho: 6px
    - Track: gris claro redondeado
    - Thumb: gradiente morado, redondeado
    - Hover en thumb: gradiente invertido

  #chat-window:
    - Border-radius: 20px
    - Sombra profunda (40px blur)

  #chat-toggle-button:
    - Sombra azul elevada
    - Hover: sombra más intensa

  .chat-message:
    - Animación slideIn

  .user-message:
    - Animación slideInRight

ESTILOS PARA FOOTER:
  - Gradiente oscuro (slate-800 a slate-900)

RESPONSIVE:
  @media (max-width: 768px):
    - Margen inferior en tarjetas de producto

ELEMENTOS DECORATIVOS:

  .decorative-separator:
    - Línea decorativa de 80px x 4px
    - Gradiente morado
    - Centrada

  .particles-bg:
    - Fondo fijo con partículas
    - Z-index -1, opacidad 0.1


6.2 CARPETA: static/img/
------------------------
Contiene las imágenes de los productos:

  - acuicolas.png: Imagen para productos acuícolas
  - pesqueros.png: Imagen para productos pesqueros
  - carnes.png: Imagen para productos ganaderos
  - cultivo.png: Imagen para productos vegetales

FORMATO: PNG
USO: Se cargan en index.html usando {% static 'img/nombre.png' %}

INTEGRACIÓN:
  - Las imágenes están optimizadas para web
  - Se muestran en tarjetas con object-cover
  - Altura fija: 224px (h-56 en Tailwind)
  - Ancho completo responsive


================================================================================
7. TECNOLOGÍAS Y FRAMEWORKS UTILIZADOS
================================================================================

7.1 BACKEND:
  - Python 3.x
  - Django 5.2.8 (Framework web)
  - SQLite3 (Base de datos)

7.2 FRONTEND:
  - HTML5
  - CSS3 (Personalizado)
  - JavaScript (Vanilla JS para chatbot)
  - Tailwind CSS 3.x (Framework CSS mediante CDN)
  - Google Fonts (Tipografía Inter)

7.3 PATRONES DE DISEÑO:
  - Template inheritance (Herencia de plantillas Django)
  - Component-based styling (Tailwind)
  - Responsive Design (Mobile-first)
  - Glassmorphism
  - Gradient design
  - Micro-interactions

7.4 CARACTERÍSTICAS MODERNAS:
  - SVG icons
  - CSS animations
  - CSS transitions
  - Backdrop filters
  - CSS Grid y Flexbox
  - Custom CSS properties


================================================================================
8. CONTROL DE VERSIONES - GITHUB
================================================================================

8.1 REPOSITORIO:
  - Nombre: Pagina_Web_Agronomia
  - Propietario: Ezequiel0117
  - Plataforma: GitHub
  - Branch principal: main

8.2 PROPÓSITO:
  - Control de versiones del código
  - Colaboración entre miembros del equipo
  - Historial de cambios
  - Backup del proyecto

8.3 FLUJO DE TRABAJO:
  
  1. INICIALIZACIÓN:
     git init
     git add .
     git commit -m "Commit inicial"
     git branch -M main
     git remote add origin [URL_REPOSITORIO]
     git push -u origin main

  2. TRABAJO COLABORATIVO:
     - Cada miembro trabaja en su sección
     - Commits frecuentes con mensajes descriptivos
     - Push al repositorio remoto
     - Pull antes de comenzar a trabajar para tener última versión

  3. COMANDOS BÁSICOS UTILIZADOS:
     git status              (Ver estado de archivos)
     git add .               (Agregar todos los cambios)
     git add archivo.py      (Agregar archivo específico)
     git commit -m "mensaje" (Guardar cambios localmente)
     git push                (Enviar cambios al repositorio remoto)
     git pull                (Obtener últimos cambios del repositorio)

8.4 ORGANIZACIÓN DEL EQUIPO:
  - Cada miembro del equipo clona el repositorio
  - Trabaja en su sección asignada
  - Realiza commits y push de sus cambios
  - Se coordinan para evitar conflictos en archivos compartidos

8.5 ARCHIVOS A IGNORAR (.gitignore recomendado):
  - venv/ (Entorno virtual)
  - __pycache__/ (Archivos compilados de Python)
  - *.pyc (Bytecode de Python)
  - db.sqlite3 (Base de datos local)
  - .env (Variables de entorno sensibles)
  - *.log (Archivos de log)


================================================================================
9. ESTRUCTURA COMPLETA DEL PROYECTO
================================================================================

Pagina_Agronomia/
│
├── venv/                          # Entorno virtual (no en GitHub)
│
├── config/                        # Configuración principal de Django
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py               # Configuración del proyecto
│   ├── urls.py                   # URLs principales
│   └── wsgi.py
│
├── productos/                     # Aplicación de productos
│   ├── migrations/               # Migraciones de base de datos
│   ├── __init__.py
│   ├── admin.py                  # Configuración del admin
│   ├── apps.py
│   ├── models.py                 # Modelos de datos
│   ├── tests.py
│   ├── urls.py                   # URLs de la app
│   └── views.py                  # Vistas (lógica)
│
├── templates/                     # Plantillas HTML
│   ├── base.html                 # Plantilla base (navbar, footer, chatbot)
│   └── index.html                # Página de inicio
│
├── static/                        # Archivos estáticos
│   ├── style.css                 # Estilos personalizados
│   └── img/                      # Imágenes
│       ├── acuicolas.png
│       ├── pesqueros.png
│       ├── carnes.png
│       └── cultivo.png
│
├── db.sqlite3                     # Base de datos SQLite
├── manage.py                      # Script de administración Django
└── README.txt                     # Este archivo


================================================================================
10. COMANDOS IMPORTANTES DE DJANGO
================================================================================

10.1 DESARROLLO:
  
  Iniciar servidor de desarrollo:
    python manage.py runserver
    (Acceder en: http://127.0.0.1:8000/)

  Crear migraciones (después de cambios en models.py):
    python manage.py makemigrations

  Aplicar migraciones:
    python manage.py migrate

  Crear superusuario (admin):
    python manage.py createsuperuser

  Recolectar archivos estáticos (para producción):
    python manage.py collectstatic

10.2 APLICACIONES:
  
  Crear nueva aplicación:
    python manage.py startapp nombre_app


================================================================================
11. FUNCIONALIDADES IMPLEMENTADAS
================================================================================

11.1 NAVEGACIÓN:
  ✓ Navbar responsive con menú hamburguesa
  ✓ Enlaces a secciones de productos
  ✓ Sticky header que permanece visible
  ✓ Efectos hover en enlaces

11.2 INTERFAZ:
  ✓ Diseño moderno con gradientes
  ✓ Tarjetas de productos con glassmorphism
  ✓ Animaciones suaves en hover
  ✓ Responsive design (móvil, tablet, desktop)
  ✓ Tipografía profesional (Inter)

11.3 CHATBOT INTERACTIVO:
  ✓ Asistente virtual flotante
  ✓ Sistema de menús estructurado
  ✓ Respuestas automáticas por categorías
  ✓ Información de precios
  ✓ FAQ (Preguntas Frecuentes)
  ✓ Datos de contacto
  ✓ Indicador de escritura
  ✓ Navegación entre menús

11.4 SECCIONES:
  ✓ Hero section con CTAs
  ✓ Grid de productos (4 categorías)
  ✓ Sección de beneficios
  ✓ Footer informativo
  ✓ Información de contacto


================================================================================
12. PRÓXIMOS PASOS Y EXPANSIÓN
================================================================================

El proyecto está estructurado para que otros miembros del equipo puedan
agregar sus secciones:

ÁREAS PARA EXPANDIR:
  - Sistema de registro/login de usuarios
  - Carrito de compras
  - Procesamiento de pagos
  - Panel de vendedor
  - Sistema de reviews/calificaciones
  - Gestión de inventario
  - Historial de pedidos
  - Sistema de notificaciones
  - Blog de contenido
  - Galería de productos ampliada

RECOMENDACIONES:
  1. Crear una nueva app Django para cada módulo grande
  2. Mantener el código documentado
  3. Hacer commits frecuentes con mensajes claros
  4. Coordinar cambios en archivos compartidos (base.html, style.css)
  5. Probar cambios antes de hacer push


================================================================================
13. INFORMACIÓN DE CONTACTO Y SOPORTE
================================================================================

PROYECTO ACADÉMICO
Universidad: [Nombre de tu universidad]
Materia: [Nombre de la materia]
Grupo: [Número de grupo]

EQUIPO:
  - [Nombre]: Configuración inicial, templates, chatbot
  - [Compañero 1]: [Sección asignada]
  - [Compañero 2]: [Sección asignada]
  - [Compañero N]: [Sección asignada]


================================================================================
14. NOTAS ADICIONALES
================================================================================

14.1 BUENAS PRÁCTICAS IMPLEMENTADAS:
  - Separación de concerns (MVT: Model-View-Template)
  - Reutilización de código (template inheritance)
  - Código limpio y documentado
  - Nombres descriptivos de variables y funciones
  - Responsive design desde el inicio
  - Optimización de imágenes

14.2 CONSIDERACIONES DE SEGURIDAD:
  - SECRET_KEY debe cambiarse en producción
  - DEBUG debe ser False en producción
  - Agregar ALLOWED_HOSTS en producción
  - Implementar HTTPS
  - Validar entrada de usuarios
  - Protección CSRF activada

14.3 PERFORMANCE:
  - CSS y JS minimizados (preparar para producción)
  - Imágenes optimizadas
  - Lazy loading para imágenes (implementar)
  - CDN para frameworks (Tailwind)
  - Caché de navegador (configurar en producción)


================================================================================
15. GLOSARIO DE TÉRMINOS
================================================================================

CDN: Content Delivery Network - Red de distribución de contenido
CTA: Call To Action - Llamado a la acción
CSRF: Cross-Site Request Forgery - Falsificación de petición
FAQ: Frequently Asked Questions - Preguntas Frecuentes
Glassmorphism: Efecto de vidrio esmerilado en UI
Hover: Efecto al pasar el cursor sobre un elemento
MVT: Model-View-Template - Patrón de Django
Responsive: Diseño adaptable a diferentes tamaños de pantalla
Sticky: Elemento que permanece fijo al hacer scroll
SVG: Scalable Vector Graphics - Gráficos vectoriales
UX: User Experience - Experiencia de usuario
Viewport: Área visible del navegador


================================================================================
FIN DE LA DOCUMENTACIÓN
================================================================================

Última actualización: Noviembre 2025
Versión: 1.0

Para más información sobre Django: https://docs.djangoproject.com/
Para más información sobre Tailwind: https://tailwindcss.com/docs
