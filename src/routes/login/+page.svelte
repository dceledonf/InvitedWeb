<script>
  import { supabase } from '$lib/supabaseClient';
  let email = '';
  let password = '';
  let error = '';
  let loading = false;
  function goBack() {
    window.location.href = '/';
  }
  /** @param {Event} e */
  async function handleLogin(e) {
    e.preventDefault();
    error = '';
    loading = true;
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    loading = false;
    if (loginError) {
      error = loginError.message;
    } else {
      // Obtener usuario autenticado
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) {
        error = 'No se pudo obtener el usuario.';
        return;
      }
      // Buscar evento del usuario
      const { data: eventos, error: eventoError } = await supabase
        .from('events')
        .select('id')
        .eq('user_id', userId)
        .limit(1);
      if (eventoError || !eventos || eventos.length === 0) {
        error = 'No se encontró un evento para este usuario.';
        return;
      }
      // Guardar event_id en sessionStorage
      sessionStorage.setItem('event_id', eventos[0].id);
      // Redirigir al dashboard
      window.location.href = '/dashboard';
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-black font-poppins px-4 relative">
  <button type="button" class="fixed top-6 right-6 text-white bg-black/40 hover:bg-black/70 rounded-full px-5 py-2 z-30 font-semibold flex items-center gap-2" on:click={goBack} title="Volver al inicio">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
    Regresar
  </button>
  <form class="bg-white/10 backdrop-blur rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col gap-6 border border-white/20 relative" on:submit={handleLogin}>
    {#if loading}
      <div class="absolute inset-0 bg-black/60 flex flex-col items-center justify-center z-10 rounded-2xl">
        <div class="loader mb-2"></div>
        <span class="text-white font-semibold">Cargando...</span>
      </div>
    {/if}
    <div class="flex justify-center mb-4">
      <img src="/img/wl.png" alt="InvitedMx Logo" class="h-8 w-auto" />
    </div>
    <h1 class="text-3xl font-extrabold text-white text-center mb-2">Iniciar sesión</h1>
    <p class="text-gray-300 text-center mb-4">Accede a tu panel de gestión de eventos</p>
    {#if error}
      <div class="bg-red-500/80 text-white rounded px-4 py-2 text-center">{error}</div>
    {/if}
    <input
      type="email"
      placeholder="Correo electrónico"
      bind:value={email}
      class="border border-white/30 bg-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white transition"
      autocomplete="email"
      required
      disabled={loading}
    />
    <input
      type="password"
      placeholder="Contraseña"
      bind:value={password}
      class="border border-white/30 bg-white/10 text-white placeholder-gray-400 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white transition"
      autocomplete="current-password"
      required
      disabled={loading}
    />
    <button type="submit" class="bg-white text-black font-bold py-3 rounded-lg text-lg hover:bg-gray-200 transition disabled:opacity-60" disabled={loading}>Entrar</button>
    <a href="#" class="text-gray-400 text-sm text-center hover:underline">¿Olvidaste tu contraseña?</a>
  </form>
</div>
<style>
  .loader {
    border: 4px solid #fff;
    border-top: 4px solid #25d366;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style> 