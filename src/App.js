import React, { useEffect, useState } from "react";
import WebSocketManager from "./WebSocketManager";
import MetroMap from "./MetroMap";
import { getStations, getTrains, getLines } from "./DataService";
import Chat from "./Chat"; // Asegúrate de importar el componente del chat

const initializeTrains = (trainsData) => {
  const trainsObj = {};
  trainsData.forEach((train, index) => {
    const train_id = train.train_id || `train_${index + 1}`;
    trainsObj[train_id] = {
      train_id,
      position: train.position || null,
      status: "Desconocido",
      current_station_id: null,
      driver_name: train.driver_name || "Desconocido",
      origin_station_id: train.origin_station_id || "Desconocido",
      destination_station_id: train.destination_station_id || "Desconocido",
    };
  });
  return trainsObj;
};

const App = () => {
  const [stations, setStations] = useState([]);
  const [trains, setTrains] = useState({});
  const [lines, setLines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState([]); // Para almacenar mensajes del chat

  const [webSocket, setWebSocket] = useState(null); // Definir el estado para WebSocket

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [linesData, stationsData, trainsData] = await Promise.all([
          getLines(),
          getStations(),
          getTrains(),
        ]);
        setLines(linesData);
        setStations(stationsData);

        const initializedTrains = initializeTrains(trainsData);
        setTrains(initializedTrains);

        setIsLoading(false);
      } catch (error) {
        console.error("Error al obtener datos:", error);
        setIsLoading(false);
      }
    };

    fetchData();

    // Conectar WebSocket al montar
    const socket = new WebSocket("wss://tarea-2.2024-1.tallerdeintegracion.cl/connect");
    setWebSocket(socket); // Guarda la referencia del WebSocket

    return () => {
      socket.close(); // Cerrar el WebSocket al desmontar
    };
  }, []);

  const handleWebSocketMessage = (data) => {
    const { type, data: eventData } = data;

    switch (type.toLowerCase()) {
      case "position": {
        const { train_id, position } = eventData;
        if (!train_id) {
          console.warn("Evento de posición sin ID:", eventData);
          return;
        }

        setTrains((prevTrains) => ({
          ...prevTrains,
          [train_id]: {
            ...(prevTrains[train_id] || {}),
            position,
          },
        }));
        break;
      }
      case "arrival": {
        const { train_id, station_id } = eventData;
        if (!train_id) {
          console.warn("Evento de llegada sin ID:", eventData);
          return;
        }

        setTrains((prevTrains) => ({
          ...prevTrains,
          [train_id]: {
            ...(prevTrains[train_id] || {}),
            current_station_id: station_id,
          },
        }));
        break;
      }
      case "departure": {
        const { train_id, station_id } = eventData;
        if (!train_id) {
          console.warn("Evento de salida sin ID:", eventData);
          return;
        }

        setTrains((prevTrains) => ({
          ...prevTrains,
          [train_id]: {
            ...(prevTrains[train_id] || {}),
            current_station_id: station_id,
          },
        }));
        break;
      }
      case "status": {
        const { train_id, status } = eventData;
        if (!train_id) {
          console.warn("Evento de estado sin ID:", eventData);
          return;
        }

        setTrains((prevTrains) => ({
          ...prevTrains,
          [train_id]: {
          ...(prevTrains[train_id] || {}),
            status,
          },
        }));
        break;
      }
      case "boarding": {
        const { train_id, station_id, boarded_passengers } = eventData;
        console.log(`El tren ${train_id} embarcó ${boarded_passengers} pasajeros en la estación ${station_id}.`);
        break;
      }
      case "unboarding": {
        const { train_id, station_id, unboarded_passengers } = eventData;
        console.log(`El tren ${train_id} desembarcó ${unboarded_passengers} pasajeros en la estación ${station_id}.`);
        break;
      }
      case "message": {
        setChatMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: eventData.name, // Quién envía el mensaje
            message: eventData.content, // El contenido del mensaje
            timestamp: data.timestamp, 
          },
        ]);
        break;
      }
      default:
        console.warn("Tipo de evento desconocido:", type);
        break;
    }
  };

  const sendChatMessage = (message) => {
    if (webSocket) {
      webSocket.send(
        JSON.stringify({
          type: "MESSAGE",
          payload: {
            content: message,
          },
        })
      );
    }
  };

  return (
    <div>
      <h1>Metro de Santiago</h1>
      {isLoading ? (
        <div>Cargando datos...</div>
      ) : (
        <>
          <WebSocketManager onMessage={handleWebSocketMessage} />
          <MetroMap stations={stations} trains={Object.values(trains)} lines={lines} />
          <Chat messages={chatMessages} sendMessage={sendChatMessage} /> {/* Incluye el componente del chat */}
        </>
      )}
    </div>
  );
};

export default App;
