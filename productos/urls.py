# productos/urls.py
from django.urls import path
from .views import login_view, logout_view, pagina_principal, register_view, perfil_view

urlpatterns = [
    # Cuando la URL esté vacía (''), usa la vista 'pagina_principal'
    path('', pagina_principal, name='principal'),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("register/", register_view, name="register"),
    path("perfil/", perfil_view, name="perfil"),
]
