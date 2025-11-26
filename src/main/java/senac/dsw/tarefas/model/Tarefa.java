package senac.dsw.tarefas.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.*;

@Entity
@Data
@Table(name = "tarefas")
public class Tarefa {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Integer id;

    @NotNull
    @Column(name = "titulo")
    String titulo;

    @NotNull
    @Column(name = "responsavel")
    String responsavel;

    @NotNull
    @Column(name = "dataTermino")
    LocalDate dataTermino;

    @NotNull
    @Column(name = "detalhamento")
    String detalhamento;

    public static boolean isDateLate(LocalDate dateToCheck) {
        LocalDate today = LocalDate.now(ZoneId.systemDefault());
        return dateToCheck.isBefore(today);
    }

    public boolean isAtrasada(){
        return isDateLate(getDataTermino());
    }
}
