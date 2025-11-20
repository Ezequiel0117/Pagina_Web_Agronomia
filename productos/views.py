# productos/views.py
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from .models import Perfil

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
    return redirect("login")

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
        perfil.fecha_nacimiento = request.POST.get("fecha_nacimiento", None)
        
        # Actualizar imagen de perfil si se subió una
        if request.FILES.get('imagen_perfil'):
            perfil.imagen_perfil = request.FILES['imagen_perfil']
        
        # Actualizar información del usuario
        request.user.first_name = request.POST.get("first_name", "")
        request.user.last_name = request.POST.get("last_name", "")
        request.user.email = request.POST.get("email", "")
        
        request.user.save()
        perfil.save()
        
        messages.success(request, "Perfil actualizado correctamente.")
        return redirect("perfil")
    
    return render(request, "perfil.html", {"perfil": perfil})