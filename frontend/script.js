document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const API_URL = 'http://127.0.0.1:8000/optimize-route';
    const PADDING = 40; // Pixels of padding around the points
    const POINT_RADIUS = 5;
    const POINT_COLOR = '#007bff';
    const ROUTE_COLOR = '#28a745';
    const TEXT_COLOR = '#343a40';

    // --- STATE ---
    let locations = [];
    let nextLocationId = 0;
    // State for canvas transformations
    let scale = 1;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    let lastMouseX = 0;
    let lastMouseY = 0;

    // --- DOM ELEMENTS ---
    const nameInput = document.getElementById('name-input');
    const xInput = document.getElementById('x-input');
    const yInput = document.getElementById('y-input');
    const addBtn = document.getElementById('add-btn');
    const locationsList = document.getElementById('locations-list');
    const optimizeBtn = document.getElementById('optimize-btn');
    const resultText = document.getElementById('result-text');
    const canvas = document.getElementById('route-canvas');
    const ctx = canvas.getContext('2d');

    // --- EVENT LISTENERS ---
    addBtn.addEventListener('click', addLocation);
    optimizeBtn.addEventListener('click', optimizeRoute);
    // Canvas panning events
    canvas.addEventListener('mousedown', startPan);
    canvas.addEventListener('mousemove', pan);
    canvas.addEventListener('mouseup', endPan);
    canvas.addEventListener('mouseleave', endPan);

    // --- FUNCTIONS ---
    function addLocation() {
        const name = nameInput.value.trim();
        const x = parseFloat(xInput.value);
        const y = parseFloat(yInput.value);

        if (name && !isNaN(x) && !isNaN(y)) {
            locations.push({ id: nextLocationId++, name, x, y });
            clearInputs();
            autoFitCanvas();
            render();
        } else {
            alert('Please fill in all fields with valid values.');
        }
    }

    async function optimizeRoute() {
        if (locations.length < 2) {
            alert('Please add at least two locations to optimize.');
            return;
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ locations: locations.map(({name, x, y}) => ({name, x, y})) }),
            });

            if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

            const result = await response.json();
            autoFitCanvas(result.ordered_route);
            render(result.ordered_route);
            resultText.textContent = `Optimized route distance: ${result.total_distance.toFixed(2)} units`;
            
        } catch (error) {
            console.error('Error optimizing route:', error);
            resultText.textContent = `Error: Could not connect to the API. ${error.message}`;
        }
    }

    function autoFitCanvas(route = null) {
        const points = route || locations;
        if (points.length === 0) return;

        let minX = points[0].x, maxX = points[0].x;
        let minY = points[0].y, maxY = points[0].y;

        for (const p of points) {
            minX = Math.min(minX, p.x);
            maxX = Math.max(maxX, p.x);
            minY = Math.min(minY, p.y);
            maxY = Math.max(maxY, p.y);
        }

        const dataWidth = maxX - minX;
        const dataHeight = maxY - minY;

        if (dataWidth === 0 && dataHeight === 0) {
            scale = 1;
            offsetX = canvas.width / 2 - minX;
            offsetY = canvas.height / 2 - minY;
            return;
        }

        const scaleX = (canvas.width - PADDING * 2) / dataWidth;
        const scaleY = (canvas.height - PADDING * 2) / dataHeight;
        scale = Math.min(scaleX, scaleY);

        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;

        offsetX = (canvas.width / 2) - (centerX * scale);
        offsetY = (canvas.height / 2) - (centerY * scale);
    }

    function render(orderedRoute = null) {
        renderLocationsList();
        drawOnCanvas(orderedRoute);
    }
    
    function renderLocationsList() {
        locationsList.innerHTML = '';
        locations.forEach(loc => {
            const li = document.createElement('li');
            li.innerHTML = `<span>${loc.name} (${loc.x}, ${loc.y})</span>`;
            locationsList.appendChild(li);
        });
    }

    function drawOnCanvas(orderedRoute) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const transform = (p) => ({
            x: p.x * scale + offsetX,
            y: p.y * scale + offsetY
        });

        // Draw points and labels
        locations.forEach(loc => {
            const p = transform(loc);
            ctx.beginPath();
            ctx.arc(p.x, p.y, POINT_RADIUS, 0, Math.PI * 2);
            ctx.fillStyle = POINT_COLOR;
            ctx.fill();
            ctx.fillStyle = TEXT_COLOR;
            ctx.font = '12px Inter';
            ctx.fillText(loc.name, p.x + 10, p.y + 5);
        });

        // Draw route if available
        if (orderedRoute && orderedRoute.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = ROUTE_COLOR;
            ctx.lineWidth = 2;
            const startPoint = transform(orderedRoute[0]);
            ctx.moveTo(startPoint.x, startPoint.y);
            orderedRoute.slice(1).forEach(loc => {
                const p = transform(loc);
                ctx.lineTo(p.x, p.y);
            });
            ctx.stroke();
        }
    }

    function startPan(e) {
        isDragging = true;
        lastMouseX = e.offsetX;
        lastMouseY = e.offsetY;
    }

    function pan(e) {
        if (!isDragging) return;
        const dx = e.offsetX - lastMouseX;
        const dy = e.offsetY - lastMouseY;
        offsetX += dx;
        offsetY += dy;
        lastMouseX = e.offsetX;
        lastMouseY = e.offsetY;
        render(); // Re-render with new offsets
    }

    function endPan() {
        isDragging = false;
    }
    
    function clearInputs() {
        nameInput.value = '';
        xInput.value = '';
        yInput.value = '';
        nameInput.focus();
    }
    
    // Initial render
    render();
});
    