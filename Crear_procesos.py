import os 
import Mensajes as mg
import time
import threading as th

def CrearProceso(parametro,n):
    
    procesoFork= os.fork()
    
    if(procesoFork>0):
        v= os.wait()
        
    if(parametro== "padre/hijo" and procesoFork==0):
        string= "El proceso padre tiene un PID= "+ str(n)
        mg.mostrar_mensaje(string)
        string= "El proceso hijo tiene un PID= "+ str(os.getpid())
        mg.mostrar_mensaje(string)
    if(parametro== "h" and procesoFork==0):
        string= "El proceso hijo tiene un PID= "+ str(os.getpid())
        mg.mostrar_mensaje(string)
        
    if(procesoFork==0 and parametro== "p"):        
        thread= th.Thread(target= CrearProceso("padre/hijo",os.getpid()))
        thread.start() 
        Infinity()
    elif(procesoFork==0):
        Infinity()
    
        

def Infinity():
    var= 1