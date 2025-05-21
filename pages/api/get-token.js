// pages/api/get-token.js
import { getToken } from "next-auth/jwt";

export default async function handler(req, res) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET,raw:true });
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return res.status(200).json({ token });
}
