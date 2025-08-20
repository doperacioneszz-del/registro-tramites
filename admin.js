// admin.js
import { supabase } from "./supabase.js";

// Elementos
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const addKioscoBtn = document.getElementById("addKioscoBtn");
const addTramiteBtn = document.getElementById("addTramiteBtn");
const downloadBtn = document.getElementById("downloadBtn");

const loginDiv = document.getElementById("loginDiv");
const adminPanel = document.getElementById("adminPanel");
const messageDiv = document.getElementById("message");

// LOGIN
loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    messageDiv.textContent = "⚠️ Ingresa correo y contraseña";
    messageDiv.className = "error";
    return;
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.error("Error en login:", error.message);
      messageDiv.textContent = "❌ " + error.message;
      messageDiv.className = "error";
    } else {
      messageDiv.textContent = "✅ Bienvenido!";
      messageDiv.className = "success";
      loginDiv.style.display = "none";
      adminPanel.style.display = "block";
    }
  } catch (err) {
    console.error("Excepción inesperada:", err);
    messageDiv.textContent = "⚠️ Error inesperado. Revisa la consola.";
    messageDiv.className = "error";
  }
});

// LOGOUT
logoutBtn.addEventListener("click", async () => {
  await supabase.auth.signOut();
  adminPanel.style.display = "none";
  loginDiv.style.display = "block";
});

// AGREGAR KIOSCO
addKioscoBtn.addEventListener("click", async () => {
  const nombre = document.getElementById("nuevoKiosco").value.trim();
  if (!nombre) return alert("Ingresa un nombre de kiosco");

  const { error } = await supabase.from("kioscos").insert([{ nombre }]);
  if (error) alert("Error: " + error.message);
  else alert("Kiosco agregado");
});

// AGREGAR TRÁMITE
addTramiteBtn.addEventListener("click", async () => {
  const nombre = document.getElementById("nuevoTramite").value.trim();
  if (!nombre) return alert("Ingresa un nombre de trámite");

  const { error } = await supabase.from("tramites").insert([{ nombre }]);
  if (error) alert("Error: " + error.message);
  else alert("Trámite agregado");
});

// DESCARGAR EXCEL UTF-8
downloadBtn.addEventListener("click", async () => {
  try {
    const { data, error } = await supabase
      .from("registros_tramites")
      .select(`
        folio,
        fecha_registro,
        registros_tramites_kiosco_id_fkey(nombre),
        registros_tramites_tramite_id_fkey(nombre)
      `);

    if (error) throw error;
    if (!data.length) return alert("No hay registros para exportar.");

    // CSV con BOM UTF-8
    let csv = "\uFEFF";
    csv += "Folio,Fecha,Kiosco,Trámite\n";

    data.forEach(row => {
      const fecha = new Date(row.fecha_registro);
      const fechaFormateada = `${fecha.getDate().toString().padStart(2,'0')}/${(fecha.getMonth()+1).toString().padStart(2,'0')}/${fecha.getFullYear()}`;
      csv += `"${row.folio}","${fechaFormateada}","${row.registros_tramites_kiosco_id_fkey.nombre}","${row.registros_tramites_tramite_id_fkey.nombre}"\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "registros_tramites.csv";
    a.click();
    URL.revokeObjectURL(url);

  } catch (err) {
    console.error("Error al obtener registros:", err);
    alert("Error al obtener registros: " + err.message);
  }
});
