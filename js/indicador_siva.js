let rawData = [];

// Inicializa mapa de marcadores
const markerMap = L.map('markerMap').setView([-7.23, -35.88], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(markerMap);
let markerGroup = L.layerGroup().addTo(markerMap);

const icons = {
    'Roubo de Automóvel': L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', iconSize:[22,22]}),
    'Roubo de Motocicleta': L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png', iconSize:[22,22]}),
    'Furto de Motocicleta': L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png', iconSize:[22,22]}),
    'Furto de Automóvel': L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png', iconSize:[22,22]}),
    'Roubo de Caminhão': L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/ltblue-dot.png', iconSize:[30,30]}),
    'Furto de Caminhão': L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png', iconSize:[30,30]})
};

function updateMap() {
    const daysAgo = parseInt(document.getElementById('periodSelect').value, 10);
    const selectedTypes = Array.from(document.querySelectorAll('.crime-filter:checked')).map(cb => cb.value);
    let filtered;

    if (daysAgo === 0) {
    filtered = rawData;
    } else {
    const cutoff = new Date(1745550000000 - daysAgo * 86400000);
    filtered = rawData.filter(d => new Date(d.data) >= cutoff);
    }

    markerGroup.clearLayers();
    filtered
    .filter(d => selectedTypes.includes(d.tipo2))
    .forEach(d => {
        L.marker([d.latitude, d.longitude], { icon: icons[d.tipo2] })
        .bindPopup(
            `<strong>Tipo:</strong> ${d.tipo2}<br>` +
            `<strong>Bairro:</strong> ${d.bairro}<br>` +
            `<strong>Data:</strong> ${new Date(d.data).toLocaleString()}`
        )
        .addTo(markerGroup);
    });
}

fetch('../json/siva.json')
    .then(res => res.json())
    .then(data => {
    rawData = data;
    updateMap();
    });

document.getElementById('periodSelect').addEventListener('change', updateMap);
document.querySelectorAll('.crime-filter').forEach(cb => cb.addEventListener('change', updateMap));