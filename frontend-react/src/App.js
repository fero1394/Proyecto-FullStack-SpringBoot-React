import React, {createContext,useContext, useReducer, useEffect, useRef , useState} from 'react';
//useRef identifica las propiedades de un componente en especifico
//reducer es un hook, funcion de react que nos ayuda administrar nuestra funcion reducer que implementa la logica necesaria para los estados y el dispatch
//useEffect nos permite trabajar en segundo plano (background) no deja que se bloquea el render es decir no espera a que el backend responda por ejemplo
const HOST_API = "http://localhost:8080/api";

//Variables iniciales para pasarlas como parametro al store
const initialState ={
  list: [],
  item:{}
};

//se crea para poder usar el store y se debe dar los estados iniciales
const Store = createContext(initialState)

//Formulario para capturar la informacion del usuario
const Form = () => {
  //identifica las propiedades de un componente en especifico en este caso el formulario
  const formRef = useRef(null);
  const {dispatch, state: {item}} = useContext(Store);
  //nos permite tener estados internos dentro del componente
  const [state, setState] = useState({item});

//metodo llamado al presionar el boton agregar de el formulario
  const onAdd = (event) => {
    event.preventDefault();

    const request = {
      name: state.name,
      id: null,
      isCompleted: false
    };

    //Este fetch especifica que es un POST el post recibe un body que es el que se modela en el request
    fetch(HOST_API+"/todo", {
      method: "POST",
      body: JSON.stringify(request),
      headers: { // en el header se dice que este contenido va a transportar un Json
        'Content-Type': 'application/json'
      }
    }) // en este then se convierte los datos (mapear) a json
    .then(response => response.json())
    .then((todo) => { //el todo es el objeto
      dispatch({type: "add-item", item: todo});
      setState({name: ""});
      formRef.current.reset();
    });
  }

  const onEdit = (event) => {
    event.preventDefault();

    const request = {
      name: state.name,
      id: item.id,
      isComplete: item.isComplete
    };

    fetch(HOST_API+"/todo", {
      method: "PUT",
      body: JSON.stringify(request),
      headers: { 
        'Content-Type': 'application/json'
      }
    }) 
    .then(response => response.json())
    .then((todo) => { //el todo es el objeto
      dispatch({type: "update-item", item: todo});
      setState({name: ""});//se borran los campos dentro del formulario
      formRef.current.reset();
    });
  }


  return <form ref={formRef}>
    <input type="text" name="name" defaultValue={item.name} onChange={(event) => {
      setState({...state, name: event.target.value})
    }}></input>
    {/**Condicionales , si el item existe entonces el boton que sale es Actualizar , si no existe sale el boton Agregar */}
    {item.id && <button onClick={onEdit}>Actualizar</button> }
    {!item.id && <button onClick={onAdd}>Agregar</button>}


  </form>


}





const List = () => {  

  //Un store es un almacen para guardar los estados internos de la aplicacion
  const {dispatch, state} = useContext(Store);

  //con este useEffect se realizan las consultas a travez de un fetch
  //El fetch es un metodo que nos permite consultar consultar por HTTP o a cualquier recurso que este en la web. el Fetch es una promesa de javascript que se necestia resolver
  useEffect(() => {
    //endpoint
    fetch(HOST_API+"/todos")
    //Aqui la promesa se convierte a un json para poder ser tratado 
    .then(response => response.json())
    .then((list) => {
      //el dispatch permite actualizacion dependiendo de la accion
      dispatch({type: "update-list", list})
    })
    //Esto son condiciones obligatorias de useEffect el primer parametro nos dice que la lista tenga contenido y que el dispatch exista para que el effect no se ejecute constantemente y se ejecute en un determinado momento, en este caso cuando se dispare el evento dispatch
  }, [state.list.length, dispatch]);

  const onDelete = (id) => {
    fetch(HOST_API + "/"+id+"/todo", {
      method: "DELETE",
    })
    .then((list) => {
      dispatch({ type: "delete-item", id})
    }) 
  }
  const onEdit = (todo) => {
    dispatch({ type: "edit-item", item: todo})
  };

  return <div>
  <table>
    <thead>
      <tr>
        <td>ID</td>
        <td>Nombre</td>
        <td>??Esta completado?</td>
      </tr>
    </thead>
    <tbody>
      {state.list.map((todo) => {
        return <tr key={todo.id}>
          <td>{todo.id}</td>
          <td>{todo.name}</td>
          <td>{todo.isCompleted === true ? "SI" : "NO"}</td>
          <td><button onClick={() => onDelete(todo.id)}>Eliminar</button></td>
          <td><button onClick={() => onEdit(todo)}>Editar</button></td>
          
        </tr>
      })}
    </tbody>
  </table>
</div>
}
//reducer es una funcion pura. toda accion debe tener un tipo para poder identificarlas
function reducer(state, action) {
  switch(action.type) {
    case 'update-item':
      const listUpdateEdit = state.list.map((item) => {
        if(item.id === action.item.id){
          return action.item;
        }
        return item;
      });
      return {...state, list: listUpdateEdit, item: {}}  
    case 'delete-item':
      const listUpdate = state.list.filter((item) => {
        return item.id !== action.id;
      });
      return {...state, list: listUpdate}
    case 'update-list':
      return {...state, list: action.list}
    case 'edit-item':
      return {...state, item: action.item}
    case 'add-item':   
    /**obten el listado reciente y a??ade un nuevo item  */
        const newList = state.list;
        newList.push(action.item);
        return {...state, list: newList}
      default:
        return state;
  }
}

//Un provide nos ayuda a conectar diferentes componentes y se basa en el contexto

const StoreProvider = ({ children }) => { //StoreProvider es un contenedor de componentes

  const [state, dispatch] = useReducer(reducer, initialState);

  //le inyectamos dos argumentos el state que reporta el estado actual y el dispatch es un metodo que nos permite 
  //enviar o notificar al reduce que cambios se quiere realizar en el sistema orientado a una accion que esta en la funcion reducer
  return <Store.Provider value={{state, dispatch}}>
    {children}
  </Store.Provider>
}






function App() {
  return (<StoreProvider>
    <Form />
    <List/>
  </StoreProvider>


  );
}

export default App;
