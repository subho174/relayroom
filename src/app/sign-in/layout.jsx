export const metadata = {
  title: "Sign In - RelayRoom",
  description: "Access your RelayRoom account to start chatting instantly.",
  keywords: ["RelayRoom", "sign in", "login", "chat app"],
  robots: "noindex, nofollow",
  openGraph: {
    title: "Sign In - RelayRoom",
    description: "Access your RelayRoom account to start chatting instantly.",
    url: "https://relayroom.vercel.app/sign-in",
    siteName: "RelayRoom",
    type: "website",
  },
};

export default function SignInLayout({ children }) {
  return <>{children}</>;
}
