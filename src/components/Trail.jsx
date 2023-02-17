import { useEffect, useRef } from "react"
import { creek_id_map } from "../config/config"

export const Trail = ({ onRef, selected, imgVal, id, trailStatus }) => {
  const ref = useRef(null)

  useEffect(() => {

    onRef(ref, id)

  }, [])

  useEffect(() => {
    // console.log(id)
    // console.log("trail", trailStatus)
    if (trailStatus) {
      // console.log("trail Status of: ", trailStatus[creek_id_map[id]])

    }

  }, [trailStatus])

  // setRefs(prevRefs => [...prevRefs, ref]);
  const handleImageLoad = (id, ref) => {
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
        src={imgVal} id={id} alt="logo" usemap="#workmap" />
      <canvas
        ref={ref}
        className={`${id} ${selected === id || (trailStatus && trailStatus[creek_id_map[id]] === "Open") ? "open" : "notOpen"}`} />
    </div>

  )
}

export default Trail