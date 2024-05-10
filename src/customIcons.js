import L from "leaflet";
import spotIcon from "./img/spot.png"; // Ruta al ícono de la estación
import trainIcon from "./img/train.png"; // Ruta al ícono del tren

// Ícono para las estaciones
const stationIcon = new L.Icon({
    iconUrl: spotIcon, // Ruta al ícono
    iconSize: [15, 15], // Tamaño del ícono
    iconAnchor: [7, 7], // Anclaje del ícono centrado
    popupAnchor: [0, -15], // Posición del popup justo encima del ícono
});

// Ícono para los trenes
const trainMarkerIcon = new L.Icon({
    iconUrl: trainIcon, // Ruta al ícono
    iconSize: [15, 15], // Tamaño del ícono
    iconAnchor: [7, 7], // Anclaje del ícono centrado
    popupAnchor: [0, -15], // Posición del popup justo encima del ícono
});

export { stationIcon, trainMarkerIcon }; // Exportar los íconos personalizados
