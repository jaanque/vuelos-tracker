document.addEventListener('DOMContentLoaded', () => {
    const flightForm = document.getElementById('flight-form');
    const leaderboardBody = document.getElementById('leaderboard-body');

    // Datos de ejemplo iniciales (simulando una base de datos o API)
    let users = [
        { name: 'UsuarioAlfa', delayHours: 15.5 },
        { name: 'BetaUser', delayHours: 22.1 },
        { name: 'CharlieFly', delayHours: 8.0 },
        { name: 'DeltaWing', delayHours: 19.3 },
    ];

    // Función para renderizar la tabla de clasificación
    function renderLeaderboard() {
        // Ordenar usuarios por horas de retraso (descendente)
        users.sort((a, b) => b.delayHours - a.delayHours);

        // Limpiar el cuerpo de la tabla actual
        leaderboardBody.innerHTML = '';

        // Llenar la tabla con los datos de los usuarios
        users.forEach((user, index) => {
            const row = leaderboardBody.insertRow();
            row.insertCell(0).textContent = index + 1; // Posición
            row.insertCell(1).textContent = user.name;
            row.insertCell(2).textContent = user.delayHours.toFixed(1); // Formatear a 1 decimal
        });
    }

    // Función para manejar el envío del formulario de vuelos
    function handleFlightSubmit(event) {
        event.preventDefault(); // Evitar que la página se recargue

        const username = document.getElementById('username').value.trim();
        const flightNumber = document.getElementById('flight-number').value.trim(); // Aunque no se use directamente en la clasificación, es bueno tenerlo
        const delayHoursInput = document.getElementById('delay-hours').value;

        // Validación simple
        if (!username || !flightNumber || delayHoursInput === '') {
            alert('Por favor, complete todos los campos.');
            return;
        }

        const delayHours = parseFloat(delayHoursInput);

        if (isNaN(delayHours) || delayHours < 0) {
            alert('Por favor, introduzca un número válido para las horas de retraso.');
            return;
        }

        // Buscar si el usuario ya existe
        const existingUser = users.find(user => user.name.toLowerCase() === username.toLowerCase());

        if (existingUser) {
            // Si existe, sumar las horas de retraso
            existingUser.delayHours += delayHours;
        } else {
            // Si no existe, añadir nuevo usuario
            users.push({ name: username, delayHours: delayHours });
        }

        // Volver a renderizar la tabla
        renderLeaderboard();

        // Limpiar el formulario
        flightForm.reset();
        document.getElementById('username').focus(); // Poner foco en el primer campo
    }

    // Añadir el event listener al formulario
    flightForm.addEventListener('submit', handleFlightSubmit);

    // Renderizar la tabla de clasificación al cargar la página
    renderLeaderboard();
});
