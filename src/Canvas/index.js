import React from "react";
import "./style.css";


class Canvas extends React.Component {

    constructor(props) {
        super(props);
        this.canvas = React.createRef();
        this.state = {
            gridSize: 20,
            originX: Math.round(window.innerWidth / 2.0),
            originY: Math.round(window.innerHeight / 2.0),
            width: window.innerWidth,
            height: window.innerHeight,
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
        const {gridSize, originX, originY} = this.state;
        drawAxis(this.canvas.current, gridSize, originX, originY);

        const vertices = [
            [1.5, 0], [3, 4], [10, 4], [12, 0], [10, -4], [3, -4]
        ];

        drawPolygon(this.canvas.current, gridSize, originX, originY, vertices)
    };

    updateSize = () => {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight,
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
        if (! this.pressed)
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
            <div>
                <canvas
                    ref={this.canvas}
                    className="Canvas"
                    onMouseDown={this.onMouseDown}
                    onMouseUp={this.onMouseUp}
                    onMouseMove={this.onMouseMove}
                    onTouchStart={this.onMouseDown}
                    onTouchEnd={this.onMouseUp}
                    onTouchMove={this.onMouseMove}
                    onKeyDown={onKeyDown}
                    width={this.state.width}
                    height={this.state.height}
                    tabIndex="0"
                />
            </div>
        );
    }
}


const drawAxis = (canvas, gridSize, originX, originY) => {
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.lineWidth = 1;
    context.strokeStyle = "#e9e9e9";
    context.fillStyle = '#000';

    // Draw grid lines along X axis.
    for (let index = 0;; index += 1) {
        const y = originY + (gridSize * index + 0.5);
        if (y > Math.floor(canvas.height))
            break;

        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.stroke();
    }

    for (let index = 1;; index += 1) {
        const y = originY - (gridSize * index + 0.5);
        if (y < 0)
            break;

        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.stroke();
    }

    // Draw grid lines along Y axis.
    for (let index = 0;; index += 1) {
        const x = originX + (gridSize * index + 0.5);
        if (x > Math.floor(canvas.width))
            break;

        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
        context.stroke();
    }

    for (let index = 1;; index += 1) {
        const x = originX - (gridSize * index + 0.5);
        if (x < 0)
            break;

        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
        context.stroke();
    }

    context.strokeStyle = "#575757";

    // Draw origin lines
    context.beginPath();
    context.moveTo(0, originY + 0.5);
    context.lineTo(canvas.width, originY + 0.5);
    context.stroke();

    context.beginPath();
    context.moveTo(originX + 0.5, 0);
    context.lineTo(originX + 0.5, canvas.height);
    context.stroke();

    // Ticks marks along the X axis.
    for (let index = 1;; index += 1) {
        const x = originX + (gridSize * index + 0.5);
        if (x > Math.floor(canvas.width))
            break;

        context.beginPath();
        context.moveTo(x, originY -3);
        context.lineTo(x, originY + 3);
        context.stroke();

        // Draw numbers.
        context.font = "9px Arial";
        context.textAlign = "start";
        context.fillText(`${index}`, x - 2, originY + 15);
    }

    for (let index = 1;; index += 1) {
        const x = originX - (gridSize * index + 0.5);
        if (x < 0)
            break;

        context.beginPath();
        context.moveTo(x, originY -3);
        context.lineTo(x, originY + 3);
        context.stroke();

        // Draw numbers.
        context.font = "9px Arial";
        context.textAlign = "start";
        context.fillText(`${-index}`, x - 2, originY + 15);
    }

    // Ticks marks along the Y axis.
    for (let index = 1;; index += 1) {
        const y = originY + (gridSize * index + 0.5);
        if (y > Math.floor(canvas.height))
            break;

        context.beginPath();
        context.moveTo(originX - 3, y);
        context.lineTo(originX + 3, y);
        context.stroke();

        // Draw numbers.
        context.font = "9px Arial";
        context.textAlign = "start";
        context.fillText(`${-index}`, originX + 8, y + 2);
    }

    for (let index = 1;; index += 1) {
        const y = originY - (gridSize * index + 0.5);
        if (y < 0)
            break;

        context.beginPath();
        context.moveTo(originX - 3, y);
        context.lineTo(originX + 3, y);
        context.stroke();

        // Draw numbers.
        context.font = "9px Arial";
        context.textAlign = "start";
        context.fillText(`${index}`, originX + 8, y + 2);
    }
};


const drawPolygon = (canvas, gridSize, originX, originY, vertices) => {
    const context = canvas.getContext("2d");
    context.strokeStyle = "#575757";
    context.fillStyle = "#ffa85f";

    context.beginPath();
    let vertex = vertices.shift();
    context.moveTo(
        originX + gridSize * vertex[0],
        originY + gridSize * vertex[1]
    );

    vertices.forEach((vertex) => {
        context.lineTo(
            originX + gridSize * vertex[0],
            originY + gridSize * vertex[1]
        );
    });

    context.closePath();
    context.fill();
    context.stroke();
};

function onKeyDown(_) {
    console.log("Keydown...");
}

export default Canvas;
