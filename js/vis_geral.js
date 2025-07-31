let rawData = [];

const markerMap = L.map('markerMap').setView([-7.23, -35.88], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(markerMap);
const markerClusterGroup = L.markerClusterGroup({ maxClusterRadius: 40 }).addTo(markerMap);

function updateMap() {
    const daysAgo = parseInt(document.getElementById('periodSelect').value, 10);
    let filtered = rawData;

    if (daysAgo !== 0) {
    const reference = new Date('2025-04-25T00:00:00');
    const cutoff = new Date(reference.getTime() - daysAgo * 86400000);
    filtered = rawData.filter(d => new Date(d.data) >= cutoff);
    }

    markerClusterGroup.clearLayers();
    filtered.forEach(d => {
    if (d.latitude && d.longitude) {
        const marker = L.marker([d.latitude, d.longitude]);
        marker.bindPopup(
        `<strong>Tipo:</strong> ${d.tipo}<br>` +
        `<strong>Bairro:</strong> ${d.bairro}<br>` +
        `<strong>Data:</strong> ${new Date(d.despachado).toLocaleString()}<br>`
        );
        markerClusterGroup.addLayer(marker);
    }
    });
}

fetch('../json/vis_geral.json')
    .then(res => res.json())
    .then(data => {
    rawData = data;
    updateMap();
    });

document.getElementById('periodSelect').addEventListener('change', updateMap);