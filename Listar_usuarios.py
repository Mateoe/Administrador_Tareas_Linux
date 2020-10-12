import Procesos as pr
import subprocess

def listar_usuarios():
    procesos = pr.listar_procesos(True)
    #Creamos una lista con los id de los usuarios
    lista_id = [proceso[3] for proceso in procesos]
    #Buscamos los id unicos
    id_unicos = set(lista_id[1:])

    #Buscamos el nombre de usuario correspondiente a cada id
    usuarios={}
    for id in id_unicos:
        #Creamos el comando unix para buscar el nombre de usuario
        comando = "getent passwd | awk -F: '$3 =="+ id +" { print $1 }'"
        #Buscamos el nombre de usuario
        usuario = subprocess.check_output(comando,shell=True)
        #Convertimos el nombre de usuario a string
        usuario = str(usuario)
        #Realizamos la limieza del nombre de usuario
        usuario = usuario.replace("b'","")
        usuario = usuario.replace(r"\n'","")
        #Guardamos el nombre de usuario en un diccionario
        usuarios[id] = usuario

    lista_usuarios = [[usuarios[usuario_id],usuario_id] for usuario_id in usuarios]
    return lista_usuarios

def mostrar_usuarios(matriz):

    lista_usuarios = matriz
    lista_usuarios = [["USUARIO","UID"]]+lista_usuarios

    longitud_uid = pr.longitud_maxima(lista_usuarios,0)
    longitud_usr = pr.longitud_maxima(lista_usuarios,1)

    usuarios = [["|"+usuario[0]+" "*(longitud_uid-len(usuario[0])),
                "|"+usuario[1]+" "*(longitud_usr-len(usuario[1]))+"|",
                                ]
                                for usuario in lista_usuarios]
    print(" "+"-"*(longitud_uid+longitud_usr+2))
    print(usuarios[0][0],usuarios[0][1])
    print(" "+"-"*(longitud_uid+longitud_usr+2))
    for usuario in usuarios[1:]:
        print(usuario[0],usuario[1])
    print(" "+"-"*(longitud_uid+longitud_usr+2))

