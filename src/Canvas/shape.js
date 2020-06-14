import * as utility from "./utility";

export class Polygon {

    constructor(context, ...vertices) {
        this.identifier = utility.generateGuid();
        this.context = context;
        this.vertices = vertices;
        this.edges = this._computeEdges();
        this.normals = this._computeNormals();
        this.axes = this._computeSeparationAxes();
        this._saved_vertices = null;

        // Record polygon elements created.
        this.shape = null;

        // Record projections.
        this.projections = {}
    }

    hover(x, y) {
        return this.context.isPointInPath(this.shape, x, y)
    }

    saveState() {
        this._saved_vertices = this.vertices;
    }

    move(delta) {
        this.vertices = this._saved_vertices.map((vertex) => {
            return [vertex[0] + delta.x, vertex[1] - delta.y];
        });

        // Reset projections.
        this.projections = {}

    }

    create(origin, scale) {
        this.shape = new Path2D();

        this.shape.moveTo(
            origin.x + scale * this.vertices[0][0],
            origin.y + scale * this.vertices[0][1] * -1
        );

        this.vertices.slice(1).forEach((vertex) => {
            this.shape.lineTo(
                origin.x + scale * vertex[0],
                origin.y + scale * vertex[1] * -1
            );
        });

        this.shape.closePath();
    }

    draw(hover = false) {
        if (this.shape === null)
            return;

        this.context.setLineDash([]);
        this.context.globalAlpha = 0.8;
        this.context.strokeStyle = "#575757";
        this.context.fillStyle = hover ? "#ffa85f" : "#d0dcff";

        this.context.fill(this.shape);
        this.context.stroke(this.shape);
    }

    _computeEdges() {
        const edges = [];
        const N = this.vertices.length;

        for (let i = 0; i < N; i++) {
            const vertex1 = this.vertices[i];
            const vertex2 = this.vertices[(i + 1) % N];
            edges.push([
                vertex2[0] - vertex1[0],
                vertex2[1] - vertex1[1]
            ]);
        }

        return edges;
    }

    _computeNormals() {
        return this.edges.map(
            (edge) => {
                const n = [-edge[1], edge[0]];
                const m = Math.sqrt((n[0]*n[0] + n[1]*n[1]));
                return [n[0]/m, n[1]/m];
            }
        )
    }

    _computeSeparationAxes() {
        // Invert normal when X axis is negative.
        const axes = this.normals.map((normal) =>
            (normal[0] < 0 || normal[1] <= -1)
                ? [-normal[0], -normal[1]] : normal
        );

        // Ensure that no duplicated axis are kept.
        return Array.from(new Set(axes))
    }

    projection(normal) {
        const normalId = normal.join();
        const result = this.projections[normalId];

        if (result !== undefined) {
            return [result[0], result[1]];
        }

        let [minimum, maximum] = [+Infinity, -Infinity];

        this.vertices.forEach((vertex) => {
            const projection = vertex[0] * normal[0] + vertex[1] * normal[1];
            minimum = Math.min(minimum, projection);
            maximum = Math.max(maximum, projection);
        });

        this.projections[normalId] = [minimum, maximum];
        return this.projections[normalId];
    }
}
