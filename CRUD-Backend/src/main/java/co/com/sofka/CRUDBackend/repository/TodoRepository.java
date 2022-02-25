package co.com.sofka.CRUDBackend.repository;

import co.com.sofka.CRUDBackend.models.Todo;
import org.springframework.data.repository.CrudRepository;

public interface TodoRepository  extends CrudRepository<Todo, Long> {
}
