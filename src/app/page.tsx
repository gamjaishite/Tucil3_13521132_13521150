"use client";

import astar, { astarToString } from "./algorithms/astar";
import ucs, { ucsToString } from "./algorithms/ucs";
import Dropdown from "./components/dropdown";
import Map from "./components/map";
import { Connections, Nodes, Path } from "./lib/utils";
import { ChangeEvent, use, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormElements extends HTMLFormControlsCollection {
  input_file: HTMLInputElement;
}

interface FileInputFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function Home() {
  const [nodes, setNodes] = useState<Nodes>();
  const [connections, setConnections] = useState<Connections>();
  const [initial, setInitial] = useState<string>();
  const [target, setTarget] = useState<string>();
  const [path, setPath] = useState<Path>();
  const [algorithm, setAlgorithm] = useState<string>("astar");
  const [displayRoute, setdisplayRoute] = useState<String>();
  const [displayCost, setdisplayCost] = useState<Number>();
  const [displayTime, setdisplayTime] = useState<String>();


  const handleInitialButton = (value: string) => {
    setInitial(value);
  };

  const handleTargetButton = (value: string) => {
    setTarget(value);
  };

  const handleStartButton = () => {
    if (nodes && connections && initial && target) {
      if (algorithm === "astar") {
        let startTime = performance.now()
        let final_path = astar(nodes, connections, initial, target);
        let endTime = performance.now()
        setPath(final_path);
        let resultString = astarToString(final_path, initial, target, nodes);
        setdisplayRoute(resultString);
        setdisplayTime(((endTime-startTime).toFixed(4)).toString());
      }
      if (algorithm === "ucs"){
        let startTime = performance.now()
        let final_path = ucs(nodes, connections, initial, target);
        let endTime = performance.now()
        let stringPath = ucsToString(final_path, initial, target, nodes);
        setPath(final_path);
        setdisplayRoute(stringPath);
        setdisplayTime(((endTime-startTime).toFixed(4)).toString());
      }
    } else if (nodes && connections && !initial && !target){
      toast.error('Initial and target has not been decided!', {
        position: toast.POSITION.TOP_CENTER
      });
      
    } else if(nodes && connections && initial && !target){
      toast.error('Target has not been decided!', {
        position: toast.POSITION.TOP_CENTER
      });
    } else if(nodes && connections && !initial && target){
      toast.error('Start node has not been decided!', {
        position: toast.POSITION.TOP_CENTER
      });
    } else{
      toast.error('No Input File!', {
        position: toast.POSITION.TOP_CENTER
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
          const label = rows[i].split(" ")[0];
          const coors = rows[i].split(" ")[1].slice(1, -1);
          const latitude = parseFloat(coors.split(",")[0]);
          const longitude = parseFloat(coors.split(",")[1]);
          raw_nodes[i - 1] = {
            name: label,
            latitude,
            longitude,
          };
        }

        const raw_connections: Connections = {};
        for (let i = data_amount + 1; i <= 2 * data_amount; i++) {
          const cols = rows[i].split(" ");
          for (let j = 0; j < data_amount; j++) {
            if (cols[j] === "1") {
              raw_connections[i - data_amount - 1]
                ? raw_connections[i - data_amount - 1].push(j.toString())
                : (raw_connections[i - data_amount - 1] = [j.toString()]);
            }
          }
        }

        setNodes(raw_nodes);
        setConnections(raw_connections);
      };
      reader.readAsText(event.currentTarget.files![0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<FileInputFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="text-biru h-screen">
      <Map nodes={nodes!} connections={connections!} path={path} />
      <ToastContainer/>
      <div className="fixed left-20 top-20 z-[100000]">
        <div className="block max-w-md h-full p-7 bg-card-color">
          <img src="/findroute.svg"></img>
          <div className="flex space-x-14">
            <div className="max-w-lg space-y-4">
              <div className="max-w-xs">
                <p className="text-blue">Upload File</p>
                <form className="space-y-6"onSubmit={handleSubmit}>
                  <div className="relative w-32 text-white bg-blue-300 hover:bg-blue-800  font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700  ">
                    <input
                      className="absolute z-[-1] w-full"
                      type="file"
                      accept=".txt"
                      id="input_file"
                      onChange={handleInputFile}
                    />
                    <svg
                      className="relative w-5 h-5"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                    >
                      <path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456a24 24 0 1 0 0-48 24 24 0 1 0 0 48z" />
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
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
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
                className="text-white w-full h-10 bg-blue-900 hover:bg-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none shadow-lg shadow-blue-500/50"
                onClick={handleStartButton} 
              >
                Start
              </button>
              <div className="space-x-3">
              <p onChange={handleStartButton} className="text-blue">Execution Time: {displayTime}</p>
              </div>
            </div>
          </div>
          <div className="space-y-24">
            <div className="space-y-2">
              <p className="text-blue">Route</p>
              <p className="text-blue" onChange={handleStartButton}>{displayRoute}</p>
            </div>
            <div className="space-y-5">
            <p className="text-blue">Distance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
