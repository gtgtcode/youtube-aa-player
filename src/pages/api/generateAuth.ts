import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";
import { useSearchParams } from "next/navigation";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  );

  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: "offline",

    // If you only need one scope, you can pass it as a string
    scope: [
      "https://www.googleapis.com/auth/youtube",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  });

  return res.status(200).json({ url: url });
}
