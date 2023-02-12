import './App.css';
import { createRef, memo, useEffect, useMemo, useRef, useState } from 'react';
import { getTrailStatus } from './api/trailStats';
import { creek_id_map } from './config';
import Trail from './components/Trail';
import ResizeAbleTrail from './components/ResizeAbleTrail';


function App() {
  const [selected, setSelected] = useState("")

  const [refs, setRefs] = useState([])
  const [trailStatus, setTrailStatus] = useState(null)


  const [containerWidth, setcontainerWidth] = useState(2048);
  const [containerHeight, setContainerHeight] = useState(1027);

  useEffect(() => {

    const fetchData = async () => {
      let status = await getTrailStatus()
      console.log(status)
      setTrailStatus(status)
    }

    fetchData()

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

  useEffect(() => {
    console.log("Trail Status: ", trailStatus)
    if (trailStatus) {
      console.log(creek_id_map["buddy"])
      console.log("buddy", trailStatus["Buddy’s Way"])

    }
  }, [trailStatus])


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

  const handleResize = () => {

    console.log('RESIZING!!')
    const origContainerWidth = 2048
    const origContainerHeight = 1027
    const containerAspectRatio = origContainerWidth / origContainerHeight

    console.log("Container Aspect: ", containerAspectRatio)

    const newWidth = window.innerWidth * window.devicePixelRatio
    // const newHeight = window.innerHeight * window.devicePixelRatio
    const newHeight = newWidth / containerAspectRatio;

    console.log("New Height: ", newHeight)
    console.log("NEW IDTH: ", newWidth)
    console.log("New Container Aspect Ratio: ", newWidth / newHeight)

    setcontainerWidth(newWidth);
    setContainerHeight(newHeight);

    // setWidth(document.getElementById('container').clientWidth);
    // setHeight(document.getElementById('container').clientHeight);
  };



  return (
    <div className="App">
      <header className="App-header">

        <div
          onMouseMove={handleMouseMoveNew}
        >
          <img src={require('./Background-SouthExpress-Fixed.png')}
            style={{
              position: 'relative',
              width: containerWidth,
              height: containerHeight,
              backgroundImage: `url(${require("./Background-SouthExpress-Fixed.png")})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            alt="logo" id="container" usemap="#workmap" />

          {/* <img src={require('./Background-SouthExpress-Fixed.png')} className="image" alt="logo" usemap="#workmap" /> */}
          {/* <Trail trailStatus={trailStatus} key="gran" id="gran" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0000_Gran-Lift.png')} /> */}
          <ResizeAbleTrail
            top={57}
            left={937}
            originalWidth={31} //TODO probably don't need this
            originalHeight={525} //TODO probably don't need this
            containerWidth={containerWidth}
            containerHeight={containerHeight}

            onRef={handleRef} selected={selected}
            key="gran" id="gran"
            trailStatus={trailStatus}

            url={require('./trails/x_0000_Gran-Lift.png')}
          />





          {/* 


          <Trail trailStatus={trailStatus} key="sjourn" id="sjourn" onRef={handleRef} selected={selected} imgVal={require('./trails/south_Sjourn.png')} />
          <Trail trailStatus={trailStatus} key="doe-run" id="doe-run" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0001_Doe-Run.png')} />
          <Trail trailStatus={trailStatus} key="charlie" id="charlie" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0002_Charlie.png')} />
          <Trail trailStatus={trailStatus} key="grand-prix" id="grand-prix" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0003_Grand-Prix.png')} />
          <Trail trailStatus={trailStatus} key="osprey" id="osprey" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0004_Osprey.png')} />
          <Trail trailStatus={trailStatus} key="sjourn-double" id="sjourn-double" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0006_SjournDouble.png')} />
          <Trail trailStatus={trailStatus} id="red-fox" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0008_Red-Fox.png')} />
          <Trail trailStatus={trailStatus} id="vern-triple" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0009_Vernon-Triple.png')} />
          <Trail trailStatus={trailStatus} id="cab" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0010_Cabriolet.png')} />
          <Trail trailStatus={trailStatus} id="silver-fox" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0011_Silver-fox.png')} />
          <Trail trailStatus={trailStatus} id="fox-tail" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0012_Fox-trail.png')} />
          <Trail trailStatus={trailStatus} id="garden-state" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0013_Garden-State.png')} />
          <Trail trailStatus={trailStatus} id="straightaway" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0014_Straightaway.png')} />
          <Trail trailStatus={trailStatus} id="twist" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0015_Twist.png')} />
          <Trail trailStatus={trailStatus} id="upper-horizon" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0017_upper-Horizon.png')} />
          <Trail trailStatus={trailStatus} id="great-north" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0019_Great-Northern.png')} />
          <Trail trailStatus={trailStatus} id="ind-pass" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0020_Indian-Pass.png')} />
          <Trail trailStatus={trailStatus} id="inde-pass" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0021_independence-pass.png')} />
          <Trail trailStatus={trailStatus} id="khyber" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0022_Khyber-pass.png')} />
          <Trail trailStatus={trailStatus} id="sayon" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0023_Sayonaro.png')} />
          <Trail trailStatus={trailStatus} id="capride" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0024_Capride.png')} />
          <Trail trailStatus={trailStatus} id="triple-bound" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0025_Triple-Bound.png')} />
          <Trail trailStatus={trailStatus} id="sugar" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0026_Sugar-slope.png')} />
          <Trail trailStatus={trailStatus} id="sugar-quad" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0027_Sugar-Quad-(lift).png')} />
          <Trail trailStatus={trailStatus} id="matchmaker" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0029_Matchmaker.png')} />
          <Trail trailStatus={trailStatus} id="low-straight" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0030_Lower-Straight.png')} />
          <Trail trailStatus={trailStatus} id="zero" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0031_Zero-G.png')} />
          <Trail trailStatus={trailStatus} id="bear-x" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0033_bear-xpress.png')} />
          <Trail trailStatus={trailStatus} id="canyon" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0034_Canyon.png')} />
          <Trail trailStatus={trailStatus} id="jumpin" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0035_JumpinJack.png')} />
          <Trail trailStatus={trailStatus} id="red-tail" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0036_RedTail.png')} />
          <Trail trailStatus={trailStatus} id="drivets" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0037_DrivetsDrop.png')} />
          <Trail trailStatus={trailStatus} id="buddy" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0038_BuddysWay.png')} />
          <Trail trailStatus={trailStatus} id="lark" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0039_Lark.png')} />
          <Trail trailStatus={trailStatus} id="giant" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0040_GiantSteps.png')} />
          <Trail trailStatus={trailStatus} id="lift-line" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0041_LiftLine.png')} />
          <Trail trailStatus={trailStatus} id="gully" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0042_TheGully.png')} />
          <Trail trailStatus={trailStatus} id="bakers" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0043_BakersField.png')} />
          <Trail trailStatus={trailStatus} id="cloud" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0044_Cloud9.png')} />
          <Trail trailStatus={trailStatus} id="tail" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0045_TailSpin.png')} />
          <Trail trailStatus={trailStatus} id="arena" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0047_Arena.png')} />
          <Trail trailStatus={trailStatus} id="halleys" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0048_HalleysComet.png')} />
          <Trail trailStatus={trailStatus} id="bunks" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0049_BunksBank.png')} />
          <Trail trailStatus={trailStatus} id="race" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0050_RaceTrail.png')} />
          <Trail trailStatus={trailStatus} id="big-bear" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0051_BigBear.png')} />
          <Trail trailStatus={trailStatus} id="gorge" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0052_GorgeRun.png')} />
          <Trail trailStatus={trailStatus} id="kami" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0053_Kamikaze.png')} />
          <Trail trailStatus={trailStatus} id="als" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0054_AlsAlley.png')} />
          <Trail trailStatus={trailStatus} id="wacky" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0055_WackyWay.png')} />
          <Trail trailStatus={trailStatus} id="south-x" onRef={handleRef} selected={selected} imgVal={require('./trails/south/SouthExpress.png')} />

 */}




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
