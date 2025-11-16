package senac.dsw.tarefas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
@Table(name = "tarefas")
public class Tarefa {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @NotNull
    @Column(name = "nome")
    String nome;

    @NotNull
    @Column(name = "responsavel")
    String responsavel;

    @NotNull
    @Column(name = "dataTermino")
    LocalDate dataTermino;

    @NotNull
    @Column(name = "detalhamento")
    String detalhamento;
}
