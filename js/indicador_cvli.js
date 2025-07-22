let rawData = [];

// Inicializa mapa de marcadores
const markerMap = L.map('markerMap').setView([-7.23, -35.88], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(markerMap);
let markerGroup = L.layerGroup().addTo(markerMap);

const icons = {
    'Homicídio doloso': L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', iconSize:[32,32]}),
    'Latrocínio': L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png', iconSize:[35,35]}),
    'Feminicídio': L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/pink-dot.png', iconSize:[42,42]}),
    'Morte decorrente de Confronto Policial': L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png', iconSize:[42,42]})
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
    .filter(d => selectedTypes.includes(d.tipo))
    .forEach(d => {
        L.marker([d.latitude, d.longitude], { icon: icons[d.tipo] })
        .bindPopup(
            `<strong>Tipo:</strong> ${d.tipo}<br>` +
            `<strong>Bairro:</strong> ${d.bairro}<br>` +
            `<strong>Data:</strong> ${new Date(d.data).toLocaleString()}`
        )
        .addTo(markerGroup);
    });
}

fetch('../json/cvli.json')
    .then(res => res.json())
    .then(data => {
    rawData = data;
    updateMap();
    });

document.getElementById('periodSelect').addEventListener('change', updateMap);
document.querySelectorAll('.crime-filter').forEach(cb => cb.addEventListener('change', updateMap));