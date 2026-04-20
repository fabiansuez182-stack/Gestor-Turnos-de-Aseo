// infrastructure/storage.js

/**
 * MÓDULO DE PERSISTENCIA
 * Responsabilidad: Único punto de contacto con el LocalStorage del navegador.
 */

// Evitamos "Magic Strings" definiendo la clave como una constante inmutable
const STORAGE_KEY = 'adso_gestor_aseo_v1';

// Estado inicial por defecto, congelado para prevenir modificaciones accidentales
const DEFAULT_STATE = Object.freeze({
    ausentes: []
});

/**
 * Carga el estado desde LocalStorage.
 * Clean Code: Manejo defensivo de errores. LocalStorage puede fallar en modo incógnito.
 */
export const cargarEstado = () => {
    try {
        const dataSerializada = localStorage.getItem(STORAGE_KEY);
        return dataSerializada ? JSON.parse(dataSerializada) : { ...DEFAULT_STATE };
    } catch (error) {
        console.warn('[Storage Error] No se pudo leer la persistencia, usando estado por defecto.', error);
        return { ...DEFAULT_STATE };
    }
};

/**
 * Guarda un nuevo estado en LocalStorage.
 */
const guardarEstado = (nuevoEstado) => {
    try {
        const dataSerializada = JSON.stringify(nuevoEstado);
        localStorage.setItem(STORAGE_KEY, dataSerializada);
    } catch (error) {
        console.error('[Storage Error] Límite de cuota o persistencia bloqueada.', error);
    }
};

/**
 * Registra un estudiante ausente validando que no exista previamente.
 */
export const registrarAusencia = (estudiante) => {
    const estadoActual = cargarEstado();
    
    if (!estadoActual.ausentes.includes(estudiante)) {
        // Inmutabilidad: Creamos un nuevo objeto y un nuevo array
        const nuevoEstado = { 
            ...estadoActual, 
            ausentes: [...estadoActual.ausentes, estudiante] 
        };
        guardarEstado(nuevoEstado);
    }
};

/**
 * Reinicia la persistencia (Ideal para el inicio de una nueva semana).
 */
export const limpiarAusencias = () => {
    guardarEstado({ ...DEFAULT_STATE });
};