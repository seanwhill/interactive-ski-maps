import './App.css';
import { createRef, memo, useEffect, useMemo, useRef, useState } from 'react';
import { getTrailStatus } from './api/trailStats';
import { trails } from './config/trailConfig';
import { Dimensions } from 'react-native'

import ResizeAbleTrail from './components/ResizeAbleTrail';


function App() {
  const [selected, setSelected] = useState("")

  const [refs, setRefs] = useState([])
  const [trailStatus, setTrailStatus] = useState(null)


  const [containerWidth, setcontainerWidth] = useState(2048);
  const [containerHeight, setContainerHeight] = useState(1027);

  const origContainerWidth = 2048
  const origContainerHeight = 1027
  const containerAspectRatio = origContainerWidth / origContainerHeight

  const [orientation, setOrientation] = useState("PORTRAIT");
  const [isMobile, setIsMobile] = useState(false)

  // useEffect(() => {
  //   Dimensions.addEventListener('change', ({ window: { width, height } }) => {
  //     if (width < height) {
  //       console.log("PORTRAIT")
  //       setOrientation("PORTRAIT")
  //     } else {
  //       console.log("LANDSCAPE")
  //       setOrientation("LANDSCAPE")

  //     }
  //   })


  //   return () => {
  //     // Restore default value
  //     // document.body.style.zoom = initialValue;
  //     window.removeEventListener('change');

  //   };

  // }, []);

  useEffect(() => {

    const fetchData = async () => {
      let status = await getTrailStatus()
      setTrailStatus(status)
    }

    fetchData()

    //Handle Resize on load so fits screen
    handleResize()

    // Change zoom level on mount
    // document.body.style.zoom = "90%";
    // const initialValue = document.body.style.zoom;

    window.addEventListener('resize', handleResize);

    return () => {
      // Restore default value
      // document.body.style.zoom = initialValue;
      window.removeEventListener('resize', handleResize);

    };

  }, [])


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

  function handleRef(ref, id) {
    setRefs(prevRefs => [...prevRefs, [ref, id]]);
  }

  const handleResize = () => {

    // console.log("Container Aspect: ", containerAspectRatio)

    console.log("innerwWidth: ", window.innerWidth)
    console.log("visualWidth: ", window.visualViewport.width)

    console.log(Dimensions.get('window').width)
    console.log(Dimensions.get('window').height)
    console.log(Dimensions.get('screen').width)
    console.log(Dimensions.get('screen').height)

    const isMobile = Dimensions.get('window').width <= 900;
    console.log(isMobile)

    let newWidth;
    if (!isMobile) {
      newWidth = window.innerWidth * window.devicePixelRatio
    }
    else {
      setIsMobile(true)
      console.log('here')
      newWidth = Dimensions.get('window').width
    }

    const newHeight = newWidth / containerAspectRatio;

    console.log("New Height: ", newHeight)
    console.log("NEW IDTH: ", newWidth)
    console.log("New Container Aspect Ratio: ", newWidth / newHeight)

    setcontainerWidth(newWidth);
    setContainerHeight(newHeight);
  };



  return (
    <div className={`App ${isMobile ? "mobile" : ""}`} style={{ maxWidth: containerWidth }}>
      <header className="App-header">

        <div
          onMouseMove={handleMouseMoveNew}
        >
          <img src={require('./Background-SouthExpress-Fixed.png')}
            style={{
              position: 'relative',
              width: containerWidth,
              height: containerHeight,
              // width: "100%",
              // aspectRatio: containerWidth / containerHeight,
              backgroundImage: `url(${require("./Background-SouthExpress-Fixed.png")})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            alt="logo" id="container" useMap="#workmap" />


          {/* <img src={require('./Background-SouthExpress-Fixed.png')} className="image" alt="logo" usemap="#workmap" /> */}
          {/* <Trail trailStatus={trailStatus} key="gran" id="gran" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0000_Gran-Lift.png')} /> */}
          {trails.map((trail) => {
            return <ResizeAbleTrail
              top={trail.top - 10} // -10 so I don't have to update every single on on the config file :)
              left={trail.left - 10} // -10 so I don't have to update every single on on the config file :)
              url={trail.url}
              key={trail.id}
              id={trail.id}
              overlayPrio={trail.overlayPrio}

              containerWidth={containerWidth}
              containerHeight={containerHeight}
              onRef={handleRef}
              selected={selected}

              trailStatus={trailStatus}
            />
          })}

        </div>
      </header >
    </div >
  );
}

export default App;
