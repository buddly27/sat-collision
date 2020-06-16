export const computeWindowSize = () => {
    const {innerWidth, innerHeight} = window;
    const coord = computeCoordinates(innerWidth, innerHeight);

    return {
        width: coord.x,
        height: coord.y,
    }
};


export const computeCoordinates = (x, y) => {
    return {
        x: computePosition(x),
        y: computePosition(y),
    }
};


export const computePosition = (x) => {
    const {devicePixelRatio} = window;
    const dpr = devicePixelRatio || 1;
    return x * dpr;
};


export const createShape = (origin, scale, vertices) => {
    const shape = new Path2D();

    shape.moveTo(
        origin.x + scale * vertices[0][0],
        origin.y + scale * vertices[0][1] * -1
    );

    vertices.slice(1).forEach((vertex) => {
        shape.lineTo(
            origin.x + scale * vertex[0],
            origin.y + scale * vertex[1] * -1
        );
    });

    shape.closePath();
    return shape;
};


export const computeEdges = (vertices) => {
    const edges = [];
    const N = vertices.length;

    for (let i = 0; i < N; i++) {
        const vertex1 = vertices[i];
        const vertex2 = vertices[(i + 1) % N];
        edges.push([
            vertex2[0] - vertex1[0],
            vertex2[1] - vertex1[1]
        ]);
    }

    return edges;
};


export const computeNormals = (edges) => {
    return edges.map(
        (edge) => {
            const n = [-edge[1], edge[0]];
            const m = Math.sqrt((n[0]*n[0] + n[1]*n[1]));
            return [n[0]/m, n[1]/m];
        }
    )
};


export const computeAxesOfSeparation = (normals) => {
    const mapping = {};

    normals.forEach((normal) => {
        // Invert normal when X axis is negative.
        const axis = (normal[0] < 0 || normal[1] <= -1)
            ? [-normal[0], -normal[1]] : normal;

        // Add to mapping with unique ID to prevent duplicate.
        mapping[axis.join()] = axis
    });

    return Object.values(mapping)
};


export const computeProjection = (vertices, normal) => {
    let [minimum, maximum] = [+Infinity, -Infinity];

    vertices.forEach((vertex) => {
        const projection = vertex[0] * normal[0] + vertex[1] * normal[1];
        minimum = Math.min(minimum, projection);
        maximum = Math.max(maximum, projection);
    });

    return [minimum, maximum];
};


export const drawGrid = (context, origin, width, height, scale) => {
    context.setLineDash([]);

    context.lineWidth = 1;
    context.strokeStyle = "#e9e9e9";
    context.globalAlpha = 1;

    // Draw grid lines along X axis.
    for (let index = 0; ; index += 1) {
        const y = origin.y + (scale * index);
        if (y > Math.floor(height))
            break;

        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
    }

    for (let index = 1; ; index += 1) {
        const y = origin.y - (scale * index);
        if (y < 0)
            break;

        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
    }

    // Draw grid lines along Y axis.
    for (let index = 0; ; index += 1) {
        const x = origin.x + (scale * index);
        if (x > Math.floor(width))
            break;

        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
    }

    for (let index = 1; ; index += 1) {
        const x = origin.x - (scale * index);
        if (x < 0)
            break;

        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
    }

    // Draw origin lines
    context.lineWidth = 2;
    context.strokeStyle = "#000";

    context.beginPath();
    context.moveTo(0, origin.y);
    context.lineTo(width, origin.y);
    context.stroke();

    context.beginPath();
    context.moveTo(origin.x, 0);
    context.lineTo(origin.x, height);
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
        const x = origin.x + (scale * index);
        if (x > Math.floor(width))
            break;

        context.strokeText(`${index}`, x, origin.y + 30);
        context.fillText(`${index}`, x, origin.y + 30);
    }

    for (let index = 1; ; index += 1) {
        const x = origin.x - (scale * index);
        if (x < 0)
            break;

        context.strokeText(`${-index}`, x, origin.y + 30);
        context.fillText(`${-index}`, x, origin.y + 30);
    }

    // Ticks numbers along the Y axis.
    for (let index = 1; ; index += 1) {
        const y = origin.y + (scale * index);
        if (y > Math.floor(height))
            break;

        context.strokeText(`${-index}`, origin.x - 25, y);
        context.fillText(`${-index}`, origin.x - 25, y);
    }

    for (let index = 1; ; index += 1) {
        const y = origin.y - (scale * index);
        if (y < 0)
            break;

        context.strokeText(`${index}`, origin.x - 25, y);
        context.fillText(`${index}`, origin.x - 25, y);

    }
};


export const drawShape = (context, shape, hover) => {
    context.setLineDash([]);
    context.lineWidth = 1;
    context.globalAlpha = 0.8;
    context.strokeStyle = "#575757";
    context.fillStyle = hover ? "#b8c1ff" : "#d0dcff";

    context.fill(shape);
    context.stroke(shape);
};


export const drawAxes = (context, origin, width, height, axes) => {
    context.setLineDash([20, 10]);
    context.strokeStyle = "#3f51b5";
    context.lineWidth = 3;
    context.globalAlpha = 1;

    const scale = Math.max(width, height);

    axes.forEach((axis) => {
        context.beginPath();
        context.moveTo(origin.x, origin.y);
        context.lineTo(
            origin.x + scale * axis[0],
            origin.y + scale * axis[1] * -1
        );
        context.stroke();

        context.beginPath();
        context.moveTo(origin.x, origin.y);
        context.lineTo(
            origin.x + scale * axis[0] * -1,
            origin.y + scale * axis[1]
        );
        context.stroke();

    })
};


export const drawProjections = (context, origin, scale, polygons) => {
    context.setLineDash([]);
    context.lineWidth = 10;
    context.globalAlpha = 1;

    // Record projection processed to prevent duplicate processes.
    const processed = new Set();

    // Process all combinations of polygons.
    for (let i = 0; i < polygons.length; i++) {
        for (let j = 0; j < polygons.length; j++) {
            const [p1, p2] = [polygons[i], polygons[j]];

            // Skip process if polygons are the same.
            if (p1.identifier === p2.identifier)
                continue;

            // Skip process if polygons have been already processed.
            const process_id = [p1.identifier, p2.identifier].sort().join(" ");

            if (processed.has(process_id))
                continue;

            const axes = Array.from(new Set([...p1.axes, ...p2.axes]));

            for (let n = 0; n < axes.length; n++) {
                const [min1, max1] = p1.projection(axes[n]);
                const [min2, max2] = p2.projection(axes[n]);

                const collision = !(max1 < min2 || max2 < min1);
                context.strokeStyle = collision ? "#ff7974" : "#3f51b5";

                let x1, x2;
                const slope = (axes[n][0] !== 0)
                    ? axes[n][1] / axes[n][0] : 999;
                const c = (axes[n][0] !== 0) ? 0 : axes[n][1];


                x1 = (min1 * scale) / Math.sqrt((1 + slope**2));
                x2 = (max1 * scale) / Math.sqrt((1 + slope**2));

                context.beginPath();
                context.moveTo(origin.x + x1, origin.y + x1 * slope * -1 + c);
                context.lineTo(origin.x + x2, origin.y + x2 * slope * -1 + c);
                context.stroke();

                x1 = (min2 * scale) / Math.sqrt((1 + slope**2));
                x2 = (max2 * scale) / Math.sqrt((1 + slope**2));

                context.beginPath();
                context.moveTo(origin.x + x1, origin.y + x1 * slope * -1 + c);
                context.lineTo(origin.x + x2, origin.y + x2 * slope * -1 + c);
                context.stroke();

                if (collision) {
                    const minDelta = Math.max(min1, min2);
                    const maxDelta = Math.min(max1, max2);
                    x1 = (minDelta * scale) / Math.sqrt((1 + slope**2));
                    x2 = (maxDelta * scale) / Math.sqrt((1 + slope**2));

                    context.strokeStyle = "#b50200";

                    context.beginPath();
                    context.moveTo(origin.x + x1, origin.y + x1 * slope * -1 + c);
                    context.lineTo(origin.x + x2, origin.y + x2 * slope * -1 + c);
                    context.stroke();
                }
            }

            // Record process.
            processed.add(process_id)
        }
    }
};
