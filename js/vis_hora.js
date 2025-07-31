const map = L.map('markerMap').setView([-7.23, -35.88], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
const markerClusterGroup = L.markerClusterGroup({ maxClusterRadius: 35 }).addTo(map);

let rawData = [];

// Mapeamento do nome do dia para número do getDay()
const diasSemana = {
  'domingo': 0,
  'segunda': 1,
  'terça': 2,
  'quarta': 3,
  'quinta': 4,
  'sexta': 5,
  'sábado': 6
};

function updateMap() {
  const periodo = document.getElementById('periodSelect').value;
  const hora = document.getElementById('hourSelect').value;
  const dia = document.getElementById('daySelect').value;

  const referencia = new Date('2025-04-25T00:00:00'); 
  let dataLimite = null;

  if (periodo !== '0') {
    dataLimite = new Date(referencia.getTime() - periodo * 24 * 60 * 60 * 1000);
  }

  markerClusterGroup.clearLayers();

  rawData.forEach(item => {
    // Ajuste aqui o nome do campo com a data
    const dataRegistro = new Date(item.despachado);
    const horaRegistro = dataRegistro.getHours();
    const diaRegistro = dataRegistro.getDay();

    // Filtros
    if (
      (periodo === '0' || dataRegistro >= dataLimite) &&
      (hora === 'todos' || horaRegistro === parseInt(hora)) &&
      (dia === 'todos' || diaRegistro === diasSemana[dia])
    ) {
      if (item.latitude && item.longitude) {
        const marker = L.marker([item.latitude, item.longitude])
          .bindPopup(
            `<strong>Tipo:</strong> ${item.tipo}<br>` +
            `<strong>Bairro:</strong> ${item.bairro}<br>` +
            `<strong>Data:</strong> ${dataRegistro.toLocaleString()}`
          );
        markerClusterGroup.addLayer(marker);
      }
    }
  });
}

fetch('../json/vis_geral.json')
  .then(response => response.json())
  .then(data => {
    rawData = data;
    updateMap();
  });

document.getElementById('periodSelect').addEventListener('change', updateMap);
document.getElementById('hourSelect').addEventListener('change', updateMap);
document.getElementById('daySelect').addEventListener('change', updateMap);