"use client";

import React, { createContext, useContext, ReactNode, useState, useMemo } from "react";
import { Workspace } from "../utils/workspace.utils";

const WorkspaceContext = createContext<Workspace | null>(null);

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [editLanguage, setEditLanguage] = useState<string | null>(null);

  const value: Workspace = useMemo(
    () => ({
      editLanguage: { data: editLanguage, set: setEditLanguage },
    }),
    [editLanguage]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within a WorkspaceProvider");
  }
  return context;
};