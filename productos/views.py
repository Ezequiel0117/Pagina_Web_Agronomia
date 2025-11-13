# productos/views.py
from django.shortcuts import render

def pagina_principal(request):
    # Esta función buscará 'index.html' dentro de la carpeta 'templates'
    return render(request, 'index.html')