// ui/renderer.js

/**
 * Principio SRP: Única responsabilidad es generar HTML y actualizar el DOM.
 * Principio OCP: Abierto a extensión (acepta cualquier array de turnos), cerrado a modificación.
 */
export const renderizarTurno = (contenedor, turnos, colorDia) => {
    contenedor.innerHTML = ''; // Limpiamos el lienzo

    turnos.forEach(turno => {
        const card = document.createElement('article');
        card.className = 'apprentice-card';
        card.style.borderLeftColor = colorDia;

        const nameElement = document.createElement('h3');
        nameElement.textContent = turno.actual;
        card.appendChild(nameElement);

        // Renderizado condicional si es un reemplazo
        if (turno.esReemplazo) {
            const badge = document.createElement('p');
            badge.style.color = '#ef4444';
            badge.style.fontSize = '0.85rem';
            badge.style.fontWeight = 'bold';
            badge.textContent = `⚠️ Contingencia: Cubriendo a ${turno.original}`;
            card.appendChild(badge);
        }

        // Delegación de interfaz: el renderizador crea el botón pero no maneja el estado
        const btnAusencia = document.createElement('button');
        btnAusencia.className = 'btn-absent';
        btnAusencia.textContent = 'Reportar Ausencia';
        btnAusencia.dataset.estudiante = turno.actual;
        
        card.appendChild(btnAusencia);
        contenedor.appendChild(card);
    });
};

export const actualizarCabecera = (elementoTitulo, diaId) => {
    const nombresDias = { 1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes' };
    elementoTitulo.textContent = `Turno de Aseo: ${nombresDias[diaId]}`;
};