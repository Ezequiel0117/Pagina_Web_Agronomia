# productos/context_processors.py

def carrito_total(request):
    """Context processor para calcular el total de items en el carrito"""
    carrito = request.session.get('carrito', {})
    total_items = sum(carrito.values())
    
    return {
        'carrito_total_items': total_items
    }
