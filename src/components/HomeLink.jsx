import Link from "next/link";
import React from "react";
import { ArrowLeft } from "lucide-react";

const HomeLink = () => {
  //   return (
  //     <Link href="/" className="fixed text-3xl font-bold text-[#fbaf03] top-4 left-4" >RelayRoom</Link>
  //   )
  return (
    <div className="flex justify-center mt-4">
      <Link
        href="/"
        className="font-semibold flex items-center justify-center gap-2 text-yellow-600"
      >
        <ArrowLeft />
        Back To HomePage
      </Link>
    </div>
  );
};

export default HomeLink;
