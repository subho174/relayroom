"use client";

import { useSession } from "next-auth/react";

export default function useFetchUser () {
  const { data: session } = useSession();
  if (session) return session.user;
  return null;
};
