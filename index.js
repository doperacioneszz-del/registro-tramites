import { supabase } from './supabase.js';

// Poblar kioscos y trámites dinámicamente
async function cargarSelects() {
  const { data: kioscos } = await supabase.from('kioscos').select('id,nombre');
  const { data: tramites } = await supabase.from('tramites').select('id,nombre');

  const kioscoSelect = document.getElementById('kiosco');
  kioscos.forEach(k => {
    const opt = document.createElement('option');
    opt.value = k.id;
    opt.textContent = k.nombre;
    kioscoSelect.appendChild(opt);
  });

  const tramiteSelect = document.getElementById('tramite');
  tramites.forEach(t => {
    const opt = document.createElement('option');
    opt.value = t.id;
    opt.textContent = t.nombre;
    tramiteSelect.appendChild(opt);
  });
}

// Registrar trámite
document.getElementById('formRegistro').addEventListener('submit', async e => {
  e.preventDefault();
  const kiosco_id = document.getElementById('kiosco').value;
  const tramite_id = document.getElementById('tramite').value;
  const folio = document.getElementById('folio').value;

  const { error } = await supabase.from('registros_tramites').insert([
    { kiosco_id, tramite_id, folio }
  ]);

  if (error) alert('Error al registrar: ' + error.message);
  else {
    alert('¡Registro exitoso!');
    document.getElementById('formRegistro').reset();
  }
});

// Botón admin
document.getElementById('adminBtn').addEventListener('click', () => {
  window.location.href = 'admin.html';
});

cargarSelects();
