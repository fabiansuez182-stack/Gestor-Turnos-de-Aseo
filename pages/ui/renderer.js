/**
 * SRP: Aplica el tema dinámico al DOM mediante variables CSS.
 */
export const aplicarTema = (diaId) => {
    const COLORES_DIAS = { 1: '#3b82f6', 2: '#22c55e', 3: '#a855f7', 4: '#6b7280', 5: '#eab308' };
    const colorSeleccionado = COLORES_DIAS[diaId] || COLORES_DIAS[1];
    
    document.documentElement.style.setProperty('--primary-color', colorSeleccionado);
    return colorSeleccionado;
};

/**
 * SRP: Actualiza el título del día.
 */
export const actualizarCabecera = (elementoTitulo, diaId) => {
    const nombresDias = { 1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes' };
    elementoTitulo.textContent = `Turno de Aseo: ${nombresDias[diaId]}`;
};

/**
 * SRP: Genera las tarjetas de los aprendices en el contenedor.
 */
export const renderizarTurno = (contenedor, turnos, colorDia) => {
    contenedor.innerHTML = ''; // Limpiar renderizado anterior

    turnos.forEach(turno => {
        const card = document.createElement('article');
        card.className = 'apprentice-card';
        card.style.borderLeftColor = colorDia;

        const nameElement = document.createElement('h3');
        nameElement.textContent = turno.actual;
        card.appendChild(nameElement);

        // Etiqueta de contingencia si aplica
        if (turno.esReemplazo) {
            const badge = document.createElement('p');
            badge.style.color = '#ef4444';
            badge.style.fontSize = '0.85rem';
            badge.style.fontWeight = 'bold';
            badge.textContent = `⚠️ Cubriendo a ${turno.original}`;
            card.appendChild(badge);
        }

        // Botón de acción (La lógica del click se maneja en app.js)
        const btnAusencia = document.createElement('button');
        btnAusencia.className = 'btn-absent';
        btnAusencia.textContent = 'Reportar Ausencia';
        btnAusencia.dataset.estudiante = turno.actual;
        
        card.appendChild(btnAusencia);
        contenedor.appendChild(card);
    });
};