document.addEventListener("DOMContentLoaded", function () {
    // Recupera os feedbacks do localStorage
    const feedbacks = JSON.parse(localStorage.getItem("feedbacks")) || [];

    // Função para exibir os feedbacks na tabela
    function displayFeedbacks(feedbacks) {
        const tableBody = document.querySelector("#feedbacksTable tbody");
        tableBody.innerHTML = ""; // Limpar tabela antes de adicionar novos dados

        feedbacks.forEach((feedback) => {
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${feedback.name}</td>
        <td>${feedback.date}</td>
        <td>${feedback.rating}</td>
        <td>${feedback.comments || "Sem comentário."}</td>
      `;
            tableBody.appendChild(row);
        });
    }

    // Exibir todos os feedbacks na tabela inicialmente
    displayFeedbacks(feedbacks);

    // Função de consulta de feedback com filtros
    document.getElementById("searchForm").addEventListener("submit", function (e) {
        e.preventDefault();

        const searchName = document.getElementById("searchName").value.toLowerCase();
        const searchDate = document.getElementById("searchDate").value;
        const sortBy = document.getElementById("sortBy").value;

        // Filtrando feedbacks
        const filteredFeedbacks = feedbacks.filter((feedback) => {
            const matchesName = feedback.name.toLowerCase().includes(searchName);
            const matchesDate = searchDate ? feedback.date === searchDate : true;
            return matchesName && matchesDate;
        });

        // Ordenando feedbacks conforme a opção escolhida
        const sortedFeedbacks = sortFeedbacks(filteredFeedbacks, sortBy);

        // Exibir feedbacks filtrados e ordenados
        displayFeedbacks(sortedFeedbacks);
    });

    // Função para ordenar os feedbacks com base na opção selecionada
    function sortFeedbacks(feedbacks, sortBy) {
        switch (sortBy) {
            case "dateAsc":
                return feedbacks.sort((a, b) => new Date(a.date) - new Date(b.date)); // Mais antiga
            case "dateDesc":
                return feedbacks.sort((a, b) => new Date(b.date) - new Date(a.date)); // Mais recente
            case "nameAsc":
                return feedbacks.sort((a, b) => a.name.localeCompare(b.name)); // A a Z
            case "nameDesc":
                return feedbacks.sort((a, b) => b.name.localeCompare(a.name)); // Z a A
            default:
                return feedbacks;
        }
    }
});
