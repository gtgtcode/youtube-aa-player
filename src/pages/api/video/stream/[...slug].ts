import type { NextApiRequest, NextApiResponse } from "next";
import { YtdlCore } from "@ybd-project/ytdl-core";

const ytdl = new YtdlCore();

export const config = {
  api: {
    responseLimit: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { slug } = req.query;

  // Ensure the slug is an array and has at least two elements
  if (!Array.isArray(slug) || slug.length < 2) {
    return res.status(400).json({
      error:
        "Invalid request format. Please provide both video ID and start time.",
    });
  }

  const [videoID, startSeconds] = slug;

  if (!videoID || !startSeconds) {
    return res.status(400).json({ error: "Video ID or start time not found" });
  }

  try {
    const startSecondsInt = parseInt(startSeconds as string, 10);
    if (isNaN(startSecondsInt) || startSecondsInt < 0) {
      return res.status(400).json({ error: "Invalid start time" });
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoID}`;

    // Set headers for streaming
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Transfer-Encoding", "chunked");

    // Use ytdl to stream the video starting from the specified time (in seconds)
    const videoStream = ytdl.download(videoUrl, {
      begin: `${startSecondsInt}s`, // Start streaming from the provided time
      quality: "", // Set to "highest" or specify a number for quality
      requestOptions: {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
        },
      },
    });

    // Pipe the stream to the response
    videoStream.pipe(res);

    videoStream.on("error", (err) => {
      console.error("Error streaming video:", err);
      res.status(500).send("Failed to stream video");
    });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Internal server error");
  }
}
