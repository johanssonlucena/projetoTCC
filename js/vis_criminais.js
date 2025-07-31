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
    filtered = filtered.filter(d => d.tipo === bairroSelecionado);
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

function preencherSelectBairros() {
  const select = document.getElementById('bairroSelect');
  const bairrosOrdenados = [...bairrosUnicos].sort();

  bairrosOrdenados.forEach(tipo => {
    const option = document.createElement('option');
    option.value = tipo;
    option.textContent = tipo;
    select.appendChild(option);
  });
}

fetch('../json/vis_geral.json')
  .then(res => res.json())
  .then(data => {
    rawData = data;

    // Preencher lista de bairros únicos
    rawData.forEach(d => {
      if (d.tipo) {
        bairrosUnicos.add(d.tipo);
      }
    });

    preencherSelectBairros();
    updateMap();
  });

// Eventos de mudança nos selects
document.getElementById('periodSelect').addEventListener('change', updateMap);
document.getElementById('bairroSelect').addEventListener('change', updateMap);
