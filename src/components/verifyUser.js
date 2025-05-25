'use server'

import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/options";

const verifyUser = async (req) => {
  const session = await getServerSession(authOptions);
  
  if(!session)
    return null;
  return session;
};

export default verifyUser
