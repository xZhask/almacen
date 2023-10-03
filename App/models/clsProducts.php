<?php
require_once 'conexion.php';

class clsProducts
{
    function ListarIpress()
    {
        $sql = 'SELECT * FROM producto';
        global $cnx;
        return $cnx->query($sql);
    }
}
