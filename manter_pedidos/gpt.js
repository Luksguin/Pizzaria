let orders = [];

// Função para gerar um ID único para o pedido
function generateOrderId() {
  return `PED-${Date.now()}`;
}

// Função para validar o CPF
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

// Função para alternar os campos de pagamento com base na seleção
function togglePaymentFields() {
  var paymentMethod = document.getElementById("paymentMethod").value;
  var paymentAmount = document.getElementById("paymentAmount");
  var pixCode = document.getElementById("pixCode");
  var paymentAmountLabel = document.getElementById("paymentAmountLabel");
  var pixCodeLabel = document.getElementById("pixCodeLabel");

  paymentAmount.style.display = "none";
  pixCode.style.display = "none";
  paymentAmountLabel.style.display = "none";
  pixCodeLabel.style.display = "none";

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
    document.getElementById("pizza").selectedOptions
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
    document.getElementById("pizza").value = order.product;
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

// Adiciona o evento de submit ao formulário
document.getElementById("orderForm").addEventListener("submit", createOrder);

// Configuração do evento de validação em tempo real do CPF
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
