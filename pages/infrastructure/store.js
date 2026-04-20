import { cargarEstado, guardarEstado } from './storage.js';

/**
 * PATRÓN DE MÓDULO + PATRÓN OBSERVADOR
 * Encapsula el estado y notifica a los suscriptores cuando hay cambios.
 */
export const AseoStore = (() => {
    // 1. Estado Privado (Única fuente de la verdad)
    let estadoInterno = {
        diaActual: new Date().getDay() >= 1 && new Date().getDay() <= 5 ? new Date().getDay() : 1,
        ausentes: cargarEstado().ausentes || []
    };

    // 2. Lista de suscriptores
    const observadores = [];

    // 3. Función privada para notificar cambios
    const notificar = () => {
        // Pasamos una copia para garantizar la inmutabilidad
        observadores.forEach(observador => observador({ ...estadoInterno }));
    };

    // 4. API Pública
    return {
        suscribir: (observador) => {
            observadores.push(observador);
            // Ejecución inicial obligatoria
            observador({ ...estadoInterno });
        },

        setDia: (nuevoDia) => {
            if (estadoInterno.diaActual !== nuevoDia) {
                estadoInterno.diaActual = nuevoDia;
                notificar(); // La UI reaccionará sola
            }
        },

        registrarAusencia: (estudiante) => {
            if (!estadoInterno.ausentes.includes(estudiante)) {
                // Mutación inmutable
                estadoInterno.ausentes = [...estadoInterno.ausentes, estudiante];
                
                // Persistencia en disco
                guardarEstado({ ausentes: estadoInterno.ausentes });
                
                notificar(); // La UI reaccionará sola
            }
        }
    };
})();