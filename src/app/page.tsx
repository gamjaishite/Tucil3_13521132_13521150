"use client";

import get_input from "./lib/utils";

interface FormElements extends HTMLFormControlsCollection {
  input_file: HTMLInputElement;
}

interface FileInputFormElement extends HTMLFormElement {
  readonly elements: FormElements;
}

export default function Home() {
  const handleSubmit = async (event: React.FormEvent<FileInputFormElement>) => {
    event.preventDefault();

    if (event.currentTarget.elements.input_file.files!.length > 0) {
      get_input(event.currentTarget.elements.input_file.files![0]);
    }
  };
  return (
    <div className="text-pink-500">
      Here our journey begins....🎉⚡
      <div>Mantap</div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept=".txt" id="input_file" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
