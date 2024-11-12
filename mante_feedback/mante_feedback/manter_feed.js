document.addEventListener("DOMContentLoaded", () => {
  const dateInput = document.getElementById("date");
  const today = new Date().toISOString().split("T")[0]; // Pega a data no formato YYYY-MM-DD
  dateInput.value = today;
});

// Função para enviar feedback e armazená-lo no localStorage
document.getElementById("feedbackForm").addEventListener("submit", (e) => {
  e.preventDefault(); // Evitar que o formulário seja enviado para um servidor

  // Coletar os dados do formulário
  const name = document.getElementById("name").value;
  const date = document.getElementById("date").value;
  const rating = document.getElementById("rating").value;
  const feedbackOption = document.getElementById("feedbackOption").value;

  // Verificar se o usuário escolheu uma opção válida
  if (!feedbackOption) {
    alert("Por favor, selecione uma opção de feedback.");
    return;
  }

  // Criar um objeto feedback
  const feedback = {
    name: name,
    date: date,
    rating: rating,
    feedbackOption: feedbackOption
  };

  // Recuperar os feedbacks do localStorage ou criar um novo array
  let feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

  // Adicionar o novo feedback ao array
  feedbacks.push(feedback);

  // Armazenar o array de feedbacks de volta no localStorage
  localStorage.setItem("feedbacks", JSON.stringify(feedbacks));

  // Resetar o formulário após o envio
  document.getElementById("feedbackForm").reset();

  const dateInput = document.getElementById("date");
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];  // Formatar a data como yyyy-mm-dd
  dateInput.value = formattedDate;  // Atribuir a data atual ao campo de data

  // Informar ao usuário que o feedback foi enviado com sucesso
  alert("Feedback enviado com sucesso!");
});