const tareaInput = document.getElementById('tareaInput')
const botonAgregar = document.getElementById('botonAgregar')
const listaTareas = document.getElementById('listaTareas')

// Función para guardar las tareas actuales en localStorage
function guardarTareas() {
  const tareasArray = [];// Creamos un array para guardar texto y estado de completado
  
  listaTareas.querySelectorAll('li').forEach(li => {
    tareasArray.push({
      texto: li.firstChild.textContent, // el texto de la tarea
      completado: li.classList.contains('completado') // si tiene o no la clase completado
    });
  });
  localStorage.setItem('tareas', JSON.stringify(tareasArray));
};

// Función que recupera las tareas desde localStorage y las muestra en pantalla
function cargarTareas() {
  
  // Obtenemos el string guardado en localStorage con clave 'tareas' y lo convertimos en un array de objetos
  const tareasGuardadas = JSON.parse(localStorage.getItem('tareas'));

  // Si no hay nada guardado (es null), salimos de la función sin hacer nada
  if (!tareasGuardadas) return;

  // Recorremos cada objeto del array (cada tarea)
  tareasGuardadas.forEach(tareaObj => {

    const li = document.createElement("li"); // Creamos un nuevo <li> para representar la tarea en la lista

    // Le asignamos como texto el contenido de la tarea (propiedad 'texto')
    li.textContent = tareaObj.texto;

    // Si la tarea estaba marcada como completada, le aplicamos la clase que la tacha
    if (tareaObj.completado) {
      li.classList.add('completado');
    }

    // Creamos un botón para eliminar la tarea
    const botonEliminar = document.createElement("button");

    // Le damos texto al botón (podría ser "🗑" si prefieres icono)
    botonEliminar.textContent = "Eliminar";

    // Añadimos clases de Bootstrap para estilos visuales del botón
    botonEliminar.classList.add("btn", "btn-danger", "btn-sm", "ms-2");

    // Añadimos funcionalidad al botón: eliminar el <li> cuando se hace clic
    botonEliminar.addEventListener('click', () => {
      li.remove();           // Elimina el elemento visualmente
      guardarTareas();       // Guarda el estado actualizado en localStorage
    });

    // Añadimos funcionalidad al <li> completo: al hacer clic se marca/desmarca como completado
    li.addEventListener('click', () => {
      li.classList.toggle('completado'); // Alterna la clase 'completado' (tacha o destacha)
      guardarTareas();                   // Guarda el estado actualizado
    });

    // Agregamos el botón eliminar como hijo del <li>
    li.appendChild(botonEliminar);

    // Finalmente, añadimos el <li> completo (con texto y botón) a la lista en el HTML
    listaTareas.appendChild(li);
  });
}


// Carga las tareas guardadas al cargar la página
window.addEventListener('load', cargarTareas);

// Creamos el listener 
botonAgregar.addEventListener('click', () => { 

    //Creamos la constante tarea que adquiere el valor del input y utiliza.trim para eliminar espacios al principio y al final del input.
    const tarea = tareaInput.value.trim();

    //if tarea !== "" estamos indicando que si la variable tarea NO es igual a nada se ejecute lo siguiente
    if (tarea !== "") {

        //Se declara una constante li que sera la creación del elemento li, sin introducirla al HTML aun
        const li = document.createElement("li");
        li.textContent = tarea;
        li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

        //Lo mismo con el botón eliminar 
        const botonEliminar = document.createElement("button") 
        botonEliminar.textContent = "Eliminar"
        botonEliminar.classList.add("btn", "btn-danger", "btn-sm", "ms-2");

        //Aquí creamos el listener del botón eliminar para que cumpla la función de eliminar la tarea(li) al hacerle click
        botonEliminar.addEventListener ('click', () => {
            li.remove();
            guardarTareas(); // guardar cambios al eliminar
        }); //Aquí cierra el listener del botón eliminar 

        //Aquí creamos el listener para tachar las tareas con click
        li.addEventListener('click', () => {
            li.classList.toggle('completado');
            guardarTareas(); // guardar cambios al marcar completado
        }); //Aquí cierra el listener

        //Aquí hacemos el botón eliminar hijo del li "la tarea"
        li.appendChild(botonEliminar);

        //Y aquí el li se vuelve hijo de la constante listaTareas que sería la ul en el HTML
        listaTareas.appendChild(li);

        // Esto borra lo que se escribió en el input
        tareaInput.value = ""

        // Guardamos la nueva tarea en localStorage
        guardarTareas();
    }

    //para el else mandaremos una alerta diciendo que el campo está vacío
    else {
        alert('Campo vacío!')
    }
});

// También permite agregar tarea al presionar Enter dentro del input
tareaInput.addEventListener('keydown', (evento) => {
  if (evento.key === 'Enter') {
    botonAgregar.click(); // Simula un clic en el botón Agregar
  }
});
