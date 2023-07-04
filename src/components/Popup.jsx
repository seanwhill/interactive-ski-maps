import React, { CSSProperties, useEffect, useFocus, useRef } from 'react';

const Popup = ({ x, y }) => {
    const popupStyle = {
        position: 'absolute',
        top: y - 150,
        left: x + 20,
        // Add other styles as needed
    };

    const divRef = useRef()

    // useEffect(() => {
    //     divRef.current.focus();
    // }, [])

    useEffect(() => {
        const handleScroll = (event) => {
            if (divRef.current) {
                console.log("scrolling")
                divRef.current.scrollTop += event.deltaY;
                event.preventDefault();
            }
        };

        const handleWheel = (event) => {
            // Check if the mouse is within the div or its descendants
            console.log(divRef.current)
            console.log(divRef.current.closest('.rectangle-popup') == event.target.closest('.rectangle-popup'))
            if (
                divRef.current
                // divRef.current.closest('.rectangle-popup') === event.target.closest('.rectangle-popup')
            ) {
                console.log("hi")

                handleScroll(event);
            }
        };

        document.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            document.removeEventListener('wheel', handleWheel);
        };
    }, []);

    useEffect(() => {
        if (divRef.current) {
            divRef.current.focus();
        }
    }, []);


    return (
        <div ref={divRef} tabIndex={0} className="rectangle-popup" style={popupStyle}>
            <h4>Flat Rail</h4>
            <p>Ride On</p>
            <img className='feature' src='./park/Flat.png'></img>

            <h4>Flat Box</h4>
            <p>Urban</p>
            <img className='feature' src='./park/FlatBox.png'></img>

            <h4>Flat Rail</h4>
            <p>Ride On</p>
            <img className='feature' src='./park/Flat.png'></img>

            <h4>Flat Box</h4>
            <p>Urban</p>
            <img className='feature' src='./park/FlatBox.png'></img>

            <h4>Flat Rail</h4>
            <p>Ride On</p>
            <img className='feature' src='./park/Flat.png'></img>

            <h4>Flat Box</h4>
            <p>Urban</p>
            <img className='feature' src='./park/FlatBox.png'></img>

        </div>
    );
};

export default Popup;
