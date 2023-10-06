<?php
$form = $_POST['form'];
mostrarModal($form);

function mostrarModal($form)
{
    switch ($form) {
        case 'PRODUCTO':
            $nombreProduct = isset($_POST['nombreProduct']) ? $_POST['nombreProduct'] : '';
            $precioProduct = isset($_POST['precioProduct']) ? $_POST['precioProduct'] : '';

            $formluario = '<form id="frmProduct" autocomplete="off">
            <h2 class="tittle_form">Producto</h2>
            <div class="cont_inputs_form">
              <input
                type="text"
                name="name_product"
                id="name_product"
                placeholder="Nombre de Producto"
                value="' . $nombreProduct . '"
                autocomplete="new_product"
              />
            </div>
            <div class="cont_inputs_form">
              <input
                type="text"
                name="priceProduct"
                id="priceProduct"
                placeholder="Precio"
                value="' . $precioProduct . '"
              />';
            if ($_POST['accion'] === '_CREATE')
                $formluario .= '<input
                type="text"
                name="sctockProduct"
                id="sctockProduct"
                placeholder="Stock"
              />';
            $formluario .= '</div>
            <button class="btn_form" type="submit">Registrar</button>
          </form>';
            echo $formluario;
            break;
    }
}
