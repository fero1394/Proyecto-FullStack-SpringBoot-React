package co.com.sofka.CRUDBackend.Service;

import co.com.sofka.CRUDBackend.models.Todo;
import co.com.sofka.CRUDBackend.repository.TodoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TodoService {

    /**
     * Inyeccion de repositorio
     */

    @Autowired
    private TodoRepository repository;

    /**
     * lista todos los elementos
     */
    public Iterable<Todo> list(){
        return repository.findAll();
    }

    public Todo save(Todo todo){
        return repository.save(todo);
    }

    public void delete(Long id){
        repository.delete(get(id));
    }

    /**
     * se le añade una exepcion al final por si no se encuentra el id
     */
    public Todo get(Long id){
        return repository.findById(id).orElseThrow();
    }
}
