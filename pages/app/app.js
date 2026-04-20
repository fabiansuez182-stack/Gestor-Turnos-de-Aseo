import { AseoStore } from '../infrastructure/store.js';
import { generarTurnoDelDia } from '../core/logic.js';
import { renderizarTurno, actualizarCabecera, aplicarTema } from '../ui/renderer.js';

const inicializarApp = () => {
    const contenedor = document.getElementById('apprentice-grid');
    const titulo = document.getElementById('day-name');

    // =========================================================================
    // 1. REACTIVIDAD: La UI se suscribe al Store
    // =========================================================================
    AseoStore.suscribir((estadoGlobal) => {
        const { diaActual, ausentes } = estadoGlobal;

        // Pasamos por la capa de lógica pura
        const turnos = generarTurnoDelDia(diaActual, ausentes);

        // Delegamos a la capa de UI
        const colorDia = aplicarTema(diaActual);
        actualizarCabecera(titulo, diaActual);
        renderizarTurno(contenedor, turnos, colorDia);
    });

    // =========================================================================
    // 2. INTENCIONES (EVENTOS): Solo modifican el Store, no tocan el DOM
    // =========================================================================
    
    // Delegación de eventos para los botones de "Reportar Ausencia"
    contenedor.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-absent')) {
            const estudiante = e.target.dataset.estudiante;
            AseoStore.registrarAusencia(estudiante); 
        }
    });

    // Eventos para la navegación de los días (Botones L, M, M, J, V)
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const diaSeleccionado = parseInt(e.target.dataset.day);
            AseoStore.setDia(diaSeleccionado);
        });
    });
};

// Iniciar sistema cuando el HTML esté completamente cargado
document.addEventListener('DOMContentLoaded', inicializarApp);