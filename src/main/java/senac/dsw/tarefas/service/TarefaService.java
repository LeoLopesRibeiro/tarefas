package senac.dsw.tarefas.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import senac.dsw.tarefas.model.Tarefa;
import senac.dsw.tarefas.model.TarefaDTO;
import senac.dsw.tarefas.repository.TarefaRepository;

import java.util.List;
import java.util.Optional;

@Service
public class TarefaService {
    @Autowired
    TarefaRepository repository;

    public List<Tarefa> findAll() {
        return repository.findAll();
    }
    
    public Optional<Tarefa> findById(Integer id) {
        return repository.findById(id);
    }
    
    public Tarefa criarTarefa(TarefaDTO tarefaDTO) {
        Tarefa tarefa = new Tarefa();
        tarefa.setTitulo(tarefaDTO.getTitulo());
        tarefa.setResponsavel(tarefaDTO.getResponsavel());
        tarefa.setDataTermino(tarefaDTO.getDataTermino());
        tarefa.setDetalhamento(tarefaDTO.getDetalhamento());
        return repository.save(tarefa);
    }

    public void excluir(Integer id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Tarefa não encontrada");
        }
        repository.deleteById(id);
    }

    public void editar(Integer id, TarefaDTO tarefaDTO) {

        Tarefa tarefa = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));

        tarefa.setTitulo(tarefaDTO.getTitulo());
        tarefa.setResponsavel(tarefaDTO.getResponsavel());
        tarefa.setDataTermino(tarefaDTO.getDataTermino());
        tarefa.setDetalhamento(tarefaDTO.getDetalhamento());

        repository.save(tarefa);
    }
}
