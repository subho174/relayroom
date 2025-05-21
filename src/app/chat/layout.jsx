export default function ChatLayout({ children, chatInterface,panel }) {
  return (
    <div className="flex h-[100vh]">
      {children}
      {panel}
      {chatInterface}
    </div>
  );
}
