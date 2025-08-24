document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    const API_URL = 'http://127.0.0.1:8000/optimize-route';
    const CANVAS_SCALE = 5;
    const POINT_RADIUS = 5;
    const POINT_COLOR = '#007bff';
    const ROUTE_COLOR = '#28a745';
    const TEXT_COLOR = '#343a40';

    // --- STATE ---
    let locations = [];
    let nextLocationId = 0;

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

    // --- FUNCTIONS ---
    function addLocation() {
        const name = nameInput.value.trim();
        const x = parseFloat(xInput.value);
        const y = parseFloat(yInput.value);

        if (name && !isNaN(x) && !isNaN(y)) {
            locations.push({ id: nextLocationId++, name, x, y });
            clearInputs();
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

            if (!response.ok) {
                throw new Error(`API Error: ${response.statusText} (Status: ${response.status})`);
            }

            const result = await response.json();
            render(result.ordered_route);
            resultText.textContent = `Optimized route distance: ${result.total_distance.toFixed(2)} units`;
            
        } catch (error) {
            console.error('Error optimizing route:', error);
            resultText.textContent = `Error: Could not connect to the API. ${error.message}`;
        }
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
        
        // Draw points and labels
        locations.forEach(loc => {
            const scaledX = loc.x * CANVAS_SCALE;
            const scaledY = loc.y * CANVAS_SCALE;
            
            // Draw point
            ctx.beginPath();
            ctx.arc(scaledX, scaledY, POINT_RADIUS, 0, Math.PI * 2);
            ctx.fillStyle = POINT_COLOR;
            ctx.fill();

            // Draw label
            ctx.fillStyle = TEXT_COLOR;
            ctx.font = '12px Inter';
            ctx.fillText(loc.name, scaledX + 10, scaledY + 5);
        });

        // Draw route if available
        if (orderedRoute && orderedRoute.length > 1) {
            ctx.beginPath();
            ctx.strokeStyle = ROUTE_COLOR;
            ctx.lineWidth = 2;

            const startPoint = orderedRoute[0];
            ctx.moveTo(startPoint.x * CANVAS_SCALE, startPoint.y * CANVAS_SCALE);

            orderedRoute.slice(1).forEach(loc => {
                ctx.lineTo(loc.x * CANVAS_SCALE, loc.y * CANVAS_SCALE);
            });
            
            ctx.stroke();
        }
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