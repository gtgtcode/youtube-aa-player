import Link from "next/link";

export default function RelatedVideo(props: any) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <a href={`/watch/${props.video?.id}`} className="w-full">
      <button className="text-left flex mb-2">
        <div className="flex-none relative">
          <img
            src={props.video?.thumbnails[1].url}
            alt="Thumbnail for Video"
            className="w-[160px]"
          ></img>
          <div className="absolute right-0 m-1 bg-zinc-800 rounded px-1 text-sm text-white bottom-0">
            {formatTime(props.video?.lengthSeconds)}
          </div>
        </div>
        <div className="pl-2">
          <div className="font-bold text-sm">{props.video?.title}</div>
          <div className="text-sm mt-1">{props.video?.author.name}</div>
          <div className="text-sm mt-1">
            {props.video?.viewCount && props.video?.viewCount.toLocaleString()}{" "}
            views • {props.video?.published}
          </div>
        </div>
      </button>
    </a>
  );
}
