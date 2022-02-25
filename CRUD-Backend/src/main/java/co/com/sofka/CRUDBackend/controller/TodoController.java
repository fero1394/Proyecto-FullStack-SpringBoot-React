package co.com.sofka.CRUDBackend.controller;

import co.com.sofka.CRUDBackend.Service.TodoService;
import co.com.sofka.CRUDBackend.models.Todo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
public class TodoController {

    //inyeccion de el Service para que pueda acceder a los servicion en controller...
    @Autowired
    private TodoService service;

    @GetMapping(value = "api/todos")
    public Iterable<Todo> list(){
        return service.list();
    }

    /**
     * Guardar
     */
    @PostMapping(value = "api/todo")
    public Todo save(@RequestBody Todo todo){
        return service.save(todo);
    }

    /**
     * Actualizar
     */
    @PutMapping(value = "api/todo")
    public Todo update(@RequestBody Todo todo){
        if(todo.getId() != null) {
            return service.save(todo);
        }
        throw new RuntimeException("No existe el id para actualizar");
    }


    @DeleteMapping(value = "api/{id}/todo")
    public void delete(@PathVariable("id")Long id){
        service.delete(id);
    }

    /**
     * se le añade una exepcion al final por si no se encuentra el id
     */
    @GetMapping(value = "api/{id}/todo")
    public Todo get(@PathVariable("id")Long id){
        return service.get(id);
    }
}
