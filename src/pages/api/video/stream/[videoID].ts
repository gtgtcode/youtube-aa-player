import type { NextApiRequest, NextApiResponse } from "next";
import { YtdlCore } from "@ybd-project/ytdl-core";
// JavaScript: const { YtdlCore } = require('@ybd-project/ytdl-core');

const ytdl = new YtdlCore({
  // The options specified here will be the default values when functions such as getFullInfo are executed.
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { videoID } = req.query;

  try {
    // Set headers for streaming
    res.setHeader("Content-Type", "video/mp4");
    res.setHeader("Transfer-Encoding", "chunked");

    // Stream the video using specific format for iOS compatibility
    const videoStream = ytdl.download(
      `https://www.youtube.com/watch?v=${videoID}`,
      {
        requestOptions: {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1", // iOS User-Agent
          },
        },
        highWaterMark: 1024 * 1024 * 10, // 10MB buffer for smoother streaming
      }
    );

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
