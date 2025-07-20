# 🔥 GUÍA AVANZADA: FLUJOS COMPLETOS MVC - ELIMINAR, EDITAR Y DRAG & DROP

## 📋 FLUJOS ADICIONALES QUE VAS A DOMINAR

1. **🗑️ ELIMINAR TAREA** - Flujo completo de eliminación
2. **✏️ EDITAR TAREA** - Flujo completo de edición
3. **🔀 DRAG & DROP** - Flujo completo de reordenamiento

---

## 🗑️ FLUJO 1: ¿QUÉ PASA CUANDO ELIMINAS UNA TAREA?

### 1️⃣ **Usuario hace clic en "Eliminar"**
```
Usuario ve la tarea → Clic en los 3 puntos → Clic en "Eliminar"
```

### 2️⃣ **CONTROLLER captura el evento** (script.js - línea 79)
```javascript
// El jefe dice: "¡Alguien quiere eliminar una tarea!"
function borrarTarea(index) {
    const tareaElement = document.getElementById(`tarea-${index}`);
    
    // 1. Pide a la VISTA que anime la eliminación
    uiFunciones.animarEliminacionTarea(tareaElement, () => {
        
        // 2. Envía al MODELO para eliminar
        const resultado = eliminarTarea(index);
        
        // 3. Si salió bien, actualiza la VISTA
        if (resultado.exito) {
            actualizarVista();
        } else {
            uiFunciones.mostrarError(resultado.mensaje);
        }
    });
}
```

### 3️⃣ **VIEW anima la eliminación** (ui.js)
```javascript
// La pantalla dice: "¡Voy a animar la eliminación!"
function animarEliminacionTarea(elemento, callback) {
    // 1. Agregar clase de animación
    elemento.classList.add('eliminando');
    
    // 2. Esperar que termine la animación
    setTimeout(() => {
        // 3. Llamar al callback (continuar con eliminación)
        callback();
    }, 300);
}
```

### 4️⃣ **MODEL elimina los datos** (lista.js - línea 127)
```javascript
// La caja fuerte dice: "OK, voy a eliminar esto"
function eliminarTarea(index) {
    // 1. ¿El índice es válido?
    if (index >= 0 && index < lista.length) {
        
        // 2. Eliminar del array
        const tareaEliminada = lista.splice(index, 1)[0];
        
        // 3. Guardar en localStorage
        guardarStorage();
        
        // 4. Responder al CONTROLLER
        return { exito: true, tareaEliminada: tareaEliminada };
    }
    
    return { exito: false, mensaje: 'Tarea no encontrada' };
}
```

### 5️⃣ **CONTROLLER actualiza la vista**
```javascript
// El jefe dice: "¡Que se actualice todo!"
actualizarVista(); // Refresca la lista completa
```

---

## ✏️ FLUJO 2: ¿QUÉ PASA CUANDO EDITAS UNA TAREA?

### 1️⃣ **Usuario hace clic en "Editar"**
```
Usuario ve la tarea → Clic en los 3 puntos → Clic en "Editar"
```

### 2️⃣ **CONTROLLER captura el evento** (controller.js - línea 109)
```javascript
// El jefe dice: "¡Alguien quiere editar una tarea!"
function modificarTarea(index) {
    // 1. ¿La tarea existe?
    if (index < 0 || index >= lista.length) {
        uiFunciones.mostrarError('Tarea no encontrada');
        return;
    }
    
    // 2. Obtener la tarea del MODELO
    const tarea = lista[index];
    
    // 3. Pedir a la VISTA que muestre el formulario de edición
    // ¡AQUÍ SE PASA guardarTareaEditada como callback!
    uiFunciones.mostrarFormularioEdicion(index, tarea, guardarTareaEditada);
}
```

### 3️⃣ **VIEW muestra formulario de edición** (view.js)
```javascript
// La pantalla dice: "¡Voy a mostrar el formulario de edición!"
function mostrarFormularioEdicion(index, tarea, guardarCallback) {
    // 1. Encontrar el elemento de la tarea
    const tareaElement = document.getElementById(`tarea-${index}`);
    
    // 2. Reemplazar el contenido con inputs
    tareaElement.innerHTML = `
        <input id="editTitulo-${index}" value="${tarea.titulo}">
        <select id="editCategoria-${index}">...</select>
        <input id="editDescripcion-${index}" value="${tarea.descripcion}">
        <button class="js-guardarTarea" data-index="${index}">Guardar</button>
        <button class="js-cancelarEdicion" data-index="${index}">Cancelar</button>
    `;
    
    // 3. Configurar evento del botón guardar
    document.querySelector(`[data-index="${index}"].js-guardarTarea`)
        .addEventListener('click', () => {
            guardarCallback(index); // Llama a guardarTareaEditada
        });
}
```

### 4️⃣ **Usuario modifica y hace clic en "Guardar"**
```javascript
// CONTROLLER captura el evento de guardar (controller.js - línea 125)
function guardarTareaEditada(index) {
    // 1. Obtener datos del formulario de edición (a través de la VISTA)
    const datosEdicion = uiFunciones.obtenerDatosFormularioEdicion(index);
    
    // 2. Actualizar a través del MODELO
    const resultado = actualizarTarea(
        index,
        datosEdicion.titulo,
        datosEdicion.categoria,
        datosEdicion.descripcion
    );
    
    // 3. Si salió bien, actualizar VISTA
    if (resultado.exito) {
        actualizarVista();
        console.log('Tarea actualizada exitosamente');
    } else {
        uiFunciones.mostrarError(resultado.mensaje);
    }
}
```

### 5️⃣ **MODEL actualiza los datos** (lista.js - línea 102)
```javascript
// La caja fuerte dice: "OK, voy a actualizar esto"
function actualizarTarea(index, nuevoTitulo, nuevaCategoria, nuevaDescripcion) {
    // 1. ¿Los datos están bien?
    if (!nuevoTitulo.trim()) {
        return { exito: false, mensaje: 'El título no puede estar vacío' };
    }
    
    // 2. Actualizar el objeto en el array
    lista[index].titulo = nuevoTitulo;
    lista[index].categoria = nuevaCategoria;
    lista[index].descripcion = nuevaDescripcion;
    
    // 3. Guardar en localStorage
    guardarStorage();
    
    // 4. Responder al CONTROLLER
    return { exito: true, tarea: lista[index] };
}
```

---

## 🔀 FLUJO 3: ¿QUÉ PASA CON DRAG & DROP?

### 1️⃣ **Usuario arrastra una tarea**
```
Usuario hace clic y mantiene → Arrastra → Suelta sobre otra tarea
```

### 2️⃣ **VIEW captura eventos de drag** (ui.js)
```javascript
// La pantalla dice: "¡Alguien está arrastrando!"

// Cuando empieza el arrastre
tarea.addEventListener('dragstart', function(e) {
    tareaArrastrada = this;  // Guardar referencia
    this.style.opacity = '0.5';  // Efecto visual
});

// Cuando se mueve sobre otro elemento
tarea.addEventListener('dragover', function(e) {
    e.preventDefault();  // Permitir drop
    this.style.borderTop = '2px solid blue';  // Indicador visual
});

// Cuando se suelta
tarea.addEventListener('drop', function(e) {
    e.preventDefault();
    this.style.borderTop = '';  // Quitar indicador
    
    // Si se soltó en diferente tarea
    if (tareaArrastrada !== this) {
        // Llamar al CONTROLLER
        cambiarOrdenTareas(tareaArrastrada, this);
    }
});
```

### 3️⃣ **CONTROLLER coordina el reordenamiento** (script.js - línea 149)
```javascript
// El jefe dice: "¡Hay que reordenar las tareas!"
function cambiarOrdenTareas(tareaOrigen, tareaDestino) {
    // 1. Extraer índices de los IDs
    const indiceOrigen = parseInt(tareaOrigen.id.split('-')[1]);
    const indiceDestino = parseInt(tareaDestino.id.split('-')[1]);
    
    // 2. Enviar al MODELO para reordenar
    const resultado = reordenarTareas(indiceOrigen, indiceDestino);
    
    // 3. Si salió bien, actualizar VISTA
    if (resultado.exito) {
        actualizarVista();
    } else {
        uiFunciones.mostrarError(resultado.mensaje);
    }
}
```

### 4️⃣ **MODEL reordena los datos** (lista.js - línea 165)
```javascript
// La caja fuerte dice: "OK, voy a cambiar el orden"
function reordenarTareas(indiceOrigen, indiceDestino) {
    // 1. ¿Los índices son válidos?
    if (indiceOrigen < 0 || indiceOrigen >= lista.length || 
        indiceDestino < 0 || indiceDestino >= lista.length) {
        return { exito: false, mensaje: 'Índices inválidos' };
    }
    
    // 2. Mover el elemento en el array
    const tareaMovida = lista.splice(indiceOrigen, 1)[0];  // Sacar
    lista.splice(indiceDestino, 0, tareaMovida);           // Insertar
    
    // 3. Guardar en localStorage
    guardarStorage();
    
    // 4. Responder al CONTROLLER
    return { exito: true };
}
```

### 5️⃣ **VIEW actualiza la pantalla**
```javascript
// La pantalla dice: "¡Voy a mostrar el nuevo orden!"
actualizarVista(); // Refresca toda la lista con el nuevo orden
```

---

## 🎯 RESUMEN DE PATRONES

### **🔄 PATRÓN COMÚN EN TODOS LOS FLUJOS:**

1. **👆 USUARIO** → Interactúa con la interfaz
2. **🎮 VIEW** → Captura eventos (opcional: animaciones)
3. **🎛️ CONTROLLER** → Coordina y valida
4. **📦 MODEL** → Procesa datos y persiste
5. **🎮 VIEW** → Se actualiza para mostrar cambios

### **💡 OBSERVACIONES IMPORTANTES:**

✅ **VIEW nunca habla directamente con MODEL**
✅ **CONTROLLER siempre es el intermediario**
✅ **MODEL solo se encarga de datos**
✅ **VIEW solo se encarga de presentación**

---

## 🎮 EJERCICIOS PARA PRACTICAR

### **🗑️ EJERCICIO 1: Sigue el flujo de eliminación**
1. Abre el proyecto en el navegador
2. Crea una tarea
3. Ve a `script.js` línea 79 (`borrarTarea`)
4. Haz clic en eliminar y sigue el flujo paso a paso

### **✏️ EJERCICIO 2: Sigue el flujo de edición**
1. Ve a `script.js` línea 109 (`modificarTarea`)
2. Haz clic en editar una tarea
3. Ve a `ui.js` y busca `mostrarFormularioEdicion`
4. Modifica algo y ve el flujo completo

### **🔀 EJERCICIO 3: Sigue el drag & drop**
1. Ve a `script.js` línea 149 (`cambiarOrdenTareas`)
2. Arrastra una tarea
3. Ve cómo se coordina todo el flujo

---

## 🚀 ¡AHORA YA DOMINAS TODOS LOS FLUJOS MVC!

Con esta guía ya entiendes:
- ✅ **Crear tareas** (guía anterior)
- ✅ **Eliminar tareas** (esta guía)
- ✅ **Editar tareas** (esta guía)  
- ✅ **Reordenar tareas** (esta guía)

**¡Tu arquitectura MVC ya no tiene secretos!** 🎉
