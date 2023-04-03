import React, { useRef, useMemo, useEffect, useState } from "react";
import "./index.scss";
type ZoomImageProps = {
  image: string;
  cssClass?: string;
};

const SCROLL_SENSITIVITY = 0.0005;
const MAX_ZOOM = 1.25;
const MIN_ZOOM = 1;

const ZoomImage = ({ image, cssClass }: ZoomImageProps) => {
  const background = useMemo(() => new Image(), [image]);
  const canvasRef: any = useRef(null);
  const containerRef: any = useRef(null);
  const mouse = {
    _x: 0,
    _y: 0,
    x: 0,
    y: 0,
    updatePosition: function (event: any) {
      var e = event || window.event;
      this.x = e.clientX - this._x;
      this.y = (e.clientY - this._y) * -1;
    },
    setOrigin: function (e: any) {
      this._x = e.offsetLeft + Math.floor(e.offsetWidth / 2);
      this._y = e.offsetTop + Math.floor(e.offsetHeight / 2);
    },
    show: function () {
      return "(" + this.x + ", " + this.y + ")";
    },
  };
  const [pointSelected, setPointSelected] = useState<any>();
  const points = [
    {
      id: 1,
      title: "Point 1",
      top: 25,
      left: 0,
      image: "banner1.png",
    },
    {
      id: 2,
      title: "Point 2",
      top: 0,
      left: 300,
      image: "banner2.png",
    },
    {
      id: 3,
      title: "Point 3",
      top: 375,
      left: 300,
      image: "bg.jpeg",
    },
  ];
  const [zoom, setZoom] = useState(1);

  // FUNCTION

  const clamp = (num: number, min: number, max: number) => {
    return Math.min(Math.max(num, min), max);
  };

  const draw = () => {
    if (canvasRef.current) {
      const { width, height } = canvasRef.current;
      const context = canvasRef.current.getContext("2d");

      // Set canvas dimensions
      canvasRef.current.width = width;
      canvasRef.current.height = height;

      // Clear canvas and scale it
      context.scale(zoom, zoom);
      context.clearRect(0, 0, width, height);

      // Make sure we're zooming to the center
      const zoomWidth = zoom * width;
      const zoomHeight = zoom * height;
      const x = (context.canvas.width / zoom - zoomWidth) / 2;
      const y = (context.canvas.height / zoom - zoomHeight) / 2;

      // Draw image
      context.drawImage(background, x, y, zoomWidth, zoomHeight);
    }
  };

  const handleWheel = (event: any) => {
    const { deltaY } = event;
    // console.log("change213213213123");
    setZoom((zoom) =>
      clamp(zoom + deltaY * SCROLL_SENSITIVITY * -1, MIN_ZOOM, MAX_ZOOM)
    );
  };

  const onMouseMoveHandler = (event: any) => {
    updatePosition(event);
  };

  const onMouseLeaveHandler = () => {
    canvasRef.current.style = "";
  };

  const updatePosition = (event: any) => {
    mouse.updatePosition(event);
    updateTransformStyle(
      (mouse.y / containerRef.current.offsetHeight / 2).toFixed(2),
      (mouse.x / containerRef.current.offsetWidth / 2).toFixed(2)
    );
  };

  const updateTransformStyle = (x: string, y: string) => {
    var style = "rotateX(" + x + "deg) rotateY(" + y + "deg)";
    canvasRef.current.style.transform = style;
    canvasRef.current.style.webkitTransform = style;
    canvasRef.current.style.mozTranform = style;
    canvasRef.current.style.msTransform = style;
    canvasRef.current.style.oTransform = style;
  };

  // This will make the component responsive.
  // Container will always adapt the size, and the canvas wil be redrawn
  // useEffect(() => {
  //   if (!observer || !canvasRef) {
  //     return;
  //   }
  //   observer.current = new ResizeObserver((entries) => {
  //     console.log("entries :>> ", containerRef.current?.offsetWidth);
  //     entries.forEach(({ target }) => {
  //       // const { width, height } = background;
  //       const width = containerRef.current?.offsetWidth;
  //       const height = containerRef.current?.offsetHeight;
  //       console.log("width :>> ", width);
  //       // If width of the container is smaller than image, scale image down
  //       if (target.clientWidth < width) {
  //         // Calculate scale
  //         const scale = target.clientWidth / width;

  //         // Redraw image
  //         canvasRef.current.width = width * scale;
  //         canvasRef.current.height = height * scale;
  //         canvasRef.current
  //           .getContext("2d")
  //           .drawImage(background, 0, 0, width * scale, height * scale);
  //       }
  //     });
  //     observer.current.disconnect();
  //   });
  //   observer.current.observe(containerRef.current);

  //   return () => observer.current.unobserve(containerRef.current);
  // }, []);

  // EFFECT
  useEffect(() => {
    if (containerRef.current) {
      mouse.setOrigin(containerRef.current);
      containerRef.current.onmousemove = onMouseMoveHandler;
      containerRef.current.onmouseleave = onMouseLeaveHandler;
    }
  }, []);

  useEffect(() => {
    background.src = image;

    if (canvasRef.current) {
      background.onload = () => {
        // Get the image dimensions
        const width = containerRef.current?.offsetWidth;
        const height = containerRef.current?.offsetHeight;
        canvasRef.current.width = width;
        canvasRef.current.height = height;
        // Draw the image
        canvasRef.current
          .getContext("2d")
          .drawImage(background, 0, 0, width, height);
      };
    }
  }, [background]);

  useEffect(() => {
    if (zoom > 1) {
      draw();
    }
  }, [zoom]);

  return (
    <div ref={containerRef} className={cssClass} onWheel={handleWheel}>
      <canvas ref={canvasRef} style={{ height: "100%" }} />
      <div className={`points-list ${zoom === MAX_ZOOM ? "active" : ""}`}>
        {points.map((point) => (
          <div
            className="point-item"
            key={point.id}
            style={{ left: `${point.left}px`, top: `${point.top}px` }}
            onMouseEnter={() => setPointSelected({ ...point, active: true })}
            onMouseLeave={() => setPointSelected({ ...point, active: false })}
          >
            <span>{point.title}</span>
            <div className="point-image">
              <img src={point.image} alt="theme" />
            </div>
          </div>
        ))}
      </div>
      <h1
        className={`${
          zoom === MAX_ZOOM && pointSelected?.active ? "active" : "deactive"
        } point-title`}
      >
        {pointSelected?.title}
      </h1>
    </div>
  );
};

export default ZoomImage;
