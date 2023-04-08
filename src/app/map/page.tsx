"use client";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";

function Rute() {
  const map = useMap();
  useEffect(() => {
    console.log(
      map.distance(
        L.latLng(-6.893702, 107.608379),
        L.latLng(-6.893727, 107.612954)
      )
    );
  }, []);
  return null;
}

export default function Map() {
  const list = ["A", "B", "C"];
  // const icon_marker = L.icon({ iconUrl: "/marker.png" });
  let list_icons: L.DivIcon[] = [];
  if (typeof window !== "undefined") {
    for (let item of list) {
      list_icons.push(
        L.divIcon({
          className:
            "bg-pink-400 w-10 h-10 rounded-full flex items-center justify-center font-bold text-2xl",
          html: `<div>${item}</div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        })
      );
    }
  }

  return (
    <div>
      <div className="fixed top-20 left-20 bg-pink-200 p-4 z-[10000] rounded-md shadow-lg">
        <h1>Path Finder</h1>
      </div>
      <MapContainer
        center={{ lat: -6.889852, lng: 107.609968 }}
        zoom={20}
        scrollWheelZoom={true}
      >
        <Rute />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={{ lat: -6.889852, lng: 107.609968 }}
          key={"marker-1"}
          icon={list_icons[0]}
        >
          <Popup>A pretty Kazuha Nakamura</Popup>
        </Marker>
        <Marker
          position={{ lat: -6.892649, lng: 107.609204 }}
          key={"marker-2"}
          icon={list_icons[1]}
        >
          <Popup>A pretty Kazuha Nakamura</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
