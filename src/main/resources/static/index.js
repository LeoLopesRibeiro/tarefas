const btnIncluir = document.getElementById('btnIncluirTarefa');
const formNovaTarefa = document.getElementById('formNovaTarefa');
const tasksContainer = document.getElementById('tasksContainer');
const msgSucesso = document.getElementById('msgSucesso');
const msgErro = document.getElementById('msgErro');

const API_URL = 'http://localhost:8080/tarefas';

function formatDate(dateStr) {
    const date = new Date(dateStr + "T00:00:00");
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

            <button class="btn-delete-task" onclick="excluirTarefa(${task.id})">Excluir</button>
            
            <button class="btn-edit-task" onclick="abrirEdicao(${task.id})">Editar</button>

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

    const idEdicao = formNovaTarefa.getAttribute("data-edit-id"); 

    const novaTarefa = {
        nome: document.getElementById('nome').value.trim(),
        responsavel: document.getElementById('responsavel').value.trim(),
        dataTermino: document.getElementById('dataTermino').value,
        detalhamento: document.getElementById('detalhamento').value.trim(),
    };

    msgSucesso.textContent = '';
    msgErro.textContent = '';


    try {

        const url = idEdicao ? `${API_URL}/${idEdicao}` : `${API_URL}/cadastrar`;
        const method = idEdicao ? "PUT" : "POST";

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(novaTarefa)
        });

        if (response.ok) {
            msgSucesso.textContent = idEdicao ? 'Tarefa editada com sucesso!' : 'Tarefa salva com sucesso!';
            formNovaTarefa.reset();
            formNovaTarefa.style.display = 'none';
            formNovaTarefa.removeAttribute("data-edit-id");
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

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        if (response.ok) {
            msgSucesso.textContent = "Tarefa editada com sucesso!";
            await carregarTarefas();
        } else {
            msgErro.textContent = "Erro ao editar a tarefa.";
        }
    } catch (error) {
        msgErro.textContent = "Erro de comunicação com o servidor.";
        console.error(error);
    }
}

async function abrirEdicao(id) {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "GET"
    });
    const task = await response.json();

    document.getElementById('nome').value = task.nome;
    document.getElementById('responsavel').value = task.responsavel;
    document.getElementById('dataTermino').value = task.dataTermino;
    document.getElementById('detalhamento').value = task.detalhamento;

    formNovaTarefa.setAttribute("data-edit-id", id);

    formNovaTarefa.style.display = "block";
    btnIncluir.style.display = "none";
    msgSucesso.textContent = "";
    msgErro.textContent = "";
}

function cancelarAcao() {
    formNovaTarefa.style.display = "none";
    btnIncluir.style.display = "block";
    formNovaTarefa.reset();
    formNovaTarefa.removeAttribute("data-edit-id");
    msgErro.textContent = "";
    msgSucesso.textContent = "";
}

carregarTarefas();
