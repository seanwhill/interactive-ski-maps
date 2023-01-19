import logo from './logo.svg';
import './App.css';
import { createRef, memo, useEffect, useMemo, useRef, useState } from 'react';
import x from './gran-2.svg'

const ExpensiveCard = ({ onRef, selected, imgVal, id }) => {
  const ref = useRef(null)

  useEffect(() => {
    console.log("setting ref")
    onRef(ref, id)
  }, [])


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
    <>
      <img
        onLoad={() => handleImageLoad(id, ref)}
        src={imgVal} id={id} alt="logo" usemap="#workmap" />
      <canvas
        ref={ref}
        className={`${id} ${selected === id ? "open" : ""}`} />
    </>

  )
}

function App() {
  const [selected, setSelected] = useState("")

  const [refs, setRefs] = useState([])


  //TODO only run every 20 or so pixels. Expensive computation
  const handleMouseMoveNew = (event) => {
    for (const ref of refs) {
      const rect = ref[0].current.getBoundingClientRect();

      if (event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) {
        // console.log("Mouse entered image");

        const canvas = ref[0].current;
        const ctx = canvas.getContext('2d');


        //Fixed static property
        // const x = event.clientX - canvas.offsetLeft;
        // const y = event.clientY - canvas.offsetTop;

        // Get the coordinates of the mouse relative to the client viewport,
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        var pixels = ctx.getImageData(x - 7.5, y - 7.5, 15, 15).data;
        for (var i = 0; i < pixels.length; i += 4) {
          var alpha = pixels[i + 3];
          if (alpha > 0) {
            // console.log("Mouse is within 10 pixels of non-transparent section");
            setSelected(ref[1])
            return
          } else {
            // console.log('Not within 10 pxiels')
            setSelected("") //TODO improve
          }
        }

      }
      else {
        setSelected("")
      }
    }
  };


  useEffect(() => {
    console.log("new ref added")
    console.log(refs)
  }, [refs])


  function handleRef(ref, id) {
    setRefs(prevRefs => [...prevRefs, [ref, id]]);
  }


  return (
    <div className="App">
      <header className="App-header">
        <div>
          <button style={{ zIndex: 1000 }} onClick={() => { setSelected(true); console.log("clicked") }}>TESSSSSSSSSSSSSSSSSSSST</button>

        </div>

        <div className='container'
          onMouseMove={handleMouseMoveNew}
        >

          <img src={require('./img_0034_Background.jpg')} className="image" alt="logo" usemap="#workmap" />
          <ExpensiveCard key="gran" id="gran_lift" onRef={handleRef} selected={selected} imgVal={require('./x_0000_Gran-Lift.png')} />
          <ExpensiveCard key="sjourn" id="sjourn" onRef={handleRef} selected={selected} imgVal={require('./south_Sjourn.png')} />




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
