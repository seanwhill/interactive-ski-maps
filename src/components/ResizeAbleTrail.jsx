import { useEffect, useRef, useState } from "react"
import { creek_id_map } from "../config"

const ResizeAbleTrail = ({ top, left, originalWidth, originalHeight, containerWidth, containerHeight, url, onRef, selected, imgVal, id, trailStatus }) => {
  const ref = useRef(null)

  const [newTop, setNewTop] = useState(top)
  const [newLeft, setNewLeft] = useState(top)
  const [newWidth, setNewWidth] = useState(originalWidth)
  const [newHeight, setNewHeight] = useState(originalHeight)

  const [y, setY] = useState(left)

  useEffect(() => {
    onRef(ref, id)

  }, [])

  useEffect(() => {

    // console.log("USE EFFECT ________________")
    // const percentShrunk = 1 - (containerWidth / origContainerWidth)
    // const newTop = top - (top * percentShrunk)

    // console.log(newTop)
    // setX(newTop)

    const origContainerWidth = 2048
    const origContainerHeight = 1027
    const containerAspectRatio = origContainerWidth / origContainerHeight

    const percentShrunk = 1 - (containerWidth / origContainerWidth)
    // console.log("new: ", containerWidth)
    // console.log("orig: ", origContainerWidth)
    // console.log("divided",  containerWidth / origContainerWidth)
    console.log("% shrunk: ", percentShrunk)



    console.log(originalWidth)
    const newWidth = originalWidth - (originalWidth * percentShrunk)
    const newHeight = originalHeight - (originalHeight * percentShrunk)

    const originalTop = 67
    const originalLeft = 946

    const newLeft = left - (left * percentShrunk)
    const newTop = top - (top * percentShrunk)
    // const newTop = top

    console.log("old left ", left)
    console.log("old top ", top)

    console.log("new Left: ", newLeft)
    console.log("new Top: ", newTop)

    setNewWidth(newWidth)
    setNewHeight(newHeight)
    setNewTop(newTop)
    setNewLeft(newLeft)

  }, [containerWidth, containerHeight])

  const aspectRatio = originalWidth / originalHeight;
  //   const newHeight = (containerWidth / aspectRatio);
  // const newHeight = Math.min(containerWidth / aspectRatio, originalHeight);

  //   const newWidth = (containerHeight * aspectRatio) * 1;




  // const origContainerWidth = 2048
  // const origContainerHeight = 1027
  // const containerAspectRatio = origContainerWidth / origContainerHeight

  // const percentShrunk = 1 - (containerWidth / origContainerWidth)
  // // console.log("new: ", containerWidth)
  // // console.log("orig: ", origContainerWidth)
  // // console.log("divided",  containerWidth / origContainerWidth)
  // console.log("% shrunk: ", percentShrunk)



  // console.log(originalWidth)
  // const newWidth = originalWidth - (originalWidth * percentShrunk)
  // const newHeight = originalHeight - (originalHeight * percentShrunk)

  // const originalTop = 67
  // const originalLeft = 946

  // const newLeft = left - (left * percentShrunk)
  // const newTop = top - (top * percentShrunk)
  // // const newTop = top

  // console.log("old left ", left)
  // console.log("old top ", top)

  // console.log("new Left: ", newLeft)
  // console.log("new Top: ", newTop)


  // const newTop = originalWidth - (originalWidth * percentShrunk)
  // const newHeight = originalHeight - (originalHeight * percentShrunk)
  // const newHeight = (containerWidth / aspectRatio);
  // const newWidth = newHeight * aspectRatio;

  //   console.log("ratio: ", aspectRatio)
  //   console.log(newHeight)
  //   console.log("new width: ", newWidth)

  //   console.log("top: ", top)
  //   console.log("orig height: ", originalHeight )
  //   console.log("contHeight: ", containerHeight)
  //   console.log("contWidth: ", containerWidth)

  // setRefs(prevRefs => [...prevRefs, ref]);
  const handleImageLoad = (id, ref) => {
    console.log("HERRREEEEEEEEEEEEEEEEEE")
    console.log("REF", ref)
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');

    const img = document.getElementById(id);
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
        src={url} id={id} alt="logo" usemap="#workmap" />
      <canvas
        ref={ref}
        style={{
          position: 'absolute',
          // top: `${(top / originalHeight) * containerHeight}px`,
          // left: `${(left / originalWidth) * containerWidth}px`,
          top: `${newTop}px`,
          left: `${newLeft}px`,
          width: `${newWidth}px`,
          height: `${newHeight}px`,
          zIndex: 5
        }}
        className={`${selected === id || (trailStatus && trailStatus[creek_id_map[id]] === "Open") ? "open" : "notOpen"}`} />
    </div>
  );


};

export default ResizeAbleTrail