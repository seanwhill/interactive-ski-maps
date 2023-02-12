import React, { useState, useEffect } from 'react';

const Container = ({ children, width, height }) => (
  <div
    // style={{
    //   position: 'relative',
    //   width,
    //   height,
    //   backgroundImage: `url(${require("./Background-SouthExpress-Fixed.png")})`,
    //   backgroundSize: 'cover',
    //   backgroundPosition: 'center',
    // }}
  >
    {children}
  </div>
);

const Image = ({ top, left, originalWidth, originalHeight, containerWidth, containerHeight, url }) => {
  const aspectRatio = originalWidth / originalHeight;
//   const newHeight = (containerWidth / aspectRatio);
// const newHeight = Math.min(containerWidth / aspectRatio, originalHeight);

//   const newWidth = (containerHeight * aspectRatio) * 1;




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

  return (
    <img
      style={{
        position: 'absolute',
        // top: `${(top / originalHeight) * containerHeight}px`,
        // left: `${(left / originalWidth) * containerWidth}px`,
        top: `${newTop}px`,
        left: `${newLeft}px`,
        width: `${newWidth}px`,
        height: `${newHeight}px`,
      }}
      src={url}
      alt=""
    />
  );
};

const App = () => {
    const [width, setWidth] = useState(2048);
    const [height, setHeight] = useState(1027);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleResize = () => {

    const origContainerWidth = 2048
    const origContainerHeight = 1027
    const containerAspectRatio = origContainerWidth / origContainerHeight

    console.log("Container Aspect: ", containerAspectRatio)

    const newWidth = window.innerWidth * window.devicePixelRatio
    // const newHeight = window.innerHeight * window.devicePixelRatio
    const newHeight = newWidth / containerAspectRatio;

    console.log("New Height: ", newHeight)
    console.log("New Container Aspect Ratio: ", newWidth / newHeight)

    setWidth(newWidth);
    setHeight(newHeight);

    // setWidth(document.getElementById('container').clientWidth);
    // setHeight(document.getElementById('container').clientHeight);
  };

  return (
    <Container width={width} height={height}>
        <img src={require('./Background-SouthExpress-Fixed.png')} 
        style={{
            position: 'relative',
            width,
            height,
            backgroundImage: `url(${require("./Background-SouthExpress-Fixed.png")})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }}
        alt="logo" id="container" usemap="#workmap" />

      <Image
        top={57}
        left={937}
        originalWidth={31}
        originalHeight={525}
        containerWidth={width}
        containerHeight={height}
        
        url={require('./trails/x_0000_Gran-Lift.png')}
        />
    </Container>
  );
};

export default App;