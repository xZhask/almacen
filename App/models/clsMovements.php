<?php
require_once 'conexion.php';

class clsMovements
{
    function listMovements()
    {
        $sql = 'SELECT * FROM movimiento';
        global $cnx;
        return $cnx->query($sql);
    }
    function createMovement($data)
    {
        $sql = 'INSERT INTO movimiento(create_at, update_at, tipo, concepto, total, estado) VALUES (CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, :tipo, :concepto, :total, :estado)';

        $parametros = [
            /*':create_at' => $data['create_at'],
            ':update_at' => $data['update_at'],*/
            ':tipo' => $data['tipo'],
            ':concepto' => $data['concepto'],
            ':total' => $data['total'],
            ':estado' => 1,
        ];
        global $cnx;
        $pre = $cnx->prepare($sql);
        $pre->execute($parametros);
        if ($pre->rowCount() > 0) return $cnx->lastInsertId();
    }
    function movementDetail($data)
    {
        $sql = 'INSERT INTO detalle_movimiento(item, id_movimiento, idproducto, cantidad, precio, subtotal) VALUES (:item, :id_movimiento, :idproducto, :cantidad, :precio, :subtotal)';
        $parametros = [
            ':item' => $data['item'],
            ':id_movimiento' => $data['id_movimiento'],
            ':idproducto' => $data['idproducto'],
            ':cantidad' => $data['cantidad'],
            ':precio' => $data['precio'],
            ':subtotal' => $data['subtotal'],
        ];
        global $cnx;
        $pre = $cnx->prepare($sql);
        $pre->execute($parametros);
        return $pre->rowCount();
    }
}
