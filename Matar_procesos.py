import Procesos as pr
import Mensajes as msg
import subprocess

#Funcion encargada de buscar todos los procesos relacionados con un nombre o PID dado
def buscar_procesos(proceso_buscado,tipo):
    #Lista de procesos sobre la que buscará
    procesos = pr.listar_procesos(True)

    if tipo == "PID":
        #PID del proceso que se desea buscar
        proceso_busqueda = proceso_buscado
        #Se busca el proceso
        proceso_encontrado = [proceso for proceso in procesos[1:] if proceso_busqueda == proceso[1]]
    if tipo == "Nombre":
        #PID del proceso que se desea buscar
        proceso_busqueda = proceso_buscado
        #Se busca el proceso
        proceso_encontrado = [proceso for proceso in procesos[1:] if proceso_busqueda == proceso[0]]
    
    proceso_encontrado = [procesos[0]]+proceso_encontrado
    return proceso_encontrado

def matar_proceso(proceso_a_matar):
    try:
        int(proceso_a_matar)
        proceso = buscar_procesos(proceso_a_matar,"PID")
    except:
        proceso = buscar_procesos(proceso_a_matar,"Nombre")
    
    #Verificamos que el proceso que deseamos eliminar exista
    if len(proceso) > 1:
        
        #Mostramos el/procesos que coincidieron con los criterios de busqueda
        print("\nA continuación se muestran los procesos relacionados con {}: \n".format(proceso_a_matar))
        pr.mostrar_procesos_usarios(proceso)
        
        #Confirmamos el PID del proceso a eliminar
        pid = input("\nConfirme el PID del proceso que desea matar: ")

        lista_procesos = pr.listar_procesos()
        lista_PPID = [proceso[2] for proceso in lista_procesos]
        lista_pid = [elemento[1] for elemento in proceso[1:]]

        if pid in lista_pid and pid in lista_PPID:
            msg.mostrar_mensaje("El proceso que desea eliminar es un proceso padre")
            confirmacion = input("Está seguro que desea eliminarlo (y/n): ")
            if confirmacion == "y":
                subprocess.check_output("pkill -TERM -P {}".format(pid),shell=True)
                subprocess.check_output("kill {}".format(pid),shell=True)
            else:
                msg.mostrar_mensaje("Operación cancelada")    
        elif pid in lista_pid:
            msg.mostrar_mensaje("El proceso que desea eliminar es un proceso hijo")
            confirmacion = input("Está seguro que desea eliminarlo (y/n): ")
            if confirmacion == "y":
                subprocess.check_output("kill {}".format(pid),shell=True)
            else:
                msg.mostrar_mensaje("Operación cancelada")
        else:
            msg.mostrar_mensaje("ERROR: el proceso {} no es una confirmación valida".format(pid))

   
    else:
        msg.mostrar_mensaje("ERROR: el proceso {} no existe".format(proceso_a_matar))
        
    


