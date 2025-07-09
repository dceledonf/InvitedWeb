<script>
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import { faWhatsapp, faInstagram } from '@fortawesome/free-brands-svg-icons';
  import { faClock, faUser, faBolt, faHeadset, faBars as faBarsSolid, faTimes as faTimesSolid, faBrain } from '@fortawesome/free-solid-svg-icons';

  let menuOpen = false;
  let showModal = false;
  let modalText = '';

  function closeMenu() {
    menuOpen = false;
  }
  function openStoreModal() {
    modalText = 'Función en desarrollo. La app estará disponible muy pronto!';
    showModal = true;
  }
  function closeModal() {
    showModal = false;
  }
</script>

<div class="min-h-screen bg-gray-50 font-poppins flex flex-col justify-between">
  <!-- Header -->
  <header class="w-full flex items-center justify-between px-4 py-4 md:px-12 bg-transparent relative z-20">
    <img src="/img/dl.png" alt="InvitedMx Logo" class="h-8 w-auto" />
    <!-- Desktop nav -->
    <nav class="hidden md:flex gap-8 text-base font-medium">
      <a href="#" class="text-black hover:text-gray-700">Inicio</a>
      <a href="#caracteristicas" class="text-black hover:text-gray-700">Características</a>
      <a href="#testimonios" class="text-black hover:text-gray-700">Testimonios</a>
      <a href="#contacto" class="text-black hover:text-gray-700">Contacto</a>
    </nav>
    <!-- Botones login desktop -->
    <div class="hidden md:flex gap-2">
      <a href="/login" class="border border-black text-black px-4 py-2 rounded-full font-semibold hover:bg-black hover:text-white transition">Iniciar sesión</a>
    </div>
    <!-- Hamburguesa mobile -->
    <button class="md:hidden flex items-center text-black focus:outline-none" on:click={() => menuOpen = true} aria-label="Abrir menú">
      <FontAwesomeIcon icon={faBarsSolid} class="w-7 h-7" />
    </button>
    <!-- Drawer mobile -->
    {#if menuOpen}
      <div class="fixed inset-0 z-40">
        <div class="absolute inset-0 bg-black bg-opacity-40 transition-opacity" on:click={closeMenu}></div>
        <aside class="absolute right-0 top-0 h-full w-64 bg-white shadow-lg flex flex-col p-6 animate-slide-in z-50">
          <div class="flex justify-between items-center mb-8">
            <img src="/img/dl.png" alt="InvitedMx Logo" class="h-8 w-auto" />
            <button class="text-black" on:click={closeMenu} aria-label="Cerrar menú">
              <FontAwesomeIcon icon={faTimesSolid} class="w-7 h-7" />
            </button>
          </div>
          <nav class="flex flex-col gap-6 text-base font-medium">
            <a href="#" class="text-black hover:text-gray-700" on:click={closeMenu}>Inicio</a>
            <a href="#caracteristicas" class="text-black hover:text-gray-700" on:click={closeMenu}>Características</a>
            <a href="#testimonios" class="text-black hover:text-gray-700" on:click={closeMenu}>Testimonios</a>
            <a href="#contacto" class="text-black hover:text-gray-700" on:click={closeMenu}>Contacto</a>
          </nav>
          <div class="flex flex-col gap-2 mt-8">
            <a href="/login" class="border border-black text-black px-4 py-2 rounded-full font-semibold hover:bg-black hover:text-white transition" on:click={closeMenu}>Iniciar sesión</a>
          </div>
        </aside>
      </div>
    {/if}
  </header>

  <!-- Hero principal -->
  <section class="flex flex-col-reverse md:flex-row items-center justify-between max-w-6xl mx-auto px-4 md:px-12 py-12 md:py-20 gap-8">
    <div class="flex-1 flex flex-col items-start justify-center">
      <h1 class="text-4xl md:text-5xl font-extrabold text-black mb-4 leading-tight">
        Crea y comparte tu <span class="text-transparent bg-clip-text bg-gradient-to-r from-black to-gray-700 decoration-4 decoration-black">Invitación Digital</span> Web
      </h1>
      <p class="text-lg text-gray-700 mb-8">La forma más moderna y práctica de invitar a tus seres queridos. Personaliza, comparte y recibe confirmaciones fácilmente.</p>
      <div class="flex gap-4 w-full md:w-auto">
        <a href="https://wa.me/5215667752610?text=Hola%20quiero%20recibir%20mas%20información%20de%20InvitedMx" target="_blank" rel="noopener" class="bg-black text-white px-6 py-3 rounded-full font-bold text-lg hover:bg-gray-800 transition flex items-center gap-2">
          <FontAwesomeIcon icon={faWhatsapp} class="w-7 h-7" />
          Solicitar por WhatsApp
        </a>
      </div>
    </div>
    <div class="flex-1 flex items-center justify-center">
      <img src="/img/mockup.jfif" alt="Mockup Invitación" class="rounded-2xl shadow-xl w-full max-w-xs md:max-w-sm max-h-[400px] md:max-h-[550px] object-contain">
    </div>
  </section>

  <!-- Sección promocional de funcionalidades y apps -->
  <section class="max-w-5xl mx-auto py-12 px-4 flex flex-col items-center">
    <div class="flex flex-col items-center text-center w-full md:max-w-3xl">
      <h2 class="text-2xl md:text-3xl font-extrabold mb-4">¡Gestiona tu evento de forma fácil y moderna!</h2>
      <p class="text-gray-700 text-lg mb-6 max-w-2xl mx-auto">Nuestra plataforma incluye un <span class="font-bold text-black">dashboard web y app móvil</span> para que puedas:</p>
      <ul class="text-left md:text-center grid gap-3 mb-8 mx-auto">
        <li><span class="font-bold text-black">•</span> Agregar, editar o eliminar invitados fácilmente.</li>
        <li><span class="font-bold text-black">•</span> Gestionar y descargar las imágenes que tus invitados suben durante el evento.</li>
        <li><span class="font-bold text-black">•</span> Recibir y visualizar mensajes de felicitación en tiempo real.</li>
      </ul>
      <div class="flex gap-4 mb-6 justify-center">
        <button on:click={openStoreModal} class="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-800 transition">
          <FontAwesomeIcon icon={["fab", "app-store-ios"]} class="w-6 h-6" />
          App Store
        </button>
        <button on:click={openStoreModal} class="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-800 transition">
          <FontAwesomeIcon icon={["fab", "google-play"]} class="w-6 h-6" />
          Play Store
        </button>
      </div>
      <p class="text-gray-600 mb-8">¡Todo desde cualquier dispositivo, con la mejor experiencia y soporte personalizado!</p>
      <div class="flex flex-col md:flex-row gap-4 w-full justify-center items-center mt-2">
        <img src="img/mockup-mobile-1.jpeg" alt="App Mockup 1" class="rounded-xl shadow-lg w-full max-w-xs md:w-56 md:max-w-none">
        <img src="img/mockup-mobile-2.jpeg" alt="App Mockup 2" class="rounded-xl shadow-lg w-full max-w-xs md:w-56 md:max-w-none">
        <img src="img/mockup-mobile-3.jpeg" alt="App Mockup 3" class="rounded-xl shadow-lg w-full max-w-xs md:w-56 md:max-w-none">
      </div>
      <div class="flex justify-center mt-6 w-full">
        <img src="img/mockup-desktop.jpg" alt="Web Dashboard Mockup" class="rounded-xl shadow-lg w-full max-w-4xl">
      </div>
    </div>
  </section>

  <!-- Modal para función en desarrollo -->
  {#if showModal}
    <div class="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div class="bg-white rounded-xl shadow-lg p-8 max-w-sm w-full flex flex-col items-center">
        <p class="text-lg font-semibold mb-4">{modalText}</p>
        <button on:click={closeModal} class="mt-2 px-4 py-2 bg-black text-white rounded-lg font-semibold">Cerrar</button>
      </div>
    </div>
  {/if}

  <!-- Barra de estadísticas -->
  <section class="w-full bg-black py-8">
    <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 px-4 md:px-12">
      <div class="flex flex-col items-center">
        <span class="text-3xl md:text-4xl font-extrabold text-white">24/7</span>
        <span class="text-gray-300 text-sm mt-1">Atención Personalizada</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="text-3xl md:text-4xl font-extrabold text-white">Desarrollo</span>
        <span class="text-gray-300 text-sm mt-1">a tu medida</span>
      </div>
      <div class="flex flex-col items-center">
        <span class="text-3xl md:text-4xl font-extrabold text-white">$2,999</span>
        <span class="text-gray-300 text-sm mt-1">Plan Único</span>
      </div>
    </div>
  </section>

  <!-- Características -->
  <section id="caracteristicas" class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 py-16 px-4">
    <div class="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
      <FontAwesomeIcon icon={faBolt} class="w-10 h-10 text-black mb-2" />
      <h3 class="font-bold text-lg mt-2 mb-1">Personalización Total</h3>
      <p class="text-gray-500 text-sm">Colores, fotos, música y más.</p>
    </div>
    <div class="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
      <FontAwesomeIcon icon={faWhatsapp} class="w-10 h-10 text-black mb-2" />
      <h3 class="font-bold text-lg mt-2 mb-1">Confirmación por WhatsApp</h3>
      <p class="text-gray-500 text-sm">Tus invitados confirman fácil y rápido.</p>
    </div>
    <div class="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
      <FontAwesomeIcon icon={faClock} class="w-10 h-10 text-black mb-2" />
      <h3 class="font-bold text-lg mt-2 mb-1">Entrega Express</h3>
      <p class="text-gray-500 text-sm">Lista en menos de 48 horas en planes de urgencia*</p>
    </div>
    <div class="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center">
      <FontAwesomeIcon icon={faHeadset} class="w-10 h-10 text-black mb-2" />
      <h3 class="font-bold text-lg mt-2 mb-1">Soporte Personalizado</h3>
      <p class="text-gray-500 text-sm">Te acompañamos en todo el proceso.</p>
    </div>
  </section>
  <div class="text-xs text-gray-500 text-center mt-[-1rem] mb-8">* Genera costos extra</div>

  <!-- Contacto -->
  <section id="contacto" class="max-w-2xl mx-auto py-16 px-4">
    <div class="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center text-center gap-4 border border-gray-100">
      <FontAwesomeIcon icon={faHeadset} class="w-12 h-12 text-black mb-2" />
      <h2 class="text-2xl font-bold mb-2">¿Tienes dudas o quieres cotizar?</h2>
      <p class="text-gray-700 mb-2 text-lg">¡Estamos para ayudarte! Contáctanos por WhatsApp o Instagram y recibe atención personalizada.</p>
      <div class="flex gap-4 items-center justify-center mb-2">
        <a href="https://wa.me/5215667752610" class="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-5 py-3 rounded-full shadow transition text-lg" target="_blank" rel="noopener">
          <FontAwesomeIcon icon={faWhatsapp} class="w-6 h-6" /> WhatsApp
        </a>
        <a href="https://instagram.com/invitedmx" class="flex items-center gap-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600 text-white font-bold px-5 py-3 rounded-full shadow transition text-lg" target="_blank" rel="noopener">
          <FontAwesomeIcon icon={faInstagram} class="w-6 h-6" /> @invitedmx
        </a>
      </div>
      <div class="text-gray-400 text-sm mt-2">Respondemos rápido y con gusto 😊</div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="w-full bg-black py-6 mt-auto">
    <div class="max-w-6xl mx-auto flex flex-col items-center justify-center px-4 md:px-12 text-white">
      <div class="flex items-center gap-2 text-lg font-semibold">
        Powered by FiveMinds
        <FontAwesomeIcon icon={faBrain} class="w-6 h-6 text-white" />
        2025
      </div>
    </div>
  </footer>
</div>

<style>
  @keyframes slide-in {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  .animate-slide-in {
    animation: slide-in 0.25s cubic-bezier(0.4,0,0.2,1);
  }
</style>
