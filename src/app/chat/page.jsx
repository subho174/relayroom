"use client";

import { Button } from "@/components/ui/button";
import { useAppContext } from "../../context/AppContext.jsx";
import { DropdownMenuDemo } from "../../components/Dropdown.jsx";

const chat = () => {
  const { isPanelOpen, setisPanelOpen } = useAppContext();

  return (
    <>
      <Button
        className="fixed top-3  bg-[#1f1f1f] right-18 z-50 text-white p-2 rounded-md sm:hidden"
        onClick={() => setisPanelOpen(!isPanelOpen)}
      >
        {isPanelOpen ? (
          <svg
            className="w-6 h-6 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18 17.94 6M18 18 6.06 6"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              d="M5 7h14M5 12h14M5 17h10"
            />
          </svg>
        )}
      </Button>
      <DropdownMenuDemo />
    </>
  );
};

export default chat;
