"use server";

import PanelClient from "./PanelClient";
import connectDB from "../../../db/dbConnect";
import { Chat } from "../../../model/chat.model";
import mongoose from "mongoose";
import verifyUser from "../../../components/verifyUser";

export default async function PanelServer() {
  try {
    await connectDB();
    const session = await verifyUser();
    if (!session) throw new Error("Unauthorized ! Please Sign In...");
    // getChatHistory
    const pastChats = await Chat.aggregate([
      {
        $match: {
          members: new mongoose.Types.ObjectId(session.user._id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "members",
          pipeline: [
            {
              $project: {
                username: 1,
                userSocketId: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
      },
    ]);
    return <PanelClient pastChats={JSON.parse(JSON.stringify(pastChats))} />;
  } catch (error) {
    throw new Error("Some error occured", error);
  }
}

