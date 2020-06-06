import * as utility from "./utility";

export class Polygon {

    constructor(context, ...vertices) {
        this.identifier = utility.generateGuid();
        this.context = context;
        this.vertices = vertices;
        this._saved_vertices = null;

        // Record polygon elements created.
        this.shape = null;
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

    edges() {
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

    normals() {
        return this.edges().map((edge) => [-edge[1], edge[0]])
    }

}
