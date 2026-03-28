import { createContext, useContext,ReactNode,useState  } from "react";
import { Workspace } from "../utils/workspace.utils";

const WorkspaceContext = createContext<Workspace>({} as Workspace);

export const WorkspaceProvider = ({children}:{children:ReactNode})=>{
    const [editLanguage,setEditLanguage] = useState<string|null>(null)

    const value :Workspace=
    {   
        editLanguage:{data:editLanguage , set:setEditLanguage },
    }
    return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
};

export const useWorkspace = () => useContext(WorkspaceContext);