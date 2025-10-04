"use client"

import { ReadProvider } from "@/modules/books/contexts/read.context"
import ChapterList from "@/modules/books/components/ChapterList"
import ReadPage from "@/modules/books/components/ReadPage"
import ReadQueryManager from "@/modules/books/components/ReadQueryManager"
import PageList from "@/modules/books/components/PageList"
import React, { useState } from "react"
import { SidebarOpen, SidebarClose, PanelRightOpen, PanelRightClose } from "lucide-react"
import { motion } from "framer-motion"

// Reusable Sidebar Toggle Button
const SidebarToggle = ({
  isOpen,
  onClick,
  OpenIcon,
  CloseIcon,
  align = "left",
}: {
  isOpen: boolean
  onClick: () => void
  OpenIcon: React.ElementType
  CloseIcon: React.ElementType
  align?: "left" | "right"
}) => (
  <div
    onClick={onClick}
    className={`p-1 hover:bg-blue-200 rounded mx-4 flex cursor-pointer ${
      align === "left" ? "justify-end" : "justify-start"
    }`}
  >
    {isOpen ? (
      <OpenIcon className="text-blue-500 hover:text-blue-600" />
    ) : (
      <CloseIcon className="text-red-800 hover:text-blue-600" />
    )}
  </div>
)

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params)
  const [leftBarOpen, setLeftBarOpen] = useState(false)
  const [rightBarOpen, setRightBarOpen] = useState(false)

  return (
    <ReadProvider id={id}>
        <div className="sticky w-full flex justify-between top-0 p-2 border-b  z-20">
          <SidebarToggle
            isOpen={leftBarOpen}
            onClick={() => setLeftBarOpen(!leftBarOpen)}
            OpenIcon={SidebarOpen}
            CloseIcon={SidebarClose}
            align="left"
          />

          <SidebarToggle
            isOpen={rightBarOpen}
            onClick={() => setRightBarOpen(!rightBarOpen)}
            OpenIcon={PanelRightOpen}
            CloseIcon={PanelRightClose}
            align="right"
          />
        </div>
      <section className="flex flex-col items-center justify-center bg-background w-full overflow-x-hidden">
        
        {/* Content Area */}
        <div className="flex flex-row justify-between w-full relative overflow-hidden">
          {/* Left Sidebar */}
          <motion.div
            initial={{ x: -270 }}
            animate={{ x: leftBarOpen ? 0 : -270 }}
            transition={{ duration: 0.3 }}
            className="absolute h-full left-0 top-0  bg-white shadow-md z-10"
          >
            <ChapterList />
          </motion.div>

          <div className="flex-1 m-4">
            <ReadPage />
          </div>
          <motion.div
            initial={{ x: 270 }}
            animate={{ x: rightBarOpen ? 0 : 270 }}
            transition={{ duration: 0.3 }}
            className="absolute right-0 top-0 h-full bg-white shadow-md z-10"
          >
            <ReadQueryManager />
          </motion.div>
        </div>
        <PageList />
      </section>
    </ReadProvider>
  )
}

export default Page
