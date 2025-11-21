// static/scripts.js - Scripts principales del sitio

// Inicialización cuando el DOM está listo
document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation();
  initializeChatbot();
});

// Navegación - menú móvil y dropdown de usuario
function initializeNavigation() {
  const mobileMenuBtn = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");
  const userMenuBtn = document.getElementById("user-menu-button");
  const userDropdown = document.getElementById("user-dropdown");

  if (mobileMenuBtn) mobileMenuBtn.addEventListener("click", () => mobileMenu.classList.toggle("hidden"));
  
  if (userMenuBtn && userDropdown) {
    userMenuBtn.addEventListener("click", (e) => { e.stopPropagation(); userDropdown.classList.toggle("hidden"); });
    document.addEventListener("click", (e) => { if (!userMenuBtn.contains(e.target) && !userDropdown.contains(e.target)) userDropdown.classList.add("hidden"); });
  }
}

// Chatbot - Lógica tomada de base_REM.html
function initializeChatbot() {
  const chatToggleBtn = document.getElementById("chat-toggle-button");
  const chatWindow = document.getElementById("chat-window");
  const chatCloseBtn = document.getElementById("chat-close-button");
  const chatSendBtn = document.getElementById("chat-send-button");
  const chatInput = document.getElementById("chat-input");
  const chatMessages = document.getElementById("chat-messages");
  
  if (!chatToggleBtn || !chatWindow) return;
  
  let isBotTyping = false;
  let hasWelcomed = false;

  // 1. Inicialización
  const initChat = () => {
    if (!hasWelcomed) {
      addBotMessage("¡Hola! 👋 Bienvenido a Mercado Sostenible. ¿En qué puedo ayudarte hoy?");
      showQuickReplies([
        "🛒 Cómo comprar", 
        "🚚 Envíos", 
        "📞 Hablar con Asesor",
        "💰 Ver precios"
      ]);
      hasWelcomed = true;
    }
  };

  // 2. Abrir/Cerrar
  chatToggleBtn.addEventListener("click", () => {
    chatWindow.classList.remove("hidden");
    chatWindow.classList.add("flex");
    chatToggleBtn.classList.add("hidden");
    initChat();
    setTimeout(() => chatInput.focus(), 100);
  });

  chatCloseBtn.addEventListener("click", () => {
    chatWindow.classList.add("hidden");
    chatWindow.classList.remove("flex");
    chatToggleBtn.classList.remove("hidden");
  });

  // 3. Manejo del Input
  chatInput.addEventListener("input", () => {
    chatSendBtn.disabled = chatInput.value.trim() === "";
  });

  // 4. Sistema de Mensajería
  const handleUserMessage = (text) => {
    if (!text || isBotTyping) return;

    addUserMessage(text);
    chatInput.value = "";
    chatSendBtn.disabled = true;
    removeQuickReplies();

    isBotTyping = true;
    showTypingIndicator();

    setTimeout(() => {
      removeTypingIndicator();
      const response = getBotResponse(text);
      addBotMessage(response.text);
      if (response.suggestions) showQuickReplies(response.suggestions);
      isBotTyping = false;
    }, 1000); 
  };

  chatSendBtn.addEventListener("click", () => handleUserMessage(chatInput.value.trim()));
  chatInput.addEventListener("keypress", (e) => { if (e.key === "Enter") handleUserMessage(chatInput.value.trim()); });

  // 5. Funciones de UI
  const addUserMessage = (text) => {
    const div = document.createElement("div");
    div.className = "flex justify-end message-enter";
    div.innerHTML = `<div class="bg-forest-green text-white px-4 py-2 rounded-2xl rounded-tr-none max-w-[85%] text-sm shadow-sm">${text}</div>`;
    chatMessages.appendChild(div);
    scrollToBottom();
  };

  const addBotMessage = (text) => {
    const div = document.createElement("div");
    div.className = "flex justify-start message-enter";
    div.innerHTML = `<div class="bg-white border border-gray-200 text-gray-800 px-4 py-2 rounded-2xl rounded-tl-none max-w-[85%] text-sm shadow-sm leading-relaxed">${text}</div>`;
    chatMessages.appendChild(div);
    scrollToBottom();
  };

  const showQuickReplies = (options) => {
    const container = document.createElement("div");
    container.className = "flex flex-wrap gap-2 justify-start message-enter pl-1 quick-replies-container";
    options.forEach(opt => {
      const btn = document.createElement("button");
      btn.className = "quick-reply-btn";
      btn.textContent = opt;
      btn.onclick = () => handleUserMessage(opt);
      container.appendChild(btn);
    });
    chatMessages.appendChild(container);
    scrollToBottom();
  };

  const removeQuickReplies = () => {
    const oldReplies = document.querySelectorAll('.quick-replies-container');
    oldReplies.forEach(el => el.remove()); 
  };

  const showTypingIndicator = () => {
    const div = document.createElement("div");
    div.id = "typing-indicator";
    div.className = "flex justify-start message-enter";
    div.innerHTML = `<div class="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-none"><div class="flex gap-1"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
    chatMessages.appendChild(div);
    scrollToBottom();
  };

  const removeTypingIndicator = () => {
    const indicator = document.getElementById("typing-indicator");
    if (indicator) indicator.remove();
  };

  const scrollToBottom = () => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  };

  // 6. CEREBRO DEL CHATBOT
  const getBotResponse = (input) => {
    const text = input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // --- ENVÍOS (NUEVO) ---
    if (text.includes("envio") || text.includes("domicilio") || text.includes("entregas") || text.includes("llevan")) {
      return {
        text: "🚚 **Envíos y Entregas:**<br><br>Realizamos entregas a domicilio dentro del perímetro urbano de **Milagro**. <br><br>Para otras zonas cercanas, por favor contáctanos para coordinar.",
        suggestions: ["📞 Hablar con Asesor", "📍 Ver Ubicación"]
      };
    }

    // --- CONTACTO / ASESOR ---
    if (text.includes("contacto") || text.includes("asesor") || text.includes("telefono") || text.includes("correo") || text.includes("llamar")) {
      return {
        text: "👤 **Atención al Cliente:**<br><br>Haz clic abajo para contactarnos directamente:<br><br>📧 <a href=\"mailto:info@mercadosostenible.com?subject=Consulta%20desde%20la%20Web\" class=\"text-forest-green font-bold underline hover:text-leaf-green\">Enviar Correo</a><br>📱 <a href=\"tel:+593123456789\" class=\"text-forest-green font-bold underline hover:text-leaf-green\">+593 123 456 789</a><br><br>Estamos disponibles de 8:00 AM a 5:00 PM.",
        suggestions: ["📍 Ubicación", "🚚 Envíos"]
      };
    }

    // --- CÓMO COMPRAR ---
    if (text.includes("comprar") || text.includes("pedido") || text.includes("adquirir")) {
      return {
        text: "🛒 **Pasos para comprar:**<br>1. Elige tus productos (Acuícolas, Pesca, Carne o Vegetales).<br>2. Escríbenos al correo o WhatsApp para confirmar stock.<br>3. Coordinamos el pago y envío.<br><br>¡Sencillo y rápido!",
        suggestions: ["📞 Hablar con Asesor", "🐟 Ver Productos"]
      };
    }

    // --- UBICACIÓN ---
    if (text.includes("ubicacion") || text.includes("donde") || text.includes("direccion")) {
      return {
        text: "📍 **Ubicación:**<br>Operamos en Milagro, Guayas. Conectamos a los productores de la zona directamente contigo.",
        suggestions: ["🚚 Envíos", "📞 Contacto"]
      };
    }

    // --- PRECIOS ---
    if (text.includes("precio") || text.includes("costo") || text.includes("vale")) {
      return {
        text: "💰 **Precios Referenciales:**<br>🐟 Tilapia: $12.50/kg<br>🦐 Camarón: $14.00/kg<br>🥩 Res: $9.75/kg<br>🥬 Vegetales: Desde $3.50<br><br>¿Te interesa alguno en especial?",
        suggestions: ["🐟 Tilapia", "🥩 Carne", "📞 Cotizar con Asesor"]
      };
    }

    // --- PRODUCTOS ---
    if (text.includes("acuicola") || text.includes("tilapia") || text.includes("camaron")) {
      return { text: "🐟 Frescura garantizada. Nuestra Tilapia y Camarón son de producción local controlada.", suggestions: ["💰 Ver precio", "🛒 Cómo comprar"] };
    }
    
    if (text.includes("vegetal") || text.includes("verdura")) {
      return { text: "🥬 Vegetales 100% frescos, sin químicos agresivos. Del campo a tu mesa.", suggestions: ["💰 Ver precio", "🛒 Cómo comprar"] };
    }

    if (text.includes("hola") || text.includes("buenas")) {
      return { text: "¡Hola! 😊 ¿En qué te puedo ayudar hoy?", suggestions: ["💰 Ver precios", "🚚 Envíos"] };
    }

    if (text.includes("gracias") || text.includes("chao")) {
      return { text: "¡Gracias a ti! 💚 Estamos para servirte.", suggestions: [] };
    }
    
    // --- FALLBACK ---
    return {
      text: "Entiendo. 🤔 Para darte una mejor respuesta, ¿prefieres ver los precios o hablar con alguien?",
      suggestions: ["💰 Ver precios", "📞 Hablar con Asesor"]
    };
  };
}
