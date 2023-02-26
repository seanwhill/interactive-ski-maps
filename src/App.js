import './App.css';
import { createRef, memo, useEffect, useMemo, useRef, useState } from 'react';
import { getTrailStatus } from './api/trailStats';
import { trails } from './config/trailConfig';
import { Dimensions, Platform, useWindowDimensions } from 'react-native'

import ResizeAbleTrail from './components/ResizeAbleTrail';

function usePrevious(value) {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

function App() {
  const [selected, setSelected] = useState("")

  const [refs, setRefs] = useState([])
  const [trailStatus, setTrailStatus] = useState(null)


  const [containerWidth, setcontainerWidth] = useState(2048);
  const [containerHeight, setContainerHeight] = useState(1027);

  const origContainerWidth = 2048
  const origContainerHeight = 1027
  const containerAspectRatio = origContainerWidth / origContainerHeight

  const [isMobile, setIsMobile] = useState(false)

  const [width, setWidth] = useState(Dimensions.get('window').width);

  const [height, setHeight] = useState(Dimensions.get('window').height);

  const [orientation, setOrientation] = useState('');
  const [prevOrientation, setPrevOrientation] = useState('');

  const [orientationChanged, setOrientationChanged] = useState(false)




  useEffect(() => {
    const fetchData = async () => {
      let status = await getTrailStatus()
      setTrailStatus(status)
    }

    function isMobileDevice() {
      return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    }

    setIsMobile(isMobileDevice())
    updateSize(true)
    fetchData()
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


  const updateSize = (initalLoad) => {
    // console.log("new Orientation", orientation)
    // console.log("Prev Orientation ", prevOrientation)
    // console.log("Orientation Changed ", orientationChanged)
    const newWidth = width
    const newHeight = newWidth / containerAspectRatio;

    // console.log("NEW WIDTH: ", newWidth)
    // console.log("NEW HEIGHT: ", newHeight)

    if (orientationChanged || initalLoad) {
      // console.log('RESIZED')

      setOrientationChanged(false)
      setcontainerWidth(newWidth);
      setContainerHeight(newHeight);
    }


  }

  useEffect(() => {

    updateSize(false)

  }, [orientation, prevOrientation, width, orientationChanged])

  useEffect(() => {

    // console.log("Width is set now: ", width)

    function getOrientation() {
      return window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape';
    }
    const newOrientation = getOrientation();

    // console.log("----------------------------")
    // console.log("Handle Resize Called")
    // console.log("Resize Prev:", orientation)
    // console.log("Resize ori:", newOrientation)

    if (orientation != newOrientation) {
      setPrevOrientation(orientation)
      setOrientation(newOrientation);
      setOrientationChanged(true)
    }

  }, [width])

  useEffect(() => {
    const handleDimensionsChange = () => {

      setWidth(Dimensions.get('window').width);
      setHeight(Dimensions.get('window').height);

    };

    Dimensions.addEventListener('change', handleDimensionsChange);

    return () => {
      Dimensions.removeEventListener('change', handleDimensionsChange);
    };
  }, [orientation]);


  return (
    <div className={`App`} style={{ maxWidth: containerWidth }}>
      <header className="App-header">
        <div
          onMouseMove={handleMouseMoveNew}
        >
          <img src={require('./mtnCreekInteractiveBackgroundSouth.png')}
            style={{
              position: 'relative',
              width: containerWidth,
              height: containerHeight,
              // width: "100%",
              // aspectRatio: containerWidth / containerHeight,
              backgroundImage: `url(${require("./mtnCreekInteractiveBackgroundSouth.png")})`,
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
      {/* <div>PREV: {prevOrientation}</div>

      <div>ORIENTATION: {orientation}</div>
      <button onClick={() => updateSize()}></button> */}

    </div >
  );
}

export default App;
