import Procesos as pr
import Mensajes as msg
import Matar_procesos as mp
import Crear_procesos as cp
import Listar_usuarios as lu
import pwd
from pwd import getpwnam
import threading as th
import time
import subprocess
import os
#Flujo de control del menú principal
while(True):
    
    #Mensajes de opciones del menú
    opciones = ["1. Mostrar procesos del sistema",
                "2. Mostrar usuarios y sus procesos",
                "3. Matar procesos",
                "4. Crear procesos",
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
    elif(opcion == "3"):
        proceso_a_matar = input("Ingrese el Nombre o PID del proceso: ")
        if proceso_a_matar == "1":
            msg.mostrar_mensaje("Operación denegada: este proceso no se puede matar")
        else:
            mp.matar_proceso(proceso_a_matar)
    elif(opcion == "4"):
  
        usuarios = lu.listar_usuarios()
        lu.mostrar_usuarios(usuarios)
        usuario = input("Ingrese el Nombre o UID del usuario que creara el proceso: ")
        nombres_usuarios = [usuario[0] for usuario in usuarios]
        uid_usuarios = [usuario[1] for usuario in usuarios]

        if usuario in nombres_usuarios or usuario in uid_usuarios: 
            if usuario.isdigit():
                usuarioid= int(usuario)
            else:
                user = pwd.getpwnam(usuario)
                usuarioid = user[2]
            parametro= input("Elija si desea crear un proceso padre, o un proceso hijo (p/h): ")
            thread= th.Thread(target= cp.CrearProceso(parametro,0, usuarioid))
            thread.start()  
            time.sleep(5)
        else:
            msg.mostrar_mensaje("Error: UID o Nombre invalido")

    elif(opcion == "0"):
        
        msg.mostrar_mensaje("Programa terminado")
        subprocess.check_output("pkill -9 -f adm.py",shell=True)        
        
    else:
        msg.mostrar_mensaje("Ingrese una opción valida")


