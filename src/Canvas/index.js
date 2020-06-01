import React from "react";
import * as utility from "../utility";
import "./style.css";


class Canvas extends React.Component {

    constructor(props) {
        super(props);
        this.canvas = React.createRef();

        const dimensions = utility.computeSize();

        this.state = {
            scale: 50,
            originX: Math.round(dimensions.width / 3.0),
            originY: Math.round(dimensions.height / 2.0),
            width: dimensions.width,
            height: dimensions.height,
            mouseX: 0,
            mouseY: 0,
            polygons: [
                [[1, 0], [3, 2], [10, 2], [12, 0], [10, -2], [3, -2]],
                [[14, 4], [14, 7], [18, 7], [18, 4]],
            ]
        };

        // Record delta to origin pressed when moving canvas;
        this.pressed = null;
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateSize);
        window.addEventListener("wheel", this.onZoom, {passive: false});
        this.draw();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateSize);
        window.removeEventListener("wheel", this.onZoom);
    }


    componentDidUpdate(prevProps, prevState, snapshot) {
        this.draw();
    }

    draw = () => {
        const {scale, originX, originY, mouseX, mouseY, polygons} = this.state;

        utility.drawAxis(this.canvas.current, scale, originX, originY);

        const context = this.canvas.current.getContext("2d");

        polygons.forEach((vertices) => {
            const shape = utility.createPolygon(
                scale, originX, originY, vertices
            );
            const hover = context.isPointInPath(shape, mouseX, mouseY);

            // Define color.
            context.globalAlpha = 0.8;
            context.strokeStyle = "#575757";
            context.fillStyle = hover ? "#ffa85f" : "#d0dcff";

            // Draw.
            context.fill(shape);
            context.stroke(shape);
        })
    };

    updateSize = () => {
        const dimensions = utility.computeSize();
        this.setState({
            width: dimensions.width,
            height: dimensions.height,
        });
    };

    onMouseDown = (event) => {
        const {clientX, clientY} = event;
        const {originX, originY} = this.state;

        this.pressed = {x: originX - clientX, y: originY - clientY};
    };

    onMouseUp = () => {
        this.pressed = null
    };

    onMouseMove = (event) => {
        const {clientX, clientY} = event;
        const {offsetTop, offsetLeft} = this.canvas.current;
        const coord = utility.computeCoordinates(
            clientX - offsetLeft, clientY - offsetTop
        );

        const state = {
            mouseX: coord.x,
            mouseY: coord.y
        };

        if (this.pressed) {
            state.originX = this.pressed.x + clientX;
            state.originY = this.pressed.y + clientY;
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
                width={this.state.width}
                height={this.state.height}
                tabIndex="0"
            />
        );
    }
}

export default Canvas;
