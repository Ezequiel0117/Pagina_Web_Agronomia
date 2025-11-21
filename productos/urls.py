# productos/urls.py
from django.urls import path
from .views import (
    login_view, logout_view, pagina_principal, register_view, perfil_view,
    productos_por_categoria, agregar_al_carrito, ver_carrito, 
    eliminar_del_carrito, vaciar_carrito, finalizar_compra
)

urlpatterns = [
    # Página principal
    path('', pagina_principal, name='principal'),
    
    # Autenticación
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("register/", register_view, name="register"),
    path("perfil/", perfil_view, name="perfil"),
    
    # Carrito
    path('carrito/agregar/<int:producto_id>/', agregar_al_carrito, name='agregar_carrito'),
    path('carrito/', ver_carrito, name='ver_carrito'),
    path('carrito/eliminar/<int:producto_id>/', eliminar_del_carrito, name='eliminar_item'),
    path('carrito/vaciar/', vaciar_carrito, name='vaciar_carrito'),
    path('carrito/finalizar/', finalizar_compra, name='finalizar_compra'),
    
    # Productos por categoría
    path('productos/<str:categoria>/', productos_por_categoria, name='productos_categoria'),
]
