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

#Extrae la longitud del elemento más grande de una columna
def longitud_maxima(matriz, columna):
    #Buscamos la longitud de cada elemento de la columna
    elementos_columna = [len(fila[columna]) for fila in matriz]
    #Buscamos el elemento con la mayór longitud
    longitud_maxima = max(elementos_columna)
    #Retornamos el elemento con la mayor longitud
    return longitud_maxima

def mostrar_procesos(matriz_procesos):

    #Añadimos la matriz de procesos a una nueva variable
    procesos = matriz_procesos

    #Establecemos las longitudes de cada columna
    longitud_cmd=longitud_maxima(matriz_procesos,0)
    longitud_pid=longitud_maxima(matriz_procesos,1)
    longitud_ppid=longitud_maxima(matriz_procesos,2)

    #Redimensionamos la longitud de cada elemento y lo decoramos
    procesos_con_logitud = [["|"+proceso[0]+" "*(longitud_cmd-len(proceso[0])),
                            "|"+proceso[1]+" "*(longitud_pid-len(proceso[1])),
                            "|"+proceso[2]+" "*(longitud_ppid-len(proceso[2]))+"|",
                            ]
                             for proceso in procesos]

    #Extraemos la cabecera
    cabecera = procesos_con_logitud[0]
    #Eliminamos la cabecera de la lista de procesos
    procesos_con_logitud = procesos_con_logitud[1:]

    #Imprimimos la lista de procesos
    print(" "+"-"*(longitud_cmd+longitud_pid+longitud_ppid+4))
    print(cabecera[0],cabecera[1],cabecera[2])
    print("+"+"-"*(longitud_cmd+longitud_pid+longitud_ppid+4)+"+")
    for proceso in procesos_con_logitud:
        
        print(proceso[0],proceso[1],proceso[2])
    print(" "+"-"*(longitud_cmd+longitud_pid+longitud_ppid+4))

