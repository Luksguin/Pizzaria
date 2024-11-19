function validarCPF(cpf) {
  console.log("Validando CPF:", cpf);
  if (cpf.length !== 11) {
    return false;
  }
  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }
  let soma = 0;
  let peso = 10;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * peso--;
  }
  let digito1 = 11 - (soma % 11);
  if (digito1 === 10 || digito1 === 11) {
    digito1 = 0;
  }
  soma = 0;
  peso = 11;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * peso--;
  }
  let digito2 = 11 - (soma % 11);
  if (digito2 === 10 || digito2 === 11) {
    digito2 = 0;
  }
  return (
    digito1 === parseInt(cpf.charAt(9)) && digito2 === parseInt(cpf.charAt(10))
  );
}

let orders = [];

function togglePaymentFields() {
  var paymentMethod = document.getElementById("paymentMethod").value;
  var paymentAmount = document.getElementById("paymentAmount");
  var pixCode = document.getElementById("pixCode");
  var paymentAmountLabel = document.getElementById("paymentAmountLabel");
  var pixCodeLabel = document.getElementById("pixCodeLabel");

  // Esconde todos os campos de pagamento inicialmente
  paymentAmount.style.display = "none";
  pixCode.style.display = "none";
  paymentAmountLabel.style.display = "none";
  pixCodeLabel.style.display = "none";

  // Mostra o campo apropriado com base na forma de pagamento
  if (paymentMethod === "dinheiro") {
    paymentAmount.style.display = "inline-block";
    paymentAmountLabel.style.display = "inline-block";
  } else if (paymentMethod === "pix") {
    pixCode.style.display = "inline-block";
    pixCodeLabel.style.display = "inline-block";
  }
}
// Função para criar um novo pedido
function createOrder(event) {
  event.preventDefault();

  const clientName = document.getElementById("clientName").value;
  const address = document.getElementById("address").value;
  const number = document.getElementById("number").value;
  const cep = document.getElementById("cep").value;
  const product = Array.from(
    document.getElementById("product").selectedOptions
  ).map((option) => option.value);
  const paymentMethod = document.getElementById("paymentMethod").value;
  const observations = document.getElementById("observations").value;

  let paymentAmount = null;
  let pixCode = null;

  if (paymentMethod === "dinheiro") {
    paymentAmount = document.getElementById("paymentAmount").value;
  } else if (paymentMethod === "pix") {
    pixCode = document.getElementById("pixCode").value;
  }

  const orderId = generateOrderId(); // Função para gerar ID único para cada pedido
  const order = {
    orderId,
    clientName,
    address,
    number,
    cep,
    product,
    paymentMethod,
    paymentAmount,
    pixCode,
    observations,
  };

  orders.push(order);
  renderTable();
  clearForm();
}

// Função para gerar um ID único para o pedido
function generateOrderId() {
  return `PED-${Date.now()}`;
}

// Função para limpar o formulário após o envio
function clearForm() {
  document.getElementById("orderForm").reset();
  document.getElementById("paymentAmount").style.display = "none";
  document.getElementById("pixCode").style.display = "none";
}

// Função para renderizar a lista de pedidos
function renderTable() {
  const tableBody = document.querySelector("#ordersTable tbody");
  tableBody.innerHTML = "";

  orders.forEach((order) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${order.orderId}</td>
      <td>${order.clientName}</td>
      <td>${order.product.join(", ")}</td>
      <td>${order.paymentMethod}</td>
      <td>${order.observations}</td>
      <td>
        <button class="edit" onclick="editOrder('${
          order.orderId
        }')">Editar</button>
        <button class="remove" onclick="removeOrder('${
          order.orderId
        }')">Remover</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Função para editar um pedido
function editOrder(orderId) {
  const order = orders.find((o) => o.orderId === orderId);
  if (order) {
    document.getElementById("clientName").value = order.clientName;
    document.getElementById("address").value = order.address;
    document.getElementById("number").value = order.number;
    document.getElementById("cep").value = order.cep;
    document.getElementById("product").value = order.product;
    document.getElementById("paymentMethod").value = order.paymentMethod;
    document.getElementById("observations").value = order.observations;

    if (order.paymentMethod === "dinheiro") {
      document.getElementById("paymentAmount").style.display = "block";
      document.getElementById("paymentAmount").value = order.paymentAmount;
    } else if (order.paymentMethod === "pix") {
      document.getElementById("pixCode").style.display = "block";
      document.getElementById("pixCode").value = order.pixCode;
    }
  }
}

// Função para remover um pedido
function removeOrder(orderId) {
  orders = orders.filter((o) => o.orderId !== orderId);
  renderTable();
}

// Função para buscar pedidos
function searchOrder() {
  const searchName = document.getElementById("searchName").value.toLowerCase();
  const searchOrderId = document.getElementById("searchOrderId").value;

  const filteredOrders = orders.filter((order) => {
    const matchName = searchName
      ? order.clientName.toLowerCase().includes(searchName)
      : true;
    const matchOrderId = searchOrderId ? order.orderId === searchOrderId : true;
    return matchName && matchOrderId;
  });

  renderFilteredTable(filteredOrders);
}

// Função para renderizar os pedidos filtrados
function renderFilteredTable(filteredOrders) {
  const tableBody = document.querySelector("#ordersTable tbody");
  tableBody.innerHTML = "";

  filteredOrders.forEach((order) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${order.orderId}</td>
      <td>${order.clientName}</td>
      <td>${order.product.join(", ")}</td>
      <td>${order.paymentMethod}</td>
      <td>${order.observations}</td>
      <td>
        <button class="edit" onclick="editOrder('${
          order.orderId
        }')">Editar</button>
        <button class="remove" onclick="removeOrder('${
          order.orderId
        }')">Remover</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

function validarTelefone(telefone) {
  // Verifica se o telefone tem exatamente 11 dígitos numéricos
  return telefone.length === 11;
}

// Validação em tempo real do CPF (durante a digitação)
const campoCPF = document.getElementById("cpf");
const resultadoCPF = document.getElementById("resultCpf");

campoCPF.addEventListener("input", function () {
  let cpf = campoCPF.value.replace(/[^\d]+/g, ""); // Remove formatação
  if (validarCPF(cpf)) {
    resultadoCPF.textContent = "CPF válido!";
    resultadoCPF.className = "valid"; // Aplica a classe "valid"
  } else {
    resultadoCPF.textContent = "CPF inválido!";
    resultadoCPF.className = "invalid"; // Aplica a classe "invalid"
  }
});

function handleFormSubmit(event) {
  event.preventDefault(); // Previne o comportamento padrão de submit

  // Captura os dados do formulário
  const clientName = document.getElementById("clientName").value;
  const cpf = document.getElementById("cpf").value;
  const address = document.getElementById("address").value;
  const number = document.getElementById("number").value;
  const cep = document.getElementById("cep").value;
  const pizza = document.getElementById("pizza").value;
  const acompanhamento = document.getElementById("acompanhamento").value;
  const paymentMethod = document.getElementById("paymentMethod").value;
  const paymentAmount = document.getElementById("paymentAmount").value;
  const observations = document.getElementById("observations").value;

  // Cria o objeto pedido
  const pedido = {
    id: pedidoId++,
    clientName,
    cpf,
    address,
    number,
    cep,
    pizza,
    acompanhamento,
    paymentMethod,
    paymentAmount: paymentMethod === "dinheiro" ? paymentAmount : "",
    observations,
  };

  // Adiciona o pedido à lista de pedidos
  pedidos.push(pedido);

  // Atualiza a tabela com o novo pedido
  updateOrdersTable();

  // Limpa o formulário após o envio
  document.getElementById("orderForm").reset();
}

// Função para atualizar a tabela de pedidos
function updateOrdersTable() {
  const tableBody = document
    .getElementById("ordersTable")
    .getElementsByTagName("tbody")[0];
  tableBody.innerHTML = ""; // Limpa a tabela antes de atualizar

  pedidos.forEach((pedido) => {
    const row = tableBody.insertRow();

    row.innerHTML = `
      <td>${pedido.id}</td>
      <td>${pedido.clientName}</td>
      <td>${pedido.pizza}</td>
      <td>${pedido.paymentMethod}</td>
      <td>${pedido.observations}</td>
      <td>
        <button onclick="editOrder(${pedido.id})" class="edit">Editar</button>
        <button onclick="removeOrder(${pedido.id})" class="remove">Remover</button>
      </td>
    `;
  });
}

// Função para editar um pedido
function editOrder(id) {
  const pedido = pedidos.find((p) => p.id === id);
  if (pedido) {
    // Preenche o formulário com os dados do pedido
    document.getElementById("clientName").value = pedido.clientName;
    document.getElementById("cpf").value = pedido.cpf;
    document.getElementById("address").value = pedido.address;
    document.getElementById("number").value = pedido.number;
    document.getElementById("cep").value = pedido.cep;
    document.getElementById("pizza").value = pedido.pizza;
    document.getElementById("acompanhamento").value = pedido.acompanhamento;
    document.getElementById("paymentMethod").value = pedido.paymentMethod;
    document.getElementById("paymentAmount").value = pedido.paymentAmount;
    document.getElementById("observations").value = pedido.observations;

    // Remove o pedido da lista e da tabela
    removeOrder(id);
  }
}

// Função para remover um pedido
function removeOrder(id) {
  pedidos = pedidos.filter((pedido) => pedido.id !== id);
  updateOrdersTable(); // Atualiza a tabela
}

// Função de pesquisa
function searchOrder() {
  const searchName = document.getElementById("searchName").value.toLowerCase();
  const searchOrderId = document.getElementById("searchOrderId").value;

  const filteredOrders = pedidos.filter((pedido) => {
    return (
      pedido.clientName.toLowerCase().includes(searchName) ||
      pedido.id.toString().includes(searchOrderId)
    );
  });

  // Atualiza a tabela com os pedidos filtrados
  const tableBody = document
    .getElementById("ordersTable")
    .getElementsByTagName("tbody")[0];
  tableBody.innerHTML = ""; // Limpa a tabela

  filteredOrders.forEach((pedido) => {
    const row = tableBody.insertRow();

    row.innerHTML = `
      <td>${pedido.id}</td>
      <td>${pedido.clientName}</td>
      <td>${pedido.pizza}</td>
      <td>${pedido.paymentMethod}</td>
      <td>${pedido.observations}</td>
      <td>
        <button onclick="editOrder(${pedido.id})" class="edit">Editar</button>
        <button onclick="removeOrder(${pedido.id})" class="remove">Remover</button>
      </td>
    `;
  });
}

// Adiciona o evento de submit ao formulário
document
  .getElementById("orderForm")
  .addEventListener("submit", handleFormSubmit);

// Configuração do evento de criação de pedido
document.getElementById("orderForm").onsubmit = createOrder;
