#Función que muestra los mensajes de decorados para que sean
#reconocidos con más fácilidad porel usuario
def mostrar_mensaje(mensaje):
    tamaño = len(mensaje)
    print("\n+"+"-"*tamaño+"+")
    print("|"+mensaje+"|")
    print("+"+"-"*tamaño+"+\n")

def mensajes_menu_principal(opcionesMenu):
    #Mensaje principal del menú
    mensaje_menu = "Meú principal administrador de tareas"
    tamaño_mensaje = len(mensaje_menu)
    decorador_menu = "+" + "-"*tamaño_mensaje + "+"
    
    #Mensajes de opciones del menú
    opciones = opcionesMenu

    #Se crea la cabecera del menú decorada
    print(decorador_menu)
    print("|" + mensaje_menu + "|")
    print(decorador_menu)

    #Se imprimen las opciones del menú
    [print("|" + opcion + " "*(tamaño_mensaje-len(opcion)) +"|") for opcion in opciones]
    
    #Se cierra el menú con un decorador
    print(decorador_menu+"\n")