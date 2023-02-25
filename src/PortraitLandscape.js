import React, { useState, useEffect, useRef } from 'react';

function PortraitLandscape() {
  const [orientation, setOrientation] = useState(getOrientation());
  const prevOrientationRef = useRef(orientation);

  useEffect(() => {
    function handleResize() {
      const newOrientation = getOrientation();
      prevOrientationRef.current = orientation;
      setOrientation(newOrientation);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [orientation]);

  function getOrientation() {
    return window.matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape';
  }

  return (
    <div>
      <p>Current orientation: {orientation}</p>
      <p>Previous orientation: {prevOrientationRef.current}</p>
    </div>
  );
}

export default PortraitLandscape