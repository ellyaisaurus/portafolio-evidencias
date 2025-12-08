// VARIABLES GLOBALES
let rawData = [];
let chartInstanceBar = null;
let chartInstancePie = null;
let tableInstance = null;

// Configuración de Chart.js
Chart.defaults.color = '#8FAD88';
Chart.defaults.font.family = "'Inter', sans-serif";
Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.05)';

// --------------------------------------------------------
// 1. PARSER CSV ROBUSTO (Solución al error de comillas)
// --------------------------------------------------------
function parseCSVLine(text) {
    let result = [];
    let cell = '';
    let quote = false;
    
    for (let i = 0; i < text.length; i++) {
        let char = text[i];
        if (char === '"') {
            quote = !quote; // Alternar estado de comilla
        } else if (char === ',' && !quote) {
            result.push(cell); // Fin de celda
            cell = '';
        } else {
            cell += char;
        }
    }
    result.push(cell);
    return result;
}

// --------------------------------------------------------
// 2. CARGA DE DATOS
// --------------------------------------------------------
async function cargarCSV() {
    try {
        const resp = await fetch("titanic.csv");
        if (!resp.ok) throw new Error("Error cargando archivo");
        const data = await resp.text();

        // Procesamiento línea por línea usando el parser robusto
        const lines = data.split("\n");
        // Omitir cabecera (index 0) y líneas vacías
        const parsedData = lines.slice(1)
            .filter(line => line.trim() !== "")
            .map(line => parseCSVLine(line));

        // Mapear a objetos para facilitar el filtrado
        // Estructura CSV: Id(0), Survived(1), Pclass(2), Name(3), Sex(4), Age(5), Fare(9)...
        rawData = parsedData.map(row => ({
            id: row[0],
            survived: row[1]?.trim(),
            pclass: row[2]?.trim(),
            name: row[3]?.replace(/"/g, ''), // Limpiar comillas extras del nombre
            sex: row[4]?.trim(),
            age: row[5] || "N/A",
            fare: row[9] || "0"
        }));

        console.log("Datos cargados correctamente:", rawData.length);
        
        // Inicializar Dashboard
        initDashboard();

    } catch (error) {
        console.error(error);
        alert("Error cargando titanic.csv. Verifica que el archivo esté en la raíz.");
    }
}

// --------------------------------------------------------
// 3. LÓGICA DEL DASHBOARD
// --------------------------------------------------------
function initDashboard() {
    // Ocultar loader
    const loader = document.getElementById('loader-overlay');
    loader.style.opacity = '0';
    setTimeout(() => loader.style.display = 'none', 500);

    // Listeners para filtros
    document.getElementById('filterSex').addEventListener('change', applyFilters);
    document.getElementById('filterClass').addEventListener('change', applyFilters);
    document.getElementById('filterSurvived').addEventListener('change', applyFilters);

    // Cargar todo inicialmente
    applyFilters();
}

function applyFilters() {
    const sexVal = document.getElementById('filterSex').value;
    const classVal = document.getElementById('filterClass').value;
    const survVal = document.getElementById('filterSurvived').value;

    // Filtrar datos
    let filteredData = rawData.filter(item => {
        const matchSex = sexVal === 'all' || item.sex === sexVal;
        const matchClass = classVal === 'all' || item.pclass === classVal;
        const matchSurv = survVal === 'all' || item.survived === survVal;
        return matchSex && matchClass && matchSurv;
    });

    updateKPIs(filteredData);
    updateCharts(filteredData);
    updateTable(filteredData);
}

// --------------------------------------------------------
// 4. ACTUALIZAR KPIS
// --------------------------------------------------------
function updateKPIs(data) {
    const total = data.length;
    const survived = data.filter(d => d.survived === '1').length;
    const men = data.filter(d => d.sex === 'male').length;
    const women = data.filter(d => d.sex === 'female').length;
    
    const rate = total > 0 ? ((survived / total) * 100).toFixed(1) : 0;

    // Actualizar Textos
    document.getElementById('totalPasajeros').innerText = total;
    document.getElementById('survivalRate').innerText = rate;
    document.getElementById('totalMen').innerText = men;
    document.getElementById('totalWomen').innerText = women;

    // Actualizar Barras de Progreso (Visual)
    document.getElementById('survivalBar').style.width = `${rate}%`;
    document.getElementById('menBar').style.width = total > 0 ? `${(men/total)*100}%` : '0%';
    document.getElementById('womenBar').style.width = total > 0 ? `${(women/total)*100}%` : '0%';
}

// --------------------------------------------------------
// 5. ACTUALIZAR GRÁFICAS (Chart.js)
// --------------------------------------------------------
function updateCharts(data) {
    // A. Gráfica Barras: Sobrevivientes vs Fallecidos por Sexo (del set filtrado)
    // Para que sea útil con los filtros, compararemos Hombres vs Mujeres del set actual
    const menSurvived = data.filter(d => d.sex === 'male' && d.survived === '1').length;
    const menDied = data.filter(d => d.sex === 'male' && d.survived === '0').length;
    const womenSurvived = data.filter(d => d.sex === 'female' && d.survived === '1').length;
    const womenDied = data.filter(d => d.sex === 'female' && d.survived === '0').length;

    const ctxBar = document.getElementById("chartSurvivalSex").getContext('2d');
    
    if (chartInstanceBar) chartInstanceBar.destroy();

    chartInstanceBar = new Chart(ctxBar, {
        type: "bar",
        data: {
            labels: ["Hombres", "Mujeres"],
            datasets: [
                {
                    label: "Sobrevivieron",
                    data: [menSurvived, womenSurvived],
                    backgroundColor: '#CBDF90', // Mindaro
                    borderRadius: 5
                },
                {
                    label: "Fallecieron",
                    data: [menDied, womenDied],
                    backgroundColor: 'rgba(255, 99, 132, 0.6)', // Rojo suave
                    borderRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { labels: { color: 'white' } }
            },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#8FAD88' } },
                x: { grid: { display: false }, ticks: { color: 'white' } }
            }
        }
    });

    // B. Gráfica Donut: Clases
    const c1 = data.filter(d => d.pclass === '1').length;
    const c2 = data.filter(d => d.pclass === '2').length;
    const c3 = data.filter(d => d.pclass === '3').length;

    const ctxPie = document.getElementById("chartPclass").getContext('2d');
    if (chartInstancePie) chartInstancePie.destroy();

    chartInstancePie = new Chart(ctxPie, {
        type: "doughnut",
        data: {
            labels: ["Clase 1", "Clase 2", "Clase 3"],
            datasets: [{
                data: [c1, c2, c3],
                backgroundColor: ["#CBDF90", "#7F9C96", "#4D7C8A"],
                borderColor: '#1B4079',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } }
            },
            cutout: '70%'
        }
    });
}

// --------------------------------------------------------
// 6. ACTUALIZAR TABLA INTERACTIVA (DataTables)
// --------------------------------------------------------
function updateTable(data) {
    // Si ya existe la tabla, limpiarla pero no destruirla completamente si no es necesario,
    // pero para cambios drásticos de datos es mejor recrear el cuerpo.
    
    // Convertir datos filtrados al formato array que DataTables espera
    const tableData = data.map(item => {
        // Badge para estado
        const statusBadge = item.survived === '1' 
            ? '<span class="badge bg-mindaro text-dark">Sobrevivió</span>' 
            : '<span class="badge bg-secondary">Falleció</span>';
            
        // Badge para clase
        let classBadge = '';
        if(item.pclass === '1') classBadge = '<span class="badge bg-warning text-dark">1ª VIP</span>';
        else if(item.pclass === '2') classBadge = '<span class="badge bg-info text-dark">2ª Media</span>';
        else classBadge = '<span class="badge bg-dark border border-secondary">3ª Gen</span>';

        return [
            item.id,
            `<span class="fw-bold">${item.name}</span>`,
            item.age,
            item.sex === 'male' ? '<i class="fa-solid fa-mars text-info"></i> Masc' : '<i class="fa-solid fa-venus text-danger"></i> Fem',
            classBadge,
            `$${parseFloat(item.fare).toFixed(2)}`,
            statusBadge
        ];
    });

    // Destruir tabla previa si existe
    if ($.fn.DataTable.isDataTable('#passengersTable')) {
        $('#passengersTable').DataTable().destroy();
    }

    // Inicializar DataTables
    tableInstance = $('#passengersTable').DataTable({
        data: tableData,
        columns: [
            { title: "ID" },
            { title: "Nombre" },
            { title: "Edad" },
            { title: "Género" },
            { title: "Clase" },
            { title: "Tarifa" },
            { title: "Estado" }
        ],
        pageLength: 10,
        lengthMenu: [5, 10, 25, 50],
        language: {
            url: "//cdn.datatables.net/plug-ins/1.13.4/i18n/es-ES.json"
        },
        dom: '<"d-flex justify-content-between mb-3"lf>rt<"d-flex justify-content-between mt-3"ip>',
        createdRow: function(row, data, dataIndex) {
            $(row).addClass('glass-row'); // Clase para hover effect si es necesario
        }
    });
}

// Iniciar
cargarCSV();