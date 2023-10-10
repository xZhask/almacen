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
    function createProduct($data)
    {
        $sql = 'INSERT INTO producto(nombre, precio, stock, estado) VALUES (:nombre, :precio, :stock, :estado)';

        $parametros = [
            ':nombre' => $data['nombre'],
            ':precio' => $data['precio'],
            ':stock' => $data['stock'],
            ':estado' => '1',
        ];
        global $cnx;
        $pre = $cnx->prepare($sql);
        $pre->execute($parametros);
        return $pre->rowCount();
    }
    function updateProduct($data)
    {
        $sql = 'UPDATE producto SET nombre=:nombre, precio=:precio, estado=:estado WHERE idproducto=:idproducto';

        $parametros = [
            ':idproducto' => $data['idProduct'],
            ':nombre' => $data['nombre'],
            ':precio' => $data['precio'],
            ':estado' => '1',
        ];
        global $cnx;
        $pre = $cnx->prepare($sql);
        $pre->execute($parametros);
        return $pre->rowCount();
    }
}
