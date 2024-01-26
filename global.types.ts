namespace models {
  export interface ICodeBox {
    id: string;
    name: string;
    roomId: string;
    password: string;
    files?: ICodeFile[]; 
    type: "WEB" | "CODE";
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface ICodeFile {
    id: string;
    code?: string;
    language: string;
    codeBoxId: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface IUser {
    id: string;
    name: string;
    email: string;
  }
}

namespace sockets {
  export interface ConnectUserType {
    userId: string;
    name: string;
    email: string;
    roomId: string;
    color: string;
    boxId: number;
  }
}
