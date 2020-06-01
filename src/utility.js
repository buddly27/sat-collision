export const computeSize = () => {
    const {innerWidth, innerHeight} = window;
    const coord = computeCoordinates(innerWidth, innerHeight);

    return {
        width: coord.x,
        height: coord.y,
    }
};


export const computeCoordinates = (x, y) => {
    const {devicePixelRatio} = window;
    const dpr = devicePixelRatio || 1;

    return {
        x: x * dpr,
        y: y * dpr,
    }
};


export const drawAxis = (canvas, scale, originX, originY) => {
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.lineWidth = 1;
    context.strokeStyle = "#e9e9e9";

    // Draw grid lines along X axis.
    for (let index = 0; ; index += 1) {
        const y = originY + (scale * index);
        if (y > Math.floor(canvas.height))
            break;

        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.stroke();
    }

    for (let index = 1; ; index += 1) {
        const y = originY - (scale * index);
        if (y < 0)
            break;

        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.stroke();
    }

    // Draw grid lines along Y axis.
    for (let index = 0; ; index += 1) {
        const x = originX + (scale * index);
        if (x > Math.floor(canvas.width))
            break;

        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
        context.stroke();
    }

    for (let index = 1; ; index += 1) {
        const x = originX - (scale * index);
        if (x < 0)
            break;

        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
        context.stroke();
    }

    // Draw origin lines
    context.lineWidth = 2;
    context.strokeStyle = "#000";

    context.beginPath();
    context.moveTo(0, originY);
    context.lineTo(canvas.width, originY);
    context.stroke();

    context.beginPath();
    context.moveTo(originX, 0);
    context.lineTo(originX, canvas.height);
    context.stroke();

    // Draw numbers.
    context.font = "25px Sans-serif";
    context.lineWidth = 3;
    context.strokeStyle = "#FFF";
    context.fillStyle = "#000";
    context.textAlign = "center";
    context.textBaseline = "middle";

    // Ticks numbers along the X axis.
    for (let index = 1; ; index += 1) {
        const x = originX + (scale * index);
        if (x > Math.floor(canvas.width))
            break;

        context.strokeText(`${index}`, x, originY + 30);
        context.fillText(`${index}`, x , originY + 30);
    }

    for (let index = 1; ; index += 1) {
        const x = originX - (scale * index);
        if (x < 0)
            break;

        context.strokeText(`${-index}`, x, originY + 30);
        context.fillText(`${-index}`, x, originY + 30);
    }

    // Ticks numbers along the Y axis.
    for (let index = 1; ; index += 1) {
        const y = originY + (scale * index);
        if (y > Math.floor(canvas.height))
            break;

        context.strokeText(`${-index}`, originX - 25, y);
        context.fillText(`${-index}`, originX - 25, y);
    }

    for (let index = 1; ; index += 1) {
        const y = originY - (scale * index);
        if (y < 0)
            break;

        context.strokeText(`${index}`, originX - 25, y);
        context.fillText(`${index}`, originX - 25, y);

    }
};


export const createPolygon = (scale, x, y, vertices) => {
    const polygon = new Path2D();

    polygon.moveTo(x + scale * vertices[0][0], y + scale * vertices[0][1] * -1);
    vertices.slice(1).forEach((vertex) => {
        polygon.lineTo(x + scale * vertex[0], y + scale * vertex[1] * -1);
    });

    polygon.closePath();
    return polygon;
};
