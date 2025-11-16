package senac.dsw.tarefas.model;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class TarefaDTO {
    @NotBlank(message = "O nome não pode estar vazio")
    private String nome;

    @NotBlank(message = "O Responsável não pode estar vazio")
    // @Size(min = 1, max = 100)
    private String responsavel;

    @NotNull(message = "A data de término é obrigatória")
    @FutureOrPresent
    private LocalDate dataTermino;

    private String detalhamento;
}
