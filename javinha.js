document.addEventListener('DOMContentLoaded', () => {
    const perguntasContainer = document.getElementById('perguntasContainer');
    const submitButton = document.getElementById('submitButton');

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

    perguntas.forEach((pergunta, i) => {
        const perguntaDiv = document.createElement('div');
        perguntaDiv.classList.add('question');

        perguntaDiv.innerHTML = `
            <p>${i + 1}. ${pergunta}</p>
            <div class="options">
                <label><input type="radio" name="q${i + 1}" value="1"><span class="circle"></span>1</label>
                <label><input type="radio" name="q${i + 1}" value="2"><span class="circle"></span>2</label>
                <label><input type="radio" name="q${i + 1}" value="3"><span class="circle"></span>3</label>
                <label><input type="radio" name="q${i + 1}" value="4"><span class="circle"></span>4</label>
            </div>
        `;

        perguntasContainer.appendChild(perguntaDiv);
    });

    const form = document.getElementById('avaliacaoForm');

    // Verificação em tempo real para ativar ou desativar o botão de envio
    form.addEventListener('change', () => {
        const allAnswered = Array.from({ length: 10 }, (_, i) =>
            form.querySelector(`input[name="q${i + 1}"]:checked`)
        ).every(input => input !== null);

        submitButton.disabled = !allAnswered;
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = new FormData(form);
        const respostas = [];

        for (let i = 1; i <= 10; i++) {
            const resposta = formData.get('q' + i);
            if (!resposta) {
                alert(`Por favor, responda todas as questões antes de enviar o formulário.`);
                return;
            }
            respostas.push(parseInt(resposta));
        }

        console.log('Respostas:', respostas);

        const ctx = document.getElementById('resultadoGrafico').getContext('2d');

        if (window.myChart) {
            window.myChart.destroy();
        }

        window.myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: respostas.map((_, i) => `Questão ${i + 1}`),
                datasets: [{
                    label: 'Avaliações',
                    data: respostas,
                    backgroundColor: [
                        '#4dc9f6',
                        '#f67019',
                        '#f53794',
                        '#537bc4',
                        '#acc236',
                        '#166a8f',
                        '#00a950',
                        '#58595b',
                        '#8549ba',
                        '#e0c25a'
                    ],
                    borderColor: '#fff',
                    borderWidth: 2,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#000',
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                let value = context.parsed;
                                return `${label}: ${value}`;
                            }
                        }
                    }
                }
            }
        });

        alert('Formulário enviado! Veja o gráfico abaixo.');
    });
});
