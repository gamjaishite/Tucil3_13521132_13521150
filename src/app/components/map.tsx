import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import { Connections, Nodes } from "../lib/utils";
import { useEffect } from "react";

function CreateMarker({ nodes }: { nodes: Nodes }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo({
      lat: nodes ? nodes[0].latitude : -6.889852,
      lng: nodes ? nodes[0].longitude : 107.609968,
    });
  }, [nodes]);
  return null;
}

export default function Map({
  nodes,
  connections,
}: {
  nodes: Nodes;
  connections: Connections;
}) {
  let marker: L.DivIcon[] = [];
  let connections_label: string[] = [];
  if (nodes) {
    for (let item in nodes) {
      marker.push(
        L.divIcon({
          className:
            "bg-pink-400 w-10 h-10 rounded-full flex items-center justify-center font-bold text-2xl",
          html: `<div>${nodes[item].name}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        })
      );
    }
  }
  if (connections) connections_label = [...Object.keys(connections)];
  return (
    <MapContainer
      center={{
        lat: nodes ? nodes[0].latitude : -6.889852,
        lng: nodes ? nodes[0].longitude : 107.609968,
      }}
      zoom={20}
      scrollWheelZoom={true}
    >
      <CreateMarker nodes={nodes} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {marker.map((icon, i) => (
        <Marker
          position={{
            lat: nodes[i].latitude,
            lng: nodes[i].longitude,
          }}
          key={`marker-${i}`}
          icon={icon}
        >
          <Popup></Popup>
        </Marker>
      ))}
      {connections_label.map((key) => (
        <>
          {connections[key].map((item) => (
            <Polyline
              pathOptions={{ color: "black" }}
              positions={[
                [nodes[key].latitude, nodes[key].longitude],
                [nodes[item].latitude, nodes[item].longitude],
              ]}
            />
          ))}
        </>
      ))}
    </MapContainer>
  );
}
