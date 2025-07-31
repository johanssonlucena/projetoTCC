let rawData = [];
let bairrosUnicos = new Set();

const markerMap = L.map('markerMap').setView([-7.23, -35.88], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(markerMap);
const markerClusterGroup = L.markerClusterGroup({ maxClusterRadius: 30 }).addTo(markerMap);

function updateMap() {
  const daysAgo = parseInt(document.getElementById('periodSelect').value, 10);
  const bairroSelecionado = document.getElementById('bairroSelect').value;

  let filtered = rawData;

  if (daysAgo !== 0) {
    const reference = new Date('2025-04-25T00:00:00');
    const cutoff = new Date(reference.getTime() - daysAgo * 86400000);
    filtered = filtered.filter(d => new Date(d.data) >= cutoff);
  }

  if (bairroSelecionado !== 'todos') {
    filtered = filtered.filter(d => d.bairro === bairroSelecionado);
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

/*  Essa Opção agrupa o zoom para os o bairro selecinado, porém temos problemas com latitudde e longitude
markerClusterGroup.clearLayers();

const bairroMarkers = [];

filtered.forEach(d => {
  if (d.latitude && d.longitude) {
    const latLng = L.latLng(d.latitude, d.longitude);
    const marker = L.marker(latLng);
    marker.bindPopup(
      `<strong>Tipo:</strong> ${d.tipo}<br>` +
      `<strong>Bairro:</strong> ${d.bairro}<br>` +
      `<strong>Data:</strong> ${new Date(d.despachado).toLocaleString()}<br>`
    );
    markerClusterGroup.addLayer(marker);
    bairroMarkers.push(latLng);
  }
});

// Se tiver marcadores no bairro, ajusta o mapa para eles
if (bairroMarkers.length > 0) {
  const bounds = L.latLngBounds(bairroMarkers);
  markerMap.fitBounds(bounds, { padding: [20, 20] });
}
*/

function preencherSelectBairros() {
  const select = document.getElementById('bairroSelect');
  const bairrosOrdenados = [...bairrosUnicos].sort();

  bairrosOrdenados.forEach(bairro => {
    const option = document.createElement('option');
    option.value = bairro;
    option.textContent = bairro;
    select.appendChild(option);
  });
}

fetch('../json/vis_geral.json')
  .then(res => res.json())
  .then(data => {
    rawData = data;

    // Preencher lista de bairros únicos
    rawData.forEach(d => {
      if (d.bairro) {
        bairrosUnicos.add(d.bairro);
      }
    });

    preencherSelectBairros();
    updateMap();
  });

// Eventos de mudança nos selects
document.getElementById('periodSelect').addEventListener('change', updateMap);
document.getElementById('bairroSelect').addEventListener('change', updateMap);
