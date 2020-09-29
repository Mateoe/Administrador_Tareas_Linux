import Procesos as pr

#Función que muestra los mensajes de decorados para que sean
#reconocidos con más fácilidad porel usuario
def mostrar_mensaje(mensaje):
    tamaño = len(mensaje)
    print("+"+"-"*tamaño+"+")
    print("|"+mensaje+"|")
    print("+"+"-"*tamaño+"+")


#Función que controla el menú principal, con el cual interactuará el
#usuario
while(True):
    
    #Mensaje principal del menú
    mensaje_menu = "Meú principal administrador de tareas"
    tamaño_mensaje = len(mensaje_menu)
    decorador_menu = "+" + "-"*tamaño_mensaje + "+"
    
    #Mensajes de opciones del menú
    opciones= ["1. Mostrar procesos del sistema",
               "0. Cerrar administrador"]


    #Se crea la cabecera del menú decorada
    print(decorador_menu)
    print("|" + mensaje_menu + "|")
    print(decorador_menu)

    #Se imprimen las opciones del menú
    [print("|" + opcion + " "*(tamaño_mensaje-len(opcion)) +"|") for opcion in opciones]
    
    #Se cierra el menú con un decorador
    print(decorador_menu+"\n")

    #Se pide al usuario la opción del menú
    opcion = input("Seleccione una opción: ")
    

    #Control de opciones
    if(opcion=="1"):
        lista_procesos=pr.listar_procesos()
        pr.mostrar_procesos(lista_procesos)
    elif(opcion=="0"):
        mostrar_mensaje("Programa terminado")
        break;
    else:
        mostrar_mensaje("Ingrese una opción valida")


