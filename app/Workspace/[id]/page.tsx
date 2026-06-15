"use client";

import React, { use, useEffect, useState } from "react";
import { OuterContainer } from "@/modules/workspace/componnents/ReferencePage";
import { ReadProvider } from "@/modules/books/contexts/read.context";
import PageList from "@/modules/books/components/PageList";
import Link from "next/link";
import { useReader } from "@/modules/books/contexts/read.context";
import { getRequestHeaders } from "@/modules/shared/utils/request";

function WorkspaceEditor() {
  const { content, page, language, book } = useReader()
  const [draftContent, setDraftContent] = useState("")
  const [status, setStatus] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setDraftContent(content.data?.content || "")
  }, [content.data?.content, page.data?.pageNumber])

  const save = async () => {
    if (!page.data?.bookUUID || !page.data?.pageNumber) {
      return
    }

    setSaving(true)
    setStatus(null)

    try {
      const response = await fetch(`/api/v1/pages/${page.data.bookUUID}/${page.data.pageNumber}`, {
        method: "PUT",
        headers: getRequestHeaders(),
        body: JSON.stringify({
          content: draftContent,
          language: language.data || page.data.originalLanguage || book.data?.originalLanguage,
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || "Unable to save page")
      }

      content.set(data)
      setStatus("Page saved successfully.")
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to save page")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="h-full flex flex-col font-mono min-h-0 gap-3">
      <textarea
        value={draftContent}
        onChange={(event) => setDraftContent(event.target.value)}
        className="w-full flex-1 resize-none rounded-2xl border border-border bg-background p-4 outline-none"
        placeholder="Write or edit the translation here..."
      />
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs text-muted-foreground">
          {page.data?.pageNumber ? `Editing page ${page.data.pageNumber}` : "Select a page to start editing"}
        </div>
        <button
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
          onClick={save}
          disabled={saving || !draftContent.trim()}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
      {status ? <div className="text-xs text-muted-foreground">{status}</div> : null}
    </div>
  )
}

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
            <WorkspaceEditor />
          </OuterContainer>
        </div>
      </div>
        <PageList/>
    </ReadProvider>
  );
};

export default Workspace;
