document.addEventListener("DOMContentLoaded", function () {
  // Recupera os clientes já cadastrados ou cria uma lista vazia
  let clients = JSON.parse(localStorage.getItem('clients')) || [];

  // Adiciona evento ao formulário para criar novos clientes
  document.getElementById('clientForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Impede o envio do formulário para fins de validação

    // Coleta os dados do formulário
    const name = document.getElementById('name').value;
    const cpf = document.getElementById('cpf').value.replace(/[^\d]+/g, ''); // Remove formatação
    const address = document.getElementById('address').value;
    const gender = document.getElementById('gender').value;
    const number = document.getElementById('number').value;
    const email = document.getElementById('email').value;

    // Valida o CPF antes de continuar
    const resultadoCPF = document.getElementById('resultCpf');
    if (validarCPF(cpf)) {
      console.log("CPF válido!");

      // Verifica se o CPF já existe
      const clientExists = clients.some(client => client.cpf === cpf);

      if (clientExists) {
        // Se o CPF já estiver cadastrado, exibe a mensagem de erro
        resultadoCPF.textContent = "Este CPF já foi cadastrado!";
        resultadoCPF.className = "invalid"; // Aplica o estilo "invalid"
      } else {
        if (!validarTelefone(number)) {
          alert("O número de telefone deve ter 11 dígitos.");
          return; // Impede o envio do formulário se o telefone for inválido
        }
        // Se o CPF for válido e não estiver duplicado, cadastra o novo cliente
        resultadoCPF.textContent = "CPF válido!";
        resultadoCPF.className = "valid"; // Aplica o estilo "valid"

        // Cria o objeto do cliente e adiciona à lista
        const newClient = {
          name,
          cpf,
          address,
          gender,
          number,
          email,
          year: new Date().getFullYear() // Ano de cadastro
        };

        // Adiciona o novo cliente à lista
        clients.push(newClient);

        // Armazena a lista de clientes no localStorage
        localStorage.setItem('clients', JSON.stringify(clients));

        // Limpa os campos do formulário após o cadastro
        document.getElementById('clientForm').reset();

        // Atualiza a visualização da tabela de clientes
        updateClientTable();
      }
    } else {
      // Se o CPF for inválido, exibe a mensagem de erro
      resultadoCPF.textContent = "CPF inválido!";
      resultadoCPF.className = "invalid"; // Aplica o estilo "invalid"
    }
  });

  // Função para atualizar a tabela de clientes
  function updateClientTable() {
    const tableBody = document.getElementById('clientsTable').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = ''; // Limpa a tabela antes de atualizar

    console.log("Atualizando tabela com clientes:", clients);
    // Adiciona cada cliente na tabela
    clients.forEach((client) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${client.name}</td>
        <td>${client.cpf}</td>
        <td>${client.gender}</td>
        <td>${client.year}</td>
        <td>
          <button class="edit" onclick="editClient('${client.cpf}')">Editar</button>
          <button class="remove" onclick="removeClient('${client.cpf}')">Excluir</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  }

  window.removeClient = function(cpf) {
    console.log(`Remover cliente com CPF: ${cpf}`);
    const index = clients.findIndex((client) => client.cpf === cpf);
    if (index !== -1) {
      clients.splice(index, 1); // Remove o cliente da lista
      localStorage.setItem('clients', JSON.stringify(clients)); // Atualiza o localStorage
      updateClientTable(); // Atualiza a tabela
    }
  }

  window.editClient = function(cpf) {
    console.log(`Editar cliente com CPF: ${cpf}`);
    const client = clients.find(client => client.cpf === cpf);
    if (client) {
      // Preenche o formulário com os dados do cliente
      document.getElementById('name').value = client.name;
      document.getElementById('cpf').value = client.cpf;
      document.getElementById('address').value = client.address;
      document.getElementById('gender').value = client.gender;
      document.getElementById('number').value = client.number;
      document.getElementById('email').value = client.email;
      
      // Alterar a função do submit para atualizar o cliente
      document.getElementById('clientForm').onsubmit = function (event) {
        event.preventDefault();

        // Atualiza os dados do cliente no array
        client.name = document.getElementById('name').value;
        client.cpf = document.getElementById('cpf').value.replace(/[^\d]+/g, ''); // Remove formatação
        client.address = document.getElementById('address').value;
        client.gender = document.getElementById('gender').value;
        client.number = document.getElementById('number').value;
        client.email = document.getElementById('email').value;

        // Atualiza o localStorage com os dados alterados
        localStorage.setItem('clients', JSON.stringify(clients));

        // Limpa o formulário e volta a função do submit para cadastrar
        document.getElementById('clientForm').reset();
        document.getElementById('clientForm').onsubmit = handleClientFormSubmit;

        // Atualiza a tabela com os dados alterados
        updateClientTable();
      };
    }
  }

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
    return digito1 === parseInt(cpf.charAt(9)) && digito2 === parseInt(cpf.charAt(10));
  }

  function validarTelefone(telefone) {
    // Verifica se o telefone tem exatamente 11 dígitos numéricos
    return telefone.length === 11;
  }

  // Função para filtrar os clientes com base nos filtros de gênero e ano
  document.getElementById("clientForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Impede o envio do formulário (recarregar a página)

    // Obter os valores dos filtros
    const genderFilter = document.getElementById("genderFilter").value.toLowerCase();
    const yearFilter = document.getElementById("yearFilter").value;

    // Seleciona todas as linhas da tabela (exceto o cabeçalho)
    const rows = document.querySelectorAll("#clientsTable tbody tr");

    rows.forEach((row) => {
      const gender = row.cells[2].textContent.toLowerCase(); // Gênero na coluna 2
      const year = row.cells[3].textContent; // Ano de cadastro na coluna 3

      let showRow = true; // Inicialmente, mostramos a linha

      // Aplicar filtro de gênero
      if (genderFilter && gender !== genderFilter) {
        showRow = false;
      }

      // Aplicar filtro de ano de cadastro
      if (yearFilter && year !== yearFilter) {
        showRow = false;
      }

      // Mostrar ou esconder a linha com base nos filtros
      row.style.display = showRow ? "" : "none";
    });
  });

  // Validação em tempo real do CPF (durante a digitação)
  const campoCPF = document.getElementById('cpf');
  const resultadoCPF = document.getElementById('resultCpf');

  campoCPF.addEventListener('input', function () {
    let cpf = campoCPF.value.replace(/[^\d]+/g, ''); // Remove formatação
    if (validarCPF(cpf)) {
      resultadoCPF.textContent = "CPF válido!";
      resultadoCPF.className = "valid";  // Aplica a classe "valid"
    } else {
      resultadoCPF.textContent = "CPF inválido!";
      resultadoCPF.className = "invalid";  // Aplica a classe "invalid"
    }
  });
  
    // Função para atualizar a tabela com clientes filtrados
    function updateFilteredClientTable(filteredClients = clients) {
      const tableBody = document.getElementById('clientsTable').getElementsByTagName('tbody')[0];
      tableBody.innerHTML = ''; // Limpa a tabela antes de adicionar os clientes filtrados
  
      filteredClients.forEach(client => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${client.name}</td>
          <td>${client.cpf}</td>
          <td>${client.gender}</td>
          <td>${client.year}</td>
          <td>
            <button class="edit" onclick="editClient('${client.cpf}')">Editar</button>
            <button class="remove" onclick="removeClient('${client.cpf}')">Excluir</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    }
  
    // Adiciona o ouvinte de evento para os filtros
    document.getElementById('clientsTable').addEventListener('input', filterClients);

  // Chama a função para exibir a tabela de clientes logo ao carregar a página
  updateClientTable();
});
