// Array para armazenar as filiais
let branches = [];

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

// Função para adicionar uma nova filial
function addBranch(event) {
  event.preventDefault();

  const branchName = document.getElementById("branchName").value;
  const cnpj = document.getElementById("cnpj").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;
  const number = document.getElementById("number").value;
  const cep = document.getElementById("cep").value;

  const branch = { branchName, cnpj, phone, email, address, number, cep };
  branches.push(branch);
  renderTable();
  clearForm();
}

// Função para limpar o formulário após o cadastro
function clearForm() {
  document.getElementById("branchForm").reset();
}

// Função para renderizar as filiais na tabela
function renderTable() {
  const tableBody = document.querySelector("#branchesTable tbody");
  tableBody.innerHTML = "";

  branches.forEach((branch, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${branch.branchName}</td>
      <td>${branch.cnpj}</td>
      <td>${branch.phone}</td>
      <td>${branch.email}</td>
      <td>${branch.address}</td>
      <td>${branch.cep}</td>
      <td>
        <button class="edit" onclick="editBranch(${index})">Editar</button>
        <button class="remove" onclick="removeBranch(${index})">Remover</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Função para editar uma filial
function editBranch(index) {
  const branch = branches[index];
  document.getElementById("branchName").value = branch.branchName;
  document.getElementById("cnpj").value = branch.cnpj;
  document.getElementById("phone").value = branch.phone;
  document.getElementById("email").value = branch.email;
  document.getElementById("address").value = branch.address;
  document.getElementById("number").value = branch.number;
  document.getElementById("cep").value = branch.cep;

  // Substituir o formulário de adicionar por um de edição
  document.getElementById("branchForm").onsubmit = function (event) {
    updateBranch(event, index);
  };
}

// Função para atualizar os dados da filial
function updateBranch(event, index) {
  event.preventDefault();

  const branchName = document.getElementById("branchName").value;
  const cnpj = document.getElementById("cnpj").value;
  const phone = document.getElementById("phone").value;
  const email = document.getElementById("email").value;
  const address = document.getElementById("address").value;
  const number = document.getElementById("number").value;
  const cep = document.getElementById("cep").value;

  branches[index] = { branchName, cnpj, phone, email, address, number, cep };
  renderTable();
  clearForm();

  // Resetar o formulário de edição para voltar ao estado inicial
  document.getElementById("branchForm").onsubmit = addBranch;
}

// Função para remover uma filial
function removeBranch(index) {
  branches.splice(index, 1);
  renderTable();
}

// Função de busca (Filtrar por nome da filial)
function searchBranch() {
  const searchName = document.getElementById("searchName").value.toLowerCase();
  const filteredBranches = branches.filter((branch) =>
    branch.branchName.toLowerCase().includes(searchName)
  );

  renderFilteredTable(filteredBranches);
}

// Função para renderizar filiais filtradas na tabela
function renderFilteredTable(filteredBranches) {
  const tableBody = document.querySelector("#branchesTable tbody");
  tableBody.innerHTML = "";

  filteredBranches.forEach((branch, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${branch.branchName}</td>
      <td>${branch.cnpj}</td>
      <td>${branch.phone}</td>
      <td>${branch.email}</td>
      <td>${branch.address}</td>
      <td>${branch.cep}</td>
      <td>
        <button class="edit" onclick="editBranch(${index})">Editar</button>
        <button class="remove" onclick="removeBranch(${index})">Remover</button>
      </td>
    `;
    tableBody.appendChild(row);
  });
}

// Adicionar evento de submissão para o formulário de filiais
document.getElementById("branchForm").onsubmit = addBranch;

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
