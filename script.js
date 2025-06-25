const tareaInput = document.getElementById('tareaInput')
const botonAgregar = document.getElementById('botonAgregar')
const listaTareas = document.getElementById('listaTareas')

//Primero creamos el listener 
botonAgregar.addEventListener('click', () => { 

    //Creamos la cosntante tarea que adquiere el valor del input y utiliza.trim para eliminar espacios al principio y al final del input.
    const tarea = tareaInput.value.trim();

    //if tarea !== "" estamos indican que si la variable tarea NO es igual a nada se ejecute lo siguiente
    if (tarea !== "") {

        //Se declara una contante li que sera la creacion del elemento li, sin introducirla al HTML aun
        const li = document.createElement("li");
        li.textContent = tarea;

        //Lo mismo con el boton eliminar 
        const botonEliminar = document.createElement("button") 
        botonEliminar.textContent = "Eliminar"
        botonEliminar.classList.add("btn", "btn-danger", "btn-sm", "ms-2");

        //Aqui creamos el listener del boton eliminar para que cumpla la funcion de eliminar la tarea(li) al hacerle click
        botonEliminar.addEventListener ('click', () => {
            li.remove();
        }); //Aqui cierra el listener del boton eliminar 

        //Aqui creamos el listener para tachar las tareas con click
        li.addEventListener('click', () => {
            li.classList.toggle('completado')
        }); //Aqui cierra el listener

        //Aqui hacemos el boton eliminar hijo del li "la tarea"
        li.appendChild(botonEliminar);

        //Y aqui el li se vuelve hijo de la constante listaTareas que seria la ul en el HTML
        listaTareas.appendChild(li);

        

        //Esto borra lo que se escribio en el input
        tareaInput.value = ""
    }


    //para el else mandaremos una alerta diciendo que el campo esta vacio
    else {
        alert('Campo vacio!')
    }
});

