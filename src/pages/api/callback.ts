import { google } from "googleapis";
import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie"; // Import cookie for setting cookies

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const query = req.query;
  const { code } = query;

  const oauth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  );

  if (code) {
    try {
      // Exchange authorization code for tokens
      const { tokens } = await oauth2Client.getToken(code as string);

      // Set tokens as HTTP-only cookies
      res.setHeader(
        "Set-Cookie",
        cookie.serialize("google_tokens", JSON.stringify(tokens), {
          secure: process.env.NODE_ENV === "production", // Use HTTPS in production
          maxAge: 60 * 60 * 24 * 7, // 1 week
          path: "/",
        })
      );

      // Redirect to the homepage or another route
      res.redirect(302, "/");
    } catch (error) {
      console.error("Error retrieving tokens", error);
      res.status(500).json({ error: "Failed to retrieve tokens" });
    }
  } else {
    res.status(400).json({ error: "No code in request" });
  }
}
