import './App.css';
import { createRef, memo, useEffect, useMemo, useRef, useState } from 'react';
import { getTrailStatus } from './api/trailStats';
import { creek_id_map} from './config';


const ExpensiveCard = ({ onRef, selected, imgVal, id, trailStatus }) => {
  const ref = useRef(null)

  useEffect(() => {

    onRef(ref, id)

  }, [])

  useEffect(() => {
    // console.log(id)
    // console.log("trail", trailStatus)
    if(trailStatus){
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
        className={`${id} ${selected === id  || (trailStatus && trailStatus[creek_id_map[id]] === "Open" )?  "open" : "notOpen"}`} />
    </div>

  )
}

function App() {
  const [selected, setSelected] = useState("")

  const [refs, setRefs] = useState([])
  const [trailStatus, setTrailStatus] = useState(null)

  useEffect(() => {

    const fetchData = async () => {
      let status = await getTrailStatus()
      console.log(status)
      setTrailStatus(status)
    }

    fetchData()

    const initialValue = document.body.style.zoom;

    // Change zoom level on mount
    // document.body.style.zoom = "90%";

    return () => {
      // Restore default value
      document.body.style.zoom = initialValue;
    };

  }, [])

  useEffect(() => {
    console.log("Trail Status: ", trailStatus)
    if(trailStatus){
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


  return (
    <div className="App">
      <header className="App-header">

        <div className='container'
          onMouseMove={handleMouseMoveNew}
        >
          
          <img src={require('./Background-SouthExpress-Fixed.png')} className="image" alt="logo" usemap="#workmap" />
          <ExpensiveCard trailStatus={trailStatus} key="gran" id="gran" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0000_Gran-Lift.png')} />
          <ExpensiveCard trailStatus={trailStatus} key="sjourn" id="sjourn" onRef={handleRef} selected={selected} imgVal={require('./trails/south_Sjourn.png')} />
          <ExpensiveCard trailStatus={trailStatus} key="doe-run" id="doe-run" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0001_Doe-Run.png')} />
          <ExpensiveCard trailStatus={trailStatus} key="charlie" id="charlie" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0002_Charlie.png')} />
          <ExpensiveCard trailStatus={trailStatus} key="grand-prix" id="grand-prix" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0003_Grand-Prix.png')} />
          <ExpensiveCard trailStatus={trailStatus} key="osprey" id="osprey" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0004_Osprey.png')} />
          <ExpensiveCard trailStatus={trailStatus} key="sjourn-double" id="sjourn-double" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0006_SjournDouble.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="red-fox" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0008_Red-Fox.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="vern-triple" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0009_Vernon-Triple.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="cab" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0010_Cabriolet.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="silver-fox" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0011_Silver-fox.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="fox-tail" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0012_Fox-trail.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="garden-state" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0013_Garden-State.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="straightaway" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0014_Straightaway.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="twist" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0015_Twist.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="upper-horizon" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0017_upper-Horizon.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="great-north" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0019_Great-Northern.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="ind-pass" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0020_Indian-Pass.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="inde-pass" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0021_independence-pass.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="khyber" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0022_Khyber-pass.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="sayon" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0023_Sayonaro.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="capride" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0024_Capride.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="triple-bound" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0025_Triple-Bound.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="sugar" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0026_Sugar-slope.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="sugar-quad" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0027_Sugar-Quad-(lift).png')} />
          <ExpensiveCard trailStatus={trailStatus} id="matchmaker" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0029_Matchmaker.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="low-straight" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0030_Lower-Straight.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="zero" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0031_Zero-G.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="bear-x" onRef={handleRef} selected={selected} imgVal={require('./trails/x_0033_bear-xpress.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="canyon" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0034_Canyon.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="jumpin" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0035_JumpinJack.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="red-tail" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0036_RedTail.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="drivets" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0037_DrivetsDrop.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="buddy" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0038_BuddysWay.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="lark" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0039_Lark.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="giant" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0040_GiantSteps.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="lift-line" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0041_LiftLine.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="gully" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0042_TheGully.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="bakers" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0043_BakersField.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="cloud" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0044_Cloud9.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="tail" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0045_TailSpin.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="arena" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0047_Arena.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="halleys" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0048_HalleysComet.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="bunks" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0049_BunksBank.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="race" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0050_RaceTrail.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="big-bear" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0051_BigBear.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="gorge" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0052_GorgeRun.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="kami" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0053_Kamikaze.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="als" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0054_AlsAlley.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="wacky" onRef={handleRef} selected={selected} imgVal={require('./trails/south/_0055_WackyWay.png')} />
          <ExpensiveCard trailStatus={trailStatus} id="south-x" onRef={handleRef} selected={selected} imgVal={require('./trails/south/SouthExpress.png')} />






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
