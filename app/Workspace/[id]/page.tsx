"use client";

import React, { use } from "react";
import { OuterContainer } from "@/modules/workspace/componnents/ReferencePage";
import { ReadProvider } from "@/modules/books/contexts/read.context";
import PageList from "@/modules/books/components/PageList";
import Link from "next/link";

const Workspace = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);

  return (
    <ReadProvider id={id}>
      <div className="h-full overflow-y-auto w-full flex flex-col min-h-0 bg-secondary/50 px-4">
        <div className="p-2 ">
          <Link href="/Workspace" className="bg-secondary text-primary hover:italic border  px-2 py-1 rounded-full inline-block">
            &larr; Back to Workspaces
          </Link>
        </div>

        {/* Make this container flex-1 and min-h-0 so the two columns (OuterContainer) fill the available height and scroll internally */}
        <div className="rounded-lg w-full flex-1 flex flex-col md:flex-row min-h-0 mb-4 gap-4">
          <OuterContainer id={id} type="ref">{""}</OuterContainer>
          <OuterContainer id={id} type="edit">
            <div className="h-full flex flex-col font-mono min-h-0">
              <textarea className="w-full h-full resize-none outline-none"></textarea>
            </div>
          </OuterContainer>
        </div>
      </div>
        <PageList/>
    </ReadProvider>
  );
};

export default Workspace;
