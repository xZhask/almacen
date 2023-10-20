<?php
require_once '../models/clsProducts.php';
require_once '../models/clsMovements.php';
//require '../../resources/libraries/vendor/autoload.php';

//use PhpOffice\PhpSpreadsheet\IOFactory;

$accion = $_POST['accion'];
controller($accion);

function controller($accion)
{
    $objProduct = new clsProducts();
    $objMovement = new clsMovements();

    switch ($accion) {
        case 'LISTAR_PRODUCTOS':
            $list_products = $objProduct->ListarIpress();
            $list_products = $list_products->fetchAll(PDO::FETCH_OBJ);
            echo json_encode($list_products);
            break;
        case 'CREATE_UPDATE_PRODUCT':
            $msg = '';
            $idProduct = isset($_POST['idProduct']) ? $_POST['idProduct'] : '';
            $stock = isset($_POST['stock_product']) ? $_POST['stock_product'] : '';

            $datos = [
                'idProduct' => $idProduct,
                'nombre' => $_POST['name_product'],
                'precio' => $_POST['price_product'],
                'stock' => $stock
            ];

            if ($idProduct !== '')
                $create_product = $objProduct->updateProduct($datos);
            else
                $create_product = $objProduct->createProduct($datos);
            $msg = ($create_product = 1) ? 'SE REGISTRÓ CORRECTAMENTE' : 'OCURRIÓ UN ERROR';
            $response = ['status' => $create_product, 'msg' => $msg];
            echo json_encode($response);
            break;
        case 'CREATE_MOVEMENT':
            $msg = '';
            $datos = [
                'tipo' => $_POST['tipo'],
                'concepto' => $_POST['concepto'],
                'total' => $_POST['total'],
            ];
            $create_movement = $objMovement->createMovement($datos);
            $msg = ($create_movement > 0) ? 'SE REGISTRÓ CORRECTAMENTE' : 'OCURRIÓ UN ERROR';
            $response = ['status' => $create_movement, 'msg' => $msg];
            echo json_encode($response);
            break;
    }
}
