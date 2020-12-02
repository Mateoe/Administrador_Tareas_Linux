function inicializarPagina(direccion){
	
	// Obtener carpetas del servidor como un arreglo
	var request = new XMLHttpRequest();
	var procedimiento = "obtenerElementos";

	request.open("POST", "procedimientosLinux.php", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.onreadystatechange = obtenerElementos;
	request.send(`procedimiento=${procedimiento}&variableA=${direccionActual_chdir}`);

	// Haciendo que el formulario sea arrastrable
	asignarArrastracion();

	// Añadiendo los escuchadores de los menús delplegables
	document.getElementById("nuevo").addEventListener("click", desplegarNuevo, false)
	document.getElementById("nuevo").addEventListener("mouseenter", quitarNuevo, false)
	document.getElementById("contenidoNuevo").addEventListener("mouseleave", quitarNuevo, false)

	document.getElementById("permisos").addEventListener("click", desplegarPermisos, false)
	document.getElementById("permisos").addEventListener("mouseenter", quitarPermisos, false)
	document.getElementById("contenidoPermisos").addEventListener("mouseleave", quitarPermisos, false)

	// Añadiendo los escuchadores de cada funcionalidad
	document.getElementById("entrarCarpeta").addEventListener("click", abrirCarpeta, false)
	document.getElementById("volver").addEventListener("click", volver, false)
	document.getElementById("nuevoArchivo").addEventListener("click", ventanaNuevo, false)
	document.getElementById("nuevaCarpeta").addEventListener("click", ventanaNuevo, false)
	document.getElementById("cambiarNombre").addEventListener("click", ventanaCambiarNombre, false)
	document.getElementById("eliminar").addEventListener("click", ventanaEliminar, false)
	document.getElementById("copiar").addEventListener("click", copiarCortar, false)
	document.getElementById("cortar").addEventListener("click", copiarCortar, false)
	document.getElementById("pegar").addEventListener("click", pegar, false)
	document.getElementById("cambiarPermisos").addEventListener("click", ventanaVerCambiarPermisos, false)
	document.getElementById("verPermisos").addEventListener("click", ventanaVerCambiarPermisos, false)
	document.getElementById("cambiarPropietario").addEventListener("click", ventanaCambiarPropietario, false)
}

function asignarArrastracion() {
	// Propósito: Hacer que el formulario sea "arrastrable"

	var formulario = document.getElementById("divFormulario");
	var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

	// Se asigna la barra del formulario como el lugar de donde se lo arrastra
	document.getElementById("barraFormulario").onmousedown = clickMouse;

	function clickMouse(input) {
		input = input || window.event;
		input.preventDefault();

		// Se obtienen las coordenadas X y Y de la posición inicial del mouse
		pos3 = input.clientX; pos4 = input.clientY;

		// Asignando evento para cuando se deja de hacer click
		document.onmouseup = closeDragElement;

		// Asignando evento para cuando se arrastra el mouse
		document.onmousemove = arrastrarFormulario;
	}

	function arrastrarFormulario(input) {
		input = input || window.event;
		input.preventDefault();

		// Se obtienen las nuevas coordenadas del mouse
		pos1 = pos3 - input.clientX;
		pos2 = pos4 - input.clientY;
		pos3 = input.clientX;
		pos4 = input.clientY;

		// Se mueve la ventana segun las nuevas coordenadas
		formulario.style.top = (formulario.offsetTop - pos2) + "px";
		formulario.style.left = (formulario.offsetLeft - pos1) + "px";
	}

	function closeDragElement() {
		// Se deja quitan los eventos al dejar de hacer click
		document.onmouseup = null; document.onmousemove = null;
	}
}

function obtenerElementos(request) {

	var respuesta; var aux; var auxPermisos; var auxAuxPermisos; var tipo; var nombre;
	request = request.target;

	if (request.readyState == 4 && request.status == 200) {

		respuesta = request.responseText;
		respuesta = respuesta.replace(/      /g, ",");
		respuesta = respuesta.replace(/     /g, ",");
		respuesta = respuesta.replace(/    /g, ",");
		respuesta = respuesta.replace(/   /g, ",");
		respuesta = respuesta.replace(/  /g, ",");
		respuesta = respuesta.replace(/ /g, ",");

		aux = respuesta.split("\n");

		respuesta = new Array(aux.length - 2);

		for (var i = 0; i < respuesta.length; i++) {
			respuesta[i] = aux[i + 1].split(",");
			auxPermisos = respuesta[i][0].split("");

			for (var j = 1; j < auxPermisos.length; j++) {
				if (auxPermisos[j] == "-") auxPermisos[j] = 0;
				else auxPermisos[j] = 1;
			}
			respuesta[i][0] = new Array(2);
			respuesta[i][0][0] = auxPermisos[0];

			auxAuxPermisos = auxPermisos.slice(1, auxPermisos.length);
			auxPermisos = new Array(3);

			j = 0;
			for (var k = 0; k < auxPermisos.length; k++) {
				auxPermisos[k] = parseInt(auxAuxPermisos.slice(j, j + 3).join(""), 2);
				j+=3;
			}
			respuesta[i][0][1] = auxPermisos
		}

		carpetasArchivos = new Map(); nombreCodigo = new Map();;
		for (var i = 0; i < respuesta.length; i++) {

			if (respuesta[i][0][0] == "d") tipo = "carpeta";
			else tipo = "archivo"

			if (respuesta[i].length <= 9) {nombre = respuesta[i][8]}
			else {
				var nombreAux = [];
				for (var j = 0; j < respuesta[i].length - 8; j++) {
					nombreAux.push(respuesta[i][j + 8]);
				}
				nombre = nombreAux.join(" ");
			}

			carpetasArchivos.set(i, {
				nombre: nombre,
				tipo: tipo,
				permisos: respuesta[i][0][1],
				propietario: respuesta[i][2],
			});
			nombreCodigo.set(carpetasArchivos.get(i).nombre, i);
		}
		idUnico = i;

		// Organizando carpetas y asignandoles escuchadores
		inicializarCarpetas();
	}
}

function inicializarCarpetas(){
	// Propósito: Asignar todas las carpetas y archivos a la vista del usuario, mijo!

	// Se inicializan las variables auxiliares
	existeProceso = false; condicionCopiadoCortado = "";

	// Se esconde el formulario en caso de quede abierto
	quitarFormulario(); condBorrado = false;

	// Ciclos para posicionar las carpetas y/o archivos en la página
	var informacion = []; var k = 0; 
	var icono; var tipo; 
	var iterador = carpetasArchivos[Symbol.iterator](); var llaveValor;

	for (var i = 0; i < Math.ceil(carpetasArchivos.size / 7); i++) {

		informacion.push("<tr>")

		for (var j = 0; j < 7; j++) {
			// Aquí faltaría un condicional para determinar si son carpetas o archivos y algo para extraer su nombre y otros elementos para identificarlos (referencia en el Backend)
			if (k >= carpetasArchivos.size){
				break;
			}
			else {
				llaveValor = iterador.next().value;
				if (llaveValor[1].tipo == "carpeta") {
					tipo = "class='carpeta' "; icono = "src='Iconos/Carpeta.png'";
				}
				else if (llaveValor[1].tipo == "archivo") {
					tipo = "class='archivo' "; icono = "src='Iconos/Archivo.png'";
				}
				informacion.push("<td><figure> <img " + tipo + icono + " id='" + llaveValor[0] + "' name='" + llaveValor[1].nombre + "'> <figcaption>" + llaveValor[1].nombre + "</figcaption></figure></td>")
			}
			k++
		}
		informacion.push("</tr>")
	}
	document.getElementById("explorador").innerHTML = informacion.join("")

	// Asignando las funciones respectivas a cada carpeta y archivo
	var asignador = document.querySelectorAll("#explorador img")
	for (var i = 0; i < asignador.length; i++) {
		if (asignador[i].className == "carpeta") {
			asignador[i].addEventListener("click", clickCarpArch, false)
			asignador[i].addEventListener("mouseover", overCarpArch, false)
			asignador[i].addEventListener("mouseout", removeCarpArch, false)
		}
		else if (asignador[i].className == "archivo") {
		 	asignador[i].addEventListener("click", clickCarpArch, false)
		 	asignador[i].addEventListener("mouseover", overCarpArch, false)
		 	asignador[i].addEventListener("mouseout", removeCarpArch, false)
		}
	}
}

function volver () {

	// Comprobando que no exista otro proceso en curso
	if (advertenciaFormulario() == false){return;}

	direccionActual = raiz;
	direccionActual_chdir = raiz;

	// Aquí iria un código con php q devuelva una lista con las carpetas correspondientes
	inicializarPagina();
	seleccionados = new Array(); ultimaSeleccion = -1;

	// Aquí iria un código con php q devuelva una lista con las carpetas correspondientes
	inicializarPagina()
}

function abrirCarpeta () {

	// Comprobando que se halla seleccionado un solo archivo
	if (advertenciaSeleccionados(true) == false){return;}

	// Comprobando que no se ha seleccionado un archivo como destino
	if (carpetasArchivos.get(ultimaSeleccion).tipo == "archivo") {
		alert("Ha seleccionado un archivo, por favor seleccione una carpeta"); return;
	}

	// Comprobando que no exista otro proceso en curso
	if (advertenciaFormulario() == false){return;}

	// Propósito: Llevar al usuario a una carpeta seleccionada
	direccionActual = direccionActual + "/" + "'" + carpetasArchivos.get(ultimaSeleccion).nombre + "'";
	direccionActual_chdir = direccionActual_chdir + "/" + carpetasArchivos.get(ultimaSeleccion).nombre

	// Aquí iria un código con php q devuelva una lista con las carpetas correspondientes
	inicializarPagina();
	seleccionados = new Array(); ultimaSeleccion = -1;
}

function clickCarpArch(input) {
	// Propósito: Darle otro color al fondito si le dan click y determinar el último elemento seleccionado
	if (input.target.parentNode.parentNode.style.backgroundColor == "rgba(0, 121, 250, 0.31)") {
		input.target.parentNode.parentNode.style.backgroundColor = "";

		if (!condBorrado) {
			seleccionados = seleccionados.filter(id => id != parseInt(input.target.id));
			if (seleccionados.length == 0) {
				ultimaSeleccion = -1;
			}
			else {
				ultimaSeleccion = seleccionados[seleccionados.length - 1];
			}
		}
	}
	else if (input.target.parentNode.parentNode.style.backgroundColor == "rgba(42, 226, 237, 0.31)") {
		input.target.parentNode.parentNode.style.backgroundColor = "rgba(0, 121, 250, 0.31)";
		if (!condBorrado) {
			seleccionados.push(parseInt(input.target.id));
			ultimaSeleccion = parseInt(input.target.id);
		}
	}
}

function overCarpArch (input) {
	// Propósito: Esta función le pone un fondito a la cosa seleccionada para dar un efecto de que lo ha seleccionado, así todo bonito, sornero
	var color = input.target.parentNode.parentNode.style.backgroundColor;
	if (color != "rgba(42, 226, 237, 0.31)" && color != "rgba(0, 121, 250, 0.31)" && color != "rgba(23, 174, 49, 0.31)") { input.target.parentNode.parentNode.style.backgroundColor = "rgba(42, 226, 237, 0.31)"; }
}

function removeCarpArch (input) {
	// Propósito: Esta función le quita el fondito a la cosa seleccionada
	if (input.target.parentNode.parentNode.style.backgroundColor == "rgba(42, 226, 237, 0.31)") { input.target.parentNode.parentNode.style.backgroundColor = "" }
}

function desplegarNuevo(){
	// Propósito: Despliega un menú al darle click en nuevo (nuevo archivo o carpeta)
	var menu = document.getElementById("contenidoNuevo");
	if (menu.style.display == "none"){ menu.style.display = "block"; }
	else { menu.style.display = "none" }
}

function quitarNuevo(){
	// Propósito: Remueve el menú de 'Nuevo'
	document.getElementById("contenidoNuevo").style.display = "none";
}

function desplegarPermisos() {
	// Propósito: Despliega un menú al darle click en permisos (ver y cambiar permisos)
	var menu = document.getElementById("contenidoPermisos");
	if (menu.style.display == "none"){ menu.style.display = "block"; }
	else { menu.style.display = "none" }
}

function quitarPermisos(){
	// Propósito: Remueve el menú de 'Permisos'
	document.getElementById("contenidoPermisos").style.display = "none";
}

function advertenciaFormulario(){
	// Propósito: Esta función le advierte al mijín q cierre la ventana del formulario
	if (existeProceso) { 
		alert("Por favor cierra la ventana actual antes de realizar otra acción");
		return false;
	}
	else {
		existeProceso = true;
		return true;
	}
}

function quitarFormulario() {
	// Propósito: ocultar el formulario y remover los escuchadores de eventos para evitar q se asigne dos o mas al mismo botón

	var botonConfirmar = document.getElementById("botonConfirmar");
	var botonCancelar = document.getElementById("botonCancelar");
	var entrada = document.getElementById("entrada");
	var formulario = document.getElementById("divFormulario");

	formulario.style.display = "none";
	formulario.style.width = "auto";

	entrada.style.display = "unset";
	entrada.removeEventListener("keydown", cambiarNombre);
	entrada.removeEventListener("keydown", nuevo);
	entrada.value = "";

	contrasena = document.getElementById("contrasena").style.display = "none";

	botonConfirmar.style.display = "unset";
	botonConfirmar.removeEventListener("click", nuevo);
	botonConfirmar.removeEventListener("click", cambiarNombre);
	botonConfirmar.removeEventListener("click", eliminar);
	botonConfirmar.removeEventListener("click", cambiarPermisos);
	botonConfirmar.removeEventListener("click", cambiarPropietario);

	botonCancelar.removeEventListener("click", quitarFormulario);
	botonCancelar.removeEventListener("click", inicializarCarpetas);

	document.getElementById("botonCancelar").innerHTML = "Cancelar";

	document.getElementById("tablaPermisos").style.display = "none";

	existeProceso = false; condBorrado = false;
}

function ventanaNuevo(input) {

	var etiqueta; var placeholder;

	// Comprobando que no exista otro proceso en curso
	if (advertenciaFormulario() == false){return;}

	// Verificando el tipo de elemento a ser creado para establecer los mensajes
	if (input.target.id == "nuevoArchivo") {
		etiqueta = "del nuevo archivo"; placeholder = "Nuevo archivo";
	}
	else if (input.target.id == "nuevaCarpeta"){
		etiqueta = "de la nueva carpeta"; placeholder = "Nueva carpeta";
	}

	// Mostrando el formulario
	document.getElementById("divFormulario").style.display = "block";

	// Asignando la información del formulario para el usuario
	document.getElementById("tituloFormulario").innerHTML = "Ingresa el nombre " + etiqueta;
	var entrada = document.getElementById("entrada");
	entrada.placeholder = placeholder;
	entrada.addEventListener("keydown", nuevo);
	entrada.select();

	// Asignando la función correspondiente a cada botón
	document.getElementById("botonConfirmar").addEventListener("click", nuevo);
	document.getElementById("botonCancelar").addEventListener("click", quitarFormulario);
}

function nuevo(input) {
	// Propósito: Crear un nuevo archivo o carpeta con el nombre proveido

	var tipo; var permisos;

	// Condicional para ejecutar el método en caso de que se haya presionado enter
	if (input.type != "click" && input.keyCode != 13) { return; }
	else { input.preventDefault(); input.stopPropagation(); }

	// Se obtiene el valor de la etiqueta para determinar que es lo nuevo que se va a crear
	var placeholder = document.getElementById("entrada").placeholder;

	if (placeholder == "Nuevo archivo"){
		tipo = "archivo"; permisos = [7,7,7];
	}
	else if (placeholder == "Nueva carpeta"){
		tipo = "carpeta"; permisos = [7,7,7];
	}

	// Obteniendo el valor ingresado, en caso de no haber ingresado, se le da un valor genérico
	var valorIngresado = document.getElementById("entrada").value

	if (valorIngresado == ""){valorIngresado = placeholder;}

	// Verificando que el archivo no exista en la carpeta actual (GENERALIZAR OIE), en caso de estarlo se le cambia el nombre
	var valorNuevo = valorIngresado; var i = 1;
	while (nombreCodigo.has(valorNuevo)) {
		valorNuevo = valorIngresado + " (" + i + ")";
		i++;
	}

	// Se añade el archivo a la carpeta que ve el usuario y al Map de referencias
	carpetasArchivos.set(idUnico, {
		nombre: valorNuevo,
		tipo: tipo,
		permisos: permisos,
		propietario: propietarioOriginal
	});
	nombreCodigo.set(valorNuevo, idUnico); idUnico++;

	// Se añade el archivo al servidor
	var request = new XMLHttpRequest();
	var procedimiento = "nuevo";
	var variableA = tipo; var variableB = direccionActual; var variableC = valorNuevo;

	request.open("POST", "procedimientosLinux.php", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send(`procedimiento=${procedimiento}&variableA=${variableA}&variableB=${variableB}&variableC=${variableC}`);

	// Se recargan las carpetas
	seleccionados = new Array();
	inicializarCarpetas();
}

function advertenciaSeleccionados(booleano){

	// Propósito: Esta función le advierte al mijín q puede seleccionar un archivo nomas
	if (seleccionados.length > 1 && booleano) {
		alert("Por favor seleccione solo un elemento para realizar esta acción");
		return false;
	}
	else if (seleccionados.length == 0) {
		alert("Por favor seleccione al menos un elemento para realizar esta acción");
		return false;
	}
	else {
		return true;
	}
}

function ventanaCambiarNombre() {

	var etiqueta;

	// Comprobando que se halla seleccionado un solo archivo
	if (advertenciaSeleccionados(true) == false){return;}

	// Comprobando que no exista otro proceso en curso
	if (advertenciaFormulario() == false){return;}

	// Verificando el tipo de elemento a ser renombrado para establecer los mensajes
	if (carpetasArchivos.get(ultimaSeleccion).tipo == "archivo") {
		etiqueta = "del archivo";
	}
	else if (carpetasArchivos.get(ultimaSeleccion).tipo == "carpeta"){
		etiqueta = "de la carpeta";
	}

	// Mostrando el formulario
	document.getElementById("divFormulario").style.display = "block";

	// Asignando la información del formulario para el usuario
	document.getElementById("tituloFormulario").innerHTML = "Ingresa el nuevo nombre " + etiqueta;
	entrada = document.getElementById("entrada");
	entrada.addEventListener("keydown", cambiarNombre);
	entrada.placeholder = "";
	entrada.select();

	// Asignando la función correspondiente a cada botón
	document.getElementById("botonConfirmar").addEventListener("click", cambiarNombre);
	document.getElementById("botonCancelar").addEventListener("click", quitarFormulario);
}

function cambiarNombre(input) {
	// Propósito: Cambiar el nombre de un nuevo archivo o carpeta seleccionado

	var caption;

	// Condicional para ejecutar el método en caso de que se haya presionado enter
	if (input.type != "click" && input.keyCode != 13) { return; }
	else { input.preventDefault(); input.stopPropagation(); }

	// Identificando el tipo de elemento para comparar con el Map adecuado
	if (carpetasArchivos.get(ultimaSeleccion).tipo == "archivo") {
		caption = "este archivo";
	}
	else if (carpetasArchivos.get(ultimaSeleccion).tipo == "carpeta"){
		caption = "esta carpeta";
	}

	// Se obtiene el valor ingresado
	var nuevoNombre = document.getElementById("entrada").value;

	if (nuevoNombre == ""){
		alert("Por favor ingrese un nombre, el campo no puede estar en blanco"); return;
	}
	else if (nuevoNombre == carpetasArchivos.get(ultimaSeleccion).nombre) {
		alert("El nuevo nombre del archivo es igual al actual"); return;
	}

	// Verificando que el nombre no exista en la carpeta actual (GENERALIZAR OIE), en caso de estarlo se le cambia el nombre
	var valorNuevo = nuevoNombre; var i = 1;
	while (nombreCodigo.has(valorNuevo)) {
		valorNuevo = nuevoNombre + " (" + i + ")";
		i++;
	}

	if (valorNuevo != nuevoNombre) {alert("El nuevo nombre de " + caption + " se repite en la carpeta actual, por lo tanto fue cambiado por: " + valorNuevo);}

	// Se renombra el archivo en el Map de carpetasArchivos, y se remueve y reañade en el Map de nombres correspondiente
	nombreCodigo.delete(carpetasArchivos.get(ultimaSeleccion).nombre);
	nombreCodigo.set(valorNuevo, ultimaSeleccion);

	var nombreViejo = carpetasArchivos.get(ultimaSeleccion).nombre;

	carpetasArchivos.set(ultimaSeleccion, {
		nombre: valorNuevo,
		tipo: carpetasArchivos.get(ultimaSeleccion).tipo,
		permisos: carpetasArchivos.get(ultimaSeleccion).permisos,
		propietario: carpetasArchivos.get(ultimaSeleccion).propietario
	});

	// Se modifica el archivo en el servidor
	var request = new XMLHttpRequest();
	var procedimiento = "cambiarNombre";
	var variableA = direccionActual; var variableB = nombreViejo; var variableC = valorNuevo;

	request.open("POST", "procedimientosLinux.php", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send(`procedimiento=${procedimiento}&variableA=${variableA}&variableB=${variableB}&variableC=${variableC}`);

	// Se recargan las carpetas
	seleccionados = new Array();
	inicializarCarpetas();	
}
	
function ventanaEliminar() {

	var label; var s;

	// Comprobando que se halla seleccionado al menos un solo archivo
	if (advertenciaSeleccionados(false) == false){return;}

	// Comprobando que no exista otro proceso en curso
	if (advertenciaFormulario() == false){return;}

	// Activando la condicion especial de borrado, sirve para que se borre solo lo seleccionado inicialmente
	condBorrado = true;

	// Mostrando el formulario
	document.getElementById("divFormulario").style.display = "block";

	// Asignando la información del formulario para el usuario
	if (seleccionados.length == 1) {
		label = "el"; 
		document.getElementById("tituloFormulario").innerHTML = "¿Estás seguro de que quieres eliminar el elemento seleccionado?. \nNOTA: no pueden eliminarse carpetas que tengan elementos dentro de ellas";
	}
	else {
		document.getElementById("tituloFormulario").innerHTML = "¿Estás seguro de que quieres eliminar los " + seleccionados.length + " elementos seleccionados?. \nNOTA: no pueden eliminarse carpetas que tengan elementos dentro de ellas";
	}
	document.getElementById("entrada").style.display = "none";

	// Asignando la función correspondiente a cada botón
	document.getElementById("botonConfirmar").addEventListener("click", eliminar);
	document.getElementById("botonCancelar").addEventListener("click", quitarFormulario);
}
	
function eliminar() {
	// Propósito: Eliminar el/los elementos seleccionados

	var auxTipo = new Array(); var auxElim = new Array();;

	// Ciclo para eliminar a los elementos de la carpeta que ve el usuario
	for (var i = 0; i < seleccionados.length; i++) {
		auxTipo.push(carpetasArchivos.get(seleccionados[i]).tipo);
		auxElim.push(carpetasArchivos.get(seleccionados[i]).nombre)
		carpetasArchivos.delete(seleccionados[i]);
	}

	// Ciclo para eliminar los elementos de la base de datos
	var request = new XMLHttpRequest();
	var procedimiento = "eliminar";
	var variableA = direccionActual; var variableB = auxElim; var variableC = auxTipo;

	request.open("POST", "procedimientosLinux.php", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.onreadystatechange = function(){
		if (request.readyState == 4 && request.status == 200) {
			if (request.responseText != "") alert(request.responseText);
		}
		// Se recargan las carpetas
		seleccionados = new Array(); ultimaSeleccion = -1;
		inicializarPagina();
	};
	request.send(`procedimiento=${procedimiento}&variableA=${variableA}&variableB=${variableB}&variableC=${variableC}`);
}

function copiarCortar(input) {

	// Propósito: Asignar los elementos a copiar o pegar al arreglo auxiliar
	var mensaje; var s;

	// Comprobando que se halla seleccionado al menos un solo archivo
	if (advertenciaSeleccionados(false) == false){return;}

	// Comprobando que no exista otro proceso en curso
	if (advertenciaFormulario() == false){return;}

	// Vaciando el vector auxiliar para almacenar los elementos que se quieren copiar o pegar
	copiadosCortados = new Array();

	// Comprobar el tipo de solicitud
	if (input.target.id == "copiar") {
		condicionCopiadoCortado = "copiado";
	}
	else if (input.target.id == "cortar") {
		condicionCopiadoCortado = "cortado";	}

	if (seleccionados.length > 1) {
		mensaje = "Los elementos fueron"; s = "s";
	}
	else {
		mensaje = "El elemento fue"; s = ""; }

	// Ciclo para asignarle el código de copiado a cada archivo (DUDA, SE DEBE COMPROBAR PERMISOS?)
	copiadosCortados = seleccionados.slice(0, seleccionados.length);

	// Mostrando el formulario
	var formulario = document.getElementById("divFormulario")
	formulario.style.display = "block";
	formulario.style.width = "400px";

	// Asignando la información del formulario para el usuario
	document.getElementById("tituloFormulario").innerHTML = mensaje + " " + condicionCopiadoCortado + s + " correctamente, ahora es posible utilizar la opción 'pegar'";

	document.getElementById("entrada").style.display = "none";

	// Asignando la función correspondiente a cada botón
	document.getElementById("botonConfirmar").style.display = "none";
	boton = document.getElementById("botonCancelar")
	boton.addEventListener("click", quitarFormulario);
	boton.innerHTML = "Aceptar"

	// Cambiandole el color a los elementos listos para copiar o pegarrrrr .... peguelo!
	var asignador = document.querySelectorAll("#explorador img");
	for (var i = 0; i < asignador.length; i++) {
		if (asignador[i].parentNode.parentNode.style.backgroundColor = "rgba(23, 174, 49, 0.31)") {
			asignador[i].parentNode.parentNode.style.backgroundColor = "";
		}
		for (var j = 0; j < copiadosCortados.length; j++) {
			if (copiadosCortados[j] == parseInt(asignador[i].id)) {
				asignador[i].parentNode.parentNode.style.backgroundColor = "rgba(23, 174, 49, 0.31)";
			}
		}
	}

	// Quitando la seleccion de cada elemento (para facilitar el pegado y no tener que estarle dando click a mano a todo)
	seleccionados = new Array(); ultimaSeleccion = -1;
}

function pegar() {
	// Propósito: Asignar los elementos a copiar o pegar al arreglo auxiliar

	var mensaje; var s; var auxCopCor = new Array();

	if (condicionCopiadoCortado == "") {alert("No hay archivos guardados en el portapapeles"); return;}

	// Condicional para el caso donde no se intenta pegar en las misma carpeta
	if (ultimaSeleccion == -1) {
		alert("La carpeta de origen y de destino son las mismas"); return;
	}

	// Condicional para que no se puede pegar una carpeta en si misma
	// if (copiadosCortados.find(element => element == ultimaSeleccion && carpetasArchivos.get(element).tipo == "carpeta")) { 
	// 	alert("Se está intentando copiar o cortar una carpeta sobre si misma"); return;
	// }

	// Comprobando que se halla seleccionado un solo archivo
	if (advertenciaSeleccionados(true) == false){return;}

	// Comprobando que no se ha seleccionado un archivo como destino
	if (carpetasArchivos.get(ultimaSeleccion).tipo == "archivo") {
		alert("Ha seleccionado un archivo, por favor seleccione una carpeta"); return;
	}

	// Comprobando que no exista otro proceso en curso
	if (advertenciaFormulario() == false){ return; }

	// Ciclo para obtener los nombre usados en el servidor
	for (var i = 0; i < copiadosCortados.length; i++) {
		auxCopCor.push(carpetasArchivos.get(copiadosCortados[i]).nombre);
	}

	// Ciclo para quitar los archivos que ve el usuario
	if (condicionCopiadoCortado == "cortado") {
		for (var i = 0; i < copiadosCortados.length; i++) {
			carpetasArchivos.delete(copiadosCortados[i]);
		}
	}

	// Código para copiar o cortar los elementos en el servidor
	var request = new XMLHttpRequest();
	var procedimiento = "copiadoCortado";
	var variableA = direccionActual; var variableB = auxCopCor; 
	var variableC = condicionCopiadoCortado; var variableD = carpetasArchivos.get(ultimaSeleccion).nombre;

	request.open("POST", "procedimientosLinux.php", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send(`procedimiento=${procedimiento}&variableA=${variableA}&variableB=${variableB}&variableC=${variableC}&variableD=${variableD}`);

	// Comprobar el tipo de solicitud
	if (copiadosCortados.length > 1) {
		mensaje = "Los elementos fueron"; s = "s";
	}
	else {
		mensaje = "El elemento fue"; s = ""; }

	// Mostrando el formulario
	var formulario = document.getElementById("divFormulario")
	formulario.style.display = "block";
	formulario.style.width = "400px";

	// Asignando la información del formulario para el usuario
	document.getElementById("tituloFormulario").innerHTML = mensaje + " " + condicionCopiadoCortado + s + " correctamente " + "en la carpeta: '" + variableD + "'";
	document.getElementById("entrada").style.display = "none";

	// Asignando la función correspondiente a cada botón
	document.getElementById("botonConfirmar").style.display = "none";
	var cancelar = document.getElementById("botonCancelar")
	cancelar.innerHTML = "Aceptar";
	cancelar.addEventListener("click", inicializarCarpetas);

	// Se recargan las carpetas
	seleccionados = new Array();
}

function ventanaVerCambiarPermisos(input) {

	var etiqueta; var permisos; var permisosBinario = new Array();

	// Comprobando que se halla seleccionado un solo archivo
	if (advertenciaSeleccionados(true) == false){return;}

	// Comprobando que no exista otro proceso en curso
	if (advertenciaFormulario() == false){return;}

	if (carpetasArchivos.get(ultimaSeleccion).tipo == "archivo") {
		etiqueta = "del archivo seleccionado";
	}
	else if (carpetasArchivos.get(ultimaSeleccion).tipo == "carpeta"){
		etiqueta = "de la carpeta seleccionada";
	}

	// Mostrando el formulario
	var formulario = document.getElementById("divFormulario")
	formulario.style.display = "block";
	formulario.style.width = "400px";

	// Asignando la información del formulario para el usuario
	document.getElementById("tituloFormulario").innerHTML = "A continuación se muestran los permisos " + etiqueta;
	document.getElementById("entrada").style.display = "none";

	// Asignando la función correspondiente a cada botón
	if (input.target.id == "cambiarPermisos") {
		document.getElementById("botonConfirmar").addEventListener("click", cambiarPermisos);
		document.getElementById("botonCancelar").addEventListener("click", quitarFormulario);
	}
	else if (input.target.id == "verPermisos") {
		document.getElementById("botonConfirmar").style.display = "none";
		var cancelar = document.getElementById("botonCancelar")
		cancelar.innerHTML = "Aceptar";
		cancelar.addEventListener("click", quitarFormulario);		
	}

	// Obteniendo el id del elemento seleccionado y mostrando sus permisos
	permisos = carpetasArchivos.get(ultimaSeleccion).permisos;

	for (var i = 0; i < permisos.length; i++) {
		permisosBinario.push(permisos[i].toString(2).padStart(3).split(""));
	}

	// Asignando el valor de los elementos elegidos
	var asignador = document.querySelectorAll("#tablaPermisos input"); var j = 0;
	for (var i = 0; i < asignador.length; i++) {
		for (var k = 0; k < 3; k++) {
			if (permisosBinario[j][k] == " " || permisosBinario[j][k] == "0"){
				asignador[i].checked = false;
			}
			else {
				asignador[i].checked = true;
			}
			if (input.target.id == "cambiarPermisos") {
				asignador[i].disabled = false;
			}
			else if (input.target.id == "verPermisos") {
				asignador[i].disabled = true;
			}
			i++;
		}
		j++; i--;
	}
	// Mostrando la tabla con los permisos
	document.getElementById("tablaPermisos").style.display = "table";
}

function cambiarPermisos() {

	var mensaje; var permisosBinario = new Array(new Array(3), new Array(3), new Array(3));
	
	// Obtener los permisos seleccionados en el formulario
	var asignador = document.querySelectorAll("#tablaPermisos input"); var j = 0;
	for (var i = 0; i < asignador.length; i++) {
		for (var k = 0; k < 3; k++) {
			if (asignador[i].checked == false){
				permisosBinario[j][k] = 0;
			}
			else {
				permisosBinario[j][k] = 1;
			}
			i++;
		}
		j++; i--;
	}

	for (var i = 0; i < 3; i++) {
		permisosBinario[i] = parseInt(permisosBinario[i].join(""), 2);
	}

	// Se cambian los permisos en el archivo seleccionado (SERVIDOR)
	var request = new XMLHttpRequest();
	var procedimiento = "cambiarPermisos";
	var variableA = direccionActual; var variableB = permisosBinario.join("");
	var variableC = carpetasArchivos.get(ultimaSeleccion).nombre;

	request.open("POST", "procedimientosLinux.php", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.send(`procedimiento=${procedimiento}&variableA=${variableA}&variableB=${variableB}&variableC=${variableC}`);

	// Se cambian los permisos para los elementos que ve el usuario
	carpetasArchivos.set(ultimaSeleccion, {
		nombre: carpetasArchivos.get(ultimaSeleccion).nombre,
		tipo: carpetasArchivos.get(ultimaSeleccion).tipo,
		permisos: permisosBinario,
		propietario: carpetasArchivos.get(ultimaSeleccion).propietario
	});

	// Identificando el tipo de elemento para el mensaje
	if (carpetasArchivos.get(ultimaSeleccion).tipo == "archivo") {
		caption = "del archivo";
	}
	else if (carpetasArchivos.get(ultimaSeleccion).tipo == "carpeta"){
		caption = "de la carpeta";
	}

	// Mostrando el formulario
	var formulario = document.getElementById("divFormulario")
	formulario.style.display = "block";
	formulario.style.width = "400px";

	// Ocultando la tabla
	document.getElementById("tablaPermisos").style.display = "none";

	// Asignando la información del formulario para el usuario
	document.getElementById("tituloFormulario").innerHTML = "Los permisos " + caption + ": '" + carpetasArchivos.get(ultimaSeleccion).nombre + "' fueron modificados correctamente";
	document.getElementById("entrada").style.display = "none";

	// Asignando la función correspondiente a cada botón
	document.getElementById("botonConfirmar").style.display = "none";
	var cancelar = document.getElementById("botonCancelar")
	cancelar.innerHTML = "Aceptar";
	cancelar.addEventListener("click", quitarFormulario);
}

function ventanaCambiarPropietario() {

	// Comprobando que se halla seleccionado un solo archivo
	if (advertenciaSeleccionados(true) == false){return;}

	// Comprobando que no exista otro proceso en curso
	if (advertenciaFormulario() == false){return;}

	// Mostrando el formulario
	document.getElementById("divFormulario").style.display = "block";

	// Asignando la información del formulario para el usuario
	document.getElementById("tituloFormulario").innerHTML = "Cambio de propietario";
	document.getElementById("entrada").placeholder = "propietario actual: " + carpetasArchivos.get(ultimaSeleccion).propietario;

	// Asignando la función correspondiente a cada botón
	document.getElementById("botonConfirmar").addEventListener("click", cambiarPropietario);
	document.getElementById("botonCancelar").addEventListener("click", quitarFormulario);
}	

function cambiarPropietario() {

	var usuario;

	// Obtener usuario ingresado y contraseña ingresada
	usuario = document.getElementById("entrada").value;
	
	// Realizar el cambio de usuario si se ingresó todo correctamente o mostrar alerta en caso contrario
	var request = new XMLHttpRequest();
	var procedimiento = "cambiarPropietario";
	var variableA = direccionActual; var variableB = usuario; 
	var variableC = carpetasArchivos.get(ultimaSeleccion).nombre;

	request.open("POST", "procedimientosLinux.php", true);
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.onreadystatechange = function(){
		if (request.readyState == 4 && request.status == 200) {
			// if (request.responseText != "") {
			// 	alert(request.responseText);
			// }
			// else {
			// 	alert("propietario cambiado correctamente");
				quitarFormulario();
			// }
		}
	};
	request.send(`procedimiento=${procedimiento}&variableA=${variableA}&variableB=${variableB}&variableC=${variableC}`);
}

// Variables globales
var carpetasArchivos; var nombreCodigo; var condBorrado; var propietarioOriginal = "juanfer";
var existeProceso; var condicionCopiadoCortado; var ultimaSeleccion; var idUnico;
var raiz = "/var/www/html/Trabajo-01---Sistemas-Operativos/raiz";
var direccionActual_chdir = "/var/www/html/Trabajo-01---Sistemas-Operativos/raiz";
var direccionActual = "/var/www/html/Trabajo-01---Sistemas-Operativos/raiz";

// Tabla hash de los elementos seleccionados
var seleccionados = new Array();

// Tabla hash de los elementos copiados o cortados
var copiadosCortados;

window.addEventListener("load", inicializarPagina, false);