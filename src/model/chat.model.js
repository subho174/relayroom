import mongoose, {Schema } from "mongoose";

const messageSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  message: {
    type: String,
    required: [true, "Enter some message"],
  },
  attachment: {
    type: String,
  },
  isViewed: {
    type: Boolean,
    default: false,
  },
  postedAt: {
    type: Date,
    default: Date.now,
  },
});

const chatSchema = new Schema(
  {
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [messageSchema],
  }
);

chatSchema.index({ members: 1 });

const Chat = mongoose.models.Chat || mongoose.model("Chat", chatSchema);
const Message = mongoose.models.Message || mongoose.model("Message", messageSchema)

export {Chat, Message}