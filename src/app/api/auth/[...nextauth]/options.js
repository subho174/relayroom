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
      async authorize({ username, email, password, isLoggingIn
        // , callbackUrl 
      }) {
        await connectDB();
        console.log(username, email, password, typeof password, isLoggingIn);
        try {
          let user = await User.findOne({ email }).select("+password");
          console.log(user);
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
    // TODO: Test Sign Up feature with providers
    async signIn({ user,
       // account, profile, email, credentials 
      }) {
      await connectDB();
      try {
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
        } else if (!existingUser) throw new Error("User not found");

        return true;
      } catch (error) {
        throw new Error(error);
      }
    },
    // async redirect({ url, baseUrl }) {
    //   return baseUrl;
    // },
    async session({ session,token
      //  user
     }) {
      if (token) {
        session.user._id = token._id;
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user,
       // account, profile, isNewUser
      }) {
      if (user) {
        token._id = user._id?.toString();
        token.username = user.username;
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
  secret: process.env.NEXTAUTH_SECRET,
};
