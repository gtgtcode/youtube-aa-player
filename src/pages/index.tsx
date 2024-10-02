import { TextField } from "@mui/material";
import { useEffect, useState } from "react";
import localFont from "next/font/local";
import { error } from "console";
import VideoPlayer from "@/components/videoplayer";
import RelatedVideo from "@/components/related-video";

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
      document.title = json.videoDetails?.title;
    } catch (e: any) {
      console.error(e.message);
    }
  }

  useEffect(() => {
    getVideoInfo();
  }, [fieldContents]);

  return (
    <div className="flex grid-cols-2">
      <section id="video-player-side" className="w-[1000px] h-[506px]">
        <section className="mx-auto container text-center mt-12">
          <TextField
            label="YouTube Video ID"
            onChange={(e) => {
              setFieldContents(e.target.value);
              getVideoInfo();
            }} // Only update state
          />
        </section>
        <section className="mt-6 px-8">
          <VideoPlayer
            src={
              fieldContents !== "" ? `/api/video/stream/${fieldContents}/0` : ""
            }
            videoInfo={videoInfo}
          />
          <div>
            <div className="w-[640px]">
              <div className="mt-6 font-bold inline float-left">
                {videoInfo?.videoDetails?.title}
              </div>
            </div>
            <br />{" "}
            <div className="w-[640px] text-left mt-4">
              <br />
              <img
                className="rounded-full text-left inline mr-2 w-[48px] h-[48px]"
                src={videoInfo?.videoDetails?.author?.thumbnails[0].url}
                alt=""
              />
              <div className="text-left inline">
                {videoInfo?.videoDetails?.author?.name}
              </div>
              <div className="mt-3 font-bold inline float-right">
                {videoInfo?.videoDetails?.viewCount &&
                  Number(
                    videoInfo.videoDetails.viewCount
                  ).toLocaleString()}{" "}
                Views
              </div>
            </div>
          </div>
        </section>
      </section>
      <section id="recommendations" className="mt-12">
        {videoInfo?.relatedVideos?.map((video: any) => (
          <div>
            <RelatedVideo video={video} setFieldContents={setFieldContents} />
          </div>
        ))}
      </section>
    </div>
  );
}
