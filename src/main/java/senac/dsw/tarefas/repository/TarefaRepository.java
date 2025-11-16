package senac.dsw.tarefas.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import senac.dsw.tarefas.model.Tarefa;

public interface TarefaRepository extends JpaRepository<Tarefa, Integer> {
    
}
