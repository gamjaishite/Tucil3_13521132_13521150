"use client";

import astar, {astarToString} from "./algorithms/astar";
import ucs, {ucsToString} from "./algorithms/ucs";
import Dropdown from "./components/dropdown";
import Map from "./components/map";
import {Connections, Edges, Nodes, Path} from "./lib/utils";
import {ChangeEvent, use, useState} from "react";
import {ToastContainer, toast} from "react-toastify";
import GraphComponent from "./graph/page";
import "react-toastify/dist/ReactToastify.css";
import L from "leaflet";
import SwitchFile from "./components/switch_file";
import SwitchNewNode from "@/app/components/switch_new_node";
import DropdownNewEdge from "@/app/components/dropdown_new_edge";

interface FormElements extends HTMLFormControlsCollection {
    input_file: HTMLInputElement;
}

interface FileInputFormElement extends HTMLFormElement {
    readonly elements: FormElements;
}

export default function Home() {

    const [nodes, setNodes] = useState<Nodes>({});
    const [connections, setConnections] = useState<Connections>({});
    const [initial, setInitial] = useState<string>();
    const [target, setTarget] = useState<string>();
    const [path, setPath] = useState<Path>();
    const [algorithm, setAlgorithm] = useState<string>("astar");
    const [displayRoute, setdisplayRoute] = useState<String>();
    const [displayCost, setdisplayCost] = useState<Number>();
    const [displayTime, setdisplayTime] = useState<String>();
    const [markers, setMarkers] = useState<L.Marker[]>([]);
    const [polylines, setPolylines] = useState<L.Polyline[]>([]);
    const [edges, setEdges] = useState<Edges[]>([]);
    const [mode, setMode] = useState<string>("file");
    const [removeAll, setRemoveAll] = useState<boolean>(false);
    const [isNewNode, setIsNewNode] = useState<boolean>(true);
    const [selectedInitialNode, setSelectedInitialNode] = useState<string>("0");
    const [selectedTargetNode, setSelectedTargetNode] = useState<string>();
    const [enabled, setEnabled] = useState(false);

    const [initialRemove, setInitialRemove] = useState<number>();
    const [targetRemove, setTargetRemove] = useState<number>();

    const handleSetPolyline = (polylines: L.Polyline[]) => {
        setPolylines(polylines);
    };

    const handleSetEdges = (edges: Edges[]) => {
        setEdges(edges);
    };

    const handleInitialButton = (value: string) => {
        setInitial(value);
    };

    const handleTargetButton = (value: string) => {
        setTarget(value);
    };

    const handleStartButton = () => {
        if (nodes && connections && initial && target) {
            if (algorithm === "astar") {
                let startTime = performance.now();
                const result = astar(nodes, connections, initial, target);
                let endTime = performance.now();
                setPath(result.raw_path);
                let resultString = astarToString(result.path);
                setdisplayRoute(resultString);
                setdisplayTime((endTime - startTime).toFixed(4).toString());
                setdisplayCost(result.cost);
            }
            if (algorithm === "ucs") {
                let startTime = performance.now();
                let final_path = ucs(nodes, connections, initial, target);
                let endTime = performance.now();
                let stringPath = ucsToString(final_path.path);
                let cost = (final_path.cost);
                setPath(final_path.raw_path);
                setdisplayRoute(stringPath);
                setdisplayTime((endTime - startTime).toFixed(4).toString());
                setdisplayCost(cost);
            }
        } else if (nodes && connections && !initial && !target) {
            toast.error("Initial and target has not been decided!", {
                position: toast.POSITION.TOP_CENTER,
            });
        } else if (nodes && connections && initial && !target) {
            toast.error("Target has not been decided!", {
                position: toast.POSITION.TOP_CENTER,
            });
        } else if (nodes && connections && !initial && target) {
            toast.error("Start node has not been decided!", {
                position: toast.POSITION.TOP_CENTER,
            });
        } else {
            toast.error("No Input File!", {
                position: toast.POSITION.TOP_CENTER,
            });
        }
    };


    const handleInputFile = (event: ChangeEvent<HTMLInputElement>) => {
        setInitial(undefined);
        setTarget(undefined);
        if (event.currentTarget.files!.length > 0) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const text = e.target?.result as string;
                const raw_nodes: Nodes = {};
                const rows = text.split("\n");
                const data_amount = parseInt(rows[0]);

                for (let i = 1; i <= data_amount; i++) {
                    if (rows[i].trim().split(" ").length != 2) {
                        toast.error("Invalid input. Invalid node", {
                            position: toast.POSITION.TOP_CENTER,
                        });
                        return;
                    }
                    const label = rows[i].trim().split(" ")[0];
                    const coors = rows[i].trim().split(" ")[1].slice(1, -1);
                    const latitude = parseFloat(coors.split(",")[0]);
                    const longitude = parseFloat(coors.split(",")[1]);

                    if (isNaN(latitude) || isNaN(longitude)) {
                        toast.error("Invalid input. Invalid coordinates", {
                            position: toast.POSITION.TOP_CENTER,
                        });
                        return;
                    }

                    if (!enabled && (latitude < -180 || latitude > 180 || longitude < -180 || longitude > 180)) {
                        toast.error("Invalid input. Invalid latitude or longitude", {
                            position: toast.POSITION.TOP_CENTER,
                        });
                        return;
                    }

                    raw_nodes[i - 1] = {
                        name: label,
                        latitude,
                        longitude,
                    };
                }

                const raw_connections: Connections = {};
                for (let i = data_amount + 1; i <= 2 * data_amount; i++) {
                    const cols = rows[i].trim().split(" ");
                    if (cols.length < data_amount) {
                        toast.error("Invalid input. Not complete adj matrix", {
                            position: toast.POSITION.TOP_CENTER,
                        });
                        return;
                    }
                    for (let j = 0; j < data_amount; j++) {
                        if (cols[j] !== "1" && cols[j] !== "0") {
                            toast.error("Invalid input. Invalid adj matrix element", {
                                position: toast.POSITION.TOP_CENTER,
                            });
                            return;
                        }
                        if (cols[j] === "1") {
                            raw_connections[i - data_amount - 1]
                                ? raw_connections[i - data_amount - 1].push(j.toString())
                                : (raw_connections[i - data_amount - 1] = [j.toString()]);
                        }
                    }
                }

                setNodes(raw_nodes);
                setConnections(raw_connections);
                setPath(undefined);
                setdisplayCost(undefined);
                setdisplayRoute(undefined);
                setdisplayTime(undefined);
            };
            reader.readAsText(event.currentTarget.files![0]);
            event.currentTarget.value = "";
        }
    };

    const handleSubmit = async (event: React.FormEvent<FileInputFormElement>) => {
        event.preventDefault();
    };

    return (
        <div className="text-biru h-screen">
            <div className="fixed right-3 top-3 z-[100000] bg-card-color p-2">
                <div className="flex flex-col items-start">
                    <SwitchFile
                        setFile={(value) => {
                            setRemoveAll(true);
                            setEdges([]);
                            setNodes({});
                            setConnections({});
                            setInitial(undefined);
                            setTarget(undefined);
                            setdisplayRoute(undefined);
                            setdisplayTime(undefined);
                            setPath(undefined)
                            value ? setMode("file") : setMode("manual");
                        }}
                    />
                    <SwitchNewNode setNewNode={(value) => setIsNewNode(value)}/>
                    {!isNewNode &&
                        <DropdownNewEdge nodes={nodes} currentNode={selectedInitialNode!} connections={connections}
                                         setConnections={(value) => setConnections(value)}
                                         setEdges={(value) => setEdges(value)}
                                         edges={edges}
                        />}
                </div>
            </div>

            {enabled === true ? (
                <GraphComponent nodes={nodes!} connections={connections!} path={path!}/>
            ) : (
                <Map
                    mode={mode}
                    nodes={nodes!}
                    connections={connections!}
                    path={path}
                    removeAll={removeAll}
                    markers={markers}
                    polylines={polylines!}
                    edges={edges!}
                    isNewNode={isNewNode}
                    initial={initialRemove}
                    target={targetRemove}
                    setInitialRemove={(value) => setInitialRemove(value)}
                    setTargetRemove={(value) => setTargetRemove(value)}
                    handleSetPolyline={(value) => handleSetPolyline(value!)}
                    handleSetEdges={(value) => handleSetEdges(value!)}
                    handleSetConnections={(value) => setConnections(value!)}
                    handleSetNodes={(value) => setNodes(value!)}
                    handleSetMarkers={(value) => setMarkers(value)}
                    handleSetRemoveAll={(value) => setRemoveAll((value))}
                    setSelectedInitialNode={(value) => setSelectedInitialNode(value)}
                />
            )}


            <ToastContainer/>


            <div className="fixed left-14 top-3 z-[100000]">
                <div className="block max-w-md p-7 bg-card-color">
                    <img src="/findroute.svg" className="mb-8"/>
                    <div>
                        <label className="inline-flex relative items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={enabled}
                                readOnly
                            />
                            <div
                                onClick={() => {
                                    setEnabled(!enabled);
                                    setNodes({});
                                    setConnections({});
                                }}
                                className="w-11 h-6 bg-gray-200 rounded-full peer  peer-focus:ring-green-300  peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"
                            ></div>
                            <span className="ml-2 text-sm font-medium text-gray-900">
                                Graph
                            </span>
                        </label>
                    </div>
                    <div className="flex space-x-14">
                        <div className="max-w-lg space-y-4">
                            <div className="max-w-xs">
                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div
                                        className={`relative w-32 text-white ${
                                            mode === "file"
                                                ? "bg-blue-300 hover:bg-blue-800"
                                                : "bg-zinc-300"
                                        } font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center`}
                                    >
                                        <input
                                            className="absolute z-[-1] w-full"
                                            type="file"
                                            accept=".txt"
                                            id="input_file"
                                            onChange={(e) => {
                                                handleInputFile(e);
                                            }}
                                            disabled={mode === "manual"}
                                        />
                                        <svg
                                            className="relative w-5 h-5"
                                            fill="currentColor"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 512 512"
                                        >
                                            <path
                                                d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/>
                                        </svg>
                                        <label htmlFor="input_file">Upload File</label>
                                    </div>
                                </form>
                            </div>
                            <div className="max-w-xs">
                                <p className="text-blue">Algorithm</p>
                                <div className="flex items-center mb-4">
                                    <input
                                        id="default-radio-1"
                                        type="radio"
                                        value=""
                                        name="default-radio"
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                        onChange={() => setAlgorithm("ucs")}
                                    />
                                    <label
                                        htmlFor="default-radio-1"
                                        className="ml-2 text-sm font-medium text-blue"
                                    >
                                        UCS
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        defaultChecked
                                        id="default-radio-2"
                                        type="radio"
                                        value=""
                                        name="default-radio"
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                                        onChange={() => setAlgorithm("astar")}
                                    />
                                    <label
                                        htmlFor="default-radio-2"
                                        className="ml-2 text-sm font-medium text-blue"
                                    >
                                        A*
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="text-biru space-y-5">
                            <div className="flex space-x-6 text-blue">
                                <Dropdown
                                    label={initial && nodes ? nodes[initial].name : "Init"}
                                    nodes={nodes}
                                    setNode={(value) => handleInitialButton(value)}
                                />
                                <Dropdown
                                    label={target && nodes ? nodes[target].name : "Target"}
                                    nodes={nodes}
                                    setNode={(value) => handleTargetButton(value)}
                                />
                            </div>
                            <button
                                type="button"
                                className="text-white w-full h-10 bg-blue-300 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 focus:outline-none shadow-lg shadow-blue-500/50"
                                onClick={handleStartButton}
                            >
                                Start
                            </button>
                            <div className="space-x-3">
                                <p onChange={handleStartButton} className="text-blue">
                                    Execution Time: {displayTime}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-24">
                        <div className="space-y-2">
                            <p className="text-blue">Route</p>
                            <p className="text-blue" onChange={handleStartButton}>
                                {displayRoute}
                            </p>
                        </div>
                        <div className="space-y-5">
                            <p className="text-blue">Distance {displayCost}</p>
                        </div>
                    </div>
                    {mode === 'manual' &&
                        <div>
                            <div className='border border-zinc-300 my-2'></div>
                            <p className='font-bold my-2'>Edges List</p>
                            <p className='text-sm mb-2'>Click buttons below to remove the edge</p>
                            <div className='max-h-44 overflow-auto'>
                                {edges &&
                                    edges.map((edge, i) => (
                                        <div key={i}>
                                            <button
                                                onClick={() => {
                                                    setInitialRemove(edge.node_init)
                                                    setTargetRemove(edge.node_target)
                                                    edges.splice(i, 1);
                                                }}
                                                className='hover:bg-blue-800 text-white justify-center w-full flex bg-blue-300 my-2 rounded-md px-4 py-2 items-center'>
                                                {edge.node_init} - {edge.node_target}
                                            </button>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}
