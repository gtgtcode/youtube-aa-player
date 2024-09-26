import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import localFont from "next/font/local";
import { error } from "console";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  const [fieldContents, setFieldContents] = useState("");
  const [videoInfo, setVideoInfo] = useState({}) as any;

  async function getVideoInfo() {
    try {
      const response = await fetch(`/api/video/info/${fieldContents}`);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }

      const json = await response.json();
      setVideoInfo(json);
    } catch (e: any) {
      console.error(e.message);
    }
  }

  useEffect(() => {
    getVideoInfo();
    document.title = videoInfo?.videoDetails?.title;
  }, [fieldContents]);

  return (
    <div>
      <section className="mx-auto container text-center mt-12">
        <TextField
          label="YouTube Video ID"
          onChange={(e) => {
            setFieldContents(e.target.value);
            getVideoInfo();
          }} // Only update state
        />
      </section>
      <section className="container mx-auto text-center mt-12">
        <video
          width="640"
          height="360"
          className="mx-auto"
          autoPlay
          controls
          poster={videoInfo?.videoDetails?.media?.thumbnails[0]?.url}
          src={fieldContents !== "" ? `/api/video/stream/${fieldContents}` : ""}
        >
          Your browser does not support the video tag.
        </video>
        <div className="w-[640px] mx-auto">
          <div className="mt-6 font-bold inline float-left">
            {videoInfo?.videoDetails?.title}
          </div>
          <div className="mt-6 font-bold inline float-right">
            {videoInfo?.videoDetails?.viewCount &&
              Number(videoInfo.videoDetails.viewCount).toLocaleString()}
          </div>
        </div>
        <br />{" "}
        <div className="w-[640px] mx-auto text-left mt-4">
          <br />
          <img
            className="rounded-full text-left inline mr-2"
            src={videoInfo?.videoDetails?.author?.thumbnails[0].url}
            alt=""
          />
          <div className="text-left inline">
            {videoInfo?.videoDetails?.author?.name}
          </div>
        </div>
      </section>
    </div>
  );
}
