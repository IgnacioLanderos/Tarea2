import React, { useEffect, useState } from "react";

const WebSocketManager = ({ onMessage }) => {
  const [ws, setWs] = useState(null);

  useEffect(() => {
    const socket = new WebSocket("wss://tarea-2.2024-1.tallerdeintegracion.cl/connect");

    socket.onopen = () => {
      console.log("Conectado al WebSocket");
      socket.send(
        JSON.stringify({
          type: "JOIN",
          payload: {
            id: "18638260",
            username: "Ignacio Landeros",
          },
        })
      );
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("Mensaje recibido:", data);

      if (onMessage) {
        onMessage(data); // Llama a la función para manejar el mensaje
      }
    };

    socket.onclose = () => {
      console.log("Conexión cerrada");
    };

    setWs(socket);

    return () => {
      socket.close(); // Cerrar el WebSocket al desmontar el componente
    };
  }, []);

  return null; // No se requiere renderizado en este componente
};

export default WebSocketManager;