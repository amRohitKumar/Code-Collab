"use client";

import { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import * as monaco from "monaco-editor";
import toast from "react-hot-toast";
import EditorFooter from "@/components/EditorFooter";
import customFetch from "@/utils/axios";
import socket from "@/socket";
import { useSession, getSession } from "next-auth/react";
import ShareRoom from "@/components/CodeBoxPage/ShareRoom";
import debounce from "@/utils/debounce";
import insertDecorationCSS from "@/utils/insertDecorationCSS";
import { getMonacoLanguageId } from "@/utils/getMonacoLangId";
import { useRouter } from "next/navigation";

// audio call

//border-[#2C3E50] bg-[#2C3E50] border-[#3498DB] bg-[#3498DB] border-[#27AE60] bg-[#27AE60] border-[#9B59B6] bg-[#9B59B6] border-[#E74C3C] bg-[#E74C3C] border-[#F39C12] bg-[#F39C12] border-[#16A085] bg-[#16A085] border-[#2980B9] bg-[#2980B9] border-[#D35400] bg-[#D35400] border-[#8E44AD] bg-[#8E44AD]

type PropsType = {
  codeBoxId: string;
};

interface IPosition {
  lineNumber: number;
  column: number;
}

interface IContentWidgetWithPosition extends monaco.editor.IContentWidget {
  position: IPosition;
}

interface IContentWidgetObject {
  [key: number]: IContentWidgetWithPosition;
}

interface Idecorations {
  [key: number]: monaco.editor.IEditorDecorationsCollection;
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
  const { data, update } = useSession();
  console.log(data);
  const router = useRouter();
  // const { id: userId, name, email, room_token, token } = data?.user || {};
  const [language, setLanguage] = useState("JAVASCRIPT_NODE");

  // to store connected users
  const [connectedUsers, setConnectedUsers] = useState<ConnectUserType[]>([]);

  // to store codebox detail
  const [codeboxDetail, setCodeboxDetail] = useState<CodeBoxDetailType | null>(
    null
  );

  const isSocket = useRef(false); // to resolve conflict between socket and editor change event
  const contentWidgets = useRef<IContentWidgetObject>({}); // to store user name tag
  const decorators = useRef<Idecorations>({});
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacorRef = useRef<Monaco | null>(null);

  // change the language of the editor
  const handleModelLanguageChange = async (newLanguage: string) => {
    const currModal = editorRef.current?.getModel();
    console.log(newLanguage, language);
    console.log(editorRef.current, currModal);
    if (!currModal || newLanguage === language) return;
    console.log(newLanguage, language);
    setLanguage(newLanguage);
    monaco.editor.setModelLanguage(currModal, getMonacoLanguageId(newLanguage));
  };

  const updateLanguageToDB = async (newLanguage: string) => {
    try {
      await customFetch.put(`/codebox/changelanguage/${codeBoxId}`, {
        data: newLanguage,
      });
    } catch (error) {
      console.log("error while updating language to db = ", error);
    }
  };

  // TO FETCH CODEBOX DATA INITIALLY
  const fetchCodeBoxData = async () => {
    try {
      const resp = await customFetch.get(`/codebox/${codeBoxId}`);
      handleModelLanguageChange(resp.data.language);
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
    const session = await getSession();
    // console.log(session);
    const { id: userId, name, email, room_token, express_token } = session?.user || {};
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

  function handleEditorDidMount(
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) {
    editorRef.current = editor;
    // console.log("mounted = ", editorRef.current);
    monacorRef.current = monaco;
    fetchCodeBoxData();
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
      // console.log("here is the current model value:", event);
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
      // clear previous decorations
      decorators.current[e.userId] && decorators.current[e.userId].clear();

      // apply new decorations
      decorators.current[e.userId] =
        editorRef.current.createDecorationsCollection(selectionArray);
    }
  }
  function changeWidgetPosition(e: ICursroEventWithUser) {
    if (!editorRef.current) return;

    // remove previous widget
    editorRef.current.removeContentWidget(contentWidgets.current[e.userId]);

    // update widget position
    contentWidgets.current[e.userId].position.lineNumber =
      e.selection.endLineNumber;
    contentWidgets.current[e.userId].position.column = e.selection.endColumn;

    // add new widget
    editorRef.current.addContentWidget(contentWidgets.current[e.userId]);
  }

  // useEffect(() => {
  //   if (editorRef.current) {
  //     fetchCodeBoxData();
  //   }
  // }, [editorRef.current?._id]);

  useEffect(() => {
    joinCodeBoxRoom();
    socket.on(
      "connected-users",
      (_connectedUsers: ConnectUserType[], currentValue: string) => {
        // console.log("connected users hook called");

        _connectedUsers.forEach((element) => {
          // add css class for cursor and selection
          insertDecorationCSS(element.userId, element.color);

          // initiate widget for each user with default position (0,0)
          insertWidget(element);
        });

        isSocket.current = true;
        editorRef.current?.setValue(currentValue);
        setConnectedUsers(_connectedUsers);
      }
    );

    socket.on("selection", function (data: ICursroEventWithUser) {
      // console.log("selection hook called", data);

      // change widget position and text selection
      changeSeleciton(data);
      changeWidgetPosition(data);
    });

    socket.on(
      "code-change-received",
      (changeEvent: monaco.editor.IModelContentChange) => {
        // console.log("code change received hook called", changeEvent);

        // execute change event
        isSocket.current = true;
        editorRef.current?.executeEdits("other-user", [
          {
            range: changeEvent.range,
            text: changeEvent.text,
            forceMoveMarkers: true,
          },
        ]);
      }
    );

    socket.on("change-language", (newLanguage: string) => {
      console.log("change language hook called", newLanguage);

      // change language of editor
      handleModelLanguageChange(newLanguage);
    });

    socket.on("user-disconnected", (userId: number) => {
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
      socket.off("change-language");
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

      // reset room_token
      // update({
      //   ...data,
      //   user: {
      //     ...data?.user,
      //     room_token: "",
      //   },
      // });
    };
  }, [codeboxDetail?.roomId]);

  return (
    <div className="flex items-start flex-col-reverse md:flex-row h-full bg-violet-100 overflow-y-clip">
      {/* LEFT CONTAINER (CODE BOX) */}
      <div className="h-full md:sticky md:top-[50px] bg-slate-500 w-full md:w-3/4">
        <Editor
          height="calc(100dvh - 110px)" // 50 + 60
          width="100%"
          defaultLanguage={getMonacoLanguageId(language) || "javascript"}
          defaultValue={codeboxDetail?.code || "// Loading ..."}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          theme="vs-dark"
          className="mt-1"
        />
        <EditorFooter
          editorRef={editorRef}
          language={language}
          setLanguage={(e) => {
            handleModelLanguageChange(e);
            updateLanguageToDB(e);
            socket.emit("change-language", e);
          }}
        />
      </div>
      {/* RIGHT CONTAINER (INFO) */}
      <div className="px-3 py-2 w-full h-full md:w-1/4">
        <div className="flex justify-center items-center">
          <h4 className="text-3xl font-bold text-center">
            {codeboxDetail?.name || "Loading ..."}
          </h4>
          <ShareRoom codeboxDetail={codeboxDetail} copyContent={copyContent} />
        </div>
        <div className="h-full  mt-4 rounded-md px-4 py-4 ">
          {connectedUsers.map((user) => (
            <div
              key={user.userId}
              className="flex items-center font-semibold bg-slate-100 rounded-md my-2 px-2 py-2"
            >
              <div className={`rounded-full w-4 h-4 bg-[${user.color}] mr-2`} />
              <div>
                {user.name} - {user.email}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
