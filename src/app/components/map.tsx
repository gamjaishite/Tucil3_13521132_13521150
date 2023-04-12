"use client"

import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Polyline,
    useMap,
    useMapEvent,
} from "react-leaflet";
import {Connections, Edges, Nodes, Path} from "../lib/utils";
import {useEffect, useState} from "react";

let markers: L.Marker[] = [];
// let polylines: L.Polyline[] = [];
// let edges: Edges[] = [];

function RemoveEdge({
                        initial,
                        target,
                        connections,
                        setConnections,
                        nodes,
                        currentSelectedNode,
                        setNodes,
                        setInitial,
                        setTarget,
                        setCurrentSelectedNode,
                    }: {
    initial: number | undefined;
    target: number | undefined;
    connections: Connections;
    setConnections: (x: Connections) => void;
    nodes: Nodes;
    setNodes: (x: Nodes) => void;
    setInitial: (x: number | undefined) => void;
    setTarget: (x: number | undefined) => void;
    currentSelectedNode: number | undefined;
    setCurrentSelectedNode: (x: number | undefined) => void;
}) {
    const map = useMap()
    if (initial && target) {
        connections[(initial - 1).toString()] = connections[(initial - 1).toString()].filter((val) => val !== (target - 1).toString())
        connections[(target - 1).toString()] = connections[(target - 1).toString()].filter((val) => val !== (initial - 1).toString())
        if (connections[(initial - 1).toString()].length === 0) {
            delete connections[(initial - 1).toString()]
            if (initial - 1 !== 0) {
                delete nodes[(initial - 1).toString()]
                map.removeLayer(markers[initial - 1])
            }
        }
        if (connections[(target - 1).toString()].length === 0) {
            delete connections[(target - 1).toString()]
            if (target - 1 !== 0) {
                delete nodes[(target - 1).toString()]
                map.removeLayer(markers[target - 1])
            }
        }
        setConnections({...connections})
        setNodes({...nodes})
        setInitial(undefined)
        setTarget(undefined)
        if (currentSelectedNode && !nodes[currentSelectedNode - 1]) {
            markers[0].setIcon(L.divIcon({
                className:
                    "bg-pink-300 w-10 h-10 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-900",
                html: `<div>${1}</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 30],
            }))
            setCurrentSelectedNode(1)
        }
    }

    return null;
}

function GetLatitudeLongitudeOnClick({
                                         setInitial,
                                         setTarget,
                                         setCurrentSelectedNode,
                                         setNodes,
                                         setConnections,
                                         nodes,
                                         connections,
                                         currentSelectedNode,
                                         initial,
                                         removeAll,
                                         mode,
                                         isNewNode,
                                         // markers,
                                         polylines,
                                         edges,
                                         handleSetPolyline,
                                         handleSetEdges,
                                         handleSetMarkers,
                                         handleSetRemoveAll,
                                     }: {
    setInitial: (x: L.LatLng | undefined) => void;
    setTarget: (x: L.LatLng | undefined) => void;
    setCurrentSelectedNode: (x: number | undefined) => void;
    setNodes: (x: Nodes | undefined) => void;
    setConnections: (x: Connections | undefined) => void;
    nodes: Nodes;
    isNewNode: boolean;
    connections: Connections;
    currentSelectedNode: number;
    initial: L.LatLng | undefined;
    target: L.LatLng | undefined;
    mode: string;
    removeAll: boolean;
    markers: L.Marker[];
    polylines: L.Polyline[];
    edges: Edges[];
    handleSetPolyline: (x: L.Polyline[] | undefined) => void;
    handleSetEdges: (x: Edges[] | undefined) => void;
    handleSetMarkers: (x: L.Marker[]) => void;
    handleSetRemoveAll: (x: boolean) => void;
}) {
    let markers_local = markers;
    const use_map = useMap();
    if (removeAll) {
        for (let marker of markers) {
            use_map.removeLayer(marker);
        }
        for (let polyline of polylines) {
            use_map.removeLayer(polyline);
        }
        handleSetMarkers([])
        handleSetPolyline([])
        setInitial(undefined)
        setTarget(undefined)
        setCurrentSelectedNode(1)
        handleSetRemoveAll(false)
        markers = []
    }

    const map = useMapEvent("click", (e) => {
        if (mode === 'file' || !isNewNode) {
            map.off();
        } else {
            // create new nodes
            nodes[markers.length] = {
                name: (markers.length + 1).toString(),
                latitude: e.latlng.lat,
                longitude: e.latlng.lng,
            };
            setNodes(nodes);
            setTarget(e.latlng);
            if (initial) {
                // let new_polyline = L.polyline([initial, e.latlng], {color: "black"});
                // map.addLayer(new_polyline);
                // handleSetPolyline([...polylines, new_polyline])
                handleSetEdges([...edges, {
                    lat_init: initial.lat,
                    lng_init: initial.lng,
                    lat_target: e.latlng.lat,
                    lng_target: e.latlng.lng,
                    name: "E" + polylines.length,
                    node_init: currentSelectedNode!,
                    node_target: markers.length + 1,
                }]);
                connections[currentSelectedNode - 1]
                    ? connections[currentSelectedNode - 1].push(markers.length.toString())
                    : (connections[currentSelectedNode - 1] = [
                        markers.length.toString(),
                    ]);
                connections[markers.length]
                    ? connections[markers.length].push(
                        (currentSelectedNode - 1).toString()
                    )
                    : (connections[markers.length] = [
                        (currentSelectedNode - 1).toString(),
                    ]);

                setConnections(connections);
            }
            let iconOptsNormal = L.divIcon({
                className:
                    "nodes-color w-10 h-10 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-900",
                html: `<div>${markers.length + 1}</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 30],
            });

            let iconOptsSelected = L.divIcon({
                className:
                    "bg-pink-300 w-10 h-10 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-900",
                html: `<div>${markers.length + 1}</div>`,
                iconSize: [30, 30],
                iconAnchor: [15, 30],
            });

            //@ts-ignore
            let new_marker: any = new L.marker(e.latlng, {
                icon: iconOptsNormal,
            });
            map.addLayer(new_marker);

            if (markers.length === 0) {
                new_marker.setIcon(iconOptsSelected);
                setInitial(e.latlng);
            }
            new_marker._id = markers.length;
            markers.push(new_marker)
            handleSetMarkers([...markers, new_marker])
            new_marker.on("click", (e: any) => {
                if (isNewNode) {
                    iconOptsSelected = L.divIcon({
                        className:
                            "bg-pink-300 w-10 h-10 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-900",
                        html: `<div>${new_marker._id + 1}</div>`,
                        iconSize: [30, 30],
                        iconAnchor: [15, 30],
                    });
                    markers.map((marker: any) => {
                        iconOptsNormal = L.divIcon({
                            className:
                                "nodes-color w-10 h-10 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-900",
                            html: `<div>${marker._id + 1}</div>`,
                            iconSize: [30, 30],
                            iconAnchor: [15, 30],
                        });
                        marker.setIcon(iconOptsNormal);
                    });
                    new_marker.setIcon(iconOptsSelected);
                    setCurrentSelectedNode(new_marker._id + 1);
                    setInitial(e.latlng);
                    setTarget(undefined);
                }
            });
        }
    });

    return null;
}

function CreateMarker({nodes}: { nodes: Nodes }) {
    const map = useMap();
    useEffect(() => {
        map.flyTo({
            lat: nodes[0] ? nodes[0].latitude : -6.889852,
            lng: nodes[0] ? nodes[0].longitude : 107.609968,
        });
    }, [nodes]);
    return null;
}


export default function Map({
                                mode,
                                nodes,
                                connections,
                                path,
                                removeAll,
                                markers,
                                edges,
                                initial,
                                target,
                                isNewNode,
                                polylines,
                                handleSetPolyline,
                                handleSetEdges,
                                handleSetConnections,
                                handleSetNodes,
                                handleSetMarkers,
                                handleSetRemoveAll,
                                setSelectedInitialNode,
                                setInitialRemove,
                                setTargetRemove,
                            }: {
    mode: string;
    nodes: Nodes;
    initial: number | undefined;
    target: number | undefined;
    connections: Connections;
    path: Path | undefined;
    removeAll: boolean;
    markers: L.Marker[];
    polylines: L.Polyline[];
    isNewNode: boolean;
    edges: Edges[];
    handleSetPolyline: (x: L.Polyline[] | undefined) => void;
    handleSetEdges: (x: Edges[] | undefined) => void;
    handleSetConnections: (x: Connections | undefined) => void;
    handleSetNodes: (x: Nodes | undefined) => void;
    handleSetMarkers: (x: L.Marker[]) => void;
    handleSetRemoveAll: (x: boolean) => void;
    setSelectedInitialNode: (x: string) => void;
    setInitialRemove: (x: number | undefined) => void;
    setTargetRemove: (x: number | undefined) => void;
}) {
    const [initialLatLng, setInitialLatLng] = useState<L.LatLng>();
    const [targetLatLng, setTargetLatLng] = useState<L.LatLng>();
    const [currentSelectedNode, setCurrentSelectedNode] = useState<number | undefined>(1);

    const handleSetPolylineMap = (polylines: L.Polyline[] | undefined) => {
        handleSetPolyline(polylines);
    };
    const handleSetEdgesMap = (edges: Edges[] | undefined) => {
        handleSetEdges(edges);
    };

    const setInitial = (latlng: L.LatLng | undefined) => {
        setInitialLatLng(latlng);
    };
    const setTarget = (latlng: L.LatLng | undefined) => {
        setTargetLatLng(latlng);
    };

    let marker: L.DivIcon[] = [];
    let connections_label: string[] = [];

    if (Object.keys(nodes).length > 0 && mode === "file") {
        for (let item in nodes) {
            marker.push(
                L.divIcon({
                    className:
                        "nodes-color w-10 h-10 rounded-full flex items-center justify-center font-bold text-2xl shadow-lg shadow-blue-900",
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
                lat: nodes[0] ? nodes[0].latitude : -6.889852,
                lng: nodes[0] ? nodes[0].longitude : 107.609968,
            }}
            zoom={20}
            scrollWheelZoom={true}
        >
            <RemoveEdge nodes={nodes}
                        setConnections={(value) => handleSetConnections(value)}
                        connections={connections}
                        setNodes={(value) => handleSetNodes(value)}
                        initial={initial}
                        target={target}
                        setInitial={(value) => setInitialRemove(value)}
                        setTarget={(value) => setTargetRemove(value)}
                        currentSelectedNode={currentSelectedNode}
                        setCurrentSelectedNode={(value) => setCurrentSelectedNode(value)}
            />
            <GetLatitudeLongitudeOnClick
                mode={mode}
                removeAll={removeAll}
                markers={markers}
                polylines={polylines}
                edges={edges}
                isNewNode={isNewNode}
                setInitial={(value) => setInitial(value)}
                setTarget={(value) => setTarget(value)}
                setCurrentSelectedNode={(value) => {
                    setCurrentSelectedNode(value);
                    setSelectedInitialNode((value! - 1)?.toString())
                }}
                setConnections={(value) => handleSetConnections(value)}
                setNodes={(value) => handleSetNodes(value)}
                connections={connections}
                nodes={nodes}
                currentSelectedNode={currentSelectedNode!}
                initial={initialLatLng}
                target={targetLatLng}
                handleSetPolyline={(value) => handleSetPolylineMap(value)}
                handleSetEdges={(value) => handleSetEdgesMap(value)}
                handleSetMarkers={(value) => handleSetMarkers(value)}
                handleSetRemoveAll={(value) => handleSetRemoveAll(value)}
            />
            <CreateMarker nodes={nodes}/>
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
            {connections_label.map((key, i) =>
                connections[key].map((item, j) => (
                    <Polyline
                        key={`polyline-${i},${j}`}
                        pathOptions={{
                            color:
                                path && (path[key] === item || path[item] === key)
                                    ? "red"
                                    : "blue",
                        }}
                        positions={[
                            [nodes[key].latitude, nodes[key].longitude],
                            [nodes[item].latitude, nodes[item].longitude],
                        ]}
                    />
                ))
            )}
        </MapContainer>
    );
}
