import { NextResponse } from "next/server";
import { Chat } from "../../../model/chat.model";
import verifyUser from "../../../components/verifyUser";

export async function GET(request) {
  // checkIfOldChatExists
  try {
    const { searchParams } = new URL(request.url);

    const receiverId = searchParams.get("receiverId");
    // console.log(receiverId, typeof receiverId);

    const session = await verifyUser();
    if (!session) throw new Error("Unauthorized ! Please Sign In...");

    if (!receiverId)
      return NextResponse.json(
        { message: "Enter receiver id" },
        { status: 400 }
      );
    const oldChat = await Chat.findOne({
      members: { $all: [session.user._id, receiverId] },
    });

    if (oldChat)
      return NextResponse.json(
        { message: "Old Chat found", data: oldChat },
        { status: 200 }
      );

    return NextResponse.json({ message: "No Chat found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await verifyUser();
    if (!session) throw new Error("Unauthorized ! Please Sign In...");

    // let formdata = await request.formData();
    // const body = Object.fromEntries(formdata.entries());
    // let { receiverId, message } = body;
    
    const body = await request.json();
    const { receiverId, message } = body;

    if (!(message && receiverId))
      return NextResponse.json({ error: "Enter all fields" }, { status: 400 });

    const oldChat = await Chat.findOne({
      members: {
        $all: [session.user._id.toString(), receiverId.toString()].sort(),
      },
    });

    // one case is pending here; if somehow fetching oldChat from db failed, then what to do;

    // if (!oldChat)
    //   return res.status(400).json(new ApiError(400, "Failed to send message"));

    const messageObj = {
      message,
      senderId: session.user._id,
      receiverId,
      // ...(uploadedFile && { attachment: uploadedFile.url }),
    };

    if (oldChat && oldChat.messages.length != 0) {
      const updatedChat = await Chat.findByIdAndUpdate(
        oldChat._id,
        {
          $push: {
            messages: messageObj,
          },
        },
        { new: true }
      );

      if (!updatedChat)
        return NextResponse.json(
          { error: "Failed to send message" },
          { status: 400 }
        );

      return NextResponse.json(
        {
          message: "Message stored successfully",
          data: { finalMessage: updatedChat.messages.at(-1) },
        },
        { status: 200 }
      );
    }
    const newMessage = await Chat.create({
      members: [session.user._id, receiverId],
      messages: [messageObj],
    });

    if (!newMessage)
      return NextResponse.json(
        { error: "Failed to start new chat" },
        { status: 400 }
      );

    return NextResponse.json(
      {
        message: "Message stored successfully",
        data: { finalMessage: newMessage.messages[0] },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  // setMessageAsViewed
  try {
    const session = await verifyUser();
    if (!session) throw new Error("Unauthorized ! Please Sign In...");

    const chatId = (await request.json()).chatId;
    // console.log(chatId);

    if (!chatId)
      return NextResponse.json({ error: "ChatId not found" }, { status: 404 });

    const chat = await Chat.findByIdAndUpdate(
      // TODO: changed this function a bit from actual Chat project, check thoroughly
      chatId,
      { $set: { "messages.$[msg].isViewed": true } },
      {
        arrayFilters: [
          { "msg.isViewed": false, "msg.receiverId": session.user._id },
        ],
      },
      { new: true }
    );

    if (!chat)
      return NextResponse.json(
        { error: "Failed to update msgs as viewed" },
        { status: 404 }
      );

    return NextResponse.json(
      { message: "isViewed updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
