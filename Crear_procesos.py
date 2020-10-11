import os 
import Mensajes as mg
import time
import threading as th

def CrearProceso(parametro,n):
    
    procesoFork= os.fork()
    
    if(parametro=="h" and procesoFork>0 and n==1):
        string= "El proceso padre tiene un PID= "+ str(os.getpid())
        mg.mostrar_mensaje(string)
    if(parametro== "h" and procesoFork==0):
        string= "El proceso hijo tiene un PID= "+ str(os.getpid())
        mg.mostrar_mensaje(string)
        
    if(procesoFork==0 and parametro== "p"):
        thread= th.Thread(target= CrearProceso("h",1))
        thread.start() 
        Infinity()
    elif(procesoFork==0):
        Infinity()
    
        

def Infinity():
    while True:
        valor= 1
      