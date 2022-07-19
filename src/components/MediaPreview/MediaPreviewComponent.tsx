import "./MediaPreview.css";
import {CloseRounded} from "@mui/icons-material";
import {FC} from "react";


interface MediaPreviewProps {
  src: string
  closePreview: () => void
}

 const MediaPreview: FC<MediaPreviewProps> = ({ src, closePreview }) => {
   if (!src) return null

  return <div className="mediaPreview">
    <CloseRounded onClick={closePreview} />
    <img src={src} alt="Preview" />
  </div>;
}

export default MediaPreview