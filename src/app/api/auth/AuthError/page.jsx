import Link from "next/link";
import { Button } from "@/components/ui/button";
import { House } from "lucide-react";

const Errorpage = async ({ searchParams }) => {
  const error = (await searchParams).error;
  return (
    <div className="h-screen flex items-center bg-black">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="text-8xl text-white tracking-tight font-medium text-primary-600">
            404
          </h1>
          <p className="my-8 text-white text-3xl tracking-tight font-medium md:text-4xl">
            {error.replace("Error: ", "")}
          </p>
          {/* <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            Sorry, we can't find that page. You'll find lots to explore on the
            home page.{" "}
          </p> */}
          <Button variant="custom" >
            <House />
            <Link href="/">Back to Homepage</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Errorpage;
