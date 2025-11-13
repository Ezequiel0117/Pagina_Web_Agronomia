# productos/urls.py
from django.urls import path
from . import views # Importa las vistas de la app actual

urlpatterns = [
    # Cuando la URL esté vacía (''), usa la vista 'pagina_principal'
    path('', views.pagina_principal, name='principal'),
]
