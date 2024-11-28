document.getElementById("fileInput").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) {
    alert("Por favor, selecione um arquivo.");
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);

    // Processa as datas no formato correto
    const processedData = jsonData.map((row) => {
      if (row["Data"]) {
        const excelDate = parseFloat(row["Data"]);
        if (!isNaN(excelDate)) {
          const parsedDate = XLSX.SSF.parse_date_code(excelDate);
          row["Data"] = `${parsedDate.d
            .toString()
            .padStart(2, "0")}/${parsedDate.m.toString().padStart(2, "0")}/${
            parsedDate.y
          }`;
        }
      }
      return row;
    });

    // Atualiza o nome do gerente, gera o relatório e o gráfico
    generateManagerName(processedData); // Chama para exibir o nome do gerente
    generateReport(processedData);
    generateChart(processedData);
  };

  reader.readAsArrayBuffer(file);
});

// Função para exibir o nome do gerente
function generateManagerName(data) {
  // Verifica se a coluna "Gerente" existe no arquivo
  if (!data.length || !data[0]["Gerente"]) {
    document.getElementById("managerName").textContent = "Não especificado";
    return;
  }

  // Busca o nome do gerente (assume que é o mesmo em todas as linhas)
  const managerName = data[0]["Gerente"];
  document.getElementById("managerName").textContent = managerName;
}

function generateReport(data) {
  if (!data.length) {
    document.getElementById("reportContainer").innerHTML =
      "<p>O arquivo está vazio ou inválido.</p>";
    return;
  }

  let tableHtml = "<table><thead><tr>";
  // Cabeçalhos da tabela
  Object.keys(data[0]).forEach((key) => {
    tableHtml += `<th>${key}</th>`;
  });
  tableHtml += "</tr></thead><tbody>";

  // Linhas da tabela
  data.forEach((row) => {
    tableHtml += "<tr>";
    Object.values(row).forEach((value) => {
      tableHtml += `<td>${value}</td>`;
    });
    tableHtml += "</tr>";
  });

  tableHtml += "</tbody></table>";

  document.getElementById("reportContainer").innerHTML = tableHtml;
}

let chart; // Variável global para o gráfico

function generateChart(data) {
  const reportType = document.getElementById("reportType").value; // Obtém o valor selecionado no <select>

  if (reportType === "financeiro_mes") {
    generateFinancialChart_mes(data); // Chama a função específica para o gráfico financeiro
  } else if (reportType === "vendas") {
    generateSalesChart(data); // Chama a função para o gráfico de vendas
  } else {
    generateFinancialChart_ano(data);
  }
}

// Exemplo de como pode ser uma função para o gráfico financeiro
function generateFinancialChart_mes(data) {
  // Lógica para gerar o gráfico financeiro
  console.log("Gerando gráfico financeiro", data);
}

function generateFinancialChart_ano(data) {
  // Lógica para gerar o gráfico financeiro
  console.log("Gerando gráfico financeiro", data);
}

// Exemplo de como pode ser uma função para o gráfico de vendas
function generateSalesChart(data) {
  // Lógica para gerar o gráfico de vendas
  console.log("Gerando gráfico de vendas", data);
}

// Função para gerar o gráfico financeiro
function generateFinancialChart_mes(data) {
  const chartType = document.getElementById("chartType").value;

  // Agrupar os dados por mês e filial
  const monthlyData = {};

  data.forEach((row) => {
    // Divida a data para extrair corretamente o mês
    const dateParts = row["Data"].split("/"); // Data no formato "dd/mm/yyyy"
    const month = dateParts[1]; // Pega o mês (index 1, que é o segundo valor após a barra '/')
    const filial = row["Filial"];
    const lucro = row["Lucro"];

    if (!monthlyData[month]) {
      monthlyData[month] = {};
    }
    if (!monthlyData[month][filial]) {
      monthlyData[month][filial] = 0;
    }

    monthlyData[month][filial] += lucro; // Somar lucros para cada filial por mês
  });

  // Preparar os dados para o gráfico
  const labels = Object.keys(monthlyData); // Meses
  const filialNames = [...new Set(data.map((row) => row["Filial"]))]; // Filiais únicas

  // Preparar as barras para cada filial
  const datasets = filialNames.map((filial) => {
    const dataForFilial = labels.map(
      (month) => monthlyData[month][filial] || 0
    ); // Lucros por mês para cada filial
    return {
      label: filial,
      data: dataForFilial,
      backgroundColor: getRandomColor(),
      borderColor: getRandomColor(),
      borderWidth: 1,
    };
  });

  // Verificação de dados
  if (
    !labels.length ||
    datasets.every((dataset) => dataset.data.every((value) => value === 0))
  ) {
    alert("Não foi possível gerar o gráfico. Verifique os dados.");
    return;
  }

  // Destruir o gráfico anterior, se existir
  if (chart) chart.destroy();

  const ctx = document.getElementById("dataChart").getContext("2d");
  chart = new Chart(ctx, {
    type: chartType,
    data: {
      labels: labels, // Meses no eixo X
      datasets: datasets, // Dados de cada filial
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Lucro por Filial e Mês",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.raw}`; // Exibe o mês e o lucro
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Meses", // Eixo X representando meses
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Lucro", // Eixo Y representando o lucro
          },
        },
      },
    },
  });
}

function generateFinancialChart_ano(data) {
  const chartType = document.getElementById("chartType").value;

  // Agrupar os dados por ano e filial
  const yearlyData = {};

  data.forEach((row) => {
    // Dividir a data para extrair corretamente o ano
    const dateParts = row["Data"].split("/"); // Data no formato "dd/mm/yyyy"
    const year = dateParts[2]; // Pega o ano (index 2, que é o terceiro valor após a barra '/')
    const filial = row["Filial"];
    const lucro = row["Lucro"];

    // Inicializar o objeto para o ano, caso não exista
    if (!yearlyData[year]) {
      yearlyData[year] = {};
    }
    // Inicializar o objeto para a filial, caso não exista
    if (!yearlyData[year][filial]) {
      yearlyData[year][filial] = 0;
    }

    // Somar lucros para cada filial por ano
    yearlyData[year][filial] += lucro;
  });

  // Preparar os dados para o gráfico
  const labels = Object.keys(yearlyData); // Anos
  const filialNames = [...new Set(data.map((row) => row["Filial"]))]; // Filiais únicas

  // Preparar as barras para cada filial
  const datasets = filialNames.map((filial) => {
    const dataForFilial = labels.map(
      (year) => yearlyData[year][filial] || 0 // Lucros por ano para cada filial
    );
    return {
      label: filial,
      data: dataForFilial,
      backgroundColor: getRandomColor(), // Cor aleatória para cada filial
      borderColor: getRandomColor(),
      borderWidth: 1,
    };
  });

  // Verificação de dados
  if (
    !labels.length ||
    datasets.every((dataset) => dataset.data.every((value) => value === 0))
  ) {
    alert("Não foi possível gerar o gráfico. Verifique os dados.");
    return;
  }

  // Destruir o gráfico anterior, se existir
  if (chart) chart.destroy();

  const ctx = document.getElementById("dataChart").getContext("2d");
  chart = new Chart(ctx, {
    type: chartType,
    data: {
      labels: labels, // Anos no eixo X
      datasets: datasets, // Dados de cada filial
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Lucro por Filial e Ano", // Título do gráfico
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.label}: ${context.raw}`; // Exibe o ano e o lucro
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Ano", // Eixo X representando anos
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Lucro", // Eixo Y representando o lucro
          },
        },
      },
    },
  });
}
// Função para gerar o gráfico de vendas
function generateSalesChart(data) {
  const chartType = document.getElementById("chartType").value; // Obtém o tipo de gráfico selecionado

  // Agrupar os dados por mês e pizza
  const monthlyData = {};

  data.forEach((row) => {
    // Divida a data para extrair corretamente o mês
    const dateParts = row["Data"].split("/"); // Data no formato "dd/mm/yyyy"
    const month = dateParts[1]; // Pega o mês (index 1, que é o segundo valor após a barra '/')
    const pizza = row["Pizzas"];
    const lucro = row["Lucro"];

    if (!monthlyData[month]) {
      monthlyData[month] = {};
    }
    if (!monthlyData[month][pizza]) {
      monthlyData[month][pizza] = 0;
    }

    monthlyData[month][pizza] += lucro; // Somar lucros para cada pizza por mês
  });

  // Preparar os dados para o gráfico
  const labels = Object.keys(monthlyData); // Meses
  const pizzaNames = [...new Set(data.map((row) => row["Pizzas"]))]; // Pizzas únicas

  // Preparar as barras para cada pizza
  const datasets = pizzaNames.map((pizza) => {
    const dataForPizza = labels.map((month) => monthlyData[month][pizza] || 0); // Lucros por mês para cada pizza
    return {
      label: pizza,
      data: dataForPizza,
      backgroundColor: getRandomColor(), // Cor aleatória para cada pizza
      borderColor: getRandomColor(),
      borderWidth: 1,
    };
  });

  // Verificação de dados
  if (
    !labels.length ||
    datasets.every((dataset) => dataset.data.every((value) => value === 0))
  ) {
    alert("Não foi possível gerar o gráfico. Verifique os dados.");
    return;
  }

  // Destruir o gráfico anterior, se existir
  if (chart) chart.destroy();

  const ctx = document.getElementById("dataChart").getContext("2d");
  chart = new Chart(ctx, {
    type: chartType, // Tipo de gráfico selecionado
    data: {
      labels: labels, // Meses no eixo X
      datasets: datasets, // Dados de cada pizza
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "Vendas por Pizza e Mês",
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.raw}`; // Exibe a pizza e o lucro
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Meses", // Eixo X representando meses
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Lucro", // Eixo Y representando o lucro
          },
        },
      },
    },
  });
}

// Função para gerar cores aleatórias para as barras
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Atualiza o gráfico quando o tipo de gráfico é alterado
document.getElementById("chartType").addEventListener("change", () => {
  if (chart) chart.destroy(); // Remove o gráfico existente
  document.getElementById("fileInput").dispatchEvent(new Event("change")); // Reprocessa os dados
});


function filterDataByDate(data, startDate, endDate) {
  return data.filter((row) => {
    if (!row["Data"]) return false; // Ignorar linhas sem data
    const [day, month, year] = row["Data"].split("/"); // Supondo formato "dd/mm/yyyy"
    const rowDate = new Date(`${year}-${month}-${day}`);
    return rowDate >= startDate && rowDate <= endDate;
  });
}


let loadedData = [];

document.getElementById("fileInput").addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (!file) {
    alert("Por favor, selecione um arquivo.");
    return;
  }

  // Declare o 'reader' antes de usá-lo
  const reader = new FileReader();

  // Defina o que deve ocorrer quando o arquivo for carregado
  reader.onload = (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet);

    // Processa as datas no formato correto
    loadedData = jsonData.map((row) => {
      if (row["Data"]) {
        const excelDate = parseFloat(row["Data"]);
        if (!isNaN(excelDate)) {
          const parsedDate = XLSX.SSF.parse_date_code(excelDate);
          row["Data"] = `${parsedDate.d
            .toString()
            .padStart(2, "0")}/${parsedDate.m
            .toString()
            .padStart(2, "0")}/${parsedDate.y}`;
        }
      }
      return row;
    });

    // Atualiza o nome do gerente, gera o relatório e o gráfico com os dados completos
    generateManagerName(loadedData);
    generateReport(loadedData);
    generateChart(loadedData);
  };

  // Lê o arquivo como um array buffer
  reader.readAsArrayBuffer(file);
});

document.getElementById("filterButton").addEventListener("click", () => {
  const startDate = new Date(document.getElementById("startDate").value);
  const endDate = new Date(document.getElementById("endDate").value);

  if (isNaN(startDate) || isNaN(endDate)) {
    alert("Por favor, insira datas válidas para o filtro.");
    return;
  }

  if (startDate > endDate) {
    alert("A data inicial deve ser anterior ou igual à data final.");
    return;
  }

  // Use a variável global `loadedData` para aplicar o filtro
  const filteredData = filterDataByDate(loadedData, startDate, endDate);

  if (!filteredData.length) {
    alert("Nenhum dado encontrado para o intervalo de datas especificado.");
    return;
  }

  // Gera o relatório e o gráfico com os dados filtrados
  generateReport(filteredData);
  generateChart(filteredData);
});
