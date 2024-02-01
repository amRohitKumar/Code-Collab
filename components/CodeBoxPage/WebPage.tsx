"use client";

import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import { toast } from "sonner";
import customFetch from "@/utils/axios";
import socket from "@/socket";
import { getSession, useSession } from "next-auth/react";
import debounce from "@/utils/debounce";
import insertDecorationCSS from "@/utils/insertDecorationCSS";
import { getMonacoLanguageId } from "@/utils/getMonacoLangId";
import { useRouter } from "next/navigation";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import EditorSidebar from "@/components/CodeBoxPage/EditorSidebar";
import EditorTabs from "@/components/CodeBoxPage/EditorTabs";
import sortByFileConvention from "@/utils/customFileSorting";
import { useTheme } from "next-themes";
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
  fileId: string | null;
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

const WebPage = ({ codeBoxId, codeBox, codeFiles }: PropsType) => {
  console.log("web page rendering ...");
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

  // to store the doc html,css,js
  const [docString, setDocString] = useState<string>("");

  // to store codebox detail
  const [codeboxDetail, setCodeboxDetail] = useState<models.ICodeBox | null>(
    codeBox
  );

  const { theme } = useTheme();

  // to store codefile detail
  const [codefileDetail, setCodefileDetail] =
    useState<models.ICodeFile[]>(codeFiles);

  const isSocket = useRef(false); // to resolve conflict between socket and editor change event
  const contentWidgets = useRef<IContentWidgetObject>({}); // to store user name tag
  const decorators = useRef<Idecorations>({});
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacorRef = useRef<Monaco | null>(null);

  //  is current user owner of the codebox
  const isOwner: boolean = sessionData?.user.id === codeboxDetail?.userId;

  // TO FETCH CODEBOX DATA INITIALLY
  const fetchCodeBoxData = () => {
    try {
      codeFiles.forEach((file: models.ICodeFile) => {
        const reqModel = monacorRef.current?.editor
          .getModels()
          .find(
            (model) => model.uri.path === monaco.Uri.parse(file.language).path
          );
        if (!reqModel) {
          monacorRef.current?.editor.createModel(
            file.code || "",
            file.language,
            monaco.Uri.parse(file.language)
          );
        }
      });

      setDocString(
        getDocument(codeFiles[0].code, codeFiles[1].code, codeFiles[2].code)
      );
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
    const session = await getSession();
    // console.log(session);
    const {
      id: userId,
      name,
      email,
      room_token,
      express_token,
    } = session?.user || {};
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

  const getDocument = (html?: string, css?: string, js?: string) => {
    return `
    <html>
      <body>${html}</body>
      <style>${css}</style>
      <script>${js}</script>
    </html>
  `;
  };
  const getHTMLString = () => {
    const allModels = monacorRef.current?.editor.getModels();
    const htmlcontent = allModels
      ?.find((model) => model.uri.path === monaco.Uri.parse("HTML").path)
      ?.getValue();
    const csscontent = allModels
      ?.find((model) => model.uri.path === monaco.Uri.parse("CSS").path)
      ?.getValue();
    const jscontent = allModels
      ?.find((model) => model.uri.path === monaco.Uri.parse("JavaScript").path)
      ?.getValue();

    setDocString(getDocument(htmlcontent, csscontent, jscontent));
  };

  const debouncedUpdateView = debounce(getHTMLString, 3000);

  function handleEditorDidMount(
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    editorRef.current = editor;
    // console.log("mounted = ", editorRef.current);
    monacorRef.current = monaco;
    fetchCodeBoxData();
    // console.log("updated = ", currFile);
  }

  useEffect(() => {
    editorRef.current?.onDidChangeCursorSelection(
      (e: monaco.editor.ICursorSelectionChangedEvent) => {
        socket.emit("selection", { ...e, fileId: currFile?.language || null });
      }
    );
  }, [editorRef?.current, currFile?.language]);

  // const setModel = (fileId: string) => {
  //   const reqModel = monacorRef.current?.editor
  //     .getModels()
  //     .find((model) => model.uri.path === "/" + fileId);
  //   editorRef.current?.setModel(reqModel!);
  //   // console.log("all = ", res);
  // };
  // useEffect(() => {
  //   console.log(monacorRef.current?.Uri.parse(currFile?.id));
  //   console.log("models = ", editorRef.current?.getModel());
  // }, [currFile?.id]);
  const saveToDatabase = async (value: string, fileId: string) => {
    try {
      await customFetch.put(`/codebox/${codeBoxId}`, { data: value, fileId });
    } catch (error) {
      console.log("error while saving to db = ", error);
    }
  };

  const fileNames = codefileDetail.map(({ code, ...otherProps }) => otherProps);

  const changeActiveFile = (fileLanguage: string) => {
    const res = codefileDetail.find((file) => file.language === fileLanguage);
    // console.log("changing active file to = ", res);
    setFile(res!);
  };

  const debouncedSave = debounce(saveToDatabase, 5000);

  function handleEditorChange(
    value: string | undefined,
    event: monaco.editor.IModelContentChangedEvent
  ) {
    // console.log("change occ");
    if (!isSocket.current) {
      console.log("here is the current model value:", event.changes[0]);
      socket.emit("code-change", {
        changeEvent: event.changes[0],
        fileId: currFile?.language,
      });
      debouncedSave(value, currFile?.id);
      debouncedUpdateView();
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
      fileId: null,
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
        if (!this.fileId) return null;
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
      monacorRef.current &&
      e.fileId === currFileRef.current?.language
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
    } else if (e.fileId === currFileRef.current?.language) {
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
      if (e.fileId === currFileRef.current?.language) {
        decorators.current[e.userId] =
          editorRef.current.createDecorationsCollection(selectionArray);
      }
    }
  }
  function changeWidgetPosition(e: ICursroEventWithUser) {
    if (!editorRef.current) return;
    // console.log("cursor change = ", e.fileId, currFile?.language);
    // remove previous widget
    editorRef.current.removeContentWidget(contentWidgets.current[e.userId]);

    if (currFileRef.current?.language === e.fileId) {
      // update widget position
      contentWidgets.current[e.userId].position.lineNumber =
        e.selection.endLineNumber;
      contentWidgets.current[e.userId].position.column = e.selection.endColumn;
    }
    contentWidgets.current[e.userId].fileId =
      e.fileId === currFileRef.current?.language ? e.fileId : null;

    // add new widget
    editorRef.current.addContentWidget(contentWidgets.current[e.userId]);
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
      console.log("selection hook called", data);

      // change widget position and text selection
      changeSeleciton(data);
      changeWidgetPosition(data);
    });

    socket.on("code-change-received", ({ changeEvent, fileId }) => {
      console.log("code change received hook called", changeEvent, fileId);

      // execute change event
      // setModel(fileId);
      // check if modal exist, if not then create a new one

      let reqModel = monacorRef.current?.editor
        .getModels()
        .find((model) => model.uri.path === monaco.Uri.parse(fileId).path);
      // if (!reqModel) {
      //   // create new model
      //   console.log("creating a new model ...");
      //   const codeFile = codefileDetail.find((file) => file.id === fileId);
      //   reqModel = monacorRef.current?.editor.createModel(
      //     codeFile?.code || "",
      //     codeFile?.language,
      //     monaco.Uri.parse(codeFile?.id!)
      //   );
      // }
      // console.log("req model = ", reqModel);
      isSocket.current = true;
      reqModel?.applyEdits([
        {
          range: changeEvent.range,
          text: changeEvent.text,
          forceMoveMarkers: true,
        },
      ]);
      // editorRef.current?.executeEdits("other-user", [
      //   {
      //     range: changeEvent.range,
      //     text: changeEvent.text,
      //     forceMoveMarkers: true,
      //   },
      // ]);
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
      monacorRef.current?.editor
        .getModels()
        .forEach((model) => model.dispose());
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

  const editorSidebarRef = useRef<ImperativePanelHandle>(null);
  const resizeEditorSidebar = (finalWidth: number) => {
    const currentSize = editorSidebarRef.current?.getSize();
    console.log("size = ", currentSize);
    if (currentSize === finalWidth) editorSidebarRef.current?.resize(3);
    else editorSidebarRef.current?.resize(finalWidth);
  };

  // let htmlContent = monacorRef.current?.editor.getModels();
  // console.log("models = ", htmlContent);

  // getHTMLString();

  return (
    <ResizablePanelGroup
      direction="horizontal"
      className=" h-full overflow-y-clip"
    >
      {/* <ResizableHandle className="active:border-4 active:border-blue-400 rounded-r-md  transition-colors ease-linear" withHandle /> */}
      <ResizablePanel
        defaultSize={55}
        className="z-10 flex editor-resizable-panel"
      >
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel
            defaultSize={7}
            minSize={7}
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
          <ResizablePanel className="">
            <div className="flex h-content md:sticky bg-slate-200 w-full">
              <div className="h-full w-full">
                <EditorTabs
                  codeFiles={fileNames}
                  handleClick={changeActiveFile}
                  activeFileId={currFile?.id!}
                />
                <Editor
                  height="calc(100dvh - 100px)" // 60 navbar + 40 tab
                  width="100%"
                  defaultLanguage="javascript"
                  language={getMonacoLanguageId(currFile?.language)}
                  defaultValue={currFile?.code || "// Loading ..."}
                  onMount={handleEditorDidMount}
                  onChange={handleEditorChange}
                  theme={theme === "dark" ? "vs-dark" : "light"}
                  path={currFile?.language}
                />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle
        className="active:border-[3px] active:border-blue-400 rounded-r-sm  transition-colors ease-linear"
        withHandle
      />
      <ResizablePanel>
        <div className="w-full h-full">
          <iframe
            title={codeboxDetail?.name || "Output"}
            sandbox="allow-scripts"
            className="w-full h-full black:bg-white"
            srcDoc={docString}
          />
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

export default WebPage;
