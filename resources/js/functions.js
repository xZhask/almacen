const _links = document.querySelectorAll(".link");
const container = document.querySelector("#container");

_links.forEach((link) => {
  link.addEventListener("click", (_) => {
    $.ajax({
      method: "POST",
      url: `App/views/${link.id}.html`,
    }).done(function (html) {
      $("#container").html(html);
    });
  });
});
let listadoProductos = [];
let nombreProductos = [];
window.addEventListener("load", async () => {
  const datos = new FormData();
  datos.append("accion", "LISTAR_PRODUCTOS");
  listadoProductos = await postData(datos);
  nombreProductos = listadoProductos.map((producto) => producto.nombre);
});

async function postData(data) {
  const response = await fetch(`App/controllers/controller.php`, {
    method: "POST",
    body: data,
  }).then((res) => res.json());
  return await response;
}

/* PRODUCTS */
async function loadProducts() {
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
let carritoVenta = [];
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
  let producto = $("#producto").val();
  let precio = $("#precio").val();
  let cantidad = $("#cantidad").val();
  let subtotal = precio * cantidad;
  let newProductCarrito = {
    nombre: producto,
    precio: precio,
    cantidad: cantidad,
    subtotal: subtotal,
  };
  carritoVenta.push(newProductCarrito);
  renderCarrito();
});

const infoProductoSeleccionado = (position, section) => {
  let stock = listadoProductos[position].stock;
  let precio = listadoProductos[position].precio;
  if (section === "v") {
    $("#stock").val(stock);
    $("#precio").val(precio);
  }
};
function renderCarrito() {
  const filasCarrito = crearFilasCarrito();
  const totalCarrito = calcularTotales();
  $("#tb_venta").html(`${filasCarrito}${totalCarrito}`);
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
    (acumulador, product) => acumulador + product.subtotal,
    0
  );
  return `<tr><td colspan="5" class="t_bold">Total</td><td class="t_bold">S/ ${total}</td></tr>`;
};

$(document).on("click", "#tb_venta .btn_delete", function () {
  let parent = $(this).closest("table");
  let tr = $(this).closest("tr");
  let position = $(tr).find("td").eq(1).html();
  position = position - 1;
  carritoVenta.splice(position, 1);
  renderCarrito();
});
/* MODAL */
const modal = document.querySelector("#bg-modal");
const modalContent = document.querySelector("#modal-content");
const modalForm = document.querySelector("#modal_form");
/* NUEVO PRODUCTO */
//Cerrar Modal
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
  modal.style.display = "none";
};
$("a.closeModal").on("click", (e) => {
  e.preventDefault();
  cerrarModal();
});
$(document).on("click", "#btn_newProduct", () => {
  let parametros = { form: "PRODUCTO", accion: "_CREATE" };
  abrirModal(parametros);
});
$(document).on("click", "#tb_products .btnEditProduct", function () {
  let parent = $(this).closest("table");
  let tr = $(this).closest("tr");
  let id = $(tr).find("td").eq(1).html();
  let position = nombreProductos.indexOf(id);
  let nombre = listadoProductos[position].nombre;
  let precio = listadoProductos[position].precio;
  let parametros = {
    form: "PRODUCTO",
    accion: "_UPDATE",
    precioProduct: precio,
    nombreProduct: nombre,
  };
  abrirModal(parametros);
  //position = position - 1;
});
/* const abrirModal = (form) => {
  modal.style.display = "table";
  $.ajax({
    url: `App/views/modals/${form}`,
    cache: false,
    dataType: "html",
    success: function (data) {
      $("#modal_form").html(data);
      if (form === "frmPersonal.html") {
        if (actionForm == "U") llenarDatosPersonal();
        else $("#btn_search_personal").css("display", "block");
      }
      if (form === "frmNuevoRegistro.html") {
        if (actionForm == "U") {
          llenarTipoDoc();
          llenarDatosIncidencia();
          llenarListadoPeritos();
        } else {
          $("#btn_search_user").css("display", "block");
          $("#btn_search_conductor").css("display", "block");
          let fechaActual = cargarFechaActual();
          console.log(fechaActual);
          $("#fechaRecepcion").val(fechaActual["fecha"]);
          $("#horaRecepcion").val(fechaActual["hora"]);
          fechaRecepcion.max = fechaActual["fecha"];
          fechaInfraccion.max = fechaActual["fecha"];
          fechaExtraccion.max = fechaActual["fecha"];
        }
      }
    },
  });
}; */
/*
buttons2.forEach(button =>{
  button.addEventListener("click",_ =>{
    buttons2.forEach(button =>{
      button.classList.remove("edit");
    })
    button.classList.toggle("edit");
  })
})

*/
/* async function postData(data) {
  const response = await fetch("App/controller/controller.php", {
    method: "POST",
    body: data,
  }).then((res) => res.json());
  return await response;
} */

/* Validar */
/* if (document.querySelector("#frmExcelImport")) {
  const form = document.querySelector("#frmExcelImport");
  const contTable = document.querySelector("#cont-result");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let frm = document.querySelector("#frmExcelImport");
    let datos = new FormData(frm);
    datos.append("accion", "VALIDAR");
    let respuesta = await postData(datos);
    contTable.innerHTML = respuesta.data;
  });
}
if (document.querySelector("#ipress-validador")) {
  document.querySelector("#ipress-validador").value =
    localStorage.getItem("ipress");
}
if (document.querySelector("#mi-archivo")) {
  const myFile = document.querySelector("#mi-archivo");
  const textoFile = document.querySelector("#lbl-miarchivo");
  const btnValidar = document.querySelector("#submit");
  myFile.addEventListener("change", () => {
    filename = myFile.value.split("\\").pop();
    textoFile.textContent = filename;
    btnValidar.classList.add("active");
  });
}
if (document.querySelector("#submit")) {
  const myFile = document.querySelector("#mi-archivo");
  const btnValidar = document.querySelector("#submit");
  btnValidar.addEventListener("click", () => {
    if (myFile.value == "") alert("Seleccione archivo");
  });
}
const inputIpress = document.querySelector("#ipress");
const inputProcedimiento = document.querySelector("#procedimiento");
const tbTarifario = document.querySelector("#tbCpms");
const contLoader = document.querySelector(".preloader");
const lnkValidar = document.querySelector("#lnk-validar");

let nivelIpress;
let tarifario = [];

window.addEventListener("load", async () => {
  contLoader.style.opacity = 0;
  contLoader.style.visibility = "hidden";

  const datos = new FormData();
  datos.append("accion", "LISTAR_UNIDADES");
  const cargarUnidades = await postData(datos);
  const unidadesList = cargarUnidades.map((unidad) => unidad.nombreIpress);
  CargarAutocompletado(unidadesList, cargarUnidades);
});

async function postData(data) {
  const response = await fetch("App/controller/controller.php", {
    method: "POST",
    body: data,
  }).then((res) => res.json());
  return await response;
}
function CargarAutocompletado(list, unidades) {
  $("#ipress").autocomplete({
    source: list,
    select: (e, item) => {
      let unidad = item.item.value;
      let position = list.indexOf(unidad);
      nivelIpress = unidades[position].nivel;
      cargarTarifario(nivelIpress);
      localStorage.setItem("ipress", unidad);
    },
  });
}
async function cargarTarifario(nivel) {
  let datos = new FormData();
  datos.append("accion", "CARGAR_TARIFARIO");
  datos.append("nivelIpress", nivel);
  tarifario = await postData(datos);
  renderTabla(tarifario);
}

const crearFilasTabla = (tarifario) =>
  tarifario
    .map(
      (procedimiento, indice) =>
        `<tr><td>${indice + 1}</td><td>${procedimiento.codigoCpms}</td><td>${
          procedimiento.descripcion
        }</td><td>S/.${procedimiento.precio}</td></tr>`
    )
    .join("");

function renderTabla(tarifario) {
  const filasString = crearFilasTabla(tarifario);
  tbTarifario.innerHTML = filasString;
  $(".bg-dark").css("display", "none");
  $("#btnExcel").prop(
    "href",
    `resources/libraries/Excel/tarifario.php?nvl=${nivelIpress}`
  );
}
inputProcedimiento.addEventListener("keyup", (e) => {
  const nuevaTabla = tarifario.filter((procedimiento) =>
    `${procedimiento.descripcion.toLowerCase()} ${procedimiento.codigoCpms.toLowerCase()}`.includes(
      inputProcedimiento.value.toLowerCase()
    )
  );
  renderTabla(nuevaTabla);
});
posicionarBuscador();

$(window).scroll(function () {
  posicionarBuscador();
});

function posicionarBuscador() {
  var alturaHeader = $("header").outerHeight(true);
  if ($(window).scrollTop() >= alturaHeader) {
    $(".cont-search").addClass("fixed");
    $(".cont-table").css("margin-top", "135px");
  } else {
    $(".cont-search").removeClass("fixed");
    $(".cont-table").css("margin-top", "0");
  }
}
lnkValidar.addEventListener("click", () => {
  window.open("validarcpms.php", "_blank");
  window.focus();
});
 */
