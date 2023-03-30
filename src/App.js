import './App.css';
import { createRef, memo, useEffect, useMemo, useRef, useState } from 'react';
import { getTrailStatus } from './api/trailStats';
import { trails } from './config/trailConfig';
import { Dimensions, Platform, useWindowDimensions } from 'react-native'

import ResizeAbleTrail from './components/ResizeAbleTrail';
import Header from './components/Header';

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

  const [width, setWidth] = useState(Dimensions.get('window').width - 200);

  const [height, setHeight] = useState(Dimensions.get('window').height);

  const [orientation, setOrientation] = useState('');
  const [prevOrientation, setPrevOrientation] = useState('');

  const [orientationChanged, setOrientationChanged] = useState(false)

  const [offsetWidth, setOffsetWidth] = useState(0)
  const [offsetHeight, setOffsetHeight] = useState(0)

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

      let clientX = event.clientX
      let clientY = event.clientY

      if (event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom) {
        // console.log("Mouse entered image");
        // console.log(ref[0])
        // console.log("ClientX", event.clientX)
        // console.log("ClientY", event.clientY)

        // console.log("rect LEFT", rect.left)
        // console.log("rect RIGHT", rect.right)

        // console.log("rect top", rect.top)
        // console.log("rect bottom", rect.bottom)

        const canvas = ref[0].current;
        const ctx = canvas.getContext('2d');


        //Fixed static property
        // const x = event.clientX - canvas.offsetLeft;
        // const y = event.clientY - canvas.offsetTop;

        // Get the coordinates of the mouse relative to the client viewport,
        const positionX = clientX - rect.left;
        const positionY = clientY - rect.top;

        // Calculate the pixel position based on the difference between the clientX coordinate and the left edge of the image
        //We want the client pointer relative to the Canvas since that is where we are grabbing our pixel data.
        let x = parseInt((clientX - rect.left) / rect.width * canvas.width); //Figure out canvas.NaturalWidht
        let y = parseInt((clientY - rect.top) / rect.height * canvas.height); //Figure out canvas.NaturalHeight


        //Second variable is how many pixels
        // x- 1/2 of pixels
        var pixels = ctx.getImageData(x - 5, y - 5, 10, 10).data;


        for (var i = 0; i < pixels.length; i += 4) {
          var alpha = pixels[i + 3];
          if (alpha > 0) { //TODO: anti aliasing around solid lines. Decreasing opacities to fade maybe use something not 0
            // console.log("Mouse is within 15 pixels of non-transparent section");
            setSelected(ref[1])
            return
          } else {
            // console.log('Not within  pxiels')
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

    // console.log("initial Load: ", initalLoad)

    const newWidth = isMobile ? width : width * window.devicePixelRatio //For now let user Zoom with window.DevicePixelRatio
    const newHeight = newWidth / containerAspectRatio;

    // console.log("NEW WIDTH: ", newWidth)
    // console.log("NEW HEIGHT: ", newHeight)

    // Get the flex container element
    const flexContainer = document.querySelector('.App');

    // Get the image element
    // const image = document.querySelector('.logs');
    const header = document.querySelector('.creekHeader');

    const elementStyles = window.getComputedStyle(header);
    const marginTop = parseFloat(elementStyles.getPropertyValue('margin-top'));
    const marginBottom = parseFloat(elementStyles.getPropertyValue('margin-bottom'));
    console.log(marginBottom)
    const headerHeight = header.offsetHeight + marginTop + marginBottom;


    // Get the height of the flex container
    const containerHeight = flexContainer.offsetHeight;
    const containerWidth = flexContainer.offsetWidth;


    // const imageWidth = image.offsetWidth;
    const imageWidth = newWidth;


    // Calculate the centering offset

    const devicePixelRatio = window.devicePixelRatio;
    // const verticalOffset = Math.floor(((containerHeight * devicePixelRatio) - (headerHeight)) / 2) / devicePixelRatio;
    const horizontalOffset = Math.floor(((containerWidth * devicePixelRatio) - (imageWidth * devicePixelRatio)) / 2) / devicePixelRatio;

    // console.log(`The image is centered by ${verticalOffset}px`);
    console.log(`The image width is centered by ${offsetWidth}px`);

    setOffsetHeight(headerHeight)
    setOffsetWidth(horizontalOffset)


    if (orientationChanged || initalLoad || !isMobile) {

      if (isMobile) {
        setOrientationChanged(false)

      }
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
      setWidth(Dimensions.get('window').width - 200);
      setHeight(Dimensions.get('window').height);
    };

    Dimensions.addEventListener('change', handleDimensionsChange);

    return () => {
      Dimensions.removeEventListener('change', handleDimensionsChange);
    };
  }, [orientation]);


  return (
    <div className={`App`} >
      <div
        onMouseMove={handleMouseMoveNew}
      >
        <div className='creekHeader'>
          <Header></Header>
          <h1 className='resort-title'>Mountain Creek</h1>

        </div>
        <div className='map-container' >


          <img className='logs' src={require('./mtnCreekInteractiveBackgroundSouth.png')}
            style={{
              // position: 'relative',
              width: containerWidth,
              height: containerHeight,
              // width: "100%",
              // aspectRatio: containerWidth / containerHeight,
              backgroundImage: `url(${require("./mtnCreekInteractiveBackgroundSouth.png")})`,
              // backgroundSize: 'cover',
              // backgroundPosition: 'center',
            }}
            alt="logo" id="container" useMap="#workmap" />
        </div>

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
            offsetWidth={offsetWidth}
            offsetHeight={offsetHeight}

            containerWidth={containerWidth}
            containerHeight={containerHeight}
            onRef={handleRef}
            selected={selected}

            trailStatus={trailStatus}
          />
        })}

      </div>
      {/* <div>PREV: {prevOrientation}</div>

      <div>ORIENTATION: {orientation}</div>
      <button onClick={() => updateSize()}></button> */}

    </div >
  );
}

export default App;
