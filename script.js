
// TU URL DE GOOGLE SHEETS - YA ESTÁ CONFIGURADA
const GOOGLE_URL = 'https://script.google.com/macros/s/AKfycbxU1w6v9Ee1rjPHaer3W8zv4wz7f4GejqZzArpUVyexrqg-Ab09tvoyO7oSwcABkRLD/exec';
// Cuando envíen el formulario
document.getElementById('registroForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Recoger los datos del formulario
    const datos = {
        cedula: document.getElementById('cedula').value,
        correo: document.getElementById('correo').value,
        nombre: document.getElementById('nombre').value,
        apellido: document.getElementById('apellido').value,
        telefono: document.getElementById('telefono').value,
        profesion: document.getElementById('profesion').value,
        cargo: document.getElementById('cargo').value
    };
    
    // Verificar que los campos obligatorios estén llenos
    if (!datos.cedula || !datos.correo || !datos.nombre || 
        !datos.apellido || !datos.telefono || !datos.profesion) {
        mostrarMensaje('⚠️ Por favor, complete todos los campos obligatorios', 'error');
        return;
    }
    
    // Mostrar que está enviando
    const btn = document.querySelector('.submit-btn');
    const textoOriginal = btn.innerHTML;
    btn.innerHTML = '📤 Enviando registro...';
    btn.disabled = true;
    
    try {
        // Enviar a Google Sheets
        await fetch(GOOGLE_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos)
        });
        
        // Mostrar mensaje de éxito
        mostrarMensaje('✅ ¡Registro exitoso! Tus datos han sido guardados.', 'success');
        
        // Limpiar el formulario
        document.getElementById('registroForm').reset();
        
        // Opcional: cambiar a la pestaña de pago
        // document.querySelector('[data-tab="pago"]').click();
        
    } catch (error) {
        console.error('Error:', error);
        mostrarMensaje('❌ Error al guardar. Por favor, intenta de nuevo.', 'error');
    } finally {
        // Restaurar el botón
        btn.innerHTML = textoOriginal;
        btn.disabled = false;
    }
});

// Función para mostrar mensajes
function mostrarMensaje(mensaje, tipo) {
    const toast = document.getElementById('toast');
    toast.textContent = mensaje;
    toast.className = `toast ${tipo}`;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Funcionalidad de las pestañas (tabs)
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        btn.classList.add('active');
        document.getElementById(`tab-${tabId}`).classList.add('active');
    });
});
