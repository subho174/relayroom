import React from "react";

const ChatSkeleton = () => {
  return (
    <div className="w-full rounded-2xl bg-black min-w-[140px] max-w-[280px] animate-pulse p-9">
      <h1 className="h-2 bg-gray-300 rounded-lg w-52 dark:bg-gray-600"></h1>
      <p className="w-48 h-2 mt-6 bg-gray-200 rounded-lg"></p>
      <p className="w-full h-2 mt-4 bg-gray-200 rounded-lg"></p>
      <p className="w-4/5 h-2 mt-4 bg-gray-200 rounded-lg"></p>
    </div>
  );
};

export default ChatSkeleton;
