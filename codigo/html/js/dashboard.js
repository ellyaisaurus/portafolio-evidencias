document.addEventListener('DOMContentLoaded', function() {
  const grid = GridStack.init({
    float: true,
    cellHeight: 160,
    margin: 10,
    disableOneColumnMode: false,
    minRow: 1
  });

  const widgets = [
    {
      w: 4, h: 2,
      content: `
        <img src="img/balance.jpeg" alt="Balance General" class="card-img">
        <div class="gs-title">Balance General</div>
        <p>Activos: $200,000<br>Pasivos: $150,000</p>
        <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#modalBalance">Ver detalle</button>
      `
    },
    {
      w: 4, h: 2,
      content: `
        <img src="img/estado.jpeg" alt="Estado Resultados" class="card-img">
        <div class="gs-title">Estado de Resultados</div>
        <p>Ingresos: $65,000<br>Gastos: $52,800</p>
        <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#modalResultados">Ver detalle</button>
      `
    },
    {
      w: 4, h: 2,
      content: `
        <img src="img/flujo.png" alt="Flujo de Efectivo" class="card-img">
        <div class="gs-title">Flujo de Efectivo</div>
        <p>Entradas: $18,100<br>Salidas: $11,700</p>
        <button class="btn btn-sm btn-primary" data-bs-toggle="modal" data-bs-target="#modalFlujo">Ver detalle</button>
      `
    },  
    {
      w: 12, h: 2,
      content: `
        <img src="img/kpi.avif" alt="Indicador KPI" class="card-img">
        <div class="gs-title">Indicadores KPI</div>
        <ul class="mb-0">
          <li>Liquidez: 1.8</li>
          <li>Rentabilidad: 12.4%</li>
          <li>Margen Neto: 9.3%</li>
        </ul>
      `
    }
  ];

  widgets.forEach(w => {
    grid.addWidget({
      w: w.w,
      h: w.h,
      content: `<div class="grid-stack-item-content">${w.content}</div>`
    });
  });
});
