redirigirSiYaHaySesion();
pintarIconos();

const form = document.getElementById('form-login');
const btn = document.getElementById('btn-entrar');
const errorGeneral = document.getElementById('error-general');
const inputPass = document.getElementById('contrasena');
const togglePass = document.getElementById('toggle-pass');

let passVisible = false;
togglePass.addEventListener('click', () => {
  passVisible = !passVisible;
  inputPass.type = passVisible ? 'text' : 'password';
  togglePass.innerHTML = icono(passVisible ? 'eyeOff' : 'eye', 18);
});

function ponerCargando(cargando) {
  btn.disabled = cargando;
  btn.innerHTML = cargando
    ? '<span class="spinner"></span> Ingresando…'
    : '<span class="txt">Ingresar</span>';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorGeneral.classList.add('oculto');

  const correo = document.getElementById('correo').value.trim();
  const contrasena = inputPass.value;

  if (!correo || !contrasena) {
    errorGeneral.textContent = 'Completa tu correo y contraseña.';
    errorGeneral.classList.remove('oculto');
    return;
  }

  ponerCargando(true);
  try {
    const usuario = await authApi.iniciarSesion(correo, contrasena);
    localStorage.setItem('nb_user', JSON.stringify(usuario));
    window.location.href = 'dashboard.html';
  } catch (err) {
    errorGeneral.textContent = mensajeError(err, 'Correo o contraseña incorrectos.');
    errorGeneral.classList.remove('oculto');
  } finally {
    ponerCargando(false);
  }
});
