"use server";

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient, StreamVideoClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;

const apiSecret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
  const user = await currentUser();

  if (!user) throw new Error("User not authenticated");
  if (!apiKey) throw new Error("No API Key");
  if (!apiSecret) throw new Error("No API Secret");

  const client = new StreamClient(apiKey, apiSecret);
  const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;
  const issued = Math.floor(Date.now() / 1000) - 60;

  const token = client.createToken(user.id, exp, issued);

  return token;

  // This is our server actions executing only on the server that taps into the api secret, creates a token for the user and now, we can call it in our StreamClientProvider.tsx without ever needing to spinning up our node-express server.
};
