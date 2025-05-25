import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import connectDB from "../../../../db/dbConnect";
import User from "../../../../model/user.model";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        isLoggingIn: { type: Boolean },
      },
      async authorize({
        username,
        email,
        password,
        isLoggingIn,
        // , callbackUrl
      }) {
        await connectDB();
        try {
          let user = await User.findOne({ email }).select("+password");
          if (isLoggingIn === "true") {
            if (!user) throw new Error("User not found");
            const isPasswordCorrect = await bcrypt.compare(
              password,
              user.password
            );
            if (!isPasswordCorrect) throw new Error("Incorrect Password");
          } else {
            if (user) throw new Error("User already exists");
            const hashedPassword = await bcrypt.hash(password, 10);
            user = await User.create({
              username,
              email,
              password: hashedPassword,
            });
          }
          return user;
        } catch (error) {
          throw new Error(error);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({
      user,
      account,
      // , profile, email, credentials
    }) {
      await connectDB();
      try {
        //NOTE:
        // both authorize() and signIn() runs in credentials login, only signIn() runs in providers login

        //ORDER:
        // for credentials login; authorize(), signIn(), jwt(), session()
        // for providers login; signIn(), jwt(), session()

        if (account.provider === "credentials") return true;

        const cookieStore = await cookies();
        const authType = cookieStore.get("authType")?.value;
        if (!authType) throw new Error("Type of Authentication not found");
        const isSignUp = authType === "signup";
        const existingUser = await User.findOne({ email: user.email });

        if (isSignUp) {
          if (existingUser) throw new Error("User already exists");
          const newUser = await User.create({
            username: user.name,
            email: user.email,
          });
          user._id = newUser._id;
        } else {
          if (!existingUser) throw new Error("User not found");
          user._id = existingUser._id;
        }

        return true;
      } catch (error) {
        throw new Error(error);
      }
    },
    // async redirect({ url, baseUrl }) {
    //   return baseUrl;
    // },
    async session({
      session,
      token,
      //  user
    }) {
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.email = token.email;
        // session.token = token
      }
      return session;
    },
    async jwt({
      token,
      user,
      // account, profile, isNewUser
    }) {
      if (user) {
        token._id = user._id?.toString();
        token.username = user.username;
        token.email = user.email;
      }
      return token;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/api/auth/AuthError",
  },
  session: {
    strategy: "jwt",
  },
  //   jwt: {
  //   encryption: false,
  // },
  secret: process.env.NEXTAUTH_SECRET,
};
