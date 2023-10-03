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
        `<tr><td>${product.idproducto}</td><td>${product.nombre}</td><td>S/ ${product.precio}</td><td>S/.${product.stock}</td><td>Editar - Eliminar</td></tr>`
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
  cargarAutoCompletado("#producto", 'v');
}
const cargarAutoCompletado = (input, section) => {
  $(input).autocomplete({
    source: nombreProductos,
    select: (e, item) => {
      let producto = item.item.value;
      let position = nombreProductos.indexOf(producto);
      infoProductoSeleccionado(position, section)
    },
  });
};

$(document).on("click", "#add_car", () => {
  let producto = $('#producto').val()
  let precio = $('#precio').val()
  let cantidad = $('#cantidad').val()
  let subtotal = precio * cantidad;
  let newProductCarrito = { nombre: producto, precio: precio, cantidad: cantidad, subtotal: subtotal };
  carritoVenta.push(newProductCarrito);
  renderCarrito()
});


const infoProductoSeleccionado = (position, section) => {
  let stock = listadoProductos[position].stock;
  let precio = listadoProductos[position].precio;
  if (section === 'v') {
    $('#stock').val(stock);
    $('#precio').val(precio);
  }
}
function renderCarrito() {
  const filasCarrito = crearFilasCarrito();
  $("#tb_venta").html(filasCarrito);
}
const crearFilasCarrito = () =>
  carritoVenta
    .map(
      (product, indice) =>
        `<tr><td>${indice + 1}</td><td>${product.nombre}</td><td>S/ ${product.precio}</td><td>${product.cantidad}</td><td>S/ ${product.subtotal}</td>`
    )
    .join("")
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
