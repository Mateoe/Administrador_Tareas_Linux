import subprocess


#Función que extrae los procesos del sistema
#Retorna una lista de listas, donde cada sublista corresponde
#a un proceso y contiene el nombre del proceso, su PID y PPID
def listar_procesos():
    
    #Encuentra los procesos del sistema
    procesos = subprocess.check_output("ps -el",shell=True)
    #Convierte el resultado en string y cambia los saltos de linea por coma
    procesos = str(procesos).replace(r"\n",",")
    #Divide los resultados por coma para obtener cada proceso
    procesos = procesos.split(",")
    #Limpiamos el primer y ultmo elemento
    procesos = [procesos[0][2:]]+procesos[1:-1]
    #Convertimos cada proceso en una lista
    procesos = [proceso.split() for proceso in procesos]

    #obtenemos la cabecera
    cabecera = procesos[0]

    #Obtenemos los indices de CMD, PID y PPID
    indice_cmd = cabecera.index("CMD")
    indice_pid = cabecera.index("PID")
    indice_ppid = cabecera.index("PPID")

    #Creamos una lista con el CMD, PID y PPID de cada proceso
    lista_procesos = [[proceso[indice_cmd],proceso[indice_pid],proceso[indice_ppid]] for proceso in procesos]

    #Retornamos la lista final
    return lista_procesos

def mostrar_procesos(matriz_procesos):
    
    for fila in matriz_procesos:
        print(fila)
    

mostrar_procesos(listar_procesos())

