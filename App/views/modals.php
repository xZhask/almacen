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
                name="price_product"
                id="price_product"
                placeholder="Precio"
                value="' . $precioProduct . '"
              />';
      if ($_POST['accion'] === 'CREATE_PRODUCT')
        $formluario .= '<input
                type="text"
                name="stock_product"
                id="stock_product"
                placeholder="Stock"
              />';

      $formluario .= '</div>
            <button class="btn_form" type="submit">Registrar</button>
          </form>';
      echo $formluario;
      break;
  }
}
