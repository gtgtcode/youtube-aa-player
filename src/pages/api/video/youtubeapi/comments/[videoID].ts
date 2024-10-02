import type { NextApiRequest, NextApiResponse } from "next";
import { google } from "googleapis";
import cookie from "cookie"; // Use cookie package to parse cookies on the server-side

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { videoID } = req.query;
  console.log(videoID);

  // Get cookies from the request headers
  const cookies = cookie.parse(req.headers.cookie || "");
  const token = cookies.google_tokens; // Extract the token from the cookie
  console.log("Cookies: ", req.headers.cookie);

  if (!token) {
    return res.status(401).json({ error: "No access token found in cookies" });
  }

  // Initialize OAuth2 client
  const oauth2Client = new google.auth.OAuth2();
  oauth2Client.setCredentials({ access_token: token });

  // Create a YouTube service object
  const youtube = google.youtube({
    version: "v3",
    auth: oauth2Client,
  });

  try {
    // Make the API request to fetch comments
    const response = await youtube.commentThreads.list({
      part: "snippet",
      videoId: videoID as string, // videoId is used to fetch comments for the video
      maxResults: 20, // Optionally adjust this value
    });

    // Send the fetched comments back to the client
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({ error: "Failed to fetch comments" });
  }
}
