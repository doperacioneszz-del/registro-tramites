// admin.js
import { supabase } from './supabase.js';

document.addEventListener("DOMContentLoaded", async () => {
  const kioscosList = document.getElementById("kioscos-list");
  const addKioscoForm = document.getElementById("add-kiosco-form");
  const kioscoFiltro = document.getElementById("kioscoFiltro");

  // Mostrar kioscos en lista y en filtro
  async function cargarKioscos() {
    const { data, error } = await supabase
      .from("kioscos")
      .select("*")
      .order("id", { ascending: true });

    if (error) {
      console.error("Error al cargar kioscos:", error);
      return;
    }

    kioscosList.innerHTML = "";
    kioscoFiltro.innerHTML = `<option value="">Todos</option>`;

    data.forEach((k) => {
      const li = document.createElement("li");
      li.textContent = k.nombre;
      kioscosList.appendChild(li);

      const option = document.createElement("option");
      option.value = k.id;
      option.textContent = k.nombre;
      kioscoFiltro.appendChild(option);
    });
  }

  // Agregar un kiosco (evita duplicados)
  addKioscoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const nombre = document.getElementById("kiosco-nombre").value.trim();

    if (!nombre) return;

    // Verificar si ya existe
    const { data: existente, error: searchError } = await supabase
      .from("kioscos")
      .select("*")
      .eq("nombre", nombre)
      .maybeSingle();

    if (searchError) {
      console.error("Error al buscar kiosco:", searchError);
      return;
    }

    if (existente) {
      alert("⚠️ Ese kiosco ya existe.");
      return;
    }

    // Insertar solo si no existe
    const { error } = await supabase.from("kioscos").insert([{ nombre }]);

    if (error) {
      console.error("Error al insertar kiosco:", error);
      return;
    }

    addKioscoForm.reset();
    await cargarKioscos();
  });

  // Inicializar
  await cargarKioscos();
});
