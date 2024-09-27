import { CircularProgress, Button, Slider } from "@mui/material";
import { useState, useRef, useEffect } from "react";

export default function VideoPlayer(props: any) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoSrc, setVideoSrc] = useState(props.src);
  const [apiTime, setAPITime] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const totalLength = props.videoInfo?.videoDetails?.lengthSeconds || 0;

  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
    console.log("Video is starting to load...");
  };

  const handleLoadedData = () => {
    setIsLoading(false);
    console.log("Video has loaded.");
    // Set the current time after the video is loaded
    if (videoRef.current) {
      videoRef.current.currentTime = currentTime; // Ensure it starts at the current time
      if (isPlaying) {
        videoRef.current.play(); // Play if it was playing
      }
    }
  };

  const handleError = (e: any) => {
    setIsLoading(false);
    setHasError(true);
    console.error("Error loading video:", e);
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Convert seconds to MM:SS format
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleSliderChangeCommitted = (
    event: any,
    newValue: number | number[]
  ) => {
    const startSeconds = newValue as number;
    if (videoRef.current) {
      // Update the video source URL to start from the selected time
      const newSrc = `/api/video/stream/${props.videoInfo.videoDetails.videoId}/${startSeconds}`;
      setAPITime(startSeconds);
      setVideoSrc(newSrc); // Update the video source state
      setCurrentTime(startSeconds); // Update the current time
      setIsLoading(true); // Show loading spinner while new video loads
    }
  };

  useEffect(() => {
    // When videoSrc changes, set the video source URL in the video element
    if (videoRef.current) {
      videoRef.current.src = videoSrc; // Update src to new value
      videoRef.current.load(); // Load the new video source
      // The currentTime should already be set correctly in handleLoadedData
    }
  }, [videoSrc]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.src = props.src; // Set initial source
      videoRef.current.load(); // Load the initial video source
      // Set initial current time based on props
      videoRef.current.currentTime = props.startTime || 0; // Start time passed as prop
      videoRef.current.play(); // Play the video initially
    }
  }, [props.src, props.startTime]); // React to changes in props

  useEffect(() => {
    // Initialize slider value based on the start time
    setCurrentTime(props.startTime || 0);
  }, [props.startTime]);

  return (
    <div>
      <div className="w-[900px] h-[506px] mx-auto relative">
        {isLoading && !hasError && (
          <CircularProgress className="absolute top-1/2 left-1/2 !-translate-x-1/2 !-translate-y-1/2" />
        )}

        <video
          className="w-full h-full"
          autoPlay
          ref={videoRef}
          poster={props.videoInfo?.videoDetails?.media?.thumbnails[0]?.url}
          src={videoSrc}
          onTimeUpdate={handleTimeUpdate}
          onLoadStart={handleLoadStart}
          onLoadedData={handleLoadedData}
          onError={handleError}
          controls={false}
        >
          Your browser does not support the video tag.
        </video>

        <div
          id="controls"
          className="block absolute w-full h-full top-0 left-0"
        >
          {/* Play/Pause Button */}
          <Button
            variant="contained"
            onClick={handlePlayPause}
            className="absolute bottom-2 left-2"
          >
            {isPlaying ? "Pause" : "Play"}
          </Button>

          {/* Progress Bar */}
          {totalLength > 0 && (
            <div className="absolute bottom-10 left-0 w-full px-4">
              <Slider
                value={currentTime + apiTime}
                max={totalLength}
                onChange={(e, newValue) => setCurrentTime(newValue as number)} // Update current time while dragging
                onChangeCommitted={handleSliderChangeCommitted} // Change video src when slider is released
                aria-labelledby="video-progress-slider"
              />
              <div className="flex justify-between text-white">
                <span>{formatTime(currentTime + apiTime)}</span>
                <span>{formatTime(totalLength)}</span>
              </div>
            </div>
          )}
        </div>

        {hasError && <p>Failed to load video. Please try again later.</p>}
      </div>
    </div>
  );
}
