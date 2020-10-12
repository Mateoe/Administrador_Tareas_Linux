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
        
        #Obtenemos la lista de los PPID del sistema para confirmar si el proceso es padre o hijo
        lista_procesos = pr.listar_procesos()
        lista_PPID = [proceso[2] for proceso in lista_procesos]
        
        #Extraemos los PID para que el usuario confirme el proceso a eliminar
        lista_pid = [elemento[1] for elemento in proceso[1:]]

        #Si el proceso está en la lista de PID y en lalista de PPID es un proceso padre
        if pid in lista_pid and pid in lista_PPID:
            #Informamos que está a punto de matar un proceso padre
            msg.mostrar_mensaje("El proceso que desea matar es un proceso padre")
            #Solicitamos que confirme si desea matar el proceso
            confirmacion = input("Está seguro que desea matarlo (y/n): ")
            #Si confirma se matan los procesos hijos y posteriormente se mata al padre
            if confirmacion == "y":
                subprocess.check_output("kill {}".format(pid),shell=True)
                subprocess.check_output("pkill -TERM -P {}".format(pid),shell=True)
            #Si deniega se interrumpe la operación
            else:
                msg.mostrar_mensaje("Operación cancelada")    
        
        #Si el proceso está en la lista de pid pero no en la de PPID es un proceso hijo
        elif pid in lista_pid:
            #Informamos que está a punto de matar a un proceso hjo
            msg.mostrar_mensaje("El proceso que desea matar es un proceso hijo")
            #Solicitamos que confirme si desea matar el proceso
            confirmacion = input("Está seguro que desea matar (y/n): ")
            #Si confirma matamos el proceso
            if confirmacion == "y":
                subprocess.check_output("kill {}".format(pid),shell=True)
            #Si deniega se cancela la operación
            else:
                msg.mostrar_mensaje("Operación cancelada")

        #Si el proceso no está en la lista de PID para la confirmación, el usuario ingresó un PID invalido
        else:
            msg.mostrar_mensaje("ERROR: el proceso {} no es una confirmación valida".format(pid))
    
    #Si el proceso no existe devolvemos un mensaje de error
    else:
        msg.mostrar_mensaje("ERROR: el proceso {} no existe".format(proceso_a_matar))
        
    


