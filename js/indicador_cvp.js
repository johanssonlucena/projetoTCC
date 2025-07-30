let rawData = [];

// Inicializa mapa de marcadores
const markerMap = L.map('markerMap').setView([-7.23, -35.88], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(markerMap);
let markerClusterGroup = L.markerClusterGroup({maxClusterRadius: 25}).addTo(markerMap);

const icons = {
    'a Transeunte': L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png', iconSize:[25,25]}),
    'em estabelecimento comercial': L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png', iconSize:[25,25]}),
    'em Residência': L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/pink-dot.png', iconSize:[25,25]}),
    'em posto de combustível': L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png', iconSize:[30,30]}),
    'em Transporte coletivo': L.icon({ iconUrl: 'https://maps.google.com/mapfiles/ms/icons/ltblue-dot.png', iconSize:[30,30]})
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

    markerClusterGroup.clearLayers();
    filtered
    .filter(d => selectedTypes.includes(d.subtipo))
    .forEach(d => {
        const marker = L.marker([d.latitude, d.longitude], { icon: icons[d.subtipo] })
            .bindPopup(
                `<strong>Tipo:</strong> Roubo ${d.subtipo}<br>` +
                `<strong>Bairro:</strong> ${d.bairro}<br>` +
                `<strong>Data:</strong> ${new Date(d.data).toLocaleString()}`
            );
        markerClusterGroup.addLayer(marker);
    });
}

fetch('../json/cvp.json')
    .then(res => res.json())
    .then(data => {
    rawData = data;
    updateMap();
    });

document.getElementById('periodSelect').addEventListener('change', updateMap);
document.querySelectorAll('.crime-filter').forEach(cb => cb.addEventListener('change', updateMap));