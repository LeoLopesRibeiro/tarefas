package senac.dsw.tarefas.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import senac.dsw.tarefas.model.Tarefa;
import senac.dsw.tarefas.model.TarefaDTO;
import senac.dsw.tarefas.repository.TarefaRepository;
import senac.dsw.tarefas.service.TarefaService;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/tarefas")
@CrossOrigin(origins ="*")
public class TarefaRestController {
    @Autowired
    private TarefaRepository repository;
    @Autowired
    private TarefaService service;

    @PostMapping("/cadastrar")
    public ResponseEntity<Tarefa> cadastrar(@RequestBody @Valid TarefaDTO tarefa) {
        if (tarefa == null) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(null);
        }
        Tarefa tarefaCriada = service.criarTarefa(tarefa);

        return ResponseEntity.status(HttpStatus.CREATED).body(tarefaCriada);
    }

    @GetMapping
    public List<Tarefa> listar() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tarefa> buscarPorId(@PathVariable Integer id) {
        Tarefa tarefa = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tarefa não encontrada"));
        return ResponseEntity.ok(tarefa);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Integer id) {
        service.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> editar(@PathVariable Integer id, @RequestBody @Valid TarefaDTO tarefaDTO) {
        service.editar(id, tarefaDTO);
        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<List<Map<String, String>>> handlerException(MethodArgumentNotValidException ex) {
        List<Map<String, String>> errors = new ArrayList<>();

        ex.getBindingResult().getFieldErrors().forEach(error -> {
            Map<String, String> err = new HashMap<>();
       //     err.put("campo", error.getField());
            err.put("mensagem", error.getDefaultMessage());
            errors.add(err);    });


        return ResponseEntity.badRequest().body(errors);
    }


}
