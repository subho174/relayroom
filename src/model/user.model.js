import mongoose, { Schema } from "mongoose";

const MessageSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [/.+\@.+\..+/, "Please use a valid email"],
    },
    password: {
      type: String,
      // required: [true, "Password is required"],
      select: false,
    },
    // refreshToken: {
    //   type: String,
    //   select: false, // by this, refresh token will never be sent with user query until explicitly asked
    // },
    // chatHistory: [
    //   {
    //     type: Schema.Types.ObjectId,
    //     ref: "User",
    //   },
    // ],
    // verifyCode: {
    //   type: String,
    //   required: [true, "Verify code is required"],
    // },
    // verifyCodeExpiry: {
    //   type: Date,
    //   required: [true, "Verify code expiry is required"],
    // },
    // isVerified: {
    //   type: Boolean,
    //   default: false,
    // },
    // isAcceptingMessage: {
    //   type: Boolean,
    //   default: true,
    // },
    // messages: [MessageSchema],
    // createdAt: {
    //   type: Date,
    //   required: true,
    //   default: Date.now,
    // },
  },
  { timestamps: true }
);

userSchema.index({ email: 1, username: 1 });

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
