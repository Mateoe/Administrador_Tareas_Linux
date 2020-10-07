import Procesos as pr
import Mensajes as msg

#Flujo de control del menú principal
while(True):
    
    #Mensajes de opciones del menú
    opciones = ["1. Mostrar procesos del sistema",
                "2. Mostrar usuarios y sus procesos",
                "0. Cerrar administrador"]

    #Se imprime el menú principal
    msg.mensajes_menu_principal(opciones)
    
    #Se pide al usuario la opción del menú
    opcion = input("Seleccione una opción: ")

    #Control de opciones
    if(opcion == "1"):
        lista_procesos=pr.listar_procesos()
        pr.mostrar_procesos(lista_procesos)
    elif(opcion == "2"):
        lista_procesos_usuarios = pr.listar_procesos(True)
        pr.mostrar_procesos_usarios(lista_procesos_usuarios)
    elif(opcion == "0"):
        msg.mostrar_mensaje("Programa terminado")
        break;
    else:
        msg.mostrar_mensaje("Ingrese una opción valida")


