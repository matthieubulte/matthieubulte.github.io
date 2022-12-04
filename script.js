(function () {
    const grid_canvas = document.querySelector('#grid-canvas');    
    const torus_canvas = document.querySelector('#torus-canvas');
    torus_canvas.classList.toggle('hidden');
    grid_canvas.classList.toggle('hidden');

    let animation = "";

    function draw() {
        draw_grid();
        draw_torus();

        // Request another frame
        requestAnimationFrame(draw);
    }

    // Start the animation
    requestAnimationFrame(draw);

    document.querySelector("#header p").addEventListener('click', function () {
        if (animation === 'torus') {
            grid_canvas.classList.toggle('hidden');
            torus_canvas.classList.toggle('hidden');
            animation = 'grid';
         } else if (animation === 'grid') {
            grid_canvas.classList.toggle('hidden');
            animation = '';
         } else {
            torus_canvas.classList.toggle('hidden');  
            animation = 'torus';
         }
    });
})();