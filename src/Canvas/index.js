import React from "react";
import {computeSize, drawAxis, drawPolygon} from "../utility"
import "./style.css";


class Canvas extends React.Component {

    constructor(props) {
        super(props);
        this.canvas = React.createRef();

        const dimensions = computeSize();

        this.state = {
            gridSize: 50,
            originX: Math.round(dimensions.width / 3.0),
            originY: Math.round(dimensions.height / 2.0),
            width: dimensions.width,
            height: dimensions.height,
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
        const {gridSize, originX, originY, polygons} = this.state;
        drawAxis(this.canvas.current, gridSize, originX, originY);

        polygons.forEach((vertices) => {
            drawPolygon(
                this.canvas.current, gridSize, originX, originY, vertices
            )
        })
    };

    updateSize = () => {
        const dimensions = computeSize();
        this.setState({
            width: dimensions.width,
            height: dimensions.height,
        });
    };

    onMouseDown = (event) => {
        this.pressed = {
            x: this.state.originX - event.clientX,
            y: this.state.originY - event.clientY,
        };
    };

    onMouseUp = () => {
        this.pressed = null
    };

    onMouseMove = (event) => {
        if (!this.pressed)
            return;

        this.setState({
            originX: this.pressed.x + event.clientX,
            originY: this.pressed.y + event.clientY,
        });
    };

    onZoom = (event) => {
        const {wheelDelta, detail} = event;
        const {gridSize} = this.state;

        const delta = Math.max(Math.min(wheelDelta || -detail, 10), -10);
        this.setState({gridSize: Math.max(Math.min(gridSize + delta), 5)});

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
