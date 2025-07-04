import axios from 'axios';

const API_KEY = import.meta.env.VITE_AVIATIONSTACK_API_KEY;
const BASE_URL = 'http://api.aviationstack.com/v1'; // Nota: AviationStack usa HTTP para el plan gratuito. HTTPS para planes de pago.

/**
 * Fetches flight data from AviationStack API.
 *
 * @param {object} params - The parameters for the API call.
 * @param {string} params.flight_iata - The IATA flight number (e.g., "AA100").
 * @param {string} params.flight_date - The date of the flight (YYYY-MM-DD).
 * @returns {Promise<object>} The flight data.
 * @throws {Error} If the API key is missing or if the request fails.
 */
export const getFlightData = async ({ flight_iata, flight_date }) => {
  if (!API_KEY) {
    console.error("Error: VITE_AVIATIONSTACK_API_KEY is not defined.");
    throw new Error("La clave API de AviationStack no está configurada. Por favor, configúrala en tus variables de entorno.");
  }

  if (!flight_iata || !flight_date) {
    throw new Error("El número de vuelo IATA y la fecha son requeridos.");
  }

  try {
    const response = await axios.get(`${BASE_URL}/flights`, {
      params: {
        access_key: API_KEY,
        flight_iata: flight_iata,
        flight_date: flight_date,
        // Podríamos añadir más parámetros aquí si es necesario, como limit=1 si esperamos un solo vuelo.
        // limit: 1
      }
    });

    // AviationStack puede devolver un array vacío en `data.data` si no se encuentran vuelos.
    // O puede devolver errores dentro de la respuesta JSON incluso con un status 200.
    if (response.data && response.data.error) {
      console.error("Error de la API de AviationStack:", response.data.error);
      throw new Error(response.data.error.message || `Error al obtener datos del vuelo: ${response.data.error.code}`);
    }

    if (response.data && Array.isArray(response.data.data)) {
      return response.data; // Devuelve el objeto completo que contiene la paginación y el array de datos
    } else {
      console.error("Respuesta inesperada de AviationStack:", response.data);
      throw new Error("Formato de respuesta inesperado de la API de AviationStack.");
    }

  } catch (error) {
    console.error("Error al llamar a la API de AviationStack:", error);
    if (error.response) {
      // Error con respuesta del servidor (ej. 400, 401, 404, 500)
      throw new Error(`Error de AviationStack: ${error.response.status} - ${error.response.data?.error?.message || error.message}`);
    } else if (error.request) {
      // Error sin respuesta del servidor (ej. problema de red)
      throw new Error("No se pudo conectar con la API de AviationStack. Verifica tu conexión.");
    } else {
      // Otro tipo de error
      throw error; // Re-lanza el error original si ya es un Error con mensaje útil
    }
  }
};

/**
 * Extracts relevant delay information from the flight data.
 * @param {object} flight - A single flight object from AviationStack's response.
 * @returns {number|null} Delay in minutes, or null if not available. Positive for delay, 0 if on time.
 */
export const extractDelayMinutes = (flight) => {
  if (!flight || !flight.departure) {
    return null;
  }

  // Priorizar `departure.delay` si está disponible y es un número
  if (typeof flight.departure.delay === 'number') {
    return Math.max(0, flight.departure.delay); // Asegurar que no sea negativo si es un adelanto
  }

  // Si no hay `departure.delay`, calcular a partir de `actual` y `scheduled`
  // Esto es una aproximación, ya que las zonas horarias pueden complicarlo si no se manejan bien.
  // AviationStack debería proporcionar `delay` directamente si tiene los datos.
  if (flight.departure.actual && flight.departure.scheduled) {
    try {
      const actualTime = new Date(flight.departure.actual);
      const scheduledTime = new Date(flight.departure.scheduled);

      // Verificar que las fechas sean válidas
      if (isNaN(actualTime.getTime()) || isNaN(scheduledTime.getTime())) {
        console.warn("Fechas de salida inválidas para calcular el retraso:", flight.departure);
        return null;
      }

      const diffMs = actualTime.getTime() - scheduledTime.getTime();
      const delayMinutes = Math.round(diffMs / 60000);
      return Math.max(0, delayMinutes); // Asegurar que no sea negativo
    } catch (e) {
      console.error("Error al parsear fechas para calcular retraso:", e);
      return null;
    }
  }

  return null; // No hay suficiente información para determinar el retraso
};
