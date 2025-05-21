import { Buttons } from "../components/Button";
import verifyUser from "../components/verifyUser";
import { redirect } from "next/navigation";
// import HomeLink from '../components/HomeLink';

export default async function Home() {
  const session = await verifyUser();
  if (session) redirect("/chat");
  return (
    <section className="bg-black py-20 h-screen content-center">
      <div className="max-w-4xl mx-auto text-center justify-items-center px-6 fade-in">
        <p className="text-amber-400 font-semibold text-[18px] uppercase mb-3 tracking-wider">
          Real-Time Messaging App
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
          Connect Instantly, Chat Seamlessly.
        </h1>
        <p className="text-lg text-gray-300 mb-8 md:w-6/10 lg:w-7/10">
          Chat instantly and effortlessly with those who matter most — seamless,
          secure, and always ready whenever you are.
        </p>
        <Buttons />
      </div>
      {/* <HomeLink /> */}
    </section>
  );
}
