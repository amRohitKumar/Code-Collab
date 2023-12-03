"use client";

// all the logic for the idea page goes here
import { useRef, useState } from "react";
import Editor, { useMonaco, loader, Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { io } from "socket.io-client";
const socket = io("ws://localhost:8000", {
  closeOnBeforeunload: false,
  withCredentials: true,
});

const Page = () => {
  const [value, setValue] = useState("");
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  function handleEditorDidMount(
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    // console.log(editor.getValue());
    editorRef.current = editor;
  }
  function showValue() {
    // console.log(editorRef, editorRef.current);
    console.log(editorRef.current?.getValue());
  }
  function handleEditorChange(value, event) {
    console.log("here is the current model value:", value);
  }

  const test = () => {
    setInterval(() => {
      socket.emit("message", value);
    }, 5000);
  };

  socket.on("message", (data) => {
    console.log("Client : ", data);
  });

  return (
    <div className="border-2 border-red-400">
      <Editor
        height="90dvh"
        width="70dvw"
        defaultLanguage="javascript"
        defaultValue="// some comment"
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
        theme="vs-dark"
      />
      <input type="text" onChange={(e) => setValue(e.target.value)} />
      <button onClick={test}>Show</button>

    </div>
  );
};

export default Page;
