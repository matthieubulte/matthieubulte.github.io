const draw_grid = (function () {
    const canvas = document.getElementById('grid-canvas');
    const ctx = canvas.getContext('2d');

    // Set up the grid of nodes
    const nodes = [];
    const onodes = [];

    const rows = 50;
    const cols = 50;
    const nodeSize = 1 / rows;

    for (let row = 0; row < rows + 1; row++) {
        const rowNodes = [];
        const orowNodes = [];

        for (let col = 0; col < cols + 1; col++) {
            rowNodes.push({
                x: col * nodeSize,
                y: row * nodeSize,
            });
            orowNodes.push({
                x: col * nodeSize,
                y: row * nodeSize,
            });
        }

        nodes.push(rowNodes);
        onodes.push(orowNodes);
    }

    const l = 0.02;
    const eps = 0.001;
    // const dotSize = 2;

    // Draw the line in a loop, updating the control points
    // to create a wiggly effect
    function draw_grid() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = '#8a0f13';

        for (let row = 0; row < nodes.length; row++) {
            const rowNodes = nodes[row];
            const orowNodes = onodes[row];

            for (let col = 0; col < rowNodes.length; col++) {
                const node = rowNodes[col];
                const onode = orowNodes[col];

                // Update the position of the node
                node.x = l * onode.x + (1 - l) * node.x + eps * (Math.random() * 2 - 1);
                node.y = l * onode.y + (1 - l) * node.y + eps * (Math.random() * 2 - 1);

                // Draw a line from this node to the next node in the row
                if (col < rowNodes.length - 1) {
                    ctx.beginPath();
                    ctx.moveTo(canvas.width * node.x, canvas.height * node.y);
                    ctx.lineTo(canvas.width * rowNodes[col + 1].x, canvas.height * rowNodes[col + 1].y);
                    // ctx.beginPath();
                    // ctx.arc(canvas.width * node.x, canvas.height * node.y, dotSize/2, 0, Math.PI * 2);
                    // ctx.fill();
                    ctx.stroke();
                }

                // Draw a line from this node to the next node in the column
                if (row < nodes.length - 1) {
                    ctx.beginPath();
                    ctx.moveTo(canvas.width * node.x, canvas.height * node.y);
                    ctx.lineTo(canvas.width * nodes[row + 1][col].x, canvas.height * nodes[row + 1][col].y);
                    // ctx.beginPath();
                    // ctx.arc(canvas.width * node.x, canvas.height * node.y, dotSize/2, 0, Math.PI * 2);
                    // ctx.fill();
                    ctx.stroke();
                }
            }
        }
    }

    return draw_grid;
})();