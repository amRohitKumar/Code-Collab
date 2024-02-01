"use client";

import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { toast } from "sonner";
import customFetch from "@/utils/axios";
import socket from "@/socket";
import { useSession } from "next-auth/react";
import debounce from "@/utils/debounce";
import insertDecorationCSS from "@/utils/insertDecorationCSS";
import { getMonacoLanguageId } from "@/utils/getMonacoLangId";
import { useRouter } from "next/navigation";

import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import EditorSidebar from "@/components/CodeBoxPage/EditorSidebar";
import { useTheme } from "next-themes";
import EditorOutput from "@/components/EditorOutput";
import { ImperativePanelHandle } from "react-resizable-panels";

// bg-[#C0392B] border-[#C0392B] bg-[#1ABC9C] border-[#1ABC9C] bg-[#34495E] border-[#34495E] bg-[#F1C40F] border-[#F1C40F] bg-[#E67E22] border-[#E67E22] bg-[#2ECC71] border-[#2ECC71] bg-[#7F8C8D] border-[#7F8C8D] bg-[#FDC10A] border-[#FDC10A] bg-[#8E44AD] border-[#8E44AD] bg-[#3498DB] border-[#3498DB] bg-[#27AE60] border-[#27AE60] bg-[#9B59B6] border-[#9B59B6] bg-[#E74C3C] border-[#E74C3C] bg-[#F39C12] border-[#F39C12] bg-[#16A085] border-[#16A085] bg-[#2980B9] border-[#2980B9] bg-[#D35400] border-[#D35400] bg-[#8E44AD] border-[#8E44AD] bg-[#FF00FF] border-[#FF00FF] bg-[#00FFFF] border-[#00FFFF]
// text-[#C0392B] text-[#1ABC9C] text-[#34495E] text-[#F1C40F] text-[#E67E22] text-[#2ECC71] text-[#7F8C8D] text-[#FDC10A] text-[#8E44AD] text-[#3498DB] text-[#27AE60] text-[#9B59B6] text-[#E74C3C] text-[#F39C12] text-[#16A085] text-[#2980B9] text-[#D35400] text-[#8E44AD] text-[#FF00FF] text-[#00FFFF]

type PropsType = {
  codeBoxId: string;
  codeBox: models.ICodeBox;
  codeFiles: models.ICodeFile[];
};

interface IPosition {
  lineNumber: number;
  column: number;
}

interface IContentWidgetWithPosition extends monaco.editor.IContentWidget {
  position: IPosition;
}

interface IContentWidgetObject {
  [key: string]: IContentWidgetWithPosition;
}

interface Idecorations {
  [key: string]: monaco.editor.IEditorDecorationsCollection;
}

type Monaco = typeof monaco;

interface ICursroEventWithUser
  extends monaco.editor.ICursorSelectionChangedEvent {
  userId: number;
  name: string;
  color: string;
  fileId: string | null;
}

const CodePage = ({ codeBoxId, codeBox, codeFiles }: PropsType) => {
  const router = useRouter();
  const { data: sessionData } = useSession();
  // const { id: userId, name, email, room_token, token } = data?.user || {};
  const [currFile, setFile] = useState<models.ICodeFile | null>(codeFiles[0]);
  const currFileRef = useRef<models.ICodeFile | null>();
  currFileRef.current = currFile;
  // to store connected users
  const [connectedUsers, setConnectedUsers] = useState<
    sockets.ConnectUserType[]
  >([]);

  // to store codebox detail
  const [codeboxDetail, setCodeboxDetail] = useState<models.ICodeBox | null>(
    codeBox
  );

  const { theme } = useTheme();

  const isSocket = useRef(false); // to resolve conflict between socket and editor change event
  const contentWidgets = useRef<IContentWidgetObject>({}); // to store user name tag
  const decorators = useRef<Idecorations>({});
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacorRef = useRef<Monaco | null>(null);

  const isOwner: boolean = sessionData?.user.id === codeboxDetail?.userId;

  // TO FETCH CODEBOX DATA INITIALLY
  const fetchCodeBoxData = () => {
    try {
      isSocket.current = true;
      editorRef.current?.setValue(codeFiles[0].code || "Enter code here ");
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
    // console.log(session);
    const {
      id: userId,
      name,
      email,
      room_token,
      express_token,
    } = sessionData?.user || {};
    console.log("join codebox room hook called");
    try {
      if (codeboxDetail?.roomId) {
        console.log("codeboxid = ", codeBoxId);
        socket.auth = {
          boxId: codeBoxId,
          userId: userId,
          name: name,
          email: email,
          roomId: codeboxDetail?.roomId,
          room_token,
          express_token,
        };
        socket.connect();
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || "Error while joining codebox room");
    }
  };

  async function handleEditorDidMount(
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    editorRef.current = editor;
    monacorRef.current = monaco;
    await fetchCodeBoxData();
    editorRef.current?.onDidChangeCursorSelection(
      (e: monaco.editor.ICursorSelectionChangedEvent) => {
        socket.emit("selection", { ...e, fileId: currFile?.language || null });
      }
    );
  }

  const saveToDatabase = async (value: string, fileId: string) => {
    try {
      await customFetch.put(`/codebox/${codeBoxId}`, { data: value, fileId });
    } catch (error) {
      console.log("error while saving to db = ", error);
    }
  };

  const debouncedSave = debounce(saveToDatabase, 5000);

  function handleEditorChange(
    value: string | undefined,
    event: monaco.editor.IModelContentChangedEvent
  ) {
    // console.log("ins func");
    if (!isSocket.current) {
      // console.log("here is the current model value:", event);
      socket.emit("code-change", event.changes[0]);
      debouncedSave(value, currFile?.id);
    } else {
      isSocket.current = false;
    }
  }

  // ADD WIDGET

  function insertWidget(user: sockets.ConnectUserType) {
    contentWidgets.current[user.userId] = {
      allowEditorOverflow: true,
      position: {
        lineNumber: 0,
        column: 0,
      },
      getId: function () {
        return String(user.userId);
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
        el.style.zIndex = "99999";
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
    // console.log("curr file", currFile);
    // console.log("changing selection = ", e.fileId, currFile?.language);
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
      // clear previous decorations
      decorators.current[e.userId] && decorators.current[e.userId].clear();

      // apply new decorations
      decorators.current[e.userId] =
        editorRef.current.createDecorationsCollection(selectionArray);
    }
  }
  function changeWidgetPosition(e: ICursroEventWithUser) {
    // console.log("cursor change = ", e.fileId, currFile?.language);
    // remove previous widget

    if (editorRef.current)
      editorRef.current.removeContentWidget(contentWidgets.current[e.userId]);
    // update widget position
    contentWidgets.current[e.userId].position.lineNumber =
      e.selection.endLineNumber;
    contentWidgets.current[e.userId].position.column = e.selection.endColumn;
    // add new widget
    editorRef.current?.addContentWidget(contentWidgets.current[e.userId]);
  }

  useEffect(() => {
    if (!codeboxDetail?.id || !editorRef.current) return;
    joinCodeBoxRoom();
    socket.on(
      "connected-users",
      (_connectedUsers: sockets.ConnectUserType[]) => {
        // console.log("connected users hook called");

        _connectedUsers.forEach((element) => {
          // add css class for cursor and selection
          insertDecorationCSS(element.userId, element.color);

          // initiate widget for each user with default position (0,0)
          insertWidget(element);
        });

        setConnectedUsers(_connectedUsers);
      }
    );

    socket.on("selection", function (data: ICursroEventWithUser) {
      // console.log("selection hook called", data);

      // change widget position and text selection
      changeSeleciton(data);
      changeWidgetPosition(data);
    });

    socket.on("code-change-received", (changeEvent) => {
      isSocket.current = true;
      editorRef.current?.executeEdits("other-user", [
        {
          range: changeEvent.range,
          text: changeEvent.text,
          forceMoveMarkers: true,
        },
      ]);
    });

    socket.on("user-disconnected", (userId: string) => {
      // console.log("user disconnected hook called");

      // remove css class for cursor and selection
      document.getElementById(`user${userId}`)?.remove();
      editorRef.current?.removeContentWidget(contentWidgets.current[userId]);
      decorators.current[userId] && decorators.current[userId].clear();
      // remove disconnected user from list
      setConnectedUsers((prev) =>
        prev.filter((user) => user.userId !== userId)
      );
    });

    socket.on("connect_error", (err) => {
      console.log(err.message); // prints the message associated with the error
      toast.error(err.message);
      router.push("/dashboard");
    });

    return () => {
      // clear all the listeners
      socket.off("connected-users");
      socket.off("code-change-received");
      socket.off("user-disconnected");
      socket.off("selection");
      socket.off("connect_error");
      socket.disconnect();

      // remove css class, widget and decorator for all users
      connectedUsers.forEach((user) => {
        editorRef.current?.removeContentWidget(
          contentWidgets.current[user.userId]
        );
        decorators.current[user.userId] &&
          decorators.current[user.userId].clear();
        document.getElementById(`user${user.userId}`)?.remove();
      });

      // destroy monaco models
      // monacorRef.current?.editor
      //   .getModels()
      //   .forEach((model) => model.dispose());
      editorRef.current?.dispose();
      // reset room_token
      // update({
      //   ...data,
      //   user: {
      //     ...data?.user,
      //     room_token: "",
      //   },
      // });
    };
    // should be called after fetchCodeboxData function
  }, [codeboxDetail?.id, editorRef.current]);

  const editorSidebarRef = useRef<ImperativePanelHandle>(null),
    editorOutputRef = useRef<ImperativePanelHandle>(null);

  const resizeEditorSidebar = (finalWidth: number) => {
    const currentSize = editorSidebarRef.current?.getSize();
    // console.log("size = ", currentSize);
    if (currentSize === finalWidth) editorSidebarRef.current?.resize(3);
    else editorSidebarRef.current?.resize(finalWidth);
  };
  const resizeEditorOuput = (finalWidth: number) => {
    console.log("clicked");
    const currentSize = editorOutputRef.current?.getSize();
    // console.log("size = ", currentSize);
    if (currentSize === finalWidth) editorOutputRef.current?.resize(8);
    else editorOutputRef.current?.resize(finalWidth);
  };

  // let htmlContent = monacorRef.current?.editor.getModels();
  // console.log("models = ", htmlContent);

  // getHTMLString();

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className="h-full overflow-y-clip"
    >
      <ResizablePanel
        defaultSize={5}
        minSize={5}
        maxSize={20}
        ref={editorSidebarRef}
        className="transition-all duration-200 ease-linear"
      >
        <EditorSidebar
          connectedUsers={connectedUsers}
          handleSize={resizeEditorSidebar}
          codeBox={codeboxDetail}
          isOwner={isOwner}
        />
      </ResizablePanel>
      <ResizablePanel defaultSize={100} className="z-10 flex">
        <ResizablePanelGroup direction="vertical">
          <ResizablePanel defaultSize={92} className="overflow-y-clip">
            <div className="flex h-content md:sticky bg-slate-200 w-full">
              <div className="h-full w-full">
                <Editor
                  height="calc(100dvh - 60px)" // 60 navbar + 40 tab
                  width="100%"
                  defaultLanguage="C"
                  language={getMonacoLanguageId(currFile?.language)}
                  defaultValue="Loading ..."
                  onMount={handleEditorDidMount}
                  onChange={handleEditorChange}
                  theme={theme === "dark" ? "vs-dark" : "light"}
                />
              </div>
            </div>
          </ResizablePanel>
          <ResizablePanel
            defaultSize={8}
            ref={editorOutputRef}
            className="transition-all duration-300 ease-linear overflow-y-clip"
          >
            <EditorOutput
              resizeEditorOuput={resizeEditorOuput}
              editorRef={editorRef}
              language={currFile?.language!}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default CodePage;
