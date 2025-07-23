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
llenadoTabla += `<td>
  <i class="bi bi-pencil-square abrirEditar" data-id="${data[i].id}"></i>
  <i class="bi bi-trash2 abrirBorrar" data-id="${data[i].id}"></i>
</td>`;
        
            
            

           }
           $("#idTable").html(llenadoTabla);
          
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
// Evento para editar
$(document).on("click", ".abrirEditar", function () {
  const id = $(this).data("id");

  $.ajax({
    url: 'http://localhost:8080/CarreraWS/buscar',
    type: 'POST',
    data: JSON.stringify({ id: id }),
    contentType: 'application/json',
    success: function (carrera) {
      // Llenar el formulario con los datos
      $("#inputId").val(carrera.id);
      $("#inputNombre").val(carrera.nombre);
      $("#inputFacultad").val(carrera.facultad);
      $("#inputDuracion").val(carrera.duracion);

      // Abrir modal
      $("#exampleModal").modal("show");
    },
    error: function (error) {
      console.error("Error al buscar carrera:", error);
    }
  });
});

// Evento para borrar
$(document).on("click", ".abrirBorrar", function () {
  const id = $(this).data("id");

  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción no se puede deshacer',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: 'http://localhost:8080/CarreraWS/eliminar',
        type: 'POST',
        data: JSON.stringify({ id: id }),
        contentType: 'application/json',
        success: function () {
          Swal.fire('Eliminado', 'La carrera fue eliminada.', 'success');
          tablaClientes();
        },
        error: function (error) {
          console.error("Error al eliminar carrera:", error);
          Swal.fire('Error', 'No se pudo eliminar la carrera.', 'error');
        }
      });
    }
  });
});







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
    url: 'http://localhost:8080/CarreraWS/editar',
    type: 'POST',
    data: JSON.stringify(nuevaCarrera),
    contentType: 'application/json',
    success: function() {
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

