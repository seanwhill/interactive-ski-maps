import logo from './logo.svg';
import './App.css';
import { memo, useMemo, useRef, useState } from 'react';
import x from './gran-2.svg'

function App() {
  const [selected, setSelected] = useState(false)
  const canvasRef = useRef(null);

  const [selected2, setSelected2] = useState(false)
  const canvasRef2 = useRef(null);

  const refs = useRef([])

  // // Check if the pixel is transparent (alpha value is 0)
  // if (alpha === 0) {
  //   console.log("Mouse is over a transparent pixel");
  //   setSelected(false)

  // } else {
  //   setSelected(true)

  //   console.log("Mouse is over a non-transparent pixel");
  // }
  // selected2(false)


  const handleMouseMove = (event) => {
    const canvas = canvasRef.current;

    const image1 = document.getElementById("test1");
    const image2 = document.getElementById("test2");

    const rect1 = canvasRef.current.getBoundingClientRect();
    // const rect1 = image1.getBoundingClientRect();
    const rect2 = canvasRef2.current.getBoundingClientRect();

    // console.log(rect1)
    // console.log(rect2)

    if (event.clientX >= rect1.left && event.clientX <= rect1.right && event.clientY >= rect1.top && event.clientY <= rect1.bottom) {
      console.log("Mouse entered image 1");

      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      // Get the coordinates of the mouse relative to the canvas
      const x = event.clientX - canvas.offsetLeft;
      const y = event.clientY - canvas.offsetTop;

      console.log(x)
      console.log(y)

      // Get the image data for the pixel at the mouse's coordinates
      // const imgData = ctx.getImageData(x, y, 1, 1);

      // console.log(imgData)
      // // The alpha value is stored in the fourth element (index 3) of the data array
      // const alpha = imgData.data[3];

      // console.log(alpha)


      var pixels = ctx.getImageData(x - 7.5, y - 7.5, 15, 15).data;
      for (var i = 0; i < pixels.length; i += 4) {
        var alpha = pixels[i + 3];
        if (alpha > 0) {
          console.log("Mouse is within 10 pixels of non-transparent section");
          setSelected(true)
          break;
        } else {
          setSelected(false) //TODO improve
        }
      }

    } else if (event.clientX >= rect2.left && event.clientX <= rect2.right && event.clientY >= rect2.top && event.clientY <= rect2.bottom) {
      console.log("Mouse entered image 2");

      const canvas = canvasRef2.current;
      const ctx = canvas.getContext('2d');

      // Get the coordinates of the mouse relative to the canvas
      const x = event.clientX - canvas.offsetLeft;
      const y = event.clientY - canvas.offsetTop;

      console.log(x)
      console.log(y)

      // Get the image data for the pixel at the mouse's coordinates
      const imgData = ctx.getImageData(x, y, 1, 1);

      console.log(imgData)
      // The alpha value is stored in the fourth element (index 3) of the data array
      const alpha = imgData.data[3];

      console.log(alpha)
      // Check if the pixel is transparent (alpha value is 0)
      if (alpha === 0) {
        console.log("Mouse is over a transparent pixel");
        setSelected2(false)

      } else {
        setSelected2(true)
        console.log("Mouse is over a non-transparent pixel");
      }
      setSelected(false)
    }
    else {
      setSelected(false)
      setSelected2(false)
    }


  };

  //TODO image load is only rendering some of the image
  const handleImageLoad = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const img = document.getElementById('test1');
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0);

    console.log(img.width)
    console.log(img.height)
    const imgData = ctx.getImageData(0, 0, img.width, img.height);
    img.style.display = "none"
    console.log(imgData);
  }

  const handleImageLoad2 = () => {
    const canvas = canvasRef2.current;
    const ctx = canvas.getContext('2d');

    const img = document.getElementById('test2');
    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0);

    console.log(img.width)
    console.log(img.height)
    const imgData = ctx.getImageData(0, 0, img.width, img.height);
    img.style.display = "none"
    console.log(imgData);
  }

  const ExpensiveCard = memo(() => {


    const id = "gran_lift"
    return (
      <>
        <img
          onLoad={handleImageLoad}
          src={require('./x_0000_Gran-Lift.png')} id={"test1"} className={`gran ${selected ? "open" : ""}`} alt="logo" usemap="#workmap" />
        <canvas
          ref={canvasRef}
          className={`gran ${selected ? "open" : ""}`} />
      </>

    )
  })

  const ExpensiveCard2 = memo(() => {

    return (
      <>
        <img
          onLoad={handleImageLoad2}
          src={require('./south_Sjourn.png')} id="test2" className={`sjourn ${false ? "open" : ""}`} alt="logo" usemap="#workmap" />
        <canvas
          ref={canvasRef2}
          className={`sjourn ${selected2 ? "open" : ""}`} />
      </>

    )
  })

  return (
    <div className="App">
      <header className="App-header">
        <div className='container'
          onMouseMove={handleMouseMove}
        >
          <img src={require('./img_0034_Background.jpg')} className="image" alt="logo" usemap="#workmap" />

          <ExpensiveCard />
          <ExpensiveCard2 />



        </div>
        {/* <map name="workmap">
          <area shape="rect" coords="34,44,270,350" alt="Computer" href="computer.htm" />
          <area shape="rect" coords="290,172,333,250" alt="Phone" href="phone.htm" />
          <area shape="circle" coords="337,300,44" alt="Cup of coffee" href="coffee.htm" />
        </map> */}
      </header >
    </div >
  );
}

export default App;
