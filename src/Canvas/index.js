import React from "react";
import * as utility from "./utility";
import {Polygon} from "./shape";
import "./style.css";


export default function Canvas(props) {
    const {gridVisible, axesVisible, polygons} = props;

    const dimensions = utility.computeSize();
    const canvas = React.useRef(null);

    const [state, setState] = React.useState({
        scale: 50,
        width: dimensions.width,
        height: dimensions.height,
        origin: {
            x: Math.round(dimensions.width / 3.0),
            y: Math.round(dimensions.height / 2.0),
        },
        pointer: {
            x: 0,
            y: 0
        },
        polygonMapping: {},
        pressed: null,
        pressedDelta: null,
    });

    const {
        scale,
        width,
        height,
        origin,
        pointer,
        polygonMapping,
        pressed,
        pressedDelta
    } = state;

    // Update 'pressed' and 'pressedDelta' when mouse is pressed on canvas.
    const onMouseDown = React.useCallback((event) => {
        const {clientX, clientY} = event;
        const client = utility.computeCoordinates(clientX, clientY);

        let pressed = null;
        const polygons = Object.values(polygonMapping);

        for (let i = 0; i < polygons.length; i++) {
            if (polygons[i].hover(pointer.x, pointer.y)) {
                pressed = polygons[i].identifier;

                // Record the vertices where the mouse is pressed to compute
                // delta.
                polygons[i].saveState();
                break;
            }
        }

        setState(
            prevState => ({
                ...prevState,
                pressed: pressed,
                pressedDelta: {
                    x: origin.x - client.x,
                    y: origin.y - client.y
                },
            })
        );

    }, [origin, pointer, polygonMapping]);

    // Release 'pressed' and 'pressedDelta' when mouse is up.
    const onMouseUp = React.useCallback(() => {
        setState(
            prevState => ({
                ...prevState,
                pressed: null,
                pressedDelta: null
            })
        );

    }, []);

    // Update state when mouse is pressed and move on the canvas.
    const onMouseMove = React.useCallback((event) => {
        const {clientX, clientY} = event;
        const {offsetTop, offsetLeft} = canvas.current;

        const client = utility.computeCoordinates(clientX, clientY);
        const offset = utility.computeCoordinates(offsetLeft, offsetTop);

        const newState = {
            pointer: {
                x: client.x - offset.x,
                y: client.y - offset.y
            }
        };

        if (pressedDelta && !pressed) {
            newState.origin = {
                x: client.x + pressedDelta.x,
                y: client.y + pressedDelta.y,
            };
        }
        else if (pressedDelta && pressed) {
            const delta = {
                x: (client.x + pressedDelta.x - origin.x) / scale,
                y: (client.y + pressedDelta.y - origin.y) / scale
            };

            polygonMapping[pressed].move(delta);
        }

        setState(prevState => ({...prevState, ...newState}));

    }, [canvas, origin, pressed, pressedDelta, scale, polygonMapping]);

    // Update state when window is resized.
    const onResize = React.useCallback(() => {
        const _dimensions = utility.computeSize();

        setState(prevState => {
            return {
                ...prevState,
                width: _dimensions.width,
                height: _dimensions.height
            };
        });

    }, []);

    // Update state when zooming on window.
    const onZoom = React.useCallback((event) => {
        const {wheelDelta, detail} = event;
        const delta = Math.max(Math.min(wheelDelta || -detail, 10), -10);

        setState(prevState => {
            return {
                ...prevState,
                scale: Math.max(Math.min(scale + delta), 5)
            };
        });

        event.preventDefault();

    }, [scale]);

    // Listen to 'resize' event.
    React.useEffect(() => {
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [onResize]);

    // Listen to 'wheel' event.
    React.useEffect(() => {
        window.addEventListener("wheel", onZoom, {passive: false});
        return () => window.removeEventListener("wheel", onZoom);
    }, [onZoom]);

    // Draw polygons when component is setup.
    React.useEffect(() => {
        const {width, height} = canvas.current;

        const context = canvas.current.getContext("2d");
        context.clearRect(0, 0, width, height);

        // Draw grid if required.
        if (gridVisible) {
            utility.drawGrid(canvas.current, scale, origin);
        }

        // Draw polygons.
        polygons.forEach((vertices) => {
            const id = vertices.map((vertex) => vertex.join()).join("-");

            if (!(id in polygonMapping)) {
                polygonMapping[id] = new Polygon(id, context, ...vertices);
            }

            const polygon = polygonMapping[id];
            polygon.create(origin, scale);

            const hover = polygon.hover(pointer.x, pointer.y);
            polygon.draw(hover);

            if (axesVisible) {
                utility.drawAxes(canvas.current, origin, polygon.axes);
            }

        });

        // Compute polygons projection on axis of separations.
        utility.drawProjections(
            canvas.current, origin, scale, Object.values(polygonMapping)
        );

    }, [
        canvas, origin, pointer, scale, polygonMapping,
        gridVisible, axesVisible, polygons,
    ]);

    return (
        <canvas
            ref={canvas}
            className="Canvas"
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseMove={onMouseMove}
            onTouchStart={onMouseDown}
            onTouchEnd={onMouseUp}
            onTouchMove={onMouseMove}
            width={width}
            height={height}
            tabIndex="0"
        />
    )
}
