export const computeSize = () => {
    const {innerWidth, innerHeight, devicePixelRatio} = window;
    const dpr = devicePixelRatio || 1;

    return {
        width: innerWidth * dpr,
        height: innerHeight * dpr,
    }
};


export const drawAxis = (canvas, gridSize, originX, originY) => {
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.lineWidth = 1;
    context.strokeStyle = "#e9e9e9";

    // Draw grid lines along X axis.
    for (let index = 0; ; index += 1) {
        const y = originY + (gridSize * index);
        if (y > Math.floor(canvas.height))
            break;

        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.stroke();
    }

    for (let index = 1; ; index += 1) {
        const y = originY - (gridSize * index);
        if (y < 0)
            break;

        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(canvas.width, y);
        context.stroke();
    }

    // Draw grid lines along Y axis.
    for (let index = 0; ; index += 1) {
        const x = originX + (gridSize * index);
        if (x > Math.floor(canvas.width))
            break;

        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, canvas.height);
        context.stroke();
    }

    for (let index = 1; ; index += 1) {
        const x = originX - (gridSize * index);
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
        const x = originX + (gridSize * index);
        if (x > Math.floor(canvas.width))
            break;

        context.strokeText(`${index}`, x, originY + 30);
        context.fillText(`${index}`, x , originY + 30);
    }

    for (let index = 1; ; index += 1) {
        const x = originX - (gridSize * index);
        if (x < 0)
            break;

        context.strokeText(`${-index}`, x, originY + 30);
        context.fillText(`${-index}`, x, originY + 30);
    }

    // Ticks numbers along the Y axis.
    for (let index = 1; ; index += 1) {
        const y = originY + (gridSize * index);
        if (y > Math.floor(canvas.height))
            break;

        context.strokeText(`${-index}`, originX - 25, y);
        context.fillText(`${-index}`, originX - 25, y);
    }

    for (let index = 1; ; index += 1) {
        const y = originY - (gridSize * index);
        if (y < 0)
            break;

        context.strokeText(`${index}`, originX - 25, y);
        context.fillText(`${index}`, originX - 25, y);

    }
};


export const drawPolygon = (canvas, gridSize, originX, originY, vertices) => {
    const _vertices = [...vertices];

    const context = canvas.getContext("2d");
    context.strokeStyle = "#575757";
    context.fillStyle = "#ffa85f";

    context.beginPath();
    let vertex = _vertices.shift();
    context.moveTo(
        originX + gridSize * vertex[0],
        originY + gridSize * vertex[1] * -1
    );

    _vertices.forEach((vertex) => {
        context.lineTo(
            originX + gridSize * vertex[0],
            originY + gridSize * vertex[1] * -1
        );
    });

    context.closePath();
    context.fill();
    context.stroke();
};

