import React from "react";
import * as utility from "./utility";
import {Polygon} from "./shape";
import "./style.css";


export default function Canvas(props) {
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
        polygons: [],
    });

    const {scale, width, height, pointer, origin} = state;
    const {gridVisible, separationAxesVisible} = props;

    // Record polygon objects per unique identifiers.
    const polygonMapping = {};

    // Record delta to origin pressed when moving canvas.
    const buffer = {
        pressed: null,
        pressedDelta: null,
    };

    // Listen to 'resize' event.
    React.useEffect(() => {
        window.addEventListener("resize", updateSize);
        return () => window.removeEventListener("resize", updateSize);
    });

    // Listen to 'wheel' event.
    React.useEffect(() => {
        window.addEventListener("wheel", onZoom, {passive: false});
        return () => window.removeEventListener("wheel", onZoom);
    });

    // Update 'pressed' and 'pressedDelta' when mouse is pressed on canvas.
    const onMouseDown = (event) => {
        const {clientX, clientY} = event;
        const client = utility.computeCoordinates(clientX, clientY);

        buffer["pressed"] = null;
        buffer["pressedDelta"] = {
            x: origin.x - client.x,
            y: origin.y - client.y
        };

        const polygons = Object.values(polygonMapping);
        for (let i = 0; i < polygons.length; i++) {
            if (polygons[i].hover(pointer.x, pointer.y)) {
                buffer["pressed"] = polygons[i].identifier;

                // Record the vertices where the mouse is pressed to compute
                // delta.
                polygons[i].saveState();
                break;
            }
        }
    };

    // Release 'pressed' and 'pressedDelta' when mouse is up.
    const onMouseUp = () => {
        buffer["pressed"] = null;
        buffer["pressedDelta"] = null;
    };

    // Update state when mouse is pressed and move on the canvas.
    const onMouseMove = (event) => {
        const {clientX, clientY} = event;
        const {offsetTop, offsetLeft} = canvas.current;

        const client = utility.computeCoordinates(clientX, clientY);
        const offset = utility.computeCoordinates(offsetLeft, offsetTop);

        const _state = {
            mouse: {
                x: client.x - offset.x,
                y: client.y - offset.y
            }
        };

        if (buffer["pressedDelta"] && !buffer["pressed"]) {
            _state.origin = {
                x: client.x + buffer["pressedDelta"].x,
                y: client.y + buffer["pressedDelta"].y,
            }
        } else if (buffer["pressedDelta"] && buffer["pressed"]) {
            const delta = {
                x: (client.x + buffer["pressedDelta"].x - origin.x) / scale,
                y: (client.y + buffer["pressedDelta"].y - origin.y) / scale
            };

            polygonMapping[buffer["pressed"]].move(delta);
        }

        setState({...state, ..._state});
    };

    // Update state when window is resized.
    const updateSize = () => {
        const _dimensions = utility.computeSize();
        setState({
            ...state,
            width: _dimensions.width,
            height: _dimensions.height
        });
    };

    // Update state when zooming on window.
    const onZoom = (event) => {
        const {wheelDelta, detail} = event;

        const delta = Math.max(Math.min(wheelDelta || -detail, 10), -10);
        setState({
            ...state,
            scale: Math.max(Math.min(scale + delta), 5)
        });

        event.preventDefault();
    };

    // Draw polygons when component is setup.
    React.useEffect(() => {
        const {scale, origin, pointer} = state;
        const {width, height} = canvas.current;

        const context = canvas.current.getContext("2d");
        context.clearRect(0, 0, width, height);

        if (gridVisible) {
            utility.drawBackground(canvas.current, scale, origin);
        }

        // Object.values(polygonMapping).forEach((polygon) => {
        //     polygon.create(origin, scale);
        //     const hover = polygon.hover(mouse.x, mouse.y);
        //
        //     polygon.draw(hover);
        //
        //     if (separationAxesVisible) {
        //         utility.drawAxes(canvas.current, origin, polygon.axes);
        //     }
        // });
        //
        // // Compute polygons projection on axis of separations.
        // utility.drawProjections(
        //     canvas.current, origin, scale, Object.values(polygonMapping)
        // );
    }, [scale]);


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



// class Canvas extends React.Component {
//
//     constructor(props) {
//         super(props);
//         this.canvas = React.createRef();
//
//         const dimensions = utility.computeSize();
//
//         this.state = {
//             scale: 50,
//             size: {
//                 width: dimensions.width,
//                 height: dimensions.height
//             },
//             origin: {
//                 x: Math.round(dimensions.width / 3.0),
//                 y: Math.round(dimensions.height / 2.0),
//             },
//             mouse: {
//                 x: 0,
//                 y: 0
//             },
//         };
//
//         // Record polygons.
//         this.polygons = {};
//
//         // Record delta to origin pressed when moving canvas.
//         this.pressed = null;
//         this.pressed_delta = null;
//     }
//
//     componentDidMount() {
//         window.addEventListener("resize", this.updateSize);
//         window.addEventListener("wheel", this.onZoom, {passive: false});
//
//         this.props.polygons.forEach((vertices) => {
//             this.addPolygon(...vertices);
//         });
//
//         this.draw();
//     }
//
//     addPolygon(...vertices) {
//         const context = this.canvas.current.getContext("2d");
//         const polygon = new Polygon(context, ...vertices);
//         this.polygons[polygon.identifier] = polygon
//     }
//
//     componentWillUnmount() {
//         window.removeEventListener("resize", this.updateSize);
//         window.removeEventListener("wheel", this.onZoom);
//     }
//
//     componentDidUpdate(prevProps, prevState, snapshot) {
//         this.draw();
//     }
//
//     draw = () => {
//         const {scale, origin, mouse} = this.state;
//         const {width, height} = this.canvas.current;
//
//         const context = this.canvas.current.getContext("2d");
//         context.clearRect(0, 0, width, height);
//
//         if (this.props.gridVisible) {
//             utility.drawBackground(this.canvas.current, scale, origin);
//         }
//
//         Object.values(this.polygons).forEach((polygon) => {
//             polygon.create(origin, scale);
//             const hover = polygon.hover(mouse.x, mouse.y);
//
//             polygon.draw(hover);
//
//             if (this.props.separationAxesVisible) {
//                 utility.drawAxes(this.canvas.current, origin, polygon.axes);
//             }
//         });
//
//         // Compute polygons projection on axis of separations.
//         utility.drawProjections(
//             this.canvas.current, origin, scale, Object.values(this.polygons)
//         );
//     };
//
//     updateSize = () => {
//         const dimensions = utility.computeSize();
//         this.setState({
//             size: {
//                 width: dimensions.width,
//                 height: dimensions.height
//             }
//         });
//     };
//
//     onMouseDown = (event) => {
//         const {clientX, clientY} = event;
//         const {mouse, origin} = this.state;
//         const client = utility.computeCoordinates(clientX, clientY);
//
//         this.pressed = null;
//         this.pressed_delta = {x: origin.x - client.x, y: origin.y - client.y};
//
//         const polygons = Object.values(this.polygons);
//         for (let i = 0; i < polygons.length; i++) {
//             if (polygons[i].hover(mouse.x, mouse.y)) {
//                 this.pressed = polygons[i].identifier;
//                 polygons[i].saveState();
//                 break;
//             }
//         }
//     };
//
//     onMouseUp = () => {
//         this.pressed = null;
//         this.pressed_delta = null;
//     };
//
//     onMouseMove = (event) => {
//         const {clientX, clientY} = event;
//         const {origin, scale} = this.state;
//         const {offsetTop, offsetLeft} = this.canvas.current;
//
//         const client = utility.computeCoordinates(clientX, clientY);
//         const offset = utility.computeCoordinates(offsetLeft, offsetTop);
//
//         const state = {
//             mouse: {
//                 x: client.x - offset.x,
//                 y: client.y - offset.y
//             }
//         };
//
//         if (this.pressed_delta && !this.pressed) {
//             state.origin = {
//                 x: client.x + this.pressed_delta.x,
//                 y: client.y + this.pressed_delta.y,
//             }
//         } else if (this.pressed_delta && this.pressed) {
//             const delta = {
//                 x: (client.x + this.pressed_delta.x - origin.x) / scale,
//                 y: (client.y + this.pressed_delta.y - origin.y) / scale
//             };
//
//             this.polygons[this.pressed].move(delta);
//         }
//
//         this.setState(state);
//     };
//
//     onZoom = (event) => {
//         const {wheelDelta, detail} = event;
//         const {scale} = this.state;
//
//         const delta = Math.max(Math.min(wheelDelta || -detail, 10), -10);
//         this.setState({scale: Math.max(Math.min(scale + delta), 5)});
//
//         event.preventDefault();
//     };
//
//     render() {
//         return (
//             <canvas
//                 ref={this.canvas}
//                 className="Canvas"
//                 onMouseDown={this.onMouseDown}
//                 onMouseUp={this.onMouseUp}
//                 onMouseMove={this.onMouseMove}
//                 onTouchStart={this.onMouseDown}
//                 onTouchEnd={this.onMouseUp}
//                 onTouchMove={this.onMouseMove}
//                 width={this.state.size.width}
//                 height={this.state.size.height}
//                 tabIndex="0"
//             />
//         );
//     }
// }
//
// export default Canvas;
