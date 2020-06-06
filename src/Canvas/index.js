import React from "react";
import * as utility from "./utility";
import {Polygon} from "./shape";
import "./style.css";


class Canvas extends React.Component {

    constructor(props) {
        super(props);
        this.canvas = React.createRef();

        const dimensions = utility.computeSize();

        this.state = {
            scale: 50,
            size: {
                width: dimensions.width,
                height: dimensions.height
            },
            origin: {
                x: Math.round(dimensions.width / 3.0),
                y: Math.round(dimensions.height / 2.0),
            },
            mouse: {
                x: 0,
                y: 0
            },
        };

        // Record polygons.
        this.polygons = {};

        // Record delta to origin pressed when moving canvas.
        this.pressed = null;
        this.pressed_delta = null;
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateSize);
        window.addEventListener("wheel", this.onZoom, {passive: false});

        this.addPolygon([1, 0], [3, 2], [10, 2], [12, 0], [10, -2], [3, -2]);
        this.addPolygon([14, 4], [14, 7], [18, 7], [18, 4]);

        this.draw();
    }

    addPolygon(...vertices) {
        const context = this.canvas.current.getContext("2d");
        const polygon = new Polygon(context, ...vertices);
        this.polygons[polygon.identifier] = polygon
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateSize);
        window.removeEventListener("wheel", this.onZoom);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.draw();
    }

    draw = () => {
        const {scale, origin, mouse} = this.state;

        utility.drawAxis(this.canvas.current, scale, origin);

        Object.values(this.polygons).forEach((polygon) => {
            polygon.create(origin, scale);
            const hover = polygon.hover(mouse.x, mouse.y);

            polygon.draw(hover);

            // Draw normals.
            utility.drawNormals(
                this.canvas.current, origin, polygon.normals()
            );
        })
    };

    updateSize = () => {
        const dimensions = utility.computeSize();
        this.setState({
            size: {
                width: dimensions.width,
                height: dimensions.height
            }
        });
    };

    onMouseDown = (event) => {
        const {clientX, clientY} = event;
        const {mouse, origin} = this.state;
        const client = utility.computeCoordinates(clientX , clientY);

        this.pressed = null;
        this.pressed_delta = {x: origin.x - client.x, y: origin.y - client.y};

        const polygons = Object.values(this.polygons);
        for (let i = 0; i < polygons.length; i++) {
            if (polygons[i].hover(mouse.x, mouse.y)) {
                this.pressed = polygons[i].identifier;
                polygons[i].saveState();
                break;
            }
        }
    };

    onMouseUp = () => {
        this.pressed = null;
        this.pressed_delta = null;
    };

    onMouseMove = (event) => {
        const {clientX, clientY} = event;
        const {origin, scale} = this.state;
        const {offsetTop, offsetLeft} = this.canvas.current;

        const client = utility.computeCoordinates(clientX , clientY);
        const offset = utility.computeCoordinates(offsetLeft, offsetTop);

        const state = {
            mouse: {
                x: client.x - offset.x,
                y: client.y - offset.y
            }
        };

        if (this.pressed_delta && !this.pressed) {
            state.origin = {
                x: client.x + this.pressed_delta.x,
                y: client.y + this.pressed_delta.y,
            }
        }
        else if (this.pressed_delta && this.pressed) {
            const delta = {
                x: (client.x + this.pressed_delta.x - origin.x) / scale,
                y: (client.y + this.pressed_delta.y - origin.y) / scale
            };

            this.polygons[this.pressed].move(delta);
        }

        this.setState(state);
    };

    onZoom = (event) => {
        const {wheelDelta, detail} = event;
        const {scale} = this.state;

        const delta = Math.max(Math.min(wheelDelta || -detail, 10), -10);
        this.setState({scale: Math.max(Math.min(scale + delta), 5)});

        event.preventDefault();
    };

    render() {
        return (
            <canvas
                ref={this.canvas}
                className="Canvas"
                onMouseDown={this.onMouseDown}
                onMouseUp={this.onMouseUp}
                onMouseMove={this.onMouseMove}
                onTouchStart={this.onMouseDown}
                onTouchEnd={this.onMouseUp}
                onTouchMove={this.onMouseMove}
                width={this.state.size.width}
                height={this.state.size.height}
                tabIndex="0"
            />
        );
    }
}

export default Canvas;
