import { useEffect, useRef, useState } from "react"
import { creek_id_map } from "../config/config"

const ResizeAbleTrail = ({ top, left, containerWidth, containerHeight, url, onRef, selected, id, trailStatus, overlayPrio }) => {
  const ref = useRef(null)

  const [originalWidth, setOriginalWidth] = useState(0)
  const [originalHeight, setOriginalHeight] = useState(0)


  const [newTop, setNewTop] = useState(top)
  const [newLeft, setNewLeft] = useState(top)
  const [newWidth, setNewWidth] = useState(originalWidth)
  const [newHeight, setNewHeight] = useState(originalHeight)


  useEffect(() => {
    onRef(ref, id)

  }, [])

  useEffect(() => {


    const origContainerWidth = 2048
    const origContainerHeight = 1027

    const percentShrunk = 1 - (containerWidth / origContainerWidth)
    const newWidth = originalWidth - (originalWidth * percentShrunk)
    const newHeight = originalHeight - (originalHeight * percentShrunk)
    const newLeft = left - (left * percentShrunk)
    const newTop = top - (top * percentShrunk)


    setNewWidth(newWidth)
    setNewHeight(newHeight)
    setNewTop(newTop)
    setNewLeft(newLeft)

  }, [containerWidth, containerHeight, originalHeight, originalWidth])


  const handleImageLoad = (id, ref) => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const img = document.getElementById(id);

    setOriginalWidth(img.width)
    setOriginalHeight(img.height)

    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0);

    // const imgData = ctx.getImageData(0, 0, img.width, img.height);
    img.style.display = "none"
  }



  return (
    <div>
      <img
        onLoad={() => handleImageLoad(id, ref)}
        src={url} id={id} alt="logo" useMap="#workmap" />
      <canvas
        ref={ref}
        style={{
          position: 'absolute',
          top: `${newTop}px`,
          left: `${newLeft}px`,
          width: `${newWidth}px`,
          height: `${newHeight}px`,
          zIndex: `${overlayPrio ? "4" : "3"}`
        }}
        className={`${selected === id || (trailStatus && trailStatus[creek_id_map[id]] === "Open") ? "open" : "notOpen"}`} />
    </div>
  );


};

export default ResizeAbleTrail