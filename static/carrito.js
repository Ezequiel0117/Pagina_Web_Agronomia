// static/carrito.js - Scripts para la página del carrito

function confirmarCompra() {
  return confirm("¿Estás seguro de que deseas finalizar la compra? Se descontará el stock de los productos.");
}

// Actualizar el carrito dinámicamente
document.addEventListener("DOMContentLoaded", () => {
  const carritoForms = document.querySelectorAll(".carrito-form");
  
  carritoForms.forEach(form => {
    form.addEventListener("submit", (e) => {
      const cantidadInput = form.querySelector("input[name='cantidad']");
      if (cantidadInput && cantidadInput.value < 1) {
        e.preventDefault();
        alert("La cantidad debe ser al menos 1");
      }
    });
  });
});
