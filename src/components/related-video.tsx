export default function RelatedVideo(props: any) {
  return (
    <button
      className="text-left flex mb-2"
      onClick={() => props.setFieldContents(props.video?.id)}
    >
      <div className="flex-none">
        <img
          src={props.video?.thumbnails[1].url}
          alt="Thumbnail for Video"
          className="w-[160px]"
        />
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
  );
}
