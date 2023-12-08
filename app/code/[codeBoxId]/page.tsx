"use client";

import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import toast from "react-hot-toast";
import EditorFooter from "@/components/EditorFooter";
import customFetch from "@/utils/axios";
import socket from "@/socket";
import { useSession } from "next-auth/react";
import ShareRoom from "@/components/CodeBoxPage/ShareRoom";
import debounce from "@/utils/debounce";
import insertDecorationCSS from "@/utils/insertDecorationCSS";

type PropsType = {
  codeBoxId: string;
};

interface LooseObject {
  [key: string | number]: any;
}

type Monaco = typeof monaco;

type CodeBoxDetailType = {
  id: number;
  name: string;
  password: string;
  roomId: string;
  code: string;
  language: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
};

type ConnectUserType = {
  userId: number;
  name: string;
  email: string;
  roomId: string;
  color: string;
  boxId: number;
};

interface ICursroEventWithUser
  extends monaco.editor.ICursorSelectionChangedEvent {
  userId: number;
  name: string;
  color: string;
}

const Page = ({ params: { codeBoxId } }: { params: PropsType }) => {
  const { data } = useSession();
  const userId = data?.user.id;
  const name = data?.user.name;
  const email = data?.user.email;
  const [connectedUsers, setConnectedUsers] = useState<ConnectUserType[]>([]);
  const [codeboxDetail, setCodeboxDetail] = useState<CodeBoxDetailType | null>(
    null
  );
  const isSocket = useRef(false);
  const contentWidgets = useRef<LooseObject>({});
  const decorations = useRef<LooseObject>({});

  // TO FETCH CODEBOX DATA INITIALLY
  const fetchCodeBoxData = async () => {
    try {
      const resp = await customFetch.get(`/codebox/${codeBoxId}`);
      setCodeboxDetail(resp.data);
    } catch (error: any) {
      console.log("error while fethcing codebox info = ", error);
      toast.error(
        error?.data?.message ||
          error?.message ||
          "Error while fetching codebox info"
      );
    }
  };

  // TO JOIN CODEBOX ROOM INITIALLY
  const joinCodeBoxRoom = async () => {
    // console.log("join codebox room hook called");
    try {
      if (codeboxDetail?.roomId) {
        // console.log("codeboxid = ", codeBoxId);
        socket.auth = {
          boxId: codeBoxId,
          userId: userId,
          name: name,
          email: email,
          roomId: codeboxDetail?.roomId,
        };
        socket.connect();
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Error while joining codebox room");
    }
  };

  // TO COPY CODEBOX INFO
  const copyContent = async () => {
    try {
      await navigator.clipboard.writeText(
        `Box Id: ${codeboxDetail?.roomId} \nPassword: ${codeboxDetail?.password}`
      );
      toast.success("Copied !");
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast.error("Failed to copy !");
    }
  };

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacorRef = useRef<Monaco | null>(null);
  function handleEditorDidMount(
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    editorRef.current = editor;
    monacorRef.current = monaco;
    editorRef.current?.onDidChangeCursorSelection(
      (e: monaco.editor.ICursorSelectionChangedEvent) => {
        socket.emit("selection", e);
      }
    );
  }

  const saveToDatabase = async (value: string) => {
    try {
      await customFetch.put(`/codebox/${codeBoxId}`, { data: value });
    } catch (error) {
      console.log("error while saving to db = ", error);
    }
  };

  const debouncedSave = debounce(saveToDatabase, 5000);

  function handleEditorChange(
    value: string | undefined,
    event: monaco.editor.IModelContentChangedEvent
  ) {
    if (!isSocket.current) {
      console.log("here is the current model value:", event);
      socket.emit("code-change", event.changes[0]);
      debouncedSave(value);
    } else {
      isSocket.current = false;
    }
  }

  // ADD WIDGET

  function insertWidget(user: ConnectUserType) {
    contentWidgets.current[user.userId] = {
      allowEditorOverflow: true,
      position: {
        lineNumber: 0,
        column: 0,
      },
      getId: function () {
        return user.userId;
      },
      getDomNode: function () {
        var el = document.createElement("span");
        el.innerHTML = user.name;
        el.style.background = user.color;
        el.style.color = "white";
        el.style.opacity = "0.9";
        el.style.width = "max-content";
        el.style.padding = "1px 4px";
        el.style.borderRadius = "5px";
        el.style.border = "1px solid white";
        return el;
      },
      getPosition: function () {
        return {
          position: this.position,
          preference: [
            monaco.editor.ContentWidgetPositionPreference.ABOVE,
            monaco.editor.ContentWidgetPositionPreference.BELOW,
          ],
        };
      },
    };
  }

  function changeSeleciton(e: ICursroEventWithUser) {
    var selectionArray = [];
    if (
      e.selection.startColumn == e.selection.endColumn &&
      e.selection.startLineNumber == e.selection.endLineNumber &&
      monacorRef.current
    ) {
      selectionArray.push({
        range: new monacorRef.current.Range(
          e.selection.startLineNumber,
          e.selection.startColumn,
          e.selection.endLineNumber,
          e.selection.endColumn
        ),
        options: {
          className: `cursor${e.userId}`,
          hoverMessage: {
            value: `User : ${e.name}`,
          },
        },
      });
    } else {
      //if selection -
      selectionArray.push({
        range: e.selection,
        options: {
          className: `selection${e.userId}`,
          hoverMessage: {
            value: `User : ${e.name}`,
          },
        },
      });
    }
    if (editorRef.current) {
      decorations.current[e.userId] =
        editorRef.current.deltaDecorations(
          decorations.current[e.userId],
          selectionArray
        );
    }
  }
  function changeWidgetPosition(e) {
    console.log("change pos = ", e);
    editorRef.current.removeContentWidget(contentWidgets.current[e.userId]);
    contentWidgets.current[e.userId].position.lineNumber =
      e.selection.endLineNumber;
    contentWidgets.current[e.userId].position.column = e.selection.endColumn;

    editorRef.current.addContentWidget(contentWidgets.current[e.userId]);
    console.log(contentWidgets.current[e.userId].position);
  }
  useEffect(() => {
    fetchCodeBoxData();
  }, []);

  useEffect(() => {
    joinCodeBoxRoom();
    socket.on(
      "connected-users",
      (_connectedUsers: ConnectUserType[], currentValue: string) => {
        console.log("connected users hook called");
        _connectedUsers.forEach((element) => {
          insertDecorationCSS(element.userId, element.color);
          insertWidget(element);
          decorations.current[element.userId] = [];
        });
        // console.log(_connectedUsers);
        isSocket.current = true;
        editorRef.current?.setValue(currentValue);
        setConnectedUsers(_connectedUsers);
      }
    );

    socket.on("selection", function (data: ICursroEventWithUser) {
      console.log("selection hook called", data);
      changeSeleciton(data);
      changeWidgetPosition(data);
    });

    socket.on("code-change-received", (changeEvent) => {
      console.log("code change received hook called");
      console.log(changeEvent);
      isSocket.current = true;

      editorRef.current?.executeEdits("other-user", [
        {
          range: {
            startLineNumber: changeEvent.range.startLineNumber,
            startColumn: changeEvent.range.startColumn,
            endLineNumber: changeEvent.range.endLineNumber,
            endColumn: changeEvent.range.endColumn,
          },
          text: changeEvent.text,
          forceMoveMarkers: true,
        },
      ]);
    });

    socket.on("user-disconnected", (userId) => {
      console.log("user disconnected hook called");
      editorRef.current?.removeContentWidget(contentWidgets.current[userId]);
      setConnectedUsers((prev) =>
        prev.filter((user) => user.userId !== userId)
      );
    });
    return () => {
      socket.off("connected-users");
      socket.off("code-change-received");
      socket.off("user-disconnected");
      socket.off("selection");
      socket.disconnect();
    };
  }, [codeboxDetail?.roomId]);

  return (
    <div className="flex mx-2 max-h-screen border-2 border-red-200 flex-col-reverse md:flex-row">
      {/* LEFT CONTAINER (CODE BOX) */}
      <div className="h-full">
        <Editor
          height="80dvh"
          width="65dvw"
          defaultLanguage="javascript"
          defaultValue={codeboxDetail?.code || "// Loading ..."}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          theme="vs-dark"
          className="mt-1"
        />
        <EditorFooter />
      </div>
      {/* RIGHT CONTAINER (INFO) */}
      <div className="px-3 py-2 w-full">
        <div className="flex justify-between items-center">
          <h4 className="text-3xl font-bold">
            {codeboxDetail?.name || "Loading ..."}
          </h4>
          <ShareRoom codeboxDetail={codeboxDetail} copyContent={copyContent} />
        </div>
        <div className="w-full h-[2px] bg-slate-200/80 mt-1" />
        <div>
          {connectedUsers.map((user) => (
            <div key={user.userId}>
              {user.name} - {user.email}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
