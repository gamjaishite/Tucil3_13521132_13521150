"use client";

import astar from "./algorithms/astar";
import ucs from "./algorithms/ucs";
import Map from "./components/map";
import "./globals.css"
import { Connections, Nodes } from "./lib/utils";
import { useState } from "react";

interface FormElements extends HTMLFormControlsCollection {
  input_file: HTMLInputElement;
}

interface FileInputFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function Home() {
  const [nodes, setNodes] = useState<Nodes>();
  const [connections, setConnections] = useState<Connections>();
  const handleSubmit = async (event: React.FormEvent<FileInputFormElement>) => {
    event.preventDefault();

    if (event.currentTarget.elements.input_file.files!.length > 0) {
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
        
        ucs(nodes!, connections!);
        astar(nodes!, connections!);
      };
      reader.readAsText(event.currentTarget.elements.input_file.files![0]);
    }
  };

  return (
    <div className="text-biru">
      <Map nodes={nodes!} connections={connections!} />
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
                  <button className="text-white w-24 h-10 bg-blue-900 hover:bg-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none shadow-lg shadow-blue-500/50" type="submit">Visualize</button>
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
                <div id="start-node" className="max-width-0">
                  <p>Start</p>
                  <button
                    id="dropdownHoverButton"
                    data-dropdown-toggle="dropdownHover"
                    data-dropdown-trigger="hover"
                    className="relative w-24 h-10 text-white bg-blue-300 hover:bg-blue-800  font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 shadow-lg shadow-blue-500/50"
                    type="button"
                  >
                    <svg
                      className="absolute w-5 h-5 right-2"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                    >
                      <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
                    </svg>
                  
                  </button>
                </div>

                <div id = "goal-node" className="max-width-0">
                  <p>Goal</p>
                  <button
                    id="dropdownHoverButton"
                    data-dropdown-toggle="dropdownHover"
                    data-dropdown-trigger="hover"
                    className="relative w-24 h-10 text-white bg-blue-300 hover:bg-blue-800 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 shadow-lg shadow-blue-500/50"
                    type="button"
                  >
                    <svg
                      className="absolute w-5 h-5 right-2"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 320 512"
                    >
                      <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
                    </svg>
                  </button>
                </div>
              </div>
              <button
                type="button"
                className="text-white w-52 h-10 bg-blue-900 hover:bg-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none shadow-lg shadow-blue-500/50"
              >
                Start
              </button>
              <p className="text-blue">Execution Time</p>
            </div>
          </div>
          <div className="space-y-28">
            <p className="text-blue">Route</p>
            <p className="text-blue">Distance</p>
          </div>
        </div>
      </div>
    </div>
  );
}
