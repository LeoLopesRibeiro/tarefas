package senac.dsw.tarefas.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TarefaDTO {

    private Integer id;

    @NotBlank(message = "O titulo não pode estar vazio")
    private String titulo;

    @NotBlank(message = "O Responsável não pode estar vazio")
    private String responsavel;

    @NotNull(message = "A data de término é obrigatória")
    private LocalDate dataTermino;

    private String detalhamento;
}
