export const metadata = {
  title: "Chat - RelayRoom",
  description:
    "Engage in seamless, real-time conversations with your contacts using RelayRoom’s intuitive chat interface.",
  keywords: ["RelayRoom", "chat interface", "real-time chat", "messaging"],
  robots: "noindex, nofollow",
  openGraph: {
    title: "Chat - RelayRoom",
    description:
      "Chat interface with chat panel and real-time messaging on RelayRoom.",
    url: "https://relayroom.vercel.app/chat",
    siteName: "RelayRoom",
    type: "website",
  },
};

export default function ChatLayout({ children, chatInterface, panel }) {
  return (
    <div className="flex h-[100vh]">
      {children}
      {panel}
      {chatInterface}
    </div>
  );
}
