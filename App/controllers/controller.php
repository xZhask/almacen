<?php
require_once '../models/clsProducts.php';
//require '../../resources/libraries/vendor/autoload.php';

//use PhpOffice\PhpSpreadsheet\IOFactory;

$accion = $_POST['accion'];
controller($accion);

function controller($accion)
{
    $objProducts = new clsProducts();

    switch ($accion) {
        case 'LISTAR_PRODUCTOS':
            $list_products = $objProducts->ListarIpress();
            $list_products = $list_products->fetchAll(PDO::FETCH_OBJ);
            echo json_encode($list_products);
            break;
            /*  case 'CARGAR_TARIFARIO':
            $nvl = $_POST['nivelIpress'];
            $tarifario = $objProcedimiento->CargarTarifario($nvl);
            $tarifario = $tarifario->fetchAll(PDO::FETCH_OBJ);
            session_start();
            $_SESSION['active'] = true;
            $_SESSION['tarifario'] = [];
            foreach ($tarifario as $procedimiento) {
                array_push($_SESSION['tarifario'], $procedimiento->codigoCpms);
            }
            echo json_encode($tarifario);
            break;
        case 'VALIDAR':
            $archivo = $_FILES['mi-archivo']['name'];
            $source = $_FILES['mi-archivo']['tmp_name'];
            $directorio = '../../resources/libraries/filesExcel/';
            $archivo = time() . '.xls';
            $dir = opendir($directorio);
            $target_path = $directorio . '/' . $archivo;
            move_uploaded_file($source, $target_path);

            $ruta = '../../resources/libraries/filesExcel/' . $archivo;
            $documento = IOFactory::load(($ruta));
            $hojaActual = $documento->getSheet(0);
            session_start();
            $tarifario = $_SESSION['tarifario'];

            $ultimaFila = $hojaActual->getHighestRow();
            $tabla = '';
            $cont = 0;
            for ($i = 10; $i <= $ultimaFila; $i++) {
                $coordenadas = "B" . $i;
                $celda = $hojaActual->getCell($coordenadas)->getValue();
                if (strlen($celda) < 9) {
                    $celdaTipo = $hojaActual->getCell("K" . $i)->getValue();
                    if (!in_array($celda, $tarifario))
                        if ($celdaTipo !== 'NANDA') {
                            $cpms = $hojaActual->getCell("C" . $i)->getValue();
                            $idAtencion = $hojaActual->getCell("N" . $i)->getValue();
                            $responsable = $hojaActual->getCell("E" . $i)->getValue();
                            $tabla .= '<tr>';
                            $tabla .= '<td>' . $celda . '</td>';
                            $tabla .= '<td>' . $cpms . '</td>';
                            $tabla .= '<td>' . $idAtencion . '</td>';
                            $tabla .= '<td>' . $responsable . '</td>';
                            $tabla .= '</tr>';
                            $cont = 1;
                        }
                }
            }
            if ($cont === 0) $tabla = '<tr><td colspan="4">NO SE ENCONTRARON OBSERVACIONES</td></tr>';
            $respuesta = ['result' => $cont, 'data' => $tabla];
            echo json_encode($respuesta);
            //echo $archivo;
            unlink($ruta);
            break; */
    }
}
