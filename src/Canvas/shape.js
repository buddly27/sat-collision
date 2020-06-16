import * as utility from "./utility";

export class Polygon {

    constructor(identifier, ...vertices) {
        this.identifier = identifier;
        this.vertices = vertices;

        // Compute axis of separations.
        const edges = utility.computeEdges(vertices);
        const normals = utility.computeNormals(edges);
        this.axes = utility.computeAxesOfSeparation(normals);

        // Record saved vertices to process polygon movement.
        this._savedVertices = null;

        // Record polygon elements created.
        this.shape = null;

        // Record projections.
        this.projections = {}
    }

    saveState() {
        this._savedVertices = this.vertices;
    }

    move(delta) {
        this.vertices = this._savedVertices.map((vertex) => {
            return [vertex[0] + delta.x, vertex[1] - delta.y];
        });

        // Reset projections.
        this.projections = {}
    }

    createShape(origin, scale) {
        this.shape = utility.createShape(origin, scale, this.vertices);
        return this.shape;
    }

    projection(normal) {
        const normalId = normal.join();
        const result = this.projections[normalId];

        if (result !== undefined) {
            return [result[0], result[1]];
        }

        this.projections[normalId] = utility.computeProjection(
            this.vertices, normal
        );
        return this.projections[normalId];
    }
}
