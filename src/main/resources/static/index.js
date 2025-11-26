const btnIncluir = document.getElementById('btnIncluirTarefa');
const formNovaTarefa = document.getElementById('formNovaTarefa');
const tasksContainer = document.getElementById('tasksContainer');
const msgSucesso = document.getElementById('msgSucesso');
const msgErro = document.getElementById('msgErro');

const API_URL = 'http://localhost:8080/tarefas';

let tarefaIdParaExcluir = null;
let tarefaNomeParaExcluir = "";

function formatDate(dateStr) {
    const date = new Date(dateStr + "T00:00:00");
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function createTaskHTML(task) {
 //formNovaTarefa.style.display = 'none';
    return `
        <div class="task">
             <h3>${task.titulo}</h3>

            <p>Responsável: <strong>${task.responsavel}</strong></p>
           <p>
             Data de término:
             <strong style="color: ${task.atrasada ? 'red' : 'black'};">
               ${formatDate(task.dataTermino)}
               ${task.atrasada ? '(Tarefa atrasada)': ''}
             </strong>
           </p>
            <p class="description">Detalhamento:<br>
            ${task.detalhamento}</p>

            <div class="buttons">
             <button class="btn-edit-task" onclick="abrirEdicao(${task.id})">Editar</button>
             <button class="btn-delete-task" onclick='abrirModal(${task.id}, ${JSON.stringify(task.titulo)})'>Excluir</button>
            </div>


        </div>
    `;
}

function abrirModal(id, titulo) {
 tarefaIdParaExcluir = id;
    tarefaTitulo = titulo;

    const texto = document.getElementById("modalTexto");
    texto.innerHTML = `Tem certeza que deseja excluir a tarefa <strong>${tarefaTitulo}</strong> (ID: ${id})?`;

    document.getElementById("modalConfirmacao").style.display = "flex";
    document.getElementById("modalConfirmacao").style.display = "flex";
}

document.getElementById("btnCancelarModal").onclick = function () {
    document.getElementById("modalConfirmacao").style.display = "none";
};

document.getElementById("btnConfirmarModal").onclick = async function () {
    if (tarefaIdParaExcluir !== null && tarefaNome) {
        await excluirTarefa(tarefaIdParaExcluir);
    }
    document.getElementById("modalConfirmacao").style.display = "none";
};

async function carregarTarefas() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) throw new Error('Erro ao buscar tarefas');
        const data = await response.json();
            console.log(data);
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
    formNovaTarefa.style.display = 'flex';
    btnIncluir.style.display = 'none';
    msgSucesso.textContent = '';
    msgErro.textContent = '';
});

formNovaTarefa.addEventListener('submit', async (e) => {
    e.preventDefault();

    const idEdicao = formNovaTarefa.getAttribute("data-edit-id"); 

    const novaTarefa = {
        titulo: document.getElementById('titulo').value.trim(),
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
        const erros = await response.json();
           const htmlErros = erros
              .map(erro => `<p>${erro.mensagem}</p>`)
              .join("");
              document.getElementById("msgErro").innerHTML = htmlErros;
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

    document.getElementById('titulo').value = task.titulo;
    document.getElementById('responsavel').value = task.responsavel;
    document.getElementById('dataTermino').value = task.dataTermino;
    document.getElementById('detalhamento').value = task.detalhamento;

    formNovaTarefa.setAttribute("data-edit-id", id);

    formNovaTarefa.style.display = "flex";
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
