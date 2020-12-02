<?php

$procedimiento = $_REQUEST["procedimiento"];
$variableA = $_REQUEST["variableA"];

switch ($procedimiento) {
    case "obtenerElementos":
        echo obtenerElementos($variableA);
        break;

    case "volver":
        chdir($variableA);
        echo system("pwd");
        break;

    case "nuevo":

        $variableB = $_REQUEST["variableB"]; $variableC = $_REQUEST["variableC"];

        if (strcmp($variableA, "archivo") == 0) {
            $aux = "touch"; $permisos = "777";
        } 
        elseif (strcmp($variableA, "carpeta") == 0) {
            $aux = "mkdir"; $permisos = "777";
        }
        system($aux . " " . $variableB . "/" . "'" . $variableC . "'");
        shell_exec("sudo chgrp juanfer " . $variableB . "/" . "'" . $variableC . "'");
        shell_exec("sudo chown juanfer " . $variableB . "/" . "'" . $variableC . "'");
        shell_exec("sudo chmod " . $permisos . " " . $variableB . "/" . "'" . $variableC . "'");
        break;

    case "cambiarNombre":

        $variableB = $_REQUEST["variableB"]; $variableC = $_REQUEST["variableC"];
        system("mv " . $variableA . "/" . "'" . $variableB . "'" . " " . $variableA . "/" . "'" . $variableC . "'");
        break;

    case "eliminar":

        $variableB = explode(",", $_REQUEST['variableB']); $variableC = explode(",", $_REQUEST["variableC"]);
        $mensaje = ""; $error;

        for($i = 0; $i < count($variableB); ++$i) {

            if (strcmp($variableC[$i], "archivo") == 0) {
                system("rm " . $variableA . "/" . "'" . $variableB[$i] . "'");
            }
            elseif (strcmp($variableC[$i], "carpeta") == 0){
                // system("rmdir " . $variableA . "/" . "'" . $variableB[$i] . "'");
                $error = shell_exec("rmdir " . $variableA . "/" . "'" . $variableB[$i] . "'");
                // if (!@shell_exec("rmdir " . $variableA . "/" . "'" . $variableB[$i] . "'" ."2>&1")) {
                //     $error = error_get_last();
                // }
                // if ($error<>"") {$mensaje = $mensaje . "'" . $variableB[$i] . "' ";}; $error = "";
                // $error = $error . $error;
            }
        }

        // if (strcmp($mensaje, "") <> 0){
        //     echo "Las siguientes carpetas no pudieron ser borradas puesto que tienen elementos dentro de ellas: " . $mensaje;
        // }
        break;

    case "copiadoCortado":
        $variableB = explode(",", $_REQUEST['variableB']); $variableC = $_REQUEST["variableC"];
        $variableD = $_REQUEST['variableD'];

        for($i = 0; $i < count($variableB); ++$i) {
            if (strcmp($variableC, "copiado") == 0) {
                system("cp " . $variableA . "/" . "'" . $variableB[$i] . "'" . " " . $variableA . "/" . "'" . $variableD . "'");
                shell_exec("sudo chgrp juanfer " . $variableA . "/" . "'" . $variableD . "'" . "/" . "'" . $variableB[$i] . "'");
                shell_exec("sudo chown juanfer " . $variableA . "/" . "'" . $variableD . "'" . "/" . "'" . $variableB[$i] . "'");
                shell_exec("sudo chmod 777 " . $variableA . "/" . "'" . $variableD . "'" . "/" . "'" . $variableB[$i] . "'");
            }
            elseif (strcmp($variableC, "cortado") == 0){
                system("mv " . $variableA . "/" . "'" . $variableB[$i] . "'" . " " . $variableA . "/" . "'" . $variableD . "'");
            }
        }
        break;

    case "cambiarPermisos":
        $variableB = $_REQUEST["variableB"]; $variableC = $_REQUEST["variableC"];

        shell_exec("sudo chmod " . $variableB . " " . $variableA . "/" . "'" . $variableC . "'");
        break;

    case "cambiarPropietario":
        $variableB = $_REQUEST["variableB"]; $variableC = $_REQUEST["variableC"];

        if (!shell_exec("sudo chown " . $variableB . " " . $variableA . "/" . "'" . $variableC . "'")) {
            // echo "El usuario ingresado no existe";
        }
        break;
}

// #ejecuta el comando ls de linux y lo convierte en lista
function obtenerElementos($ruta){
    chdir($ruta);
    $elementos = shell_exec("ls -l");
    return $elementos;
}

?>