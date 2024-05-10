import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { stationIcon, trainMarkerIcon } from './customIcons';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css'; 

// Corregir íconos predeterminados para Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MetroMap = ({ stations, trains, lines }) => {
  if (!lines || !Array.isArray(lines) || lines.length === 0) {
    return <div>No se pueden mostrar las líneas del metro.</div>;
  }

  const center = [-33.48, -70.65]; // Centro del mapa

  return (
    <div style={{justifyContent: 'center' }}>
        <MapContainer
          center={center}
          zoom={12}
          style={{ height: '1000px', width: '50%' }}
          dragging={false}
          touchZoom={false}
          doubleClickZoom={false}
          scrollWheelZoom={false}
          zoomControl={false}
          boxZoom={false}
          keyboard={false}
        >

        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap &amp; contributors, &copy; CartoDB'
        />

        {/* Dibujar las líneas del metro */}
        {lines.map((line) => {
          const lineCoordinates = line.station_ids.map((stationId) => {
            const station = stations.find((s) => s.station_id === stationId);
            return station ? [station.position.lat, station.position.long] : null;
          });

          const validCoordinates = lineCoordinates.filter((coord) => coord !== null);

          if (validCoordinates.length === 0) {
            return null;
          }

          return (
            <Polyline
              key={line.line_id}
              positions={validCoordinates}
              color={line.color}
              weight={5}
            />
          );
        })}

        {/* Dibujar las estaciones */}
        {stations.map((station) => (
          <Marker
            key={station.station_id}
            position={[station.position.lat, station.position.long]}
            icon={stationIcon}
          >
            <Popup>
              <b>{station.name}</b> ({station.station_id})<br />
              Línea: {station.line_id}
            </Popup>
          </Marker>
        ))}

        {/* Dibujar los trenes */}
        {trains
          .filter((train) => train.position && train.position.lat !== null && train.position.long !== null)
          .map((train) => {
            const originStation = stations.find((s) => s.station_id === train.origin_station_id);
            const destinationStation = stations.find((s) => s.station_id === train.destination_station_id);

            // Cambiar para obtener la línea del tren a partir de la estación de origen o destino
            const line = lines.find((l) => 
                (originStation && l.station_ids.includes(originStation.station_id)) ||
                (destinationStation && l.station_ids.includes(destinationStation.station_id))
            );

            return (
              <Marker
                key={train.train_id}
                position={[train.position.lat, train.position.long]}
                icon={trainMarkerIcon}
              >
                <Popup>
                  Tren: {train.train_id}<br />
                  Línea: {line ? line.name : "Desconocido"}<br />
                  Estado: {train.status || "Desconocido"}<br />
                  Chofer: {train.driver_name || "Desconocido"}<br />
                  Origen: {originStation ? originStation.name : "Desconocido"}<br />
                  Destino: {destinationStation ? destinationStation.name : "Desconocido"}
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>

      {/* Contenedor para tablas */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        {/* Tabla de estaciones */}
        <div>
          <h2>Estaciones</h2>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>ID</th>
                <th>Línea</th>
              </tr>
            </thead>
            <tbody>
              {stations.map((station) => (
                <tr key={station.station_id}>
                  <td>{station.name}</td>
                  <td>{station.station_id}</td>
                  <td>{station.line_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Tabla de trenes */}
        <div>
          <h2>Trenes</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Chofer</th>
                <th>Estación de Origen</th>
                <th>Estación de Destino</th>
                <th>Estación Actual</th>
              </tr>
            </thead>
            <tbody>
              {trains.map((train) => (
                <tr key={train.train_id}>
                  <td>{train.train_id}</td>
                  <td>{train.driver_name || "Desconocido"}</td>
                  <td>{stations.find((s) => s.station_id === train.origin_station_id)?.name || "Desconocido"}</td>
                  <td>{stations.find((s) => s.station_id === train.destination_station_id)?.name || "Desconocido"}</td>
                  <td>{stations.find((s) => s.station_id === train.current_station_id)?.name || "Desconocido"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MetroMap;
