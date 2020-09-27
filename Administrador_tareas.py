import Procesos as pr


while(True):
    
    print("\nMeú principal administrador de tareas")
    print("1. Mostrar procesos del sistema")
    print("0. Cerrar administrador")
    opcion = input("\nSeleccione una opción: ")
    
    if(opcion=="1"):
        lista_procesos=pr.listar_procesos()
        pr.mostrar_procesos(lista_procesos)
    elif(opcion=="0"):
        print("Programa terminado\n")
        break;
    else:
        print("Ingrese una opción valida\n")  


