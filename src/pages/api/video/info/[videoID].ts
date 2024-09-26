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
    // Fetch video information
    const info = await ytdl.getFullInfo(videoID as string);

    // Send back the video information as JSON
    res.status(200).json(info);
  } catch (error) {
    console.error("Error fetching video info:", error);
    res.status(500).json({ error: "Failed to fetch video information" });
  }
}
