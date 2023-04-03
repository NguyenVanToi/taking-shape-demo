import React, { useEffect, useRef } from "react";
import ZoomImage from "./components/zoomContainer";

function App() {
  const cursor: any = useRef(null);
  useEffect(() => {
    if (cursor) {
      document.addEventListener("mousemove", (event) => {
        const { x, y } = event;
        if (cursor.current) {
          cursor.current.style.transform = `translate(${x}px, ${y}px)`;
        }
      });
    }
  }, []);

  return (
    <div>
      <span className="cursor" ref={cursor}></span>
      <ZoomImage image="bg.jpg" cssClass="background-main" />
    </div>
  );
}

export default App;
