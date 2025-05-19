document.addEventListener('DOMContentLoaded', () => {
    const perguntas = [
        "Comunico minhas ideias com clareza e objetividade.",
        "Colaboro bem com colegas e trabalho de forma eficaz em equipe.",
        "Sou proativo(a) e tomo iniciativa sem depender de ordens.",
        "Organizo minhas tarefas e cumpro prazos com responsabilidade.",
        "Alcanço as metas que me são atribuídas de forma consistente.",
        "Busco aprender continuamente e aplico novos conhecimentos no trabalho.",
        "Mantenho um bom relacionamento com colegas e respeito diferentes opiniões.",
        "Assumo a responsabilidade pelos meus erros e aprendo com eles.",
        "Consigo encontrar soluções práticas para os problemas que enfrento.",
        "Trabalho de forma autônoma, sem necessidade de supervisão constante."
    ];

    const perguntasContainer = document.getElementById('perguntasContainer');
    const submitButton = document.getElementById('submitButton');

    perguntas.forEach((pergunta, i) => {
        const div = document.createElement('div');
        div.classList.add('question');

        div.innerHTML = `
            <p>${i + 1}. ${pergunta}</p>
            <div class="options">
                <label>
                    <input type="radio" name="q${i + 1}" value="1">
                    <span class="circle"></span>
                    1
                </label>
                <label>
                    <input type="radio" name="q${i + 1}" value="2">
                    <span class="circle"></span>
                    2
                </label>
                <label>
                    <input type="radio" name="q${i + 1}" value="3">
                    <span class="circle"></span>
                    3
                </label>
                <label>
                    <input type="radio" name="q${i + 1}" value="4">
                    <span class="circle"></span>
                    4
                </label>
            </div>
        `;

        perguntasContainer.appendChild(div);
    });

    const form = document.getElementById('avaliacaoForm');

    form.addEventListener('change', () => {
        const allAnswered = perguntas.every((_, i) =>
            form.querySelector(`input[name="q${i + 1}"]:checked`)
        );
        submitButton.disabled = !allAnswered;
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Coleta as respostas
        const respostas = [];
        for (let i = 1; i <= perguntas.length; i++) {
            const resposta = form.querySelector(`input[name="q${i}"]:checked`).value;
            respostas.push(parseInt(resposta));
        }

        // Gera gráfico
        const ctx = document.getElementById('resultadoGrafico').getContext('2d');
        if (window.myChart) window.myChart.destroy();

        window.myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: perguntas.map((_, i) => `Q${i + 1}`),
                datasets: [{
                    label: 'Avaliações',
                    data: respostas,
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: '#333',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 4
                    }
                }
            }
        });

        alert('Avaliação enviada! Veja o gráfico abaixo.');

        // Gera PDF com as respostas
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        let y = 10;
        doc.setFont("helvetica", "bold");
        doc.text("Relatório da Avaliação Pessoal", 10, y);
        y += 10;

        doc.setFont("helvetica", "normal");
        perguntas.forEach((pergunta, i) => {
            if (y > 270) { // quebra de página
                doc.addPage();
                y = 10;
            }
            doc.text(`${i + 1}. ${pergunta}`, 10, y);
            y += 7;
            doc.text(`Resposta: ${respostas[i]}`, 15, y);
            y += 10;
        });

        doc.save("avaliacao_pessoal.pdf");
    });
});

document.getElementById('avaliacaoForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const respostas = [];

  for (let i = 1; i <= 10; i++) {
    const resposta = document.querySelector(`input[name="q${i}"]:checked`);
    respostas.push(resposta ? parseInt(resposta.value) : 0);
  }

  const ctx = document.getElementById('resultadoGrafico').getContext('2d');

  if (window.myChart) window.myChart.destroy();

  window.myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: respostas.map((_, i) => `Pergunta ${i + 1}`),
      datasets: [{
        label: 'Avaliação',
        data: respostas,
        backgroundColor: 'rgba(54, 162, 235, 0.7)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        borderRadius: 6, // cantos arredondados
        maxBarThickness: 40 // barra não fica gigante
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: '#333',
          titleFont: { size: 16 },
          bodyFont: { size: 14 }
        },
        datalabels: {
          anchor: 'end',
          align: 'top',
          color: '#000',
          font: { weight: 'bold', size: 14 }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Perguntas',
            font: { size: 16, weight: 'bold' }
          },
          ticks: { maxRotation: 0, minRotation: 0 }
        },
        y: {
          beginAtZero: true,
          max: 4,
          ticks: {
            stepSize: 1,
            font: { size: 14 }
          },
          title: {
            display: true,
            text: 'Nota',
            font: { size: 16, weight: 'bold' }
          }
        }
      }
    },
    plugins: [ChartDataLabels] // plugin para mostrar valores nas barras
  });
});
