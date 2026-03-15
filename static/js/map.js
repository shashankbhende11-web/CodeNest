let map;
let markers = [];
let routingPolyline = null;

// Initialize Google Maps
function initMap() {
    // Center point of the hospital
    const center = MAP_CONFIG.hospitalCenter;

    map = new google.maps.Map(document.getElementById("hospital-map"), {
        center: center,
        zoom: 18,
        mapTypeId: "roadmap",
        disableDefaultUI: true, // Clean interface
        zoomControl: true,
        // Optional: Custom styling for a clean look
        styles: [
            {
                featureType: "poi.business",
                stylers: [{ visibility: "off" }]
            },
            {
                featureType: "transit",
                elementType: "labels.icon",
                stylers: [{ visibility: "off" }]
            }
        ]
    });

    // Add main hospital marker
    const mainMarker = new google.maps.Marker({
        position: center,
        map: map,
        icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: "#0d6efd",
            fillOpacity: 0.2,
            strokeColor: "#0d6efd",
            strokeWeight: 2,
            scale: 25
        },
        title: MAP_CONFIG.hospitalName
    });

    const infoWindow = new google.maps.InfoWindow();

    // Set up list interaction
    const deptItems = document.querySelectorAll('.dept-item');
    
    deptItems.forEach(item => {
        const lat = parseFloat(item.getAttribute('data-lat'));
        const lng = parseFloat(item.getAttribute('data-lng'));
        const deptName = item.querySelector('.fw-medium').textContent;
        const roomInfo = item.querySelector('small').textContent;
        const roomNum = item.getAttribute('data-room');
        const floorNum = item.getAttribute('data-floor');
        
        const position = { lat, lng };

        // Create marker
        const marker = new google.maps.Marker({
            position: position,
            map: map,
            title: deptName,
            animation: google.maps.Animation.DROP,
            icon: {
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
            }
        });
        
        markers.push(marker);

        const contentString = `
            <div class="p-2">
                <h6 class="fw-bold mb-1 text-primary">${deptName}</h6>
                <p class="small text-muted mb-2">${roomInfo}</p>
                <button class="btn btn-sm btn-primary w-100" onclick="simulateDirections(${lat}, ${lng}, '${deptName}', '${roomNum}', '${floorNum}')">
                    Navigate Here
                </button>
            </div>
        `;

        marker.addListener('click', () => {
            infoWindow.setContent(contentString);
            infoWindow.open(map, marker);
            highlightListItem(item);
        });

        // List item click
        item.addEventListener('click', () => {
            map.panTo(position);
            map.setZoom(19);
            infoWindow.setContent(contentString);
            infoWindow.open(map, marker);
            highlightListItem(item);
            simulateDirections(lat, lng, deptName, roomNum, floorNum);
        });
    });

    // Search Box Logic
    const searchInput = document.getElementById('map-search');
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        
        deptItems.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(term)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    });

    // Clear Route
    document.getElementById('clear-route').addEventListener('click', () => {
        if (routingPolyline) {
            routingPolyline.setMap(null);
            routingPolyline = null;
        }
        document.getElementById('route-info').classList.add('d-none');
        resetListHighlights();
        map.panTo(center);
        map.setZoom(18);
        infoWindow.close();
    });
}

function highlightListItem(activeItem) {
    const items = document.querySelectorAll('.dept-item');
    items.forEach(i => {
        i.classList.remove('active', 'bg-primary', 'text-white');
        const smallText = i.querySelector('div small');
        if (smallText) {
            smallText.classList.replace('text-white-50', 'text-muted');
        }
    });

    activeItem.classList.add('active', 'bg-primary', 'text-white');
    const smallActiveText = activeItem.querySelector('div small');
    if (smallActiveText) {
        smallActiveText.classList.replace('text-muted', 'text-white-50');
    }
}

function resetListHighlights() {
    const items = document.querySelectorAll('.dept-item');
    items.forEach(i => {
        i.classList.remove('active', 'bg-primary', 'text-white');
        const smallText = i.querySelector('div small');
        if (smallText) {
            smallText.classList.replace('text-white-50', 'text-muted');
        }
    });
}

// Simulate routing from Main Entrance to Dept (since real indoor mapping requires private maps)
window.simulateDirections = function(destLat, destLng, deptName, roomNum, floorNum) {
    // Clear existing
    if (routingPolyline) {
        routingPolyline.setMap(null);
    }

    const startPoint = { 
        lat: MAP_CONFIG.hospitalCenter.lat - 0.0005, // Slight offset for "entrance"
        lng: MAP_CONFIG.hospitalCenter.lng 
    };
    const endPoint = { lat: destLat, lng: destLng };

    // Simple direct line simulation (In real app, use Google Maps Directions Service API)
    const flightPlanCoordinates = [
        startPoint,
        MAP_CONFIG.hospitalCenter, // Goto center first
        endPoint
    ];

    routingPolyline = new google.maps.Polyline({
        path: flightPlanCoordinates,
        geodesic: true,
        strokeColor: "#20c997", // Success Teal
        strokeOpacity: 1.0,
        strokeWeight: 4,
        icons: [{
            icon: { path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW },
            offset: '100%'
        }]
    });

    routingPolyline.setMap(map);

    // Update UI
    const routeInfo = document.getElementById('route-info');
    routeInfo.classList.remove('d-none');
    
    document.getElementById('route-target').textContent = `${deptName} (Room ${roomNum}, Floor ${floorNum})`;
    
    // Animate map view to fit route
    const bounds = new google.maps.LatLngBounds();
    flightPlanCoordinates.forEach(pos => bounds.extend(pos));
    map.fitBounds(bounds);
    
    // Optional: simulate user movement along path using timers
};
