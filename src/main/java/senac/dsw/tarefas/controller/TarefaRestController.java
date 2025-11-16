package senac.dsw.tarefas.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import senac.dsw.tarefas.model.Tarefa;
import senac.dsw.tarefas.model.TarefaDTO;
import senac.dsw.tarefas.repository.TarefaRepository;
import senac.dsw.tarefas.service.TarefaService;

import java.util.List;
import java.util.Map;
import java.util.Objects;

@RestController
@RequestMapping("/tarefas")
public class TarefaRestController {
    @Autowired
    private TarefaRepository repository;
    @Autowired
    private TarefaService service;

    @PostMapping
    public ResponseEntity<Tarefa> cadastrar(@RequestBody @Valid TarefaDTO tarefa) {
        Tarefa tarefaCriada = service.criarTarefa(tarefa);
        return ResponseEntity.status(HttpStatus.CREATED).body(tarefaCriada);
    }

    @GetMapping
    public List<Tarefa> listar() {
        return service.findAll();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }
    
    // @PutMapping("/{id}")
    // public ResponseEntity<Void> alterar(@PathVariable Integer id) {
    //     service.alterar(id);
    //     return ResponseEntity.noContent().build();
    // }

}
