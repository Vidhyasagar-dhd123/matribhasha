"use client";

import { ReadProvider } from "@/modules/books/contexts/read.context";
import ChapterList from "@/modules/books/components/ChapterList";
import ReadPage from "@/modules/books/components/ReadPage";
import ReadQueryManager from "@/modules/books/components/ReadQueryManager";
import PageList from "@/modules/books/components/PageList";
import React, { useState } from "react";
import { SidebarOpen, SidebarClose, PanelRightOpen, PanelRightClose } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Reusable Sidebar Toggle Button
const SidebarToggle = ({
  isOpen,
  onClick,
  OpenIcon,
  CloseIcon,
  label,
  align = "left",
}: {
  isOpen: boolean;
  onClick: () => void;
  OpenIcon: React.ElementType;
  CloseIcon: React.ElementType;
  label: string;
  align?: "left" | "right";
}) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border bg-card text-foreground hover:bg-muted transition shadow-sm ${
      align === "left" ? "justify-start" : "justify-end"
    }`}
  >
    {isOpen ? <CloseIcon size={14} /> : <OpenIcon size={14} />}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = React.use(params);
  const [leftBarOpen, setLeftBarOpen] = useState(false);
  const [rightBarOpen, setRightBarOpen] = useState(false);

  return (
    <ReadProvider id={id}>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        {/* Top Sticky Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-2 bg-card/90 backdrop-blur border-b border-border shadow-sm">
          <SidebarToggle
            isOpen={leftBarOpen}
            onClick={() => setLeftBarOpen(!leftBarOpen)}
            OpenIcon={SidebarOpen}
            CloseIcon={SidebarClose}
            label="Chapters"
            align="left"
          />

          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:block">
            Reader View
          </div>

          <SidebarToggle
            isOpen={rightBarOpen}
            onClick={() => setRightBarOpen(!rightBarOpen)}
            OpenIcon={PanelRightOpen}
            CloseIcon={PanelRightClose}
            label="Versions & Authors"
            align="right"
          />
        </div>

        {/* Content Reading Arena */}
        <section className="flex-1 flex flex-col justify-between w-full relative overflow-x-hidden">
          <div className="flex-1 flex flex-row justify-center w-full relative min-h-0">
            {/* Left Sidebar */}
            <AnimatePresence>
              {leftBarOpen && (
                <motion.div
                  initial={{ x: -280, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -280, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="absolute left-0 top-0 bottom-0 z-30 shadow-2xl"
                >
                  <ChapterList />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Central Reader Page */}
            <div className="flex-1 w-full max-w-5xl px-3 py-4 flex justify-center">
              <ReadPage />
            </div>

            {/* Right Sidebar */}
            <AnimatePresence>
              {rightBarOpen && (
                <motion.div
                  initial={{ x: 280, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 280, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="absolute right-0 top-0 bottom-0 z-30 shadow-2xl"
                >
                  <ReadQueryManager />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Page Bar */}
          <PageList className="sticky bottom-0 z-10" />
        </section>
      </div>
    </ReadProvider>
  );
};

export default Page;
