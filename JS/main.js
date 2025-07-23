$(document).ready(function() {


    Swal.fire({
        title: 'Bienvenido',
        text: 'Esta es una alerta de bienvenida',
        icon: 'success',
    });
});

function tablaClientes(){
    console.log("Tabla de clientes");
    $.ajax({
        url: 'http://localhost:8080/CarreraWS/listar',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
           console.log("Datos recibidos:", data);
           let llenadoTabla ="";

           for(let i=0; i<data.length; i++){
            llenadoTabla += "<tr>";
            llenadoTabla += "<td>" + data[i].id + "</td>";
            llenadoTabla += "<td>" + data[i].nombre + "</td>";
            llenadoTabla += "<td>" + data[i].facultad + "</td>";
            
            

           }
           $("#idTable").html(llenadoTabla);
           //buscarAtributo
           //searchInput
           $("#buscar").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        $("#idTable tr").filter(function () {
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
        });
      });
        
        },
        error: function(error) {
            console.error("Error al obtener los clientes:", error);
        }
    });

}

tablaClientes();

$("#id")


var myModal = document.getElementById('myModal')
var myInput = document.getElementById('myInput')

myModal.addEventListener('shown.bs.modal', function () {
  myInput.focus()
})



function guardarCarrera() {
  const id = parseInt($("#inputId").val());
  const nombre = $("#inputNombre").val();
  const facultad = $("#inputFacultad").val();
  const duracion = $("#inputDuracion").val();

  if (!id || !nombre || !facultad || !duracion) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Por favor llena todos los campos.',
    });
    return;
  }

  const nuevaCarrera = {
    id: id,
    nombre: nombre,
    facultad: facultad,
    duracion: duracion,
    listaEstudiantes: []
  };

  $.ajax({
    url: 'http://localhost:8080/CarreraWS/guardar',
    type: 'POST',
    data: JSON.stringify(nuevaCarrera),
    contentType: 'application/json',
    success: function(response) {
      Swal.fire({
        icon: 'success',
        title: 'Carrera guardada',
        text: 'Se ha registrado correctamente.',
      });

      // Cerrar el modal
      $('#exampleModal').modal('hide');

      // Limpiar el formulario
      $('#inputId').val('');
      $('#inputNombre').val('');
      $('#inputFacultad').val('');
      $('#inputDuracion').val('');

      // Recargar la tabla
      tablaClientes();
    },
    error: function(error) {
      console.error("Error al guardar carrera:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo guardar la carrera.',
      });
    }
  });
}
