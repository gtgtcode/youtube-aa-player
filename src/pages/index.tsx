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
          controls
          autoPlay
          src={fieldContents !== "" ? `/api/video/stream/${fieldContents}` : ""}
        >
          Your browser does not support the video tag.
        </video>
        <div className="mt-6 font-bold">{videoInfo?.videoDetails?.title}</div>
      </section>
    </div>
  );
}
