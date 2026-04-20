// app/app.js

import { generarTurnoDelDia } from '../core/logic.js';
import { cargarEstado, registrarAusencia } from '../infrastructure/storage.js';
import { renderizarTurno, actualizarCabecera } from '../ui/renderer.js';

/**
 * Principio DIP (Dependency Inversion): Este módulo de alto nivel coordina 
 * dependencias de bajo nivel mediante sus contratos (APIs públicas).
 */
const COLORES_DIAS = { 1: '#3b82f6', 2: '#22c55e', 3: '#a855f7', 4: '#6b7280', 5: '#eab308' };

const inicializarApp = () => {
    const contenedor = document.getElementById('apprentice-grid');
    const titulo = document.getElementById('day-name');
    let diaActual = 1; // Inicializa en Lunes

    // Función pura de orquestación
    const orquestarPipeline = (dia) => {
        const estado = cargarEstado();
        const turnos = generarTurnoDelDia(dia, estado.ausentes);
        const colorDia = COLORES_DIAS[dia] || COLORES_DIAS[1];
        
        // Actualizamos variable CSS global para el tema
        document.documentElement.style.setProperty('--primary-color', colorDia);
        
        actualizarCabecera(titulo, dia);
        renderizarTurno(contenedor, turnos, colorDia);
    };

    // Event Delegation (Escucha global en el contenedor)
    contenedor.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-absent')) {
            const estudiante = e.target.dataset.estudiante;
            registrarAusencia(estudiante);
            orquestarPipeline(diaActual); // Reactividad manual: Re-renderiza al mutar el estado
        }
    });

    // Escucha de los botones de los días de la semana
    document.querySelectorAll('.day-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            diaActual = parseInt(e.target.dataset.day);
            orquestarPipeline(diaActual);
        });
    });

    // Despliegue inicial
    orquestarPipeline(diaActual);
};

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarApp);