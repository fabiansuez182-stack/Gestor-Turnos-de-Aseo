// core/logic.js

// 1. Data Inmutable: Lista oficial de la ficha ADSO Cognitus # 3292136
export const APRENDICES = Object.freeze([
    "Alisson Paola Jaramillo Echeverry", "Carlos Andrés Zuluaga Atehortua", "Daniela Zapata López",
    "David Antonio Pescador Durán", "David Buendia Ruiz", "Eric Daniel Barreto Chavez",
    "Jhoan Steven Murillo García", "Jhon Alejandro Patiño Agudelo", "Juan Camilo Valencia Rey",
    "Juan Carlos Combita Sandoval", "Juan David Ferrer Castillo", "Juan José Santamaria Muñoz",
    "Julián David Flórez Vera", "Maria Fernanda Huertas Montes", "Nelson Fabián Gallego Sánchez",
    "Santiago Moreno Piedrahita", "Santiago Palacio Tovar", "Santiago Tovar Zambrano",
    "Sebastian Ortega Barrero", "Stiven Andrés Robles Galán", "Valeria Arcila Hernández",
    "Valeria Becerra Giraldo"
]);

// 2. Funciones Puras (Arrow Functions Estrictas) 

/**
 * Calcula el índice inicial basado en el día de la semana.
 * (1 = Lunes, 5 = Viernes). Si es fin de semana, asume Lunes.
 */
export const calcularIndiceInicio = (dia, totalEstudiantes, tamanoGrupo = 5) => {
    const diaNormalizado = (dia >= 1 && dia <= 5) ? dia : 1;
    return ((diaNormalizado - 1) * tamanoGrupo) % totalEstudiantes;
};

/**
 * Extrae el grupo base secuencial de estudiantes para un día específico.
 */
export const obtenerGrupoBase = (estudiantes, indiceInicio, tamanoGrupo = 5) =>
    Array.from({ length: tamanoGrupo }, (_, i) => estudiantes[(indiceInicio + i) % estudiantes.length]);

/**
 * Filtra los estudiantes que están disponibles para ser reemplazos.
 * (No están en el grupo actual y no están reportados como ausentes).
 */
export const obtenerCandidatosReemplazo = (todosLosEstudiantes, grupoBase, ausentes) =>
    todosLosEstudiantes.filter(estudiante =>
        !grupoBase.includes(estudiante) && !ausentes.includes(estudiante)
    );

/**
 * Selecciona un reemplazo aleatorio. 
 * (Única función con un grado de impureza contenida por el Math.random).
 */
const seleccionarReemplazoAleatorio = (candidatos) => {
    if (candidatos.length === 0) return null;
    const indiceAleatorio = Math.floor(Math.random() * candidatos.length);
    return candidatos[indiceAleatorio];
};

/**
 * Orquesta la lógica de contingencia mediante un 'reduce' funcional puro,
 * garantizando la inmutabilidad de los datos en cada iteración.
 */
export const procesarTurnoConContingencia = (grupoBase, ausentes, candidatosIniciales) => {
    const resultadoFinal = grupoBase.reduce((estado, estudiante) => {
        if (ausentes.includes(estudiante)) {
            const reemplazo = seleccionarReemplazoAleatorio(estado.candidatosDisponibles);
            return {
                turnos: [...estado.turnos, { 
                    original: estudiante, 
                    actual: reemplazo || "N/A (Sin reemplazos)", 
                    esReemplazo: true 
                }],
                // Filtramos al candidato recién usado para no repetirlo
                candidatosDisponibles: estado.candidatosDisponibles.filter(c => c !== reemplazo)
            };
        }
        
        return {
            turnos: [...estado.turnos, { original: estudiante, actual: estudiante, esReemplazo: false }],
            candidatosDisponibles: estado.candidatosDisponibles
        };
    }, { turnos: [], candidatosDisponibles: candidatosIniciales });

    return resultadoFinal.turnos;
};

/**
 * COMPOSICIÓN (Pipeline): Función principal exportada que compone el flujo de datos.
 */
export const generarTurnoDelDia = (dia, ausentes = []) => {
    const indiceInicio = calcularIndiceInicio(dia, APRENDICES.length);
    const grupoBase = obtenerGrupoBase(APRENDICES, indiceInicio);
    const candidatos = obtenerCandidatosReemplazo(APRENDICES, grupoBase, ausentes);

    return procesarTurnoConContingencia(grupoBase, ausentes, candidatos);
};