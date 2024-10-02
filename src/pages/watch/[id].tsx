import { Skeleton } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import VideoPlayer from "@/components/videoplayer";
import RelatedVideo from "@/components/related-video";
import Login from "@/components/login";
import cookie from "js-cookie"; // For cookie management

export default function Home() {
  const params = useParams();
  const [fieldContents, setFieldContents] = useState(params?.id);
  const [videoInfo, setVideoInfo] = useState({}) as any;
  const [loading, isLoading] = useState(true);
  const [authURL, setAuthURL] = useState() as any;
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track if user is logged in
  const [userInfo, setUserInfo] = useState({}) as any; // Store user info

  async function getVideoInfo() {
    try {
      const response = await fetch(`/api/video/info/${fieldContents}`);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      setVideoInfo(json);
      isLoading(false);
      getComments();
      document.title = json.videoDetails?.title;
    } catch (e: any) {
      console.error(e.message);
    }
  }

  async function getAuthURL() {
    try {
      const response = await fetch(`/api/generateAuth`);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      setAuthURL(json);
    } catch (e: any) {
      console.error(e.message);
    }
  }

  async function getComments() {
    try {
      const response = await fetch(
        `/api/video/youtubeapi/comments/${fieldContents}`,
        { method: "GET", credentials: "include" }
      );
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const json = await response.json();
      console.log(json);
    } catch (e: any) {
      console.error(e.message);
    }
  }

  useEffect(() => {}, []);

  async function checkLoginStatus() {
    // Check if tokens exist in cookies or elsewhere to verify login status
    const token = cookie.get("google_tokens");

    if (token) {
      setIsLoggedIn(true); // Set logged-in status to true
      const userInfo = JSON.parse(token); // Parse token to get user info if available
      setUserInfo(userInfo);
    }
  }

  useEffect(() => {
    getAuthURL();
    checkLoginStatus(); // Check if the user is logged in when the component mounts
  }, []);

  useEffect(() => {
    getVideoInfo();
  }, [fieldContents]);

  useEffect(() => {
    setFieldContents(params?.id);
  }, [params]);

  return (
    <div>
      <nav>
        {isLoggedIn ? (
          <div className="font-bold">
            Logged in as: {userInfo?.access_token ? "User" : "Unknown User"}
          </div>
        ) : (
          <Login url={authURL?.url} />
        )}
      </nav>
      <div className="flex grid-cols-2 container mx-auto">
        <section id="video-player-side" className="w-[1000px] h-[506px]">
          <section className="mt-12 px-8">
            <VideoPlayer
              src={
                fieldContents !== ""
                  ? `/api/video/stream/${fieldContents}/0`
                  : ""
              }
              videoInfo={videoInfo}
            />
            <div>
              <div className="w-[640px]">
                <div className="mt-5 font-bold inline float-left">
                  {!loading ? (
                    <div>
                      {videoInfo?.videoDetails?.isLive && (
                        <div>
                          <div className="bg-red-600 text-white p-1 mr-2 text-sm rounded inline">
                            • LIVE
                          </div>
                          <div className="inline"></div>
                        </div>
                      )}
                      {videoInfo?.videoDetails?.title}
                    </div>
                  ) : (
                    <Skeleton className="w-[600px] h-[30px]" animation="wave" />
                  )}
                </div>
              </div>
              <br />{" "}
              <div className="w-full text-left mt-2">
                <br />
                <div className="inline-flex">
                  {!loading ? (
                    <img
                      className="rounded-full text-left inline mr-2 w-[48px] h-[48px]"
                      src={videoInfo?.videoDetails?.author?.thumbnails[0].url}
                      alt=""
                    />
                  ) : (
                    <Skeleton
                      className="w-[48px] h-[48px] text-left inline mr-2"
                      animation="wave"
                      variant="circular"
                    />
                  )}
                  <div className="grid">
                    <div className="text-left inline">
                      {videoInfo?.videoDetails?.author?.name}
                    </div>
                    <div className="text-left inline">
                      {videoInfo?.videoDetails?.author?.subscriberCount &&
                        Number(
                          videoInfo.videoDetails?.author?.subscriberCount
                        ).toLocaleString()}{" "}
                      Subscribers
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 bg-zinc-200 p-2 rounded">
                <div>
                  {videoInfo?.videoDetails?.viewCount &&
                    Number(
                      videoInfo.videoDetails.viewCount
                    ).toLocaleString()}{" "}
                  Views • {videoInfo?.videoDetails?.published}
                </div>
                <div className="mt-4">
                  {videoInfo?.videoDetails?.description}
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
    </div>
  );
}
