import { redirect } from "next/navigation";
import ChatClient from "./ChatClient.jsx";
import verifyUser from "../../components/verifyUser.js";

const chat = async () => {
  const session = await verifyUser();
  console.log(session);

  if (!session) redirect("/");
  else return <ChatClient />;
};

export default chat;
