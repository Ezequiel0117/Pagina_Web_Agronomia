# productos/views.py
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
from django.core.exceptions import ValidationError
from .models import Perfil, Producto

def pagina_principal(request):
    return render(request, "index.html")

def login_view(request):
    if request.method == "POST":
        usuario = request.POST.get("usuario")
        clave = request.POST.get("clave")

        user = authenticate(request, username=usuario, password=clave)

        if user is not None:
            login(request, user)
            return redirect("principal")
        else:
            messages.error(request, "Usuario o contraseña incorrectos")

    return render(request, "login.html")

def logout_view(request):
    logout(request)
    return redirect("principal")

def register_view(request):
    if request.method == "POST":
        username = request.POST.get("usuario")
        email = request.POST.get("email")
        password1 = request.POST.get("clave1")
        password2 = request.POST.get("clave2")

        if password1 != password2:
            messages.error(request, "Las contraseñas no coinciden.")
            return render(request, "register.html")

        if len(password1) < 4:
            messages.error(request, "La contraseña debe tener al menos 4 caracteres.")
            return render(request, "register.html")

        try:
            user = User.objects.create_user(username=username, email=email, password=password1)
            user.save()

            login(request, user)
            return redirect("principal")

        except IntegrityError:
            messages.error(request, "El usuario ya existe. Elige otro nombre.")
            return render(request, "register.html")

    return render(request, "register.html")

@login_required
def perfil_view(request):
    perfil, created = Perfil.objects.get_or_create(user=request.user)
    
    if request.method == "POST":
        # Actualizar información del perfil
        perfil.bio = request.POST.get("bio", "")
        perfil.telefono = request.POST.get("telefono", "")
        perfil.direccion = request.POST.get("direccion", "")

        # Manejar campo de fecha: convertir cadena vacía a None para evitar ValidationError
        fecha_val = request.POST.get("fecha_nacimiento", "").strip()
        perfil.fecha_nacimiento = fecha_val if fecha_val != "" else None
        
        # Actualizar imagen de perfil si se subió una
        if request.FILES.get('imagen_perfil'):
            perfil.imagen_perfil = request.FILES['imagen_perfil']
        
        # Actualizar información del usuario
        request.user.first_name = request.POST.get("first_name", "")
        request.user.last_name = request.POST.get("last_name", "")
        request.user.email = request.POST.get("email", "")
        
        try:
            request.user.save()
            perfil.save()
        except ValidationError:
            messages.error(request, "Formato de fecha inválido. Use YYYY-MM-DD o deje el campo vacío.")
            return render(request, "perfil.html", {"perfil": perfil})

        messages.success(request, "Perfil actualizado correctamente.")
        return redirect("perfil")
    
    return render(request, "perfil.html", {"perfil": perfil})


# ===== VISTAS DE PRODUCTOS Y CARRITO =====

def productos_por_categoria(request, categoria):
    """Vista unificada para mostrar productos por categoría"""
    categoria_formateada = categoria.capitalize()
    productos = Producto.objects.filter(categoria=categoria_formateada)
    
    # Obtener total del carrito
    carrito = request.session.get("carrito", {})
    total_carrito = sum(carrito.values())
    
    # Seleccionar template según categoría
    templates = {
        'Acuicolas': 'acuicolas.html',
        'Pesqueros': 'pesqueros.html',
        'Ganaderos': 'ganaderos.html',
        'Vegetales': 'vegetales.html',
    }
    
    template = templates.get(categoria_formateada, 'productos.html')
    
    return render(request, template, {
        'productos': productos,
        'categoria': categoria_formateada,
        'titulo': f"Productos {categoria_formateada}",
        'total_carrito': total_carrito,
    })


@login_required
def agregar_al_carrito(request, producto_id):
    """Agregar o modificar cantidad de un producto en el carrito"""
    carrito = request.session.get("carrito", {})
    producto_id = str(producto_id)

    action = request.POST.get("action", "increase")

    if action == "increase":
        carrito[producto_id] = carrito.get(producto_id, 0) + 1
    elif action == "decrease":
        if carrito.get(producto_id, 0) > 1:
            carrito[producto_id] -= 1
        else:
            carrito.pop(producto_id, None)

    request.session["carrito"] = carrito
    request.session.modified = True

    # Si es una petición AJAX, devolver JSON
    if request.headers.get("x-requested-with") == "XMLHttpRequest":
        return JsonResponse({"total_items": sum(carrito.values())})

    return redirect("ver_carrito")


@login_required
def ver_carrito(request):
    """Mostrar el contenido del carrito"""
    carrito = request.session.get('carrito', {})
    productos = []
    total = 0

    for prod_id, cantidad in carrito.items():
        try:
            producto = Producto.objects.get(id=int(prod_id))
        except Producto.DoesNotExist:
            continue

        subtotal = producto.precio * cantidad
        total += subtotal

        productos.append({
            "producto": producto,
            "cantidad": cantidad,
            "subtotal": subtotal
        })

    return render(request, "carrito.html", {
        "productos": productos,
        "total": total
    })


@login_required
def eliminar_del_carrito(request, producto_id):
    """Eliminar un producto del carrito"""
    carrito = request.session.get("carrito", {})
    producto_id = str(producto_id)

    carrito.pop(producto_id, None)

    request.session["carrito"] = carrito
    request.session.modified = True

    return redirect("ver_carrito")


@login_required
def vaciar_carrito(request):
    """Vaciar todo el carrito"""
    request.session["carrito"] = {}
    request.session.modified = True
    return redirect("ver_carrito")


@login_required
def finalizar_compra(request):
    """Procesar la compra y actualizar el stock"""
    if request.method != "POST":
        return redirect("ver_carrito")
    
    carrito = request.session.get('carrito', {})
    
    if not carrito:
        messages.warning(request, "Tu carrito está vacío.")
        return redirect("ver_carrito")
    
    # Procesar cada producto del carrito
    productos_comprados = []
    total_compra = 0
    
    for prod_id, cantidad in carrito.items():
        try:
            producto = Producto.objects.get(id=int(prod_id))
            
            # Verificar que hay suficiente stock
            if producto.stock < cantidad:
                messages.error(request, f"Stock insuficiente para {producto.nombre}. Solo quedan {producto.stock} unidades.")
                return redirect("ver_carrito")
            
            # Reducir el stock
            producto.stock -= cantidad
            producto.save()
            
            subtotal = producto.precio * cantidad
            total_compra += subtotal
            
            productos_comprados.append({
                'nombre': producto.nombre,
                'cantidad': cantidad,
                'subtotal': subtotal
            })
            
        except Producto.DoesNotExist:
            continue
    
    # Vaciar el carrito
    request.session["carrito"] = {}
    request.session.modified = True
    
    # Mensaje de éxito
    mensaje = f"¡Compra realizada con éxito! Total: ${total_compra:.2f}. Se compraron {len(productos_comprados)} productos diferentes."
    messages.success(request, mensaje)
    
    return redirect("principal")
