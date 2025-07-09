<script>
  import { supabase } from '$lib/supabaseClient';
  import { onMount } from 'svelte';
  import { faTrash, faPen, faPaperPlane, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
  import { faWhatsapp } from '@fortawesome/free-brands-svg-icons';
  import { faCommentDots } from '@fortawesome/free-regular-svg-icons';
  import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
  import Swal from 'sweetalert2';
  import 'intl-tel-input/build/css/intlTelInput.css';
  import intlTelInput from 'intl-tel-input';
  /** @type {any[]} */
  let invitados = [];
  let loading = false;
  let error = '';
  let search = '';
  let asistenciaFiltro = 'todos';
  let whatsappMsg = '¡Hola! Te invitamos cordialmente a nuestro evento.';
  let showMsgModal = false;
  let drawerOpen = false;

  const ladas = [
    { code: '+52', flag: '🇲🇽', label: 'México' },
    { code: '+1', flag: '🇺🇸', label: 'EE.UU.' },
    { code: '+34', flag: '🇪🇸', label: 'España' },
    // Puedes agregar más países aquí
  ];

  async function fetchInvitados() {
    loading = true;
    error = '';
    const event_id = sessionStorage.getItem('event_id');
    if (!event_id) {
      error = 'No se encontró el evento de la sesión.';
      invitados = [];
      loading = false;
      return;
    }
    const { data, error: err } = await supabase
      .from('invitados')
      .select('nombre, asistira, personas_confirmadas, max_inv, numero')
      .eq('event_id', event_id);
    if (err) {
      error = err.message;
      invitados = [];
    } else {
      invitados = data;
    }
    loading = false;
  }

  onMount(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    await fetchInvitados();
  });

  async function logout() {
    await supabase.auth.signOut();
    sessionStorage.clear();
    window.location.href = '/';
  }

  /**
   * @param {string} numero
   */
  async function eliminarInvitado(numero) {
    const invitado = invitados.find(i => i.numero === numero);
    const result = await Swal.fire({
      title: '¿Eliminar invitado?',
      text: `¿Estás seguro de eliminar a ${invitado?.nombre || 'el invitado'}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#000',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        cancelButton: 'swal2-cancel-black'
      }
    });
    if (result.isConfirmed) {
      const { error: err } = await supabase.from('invitados').delete().eq('numero', numero);
      if (err) {
        await Swal.fire('Error', 'No se pudo eliminar el invitado.', 'error');
      } else {
        await Swal.fire('Eliminado', 'El invitado ha sido eliminado.', 'success');
        await fetchInvitados();
      }
    }
  }

  async function editarInvitado(numero) {
    const invitado = invitados.find(i => i.numero === numero);
    if (!invitado) return;
    const { value: formValues } = await Swal.fire({
      title: 'Editar invitado',
      html:
        `<input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${invitado.nombre || ''}">` +
        `<input id="swal-maxinv" class="swal2-input" placeholder="Máx. invitaciones" type="number" value="${invitado.max_inv || ''}">` +
        `<input id="swal-numero" class="swal2-input" placeholder="Número" type="text" value="${invitado.numero || ''}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#000',
      customClass: {
        confirmButton: 'swal2-confirm-black',
        cancelButton: 'swal2-cancel-black'
      },
      preConfirm: () => {
        return {
          nombre: document.getElementById('swal-nombre').value,
          max_inv: document.getElementById('swal-maxinv').value,
          numero: document.getElementById('swal-numero').value
        };
      }
    });
    if (formValues) {
      const { error: err } = await supabase.from('invitados').update({
        nombre: formValues.nombre,
        max_inv: formValues.max_inv,
        numero: formValues.numero
      }).eq('numero', numero);
      if (err) {
        await Swal.fire('Error', 'No se pudo actualizar el invitado.', 'error');
      } else {
        await Swal.fire('Actualizado', 'Los datos del invitado han sido actualizados.', 'success');
        await fetchInvitados();
      }
    }
  }

  /**
   * @param {string} numero
   */
  function enviarWhatsapp(numero) {
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(whatsappMsg)}`;
    window.open(url, '_blank');
  }

  function openMsgModal() {
    showMsgModal = true;
  }
  function closeMsgModal() {
    showMsgModal = false;
  }

  function showTwilioModal() {
    Swal.fire({
      title: 'Función en desarrollo',
      html: `<div style='display:flex;flex-direction:column;align-items:center;gap:8px;'>
        <img src='https://www.vectorlogo.zone/logos/twilio/twilio-icon.svg' alt='Twilio' style='width:48px;height:48px;margin:0 auto;'>
        <div>Pronto podrás enviar mensajes a todos tus invitados desde aquí.</div>
      </div>`,
      confirmButtonText: 'OK',
      confirmButtonColor: '#000',
      customClass: { confirmButton: 'swal2-confirm-black' }
    });
  }

  async function agregarInvitado() {
    const { value: formValues } = await Swal.fire({
      title: 'Agregar invitado',
      html:
        `<input id="swal-nombre" class="swal2-input" placeholder="Nombre">` +
        `<input id="swal-maxinv" class="swal2-input" placeholder="Máx. invitaciones" type="number">` +
        `<input id="swal-numero" class="swal2-input iti" placeholder="Ej: 55 1234 5678" type="tel">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#000',
      customClass: {
        confirmButton: 'swal2-confirm-black',
        cancelButton: 'swal2-cancel-black',
        popup: 'swal2-popup-tall'
      },
      didOpen: () => {
        intlTelInput(document.getElementById('swal-numero'), {
          initialCountry: 'mx',
          utilsScript: 'https://cdn.jsdelivr.net/npm/intl-tel-input@18.1.1/build/js/utils.js'
        });
      },
      preConfirm: () => {
        const iti = window.intlTelInputGlobals.getInstance(document.getElementById('swal-numero'));
        return {
          nombre: document.getElementById('swal-nombre').value,
          max_inv: document.getElementById('swal-maxinv').value,
          numero: iti.getNumber()
        };
      }
    });
    if (formValues) {
      const { error: err } = await supabase.from('invitados').insert({
        nombre: formValues.nombre,
        max_inv: formValues.max_inv,
        numero: formValues.numero
      });
      if (err) {
        await Swal.fire('Error', 'No se pudo agregar el invitado.', 'error');
      } else {
        await Swal.fire('Agregado', 'El invitado ha sido agregado.', 'success');
        await fetchInvitados();
      }
    }
  }

  function openDrawer() { drawerOpen = true; }
  function closeDrawer() { drawerOpen = false; }

  $: invitadosFiltrados = invitados
    .filter(i => {
      // Filtro de búsqueda
      const q = search.trim().toLowerCase();
      if (!q) return true;
      return (
        (i.nombre && i.nombre.toLowerCase().includes(q)) ||
        (i.numero && i.numero.toString().includes(q))
      );
    })
    .filter(i => {
      // Filtro de asistencia
      if (asistenciaFiltro === 'todos') return true;
      if (asistenciaFiltro === 'si') return i.asistira === true;
      if (asistenciaFiltro === 'no') return i.asistira === false;
      if (asistenciaFiltro === 'pendiente') return i.asistira === null;
      return true;
    })
    .slice()
    .sort((a, b) => {
      // Orden: TRUE primero, luego FALSE, luego NULL
      const order = (val) => val === true ? 0 : val === false ? 1 : 2;
      return order(a.asistira) - order(b.asistira);
    });
</script>

<!-- Hamburguesa mobile: completamente fuera del div principal -->
<button class="fixed top-4 left-4 z-30 md:hidden" on:click={openDrawer} aria-label="Abrir menú" style="background: none; border: none; box-shadow: none; padding: 0;">
  <FontAwesomeIcon icon={faBars} class="w-7 h-7 text-black" />
</button>
<div class="min-h-screen font-poppins flex bg-white">
  <!-- Sidebar desktop -->
  <aside class="w-60 min-h-screen bg-black border-r border-white/10 flex-col justify-between py-8 px-4 fixed md:static z-10 animate__animated animate__fadeInLeft hidden md:flex">
    <div class="flex flex-col gap-2">
      <div class="flex justify-center items-center mb-8 h-12">
        <img src="/img/wl.png" alt="InvitedMx Logo" class="h-10 w-auto object-contain" />
      </div>
      <button class="text-left px-3 py-2 rounded-lg font-semibold transition text-gray-400 hover:bg-white/10 hover:text-white" on:click={agregarInvitado}>Agregar Invitado</button>
      <button class="text-left px-3 py-2 rounded-lg font-semibold transition text-gray-400 hover:bg-white/10 hover:text-white">Ver mi evento</button>
      <button class="text-left px-3 py-2 rounded-lg font-semibold transition text-gray-400 hover:bg-white/10 hover:text-white">Importar lista de invitados</button>
      <button class="mt-8 w-full flex items-center justify-center gap-2 bg-white/10 text-white px-3 py-2 rounded-lg font-semibold transition hover:bg-white/20" on:click={openMsgModal}>
        <FontAwesomeIcon icon={faWhatsapp} />
        Modificar mensaje
      </button>
    </div>
    <button class="mt-8 px-3 py-2 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition" on:click={logout}>
      Cerrar sesión
    </button>
  </aside>
  <!-- Drawer mobile -->
  {#if drawerOpen}
    <div class="fixed inset-0 z-40">
      <div class="absolute inset-0 bg-black bg-opacity-40 transition-opacity" on:click={closeDrawer}></div>
      <aside class="absolute left-0 top-0 h-full w-60 bg-black shadow-lg flex flex-col p-6 animate__animated animate__fadeInLeft z-50">
        <button class="absolute top-4 right-4 text-white text-2xl" on:click={closeDrawer} aria-label="Cerrar menú" style="background: none; border: none; box-shadow: none; padding: 0;">
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div class="flex flex-col gap-2 mt-8">
          <div class="flex justify-center items-center mb-8 h-12">
            <img src="/img/wl.png" alt="InvitedMx Logo" class="h-10 w-auto object-contain" />
          </div>
          <button class="text-left px-3 py-2 rounded-lg font-semibold transition text-gray-400 hover:bg-white/10 hover:text-white" on:click={agregarInvitado}>Agregar Invitado</button>
          <button class="text-left px-3 py-2 rounded-lg font-semibold transition text-gray-400 hover:bg-white/10 hover:text-white">Ver mi evento</button>
          <button class="text-left px-3 py-2 rounded-lg font-semibold transition text-gray-400 hover:bg-white/10 hover:text-white">Importar lista de invitados</button>
          <button class="mt-8 w-full flex items-center justify-center gap-2 bg-white/10 text-white px-3 py-2 rounded-lg font-semibold transition hover:bg-white/20" on:click={openMsgModal}>
            <FontAwesomeIcon icon={faWhatsapp} />
            Modificar mensaje
          </button>
        </div>
        <button class="mt-8 px-3 py-2 rounded-lg font-semibold bg-red-600 text-white hover:bg-red-700 transition" on:click={logout}>
          Cerrar sesión
        </button>
      </aside>
    </div>
  {/if}
  <!-- Main content -->
  <main class="flex-1 min-h-screen ml-0 md:ml-60 flex flex-col items-center justify-start px-2 py-10 bg-white animate__animated animate__fadeIn">
    <div class="rounded-2xl shadow-xl p-6 w-full max-w-4xl mx-auto flex flex-col items-center gap-6 border border-black/10 bg-white">
      <h1 class="text-3xl font-extrabold text-black text-center mb-2">Dashboard</h1>
      <div class="w-full flex flex-col md:flex-row md:items-end gap-4 mb-4">
        <div class="flex-1">
          <label class="block text-sm font-semibold text-gray-700 mb-1" for="search">Buscar invitado</label>
          <input id="search" type="text" placeholder="Buscar por nombre o número..." bind:value={search} class="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition bg-white text-black" />
        </div>
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1" for="filtro">Asistencia</label>
          <select id="filtro" bind:value={asistenciaFiltro} class="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black transition bg-white text-black">
            <option value="todos">Todos</option>
            <option value="si">Sí</option>
            <option value="no">No</option>
            <option value="pendiente">Pendiente</option>
          </select>
        </div>
        <div class="flex items-end">
          <button class="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-green-700 transition" title="Enviar todas" on:click={showTwilioModal}>
            <FontAwesomeIcon icon={faWhatsapp} />
            Enviar todas
          </button>
        </div>
      </div>
      <div class="w-full flex flex-col items-center animate__animated animate__fadeInUp md:pr-10">
        <div class="w-full flex justify-center">
          <div class="overflow-x-auto" style="max-width: 100vw;">
            {#if loading}
              <div class="text-gray-500 py-8 text-center">Cargando invitados...</div>
            {:else if error}
              <div class="text-red-500 py-8 text-center">{error}</div>
            {:else if invitadosFiltrados.length === 0}
              <div class="text-gray-400 py-8 text-center">No se encontraron invitados.</div>
            {:else}
              <table class="min-w-[600px] w-full bg-white border border-black/10 rounded-lg text-sm table-fixed">
                <thead class="bg-gray-100">
                  <tr>
                    <th class="px-4 py-2 text-left">Nombre</th>
                    <th class="px-4 py-2 text-center">Asistirá</th>
                    <th class="px-4 py-2 text-center">Personas confirmadas</th>
                    <th class="px-4 py-2 text-center">Máx. invitaciones</th>
                    <th class="px-4 py-2 text-center">Número</th>
                    <th class="px-4 py-2 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {#each invitadosFiltrados.slice(0, 8) as invitado}
                    <tr class="border-b last:border-b-0">
                      <td class="px-4 py-2">{invitado.nombre}</td>
                      <td class="px-4 py-2 text-center">
                        {#if invitado.asistira === true}
                          <span class="inline-block px-2 py-1 rounded bg-green-100 text-green-700">Sí</span>
                        {:else if invitado.asistira === false}
                          <span class="inline-block px-2 py-1 rounded bg-red-100 text-red-700">No</span>
                        {:else}
                          <span class="inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-700">Pendiente</span>
                        {/if}
                      </td>
                      <td class="px-4 py-2 text-center">{invitado.personas_confirmadas}</td>
                      <td class="px-4 py-2 text-center">{invitado.max_inv}</td>
                      <td class="px-4 py-2 text-center">{invitado.numero}</td>
                      <td class="px-4 py-2 flex gap-2 items-center justify-center">
                        <button title="Eliminar" class="text-red-600 hover:text-red-800" on:click={() => eliminarInvitado(invitado.numero)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                        <button title="Editar" class="text-gray-600 hover:text-black" on:click={() => editarInvitado(invitado.numero)}>
                          <FontAwesomeIcon icon={faPen} />
                        </button>
                        <button title="Enviar WhatsApp" class="text-green-600 hover:text-green-800" on:click={() => enviarWhatsapp(invitado.numero)}>
                          <FontAwesomeIcon icon={faWhatsapp} />
                        </button>
                      </td>
                    </tr>
                  {/each}
                </tbody>
              </table>
              {#if invitadosFiltrados.length > 8}
                <div class="text-xs text-gray-400 mt-2 text-center">Mostrando solo los primeros 8 invitados.</div>
              {/if}
            {/if}
          </div>
        </div>
        <!-- Leyenda y botón solo en mobile -->
        <div class="block md:hidden w-full flex flex-col items-center mt-6">
          <p class="text-center text-gray-600 text-base mb-3">El manejo de tu evento en un smartphone es mejor desde nuestra app!</p>
          <a href="#" class="bg-black text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg hover:bg-gray-900 transition">Descargar app</a>
        </div>
      </div>
    </div>
  </main>
</div>

<style>
  *, *::before, *::after {
    box-sizing: border-box;
  }
  html, body {
    overflow-x: hidden;
    width: 100%;
    max-width: 100%;
  }
  body {
    /* background: red;  // para debug, puedes quitarlo */
  }
  @media (max-width: 768px) {
    aside.md\:flex {
      display: none !important;
    }
    .swal2-popup-tall {
      min-height: 520px !important;
    }
    main {
      margin-left: 0 !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      width: 100% !important;
      max-width: 100% !important;
      overflow-x: hidden;
    }
    .dashboard-content {
      width: 100%;
      max-width: 100%;
      min-width: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      overflow-x: hidden;
    }
    .table-scroll-container, .overflow-x-auto {
      width: 100%;
      max-width: 100%;
      margin: 0;
      padding: 0;
      overflow-x: auto;
    }
    table {
      min-width: 600px;
    }
    /* Drawer y hamburguesa */
    .z-40, .z-30, .z-50 {
      max-width: 100vw;
      width: 100vw;
      left: 0;
      right: 0;
      overflow-x: hidden;
    }
    .fixed {
      max-width: 100vw;
      width: 100vw;
      left: 0;
      right: 0;
      overflow-x: hidden;
    }
    .shadow-lg, .rounded-full {
      max-width: 100vw;
    }
  }
  .swal2-confirm-black {
    background: #000 !important;
    color: #fff !important;
    border: none !important;
  }
  .swal2-cancel-black {
    background: #000 !important;
    color: #fff !important;
    border: none !important;
  }
  /* Input estilo WhatsApp */
  .swal2-input.iti {
    border-radius: 8px !important;
    border: 1.5px solid #e0e0e0 !important;
    box-shadow: none !important;
    background: #fafafa !important;
    color: #222 !important;
    font-size: 1rem !important;
    padding-left: 48px !important;
    height: 44px !important;
    margin-bottom: 0.5rem !important;
    transition: border-color 0.2s;
  }
  .swal2-input.iti:focus {
    border-color: #25d366 !important; /* Verde WhatsApp */
    background: #fff !important;
  }
  .swal2-popup .iti__country-list {
    z-index: 99999 !important;
    max-height: 200px !important;
    overflow-y: auto !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.10);
    border-radius: 8px !important;
    border: 1px solid #e0e0e0 !important;
    background: #fff !important;
  }
  .swal2-popup .iti__country {
    font-size: 1rem !important;
    padding: 8px 12px !important;
  }
  .swal2-popup .iti__flag-container {
    left: 8px;
  }
  .swal2-popup .iti__selected-flag {
    margin-left: 0;
  }
  .swal2-popup .iti {
    width: 100% !important;
    position: relative !important;
  }
  .swal2-popup-tall {
    min-height: 480px !important;
    height: auto !important;
    max-width: 420px !important;
  }
  /* Forzar hamburguesa a la esquina superior izquierda */
  button[aria-label="Abrir menú"] {
    left: 1rem !important;
    top: 1rem !important;
    right: auto !important;
    margin: 0 !important;
    display: inline-flex !important;
    position: fixed !important;
    z-index: 9999 !important;
  }
</style> 