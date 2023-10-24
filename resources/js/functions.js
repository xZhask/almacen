const _links = document.querySelectorAll(".link");
const container = document.querySelector("#container");

let listadoProductos = []; //Listado general de productos, todos los campos
let nombreProductos = []; //Solo nombres de productos
let productSelect = ""; //Producto seleccionado
let actionForm; //Acción de formulario
let carritoVenta = []; //Carrito de venta
_links.forEach((link) => {
  link.addEventListener("click", (_) => {
    if (link.id == "venta" && link.classList.contains("active") == true) {
      //alert('desea limpiar el listado del carrito de venta?')
    } else {
      carritoVenta.length = 0;
      $.ajax({
        method: "POST",
        url: `App/views/${link.id}.html`,
      }).done(function (html) {
        $("#container").html(html);
        _links.forEach((link) => {
          link.classList.remove("active");
        });
        link.classList.toggle("active");
      });
    }
    console.log(carritoVenta);
  });
});
/* MODAL Y MENSAJES */
const abrirModal = (data) => {
  modal.style.display = "table";
  $.ajax({
    data: data,
    url: `App/views/modals.php`,
    type: "POST",
    cache: false,
    dataType: "html",
    beforeSend: function () {
      $("#modal_form").html("Procesando, espere por favor...");
    },
    success: function (response) {
      $("#modal_form").html(response);
    },
  });
};
const cerrarModal = () => {
  $("#modal_form").html("");
  modal.style.display = "none";
  productSelect = "";
  actionForm = "";
};
$("a.closeModal").on("click", (e) => {
  e.preventDefault();
  cerrarModal();
});
function showMsg(status, message) {
  let icon = (status = 0 ? "error" : "success");
  Swal.fire({
    position: "top-end",
    icon: icon,
    title: message,
    showConfirmButton: false,
    timer: 1700,
  });
}
window.addEventListener("load", async () => {
  listadoProductos = await loadProducts();
});

async function loadProducts() {
  const datos = new FormData();
  datos.append("accion", "LISTAR_PRODUCTOS");
  listadoProductos = await postData(datos);
  nombreProductos = listadoProductos.map((producto) => producto.nombre);
  return listadoProductos;
}

async function postData(data) {
  const response = await fetch(`App/controllers/controller.php`, {
    method: "POST",
    body: data,
  }).then((res) => res.json());
  return await response;
}

/* PRODUCTS */
async function mostrarProducts() {
  let listadoProductos = await loadProducts();
  renderTablaProducts(listadoProductos);
}
function renderTablaProducts(listProducts) {
  const filasString = crearFilasTablaProducts(listProducts);
  $("#tb_products").html(filasString);
}
const crearFilasTablaProducts = (listProducts) =>
  listProducts
    .map(
      (product) =>
        `<tr><td>${product.idproducto}</td><td>${product.nombre}</td><td>S/ ${product.precio}</td><td> ${product.stock}</td><td><i class="fa-solid fa-square-pen btn_blue btnEditProduct"></i>  <i class="fa-solid fa-square-minus btn_red"></i></td></tr>`
    )
    .join("");

$(document).on("keyup", "#search_product", () => {
  let searchProduct = $("#search_product").val();
  const nuevaTabla = listadoProductos.filter((product) =>
    `${product.nombre.toLowerCase()}`.includes(searchProduct.toLowerCase())
  );
  renderTablaProducts(nuevaTabla);
});

/* VENTAS */

function searchCompleteProductVenta() {
  cargarAutoCompletado("#producto", "v");
}
const cargarAutoCompletado = (input, section) => {
  $(input).autocomplete({
    source: nombreProductos,
    select: (e, item) => {
      let producto = item.item.value;
      let position = nombreProductos.indexOf(producto);
      infoProductoSeleccionado(position, section);
    },
  });
};

$(document).on("click", "#add_car", () => {
  let idproducto = $("#idproducto").val();
  let cantidad = $("#cantidad").val();
  if (idproducto === "") alert("Seleccionar Producto");
  else if (cantidad === "") alert("Ingresar cantidad");
  else {
    let idProductsCar = carritoVenta.map((producto) => producto.idproducto);
    let positionCarProduct = idProductsCar.indexOf(idproducto);
    let producto = $("#producto").val();
    let positionListProduct = nombreProductos.indexOf(producto);
    let stock = +listadoProductos[positionListProduct].stock;
    if (cantidad > stock) alert("Stock insuficiente");
    else {
      let precio = listadoProductos[positionListProduct].precio;

      if (positionCarProduct < 0) {
        let subtotal = (precio * cantidad).toFixed(2);
        let newProductCarrito = {
          idproducto: idproducto,
          nombre: producto,
          precio: precio,
          cantidad: cantidad,
          subtotal: subtotal,
        };
        carritoVenta.push(newProductCarrito);
      } else {
        //carritoVenta[positionCarProduct]
        let cantCarrito = +carritoVenta[positionCarProduct].cantidad;
        let newCantidad = +cantidad + cantCarrito;
        if (newCantidad > stock) alert("Stock insuficiente");
        else {
          carritoVenta[positionCarProduct].cantidad = newCantidad;
          carritoVenta[positionCarProduct].subtotal = (
            newCantidad * precio
          ).toFixed(2);
        }
      }
      renderCarrito();
      let inputs = document.querySelectorAll(".controls input");
      // Recorrer para poner valor
      inputs.forEach((input) => (input.value = ""));
    }
  }
});

const infoProductoSeleccionado = (position, section) => {
  let stock = listadoProductos[position].stock;
  let precio = listadoProductos[position].precio;
  let id = listadoProductos[position].idproducto;
  if (section === "v") {
    $("#stock").val(stock);
    $("#precio").val(precio);
    $("#idproducto").val(id);
  }
};
function renderCarrito() {
  const filasCarrito = crearFilasCarrito();
  let totalCarrito = calcularTotales();
  totalCarrito = `<tr><td colspan="5" class="t_bold">Total</td><td class="t_bold">S/ ${totalCarrito}</td></tr>`;
  $("#tb_venta").html(`${filasCarrito}${totalCarrito}`);
  console.log(carritoVenta);
}
const crearFilasCarrito = () =>
  carritoVenta
    .map(
      (product, indice) =>
        `<tr><td><i class="fa-solid fa-circle-xmark btn_delete btn_red"></i></td><td>${
          indice + 1
        }</td><td>${product.nombre}</td><td>S/ ${product.precio}</td><td>${
          product.cantidad
        }</td><td>S/ ${product.subtotal}</td>`
    )
    .join("");
const calcularTotales = () => {
  let total = carritoVenta.reduce(
    (acumulador, product) => +product.subtotal + acumulador,
    0
  );
  return total.toFixed(2);
};

$(document).on("click", "#tb_venta .btn_delete", function () {
  let parent = $(this).closest("table");
  let tr = $(this).closest("tr");
  let position = $(tr).find("td").eq(1).html();
  position = position - 1;
  carritoVenta.splice(position, 1);
  renderCarrito();
});
function limpiarCarrito() {}
/* MODAL */
const modal = document.querySelector("#bg-modal");
const modalContent = document.querySelector("#modal-content");
const modalForm = document.querySelector("#modal_form");
/* NUEVO PRODUCTO */

$(document).on("click", "#btn_newProduct", () => {
  actionForm = "CREATE_PRODUCT";
  let parametros = { form: "PRODUCTO", accion: actionForm };
  abrirModal(parametros);
});
$(document).on("click", "#tb_products .btnEditProduct", function () {
  actionForm = "UPDATE_PRODUCT";
  let parent = $(this).closest("table");
  let tr = $(this).closest("tr");
  let nombre = $(tr).find("td").eq(1).html();
  let position = nombreProductos.indexOf(nombre);
  nombre = listadoProductos[position].nombre;
  let precio = listadoProductos[position].precio;
  productSelect = listadoProductos[position].idproducto;
  let parametros = {
    form: "PRODUCTO",
    accion: actionForm,
    precioProduct: precio,
    nombreProduct: nombre,
  };
  abrirModal(parametros);
});
$(document).on("click", "#btnCleanCart", () => {
  limpiarCarrito();
});
/* REGISTRAR PRODUCTO */
$(document).on("submit", "#frmProduct", async (e) => {
  e.preventDefault();
  let form = document.querySelector("#frmProduct");
  let datos = new FormData(form);
  datos.append("accion", "CREATE_UPDATE_PRODUCT");
  datos.append("idProduct", productSelect);
  let respuesta = await postData(datos);
  showMsg(respuesta.status, respuesta.msg);
  mostrarProducts();
  cerrarModal();
});
/* REGISTRAR CARRITO */
$(document).on("click", "#btnSaveSale", async () => {
  let totalVenta = await calcularTotales();
  let datos = new FormData();
  datos.append("accion", "CREATE_MOVEMENT");
  datos.append("tipo", "I");
  datos.append("concepto", "VENTA");
  datos.append("total", totalVenta);
  datos.append("movementDetail", JSON.stringify(carritoVenta));
  let respuesta = await postData(datos);
  showMsg(respuesta.status, respuesta.msg);
  limpiarCarrito();
});
function limpiarCarrito() {
  carritoVenta.length = 0;
  $("#tb_venta").html(``);
}
