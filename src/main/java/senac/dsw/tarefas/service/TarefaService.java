package senac.dsw.tarefas.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import senac.dsw.tarefas.model.Tarefa;
import senac.dsw.tarefas.model.TarefaDTO;
import senac.dsw.tarefas.repository.TarefaRepository;

import java.util.List;
@Service
public class TarefaService {
    @Autowired
    TarefaRepository repository;
    public List<Tarefa> findAll(){
        return repository.findAll();
    }

    public Tarefa criarTarefa(TarefaDTO tarefaDTO){
        Tarefa tarefa = new Tarefa();
        tarefa.setNome(tarefaDTO.getNome());
        tarefa.setResponsavel(tarefaDTO.getResponsavel());
        tarefa.setDataTermino(tarefaDTO.getDataTermino());
        tarefa.setDetalhamento(tarefaDTO.getDetalhamento());
        return repository.save(tarefa);
    }
}
