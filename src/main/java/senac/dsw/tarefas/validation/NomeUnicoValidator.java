package senac.dsw.tarefas.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;
import senac.dsw.tarefas.service.TarefaService;

//public class NomeUnicoValidator implements ConstraintValidator<NomeUnico, String> {
//
//    @Autowired
//    TarefaService service;
//    @Override
//    public boolean isValid(String titulo, ConstraintValidatorContext context) {
//        return service.findByTitulo(titulo) == null;
//    }
//}
