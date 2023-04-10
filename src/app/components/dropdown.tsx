"use client";

import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Nodes } from "../lib/utils";
import "../globals.css";

const Dropdown = ({
  label,
  nodes,
  setNode,
}: {
  label: string;
  nodes: Nodes | undefined;
  setNode: (x: string) => any;
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="outline-none focus:outline-none" asChild>
        <button
          id="dropdownHoverButton"
          className="relative w-24 h-10 text-white bg-blue-300 hover:bg-blue-800  font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 shadow-lg shadow-blue-500/50 outline-none focus:outline-none"
        >
          {label}
          <svg
            className="absolute w-5 h-5 right-2"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 320 512"
          >
            <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
          </svg>
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className={`${
            nodes ? "" : "hidden"
          } min-w-[100px] bg-blue-200 rounded-md p-[5px] z-[1000000] shadow-xl max-h-64 overflow-auto`}
        >
          <DropdownMenu.Label />
          {nodes &&
            Object.keys(nodes).map((item, i) => (
              <DropdownMenu.Item
                className="text-blue focus:outline-none flex justify-center p-2 cursor-pointer hover:bg-blue-500 rounded-md "
                key={`item-${i}`}
              >
                <button
                  onClick={() => setNode(i.toString())}
                  className="w-full"
                >
                  {nodes[item].name}
                </button>
              </DropdownMenu.Item>
            ))}

          <DropdownMenu.Separator />
          <DropdownMenu.Arrow />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default Dropdown;
