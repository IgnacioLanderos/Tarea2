// src/DataService.js
const API_BASE_URL = "https://tarea-2.2024-1.tallerdeintegracion.cl";

export const getStations = async () => {
  const response = await fetch(`${API_BASE_URL}/api/metro/stations`);
  if (!response.ok) {
    throw new Error("Error al obtener estaciones");
  }
  return await response.json(); // Devuelve los datos como JSON
};

export const getLines = async () => {
  const response = await fetch(`${API_BASE_URL}/api/metro/lines`);
  if (!response.ok) {
    throw new Error("Error al obtener líneas");
  }
  return await response.json(); // Devuelve los datos como JSON
};

export const getTrains = async () => {
  const response = await fetch(`${API_BASE_URL}/api/metro/trains`);
  if (!response.ok) {
    throw new Error("Error al obtener trenes");
  }
  return await response.json(); // Devuelve los datos como JSON
};
