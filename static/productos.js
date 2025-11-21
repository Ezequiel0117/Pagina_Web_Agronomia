// static/productos.js - Scripts para la página de productos

function agregarAlCarrito(productoId) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/carrito/agregar/" + productoId + "/", true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader("X-CSRFToken", getCookie("csrftoken"));
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  
  xhr.onload = function() {
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      actualizarContadorCarrito(response.total_items);
      mostrarNotificacion("✅ Producto agregado al carrito", "success");
    } else {
      mostrarNotificacion("❌ Error al agregar producto", "error");
    }
  };
  
  xhr.send("action=increase");
}

function actualizarContadorCarrito(total) {
  // Actualizar por id (compatibilidad) y por clase (varias apariciones)
  const contadorById = document.getElementById("carrito-count");
  if (contadorById) {
    contadorById.textContent = total;
    contadorById.classList.add('animate-bounce');
    setTimeout(() => {
      contadorById.classList.remove('animate-bounce');
    }, 500);
  }

  // También actualizar cualquier elemento con la clase carrito-count
  const contadores = document.querySelectorAll('.carrito-count');
  if (contadores.length > 0) {
    contadores.forEach(el => {
      el.textContent = total;
    });
  }
}

function mostrarNotificacion(mensaje, tipo) {
  const notif = document.createElement("div");
  notif.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white z-50 ${
    tipo === "success" ? "bg-green-600" : "bg-red-600"
  }`;
  notif.style.animation = "slideInRight 0.3s ease-out";
  notif.textContent = mensaje;
  
  document.body.appendChild(notif);
  
  setTimeout(() => {
    notif.style.animation = "slideOutRight 0.3s ease-in";
    setTimeout(() => notif.remove(), 300);
  }, 3000);
}

function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + "=")) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
