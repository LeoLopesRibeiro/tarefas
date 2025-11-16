const btnIncluir = document.getElementById('btnIncluirTarefa');
const formNovaTarefa = document.getElementById('formNovaTarefa');
const tasksContainer = document.getElementById('tasksContainer');
const msgSucesso = document.getElementById('msgSucesso');
const msgErro = document.getElementById('msgErro');

const API_URL = 'http://localhost:8080/tarefas';

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function isLate(dateStr) {
    const today = new Date();
    const date = new Date(dateStr);
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < today;
}

function createTaskHTML(task) {
    const lateClass = isLate(task.dataTermino) ? `<span class="late-label">ATRASADA</span>` : '';
    return `
        <div class="task">
            <h3>${task.nome} ${lateClass}</h3>
            <p>Responsável: <strong>${task.responsavel}</strong></p>
            <p>Data de término: <strong>${formatDate(task.dataTermino)}</strong></p>
            <p class="description">${task.detalhamento}</p>

            <button class="btn-delete-task" onclick="excluirTarefa(${task.id})">
                Excluir
            </button>
        </div>
    `;
}

async function carregarTarefas() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao buscar tarefas');
        const data = await response.json();
        tasksContainer.innerHTML = '';
        data.forEach(task => {
            tasksContainer.innerHTML += createTaskHTML(task);
        });
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
        tasksContainer.innerHTML = '<p>Erro ao carregar tarefas.</p>';
    }
}

btnIncluir.addEventListener('click', () => {
    formNovaTarefa.style.display = 'block';
    btnIncluir.style.display = 'none';
    msgSucesso.textContent = '';
    msgErro.textContent = '';
});

formNovaTarefa.addEventListener('submit', async (e) => {
    e.preventDefault();

    const novaTarefa = {
        nome: document.getElementById('nome').value.trim(),
        responsavel: document.getElementById('responsavel').value.trim(),
        dataTermino: document.getElementById('dataTermino').value,
        detalhamento: document.getElementById('detalhamento').value.trim(),
    };

    msgSucesso.textContent = '';
    msgErro.textContent = '';


    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novaTarefa)
        });

        if (response.ok) {
            msgSucesso.textContent = 'Tarefa salva com sucesso!';
            formNovaTarefa.reset();
            formNovaTarefa.style.display = 'none';
            btnIncluir.style.display = 'block';
            await carregarTarefas();
        } else {
            const errorData = await response.json();
            const primeiraMensagem = Array.isArray(errorData)
                ? errorData[0]
                : (errorData.errors?.[0]?.defaultMessage || 'Erro ao salvar tarefa.');
            msgErro.textContent = `Erro: ${primeiraMensagem}`;
        }
    } catch (error) {
        msgErro.textContent = 'Erro de comunicação com o servidor.';
        console.error(error);
    }
});

async function excluirTarefa(id) {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            msgSucesso.textContent = "Tarefa excluída com sucesso!";
            await carregarTarefas();
        } else {
            msgErro.textContent = "Erro ao excluir a tarefa.";
        }
    } catch (error) {
        msgErro.textContent = "Erro de comunicação com o servidor.";
        console.error(error);
    }
}

carregarTarefas();
