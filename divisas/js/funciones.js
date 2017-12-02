var tableDiv;
var tableExternal;
$(document).ready(function () {

    tableDiv = $("#tableDivisas").DataTable({
        "destroy": true,
        "ajax": "includes/getTCDivisas.php",
        "async": true,
        "deferRender": true,
//        "serverSide": false,
        "columns": [
            {"data": "fecha"},
            {"data": "m1"},
            {"data": "m2"},
            {"data": "m3"},
            {"data": "m4"},
            {"data": "m5"},
            {"data": "m6"},
            {"data": "m7"},
            {"data": "m8"}
        ],
        "scrollY": 200,
        "searching": false,
        "lengthMenu": [[10, 10], [10]],
        "paging": true,
        "ordering": true,
        "info": false,

        "order": [[0, 'desc']],
        "language": {
            "infoEmpty": "No Hay Resultados",
            "search": "Buscar:",
            "zeroRecords": "No se encontraron registros.",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ Registros",
            "lengthMenu": "Muestra _MENU_ Registros",
            "paginate": {
                "first": "Inicio",
                "last": "Ultimo",
                "next": "Siguiente",
                "previous": "Anterior"
            }
        }
    });

    $('#tableDivisas tbody').on('click', 'tr', function () {
        $(this).toggleClass('selected');
    });

    tableExternal = $("#externosContact").DataTable({
        "destroy": true,
        "ajax": "includes/getExternos.php",
        "async": true,
        "deferRender": true,
        "columns": [
            {"data": "nombre"},
            {"data": "email"}
        ],
        "scrollY": 200,
        "searching": true,
        "lengthMenu": [[8, 8], [8]],
//        "paging": true,
        "ordering": true,
        "info": false,

        "order": [[0, 'asc']],
        "language": {
            "infoEmpty": "No Hay Resultados",
            "search": "Buscar:",
            "zeroRecords": "No se encontraron registros.",
            "info": "Mostrando _START_ a _END_ de _TOTAL_ Registros",
            "lengthMenu": "Muestra _MENU_ Registros",
            "paginate": {
                "first": "Inicio",
                "last": "Ultimo",
                "next": "Siguiente",
                "previous": "Anterior"
            }
        }
    });

    $('#externosContact tbody').on('dblclick', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
        } else {
            tableDiv.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }

        var c1 = $('td', this).eq(0).text();
        var c2 = $('td', this).eq(1).text();
        $("#externoNombre").val(c1);
        $('#externoEmail').val(c2);
//        $(this).toggleClass('selected');
    });

    $('#externosContact tbody').on('click', 'tr', function () {
        $(this).toggleClass('selected');
        tableDiv.row().remove().draw(false);
    });


    $('#tableDivisas tbody').on('dblclick', 'tr', function () {
        var fechaTablePHP = $('td', this).eq(0).text();
        if (!dateValidate(fechaTablePHP)) {
            alert("Error: Solo es posible modificar las fechas del día en curso.\nIntenta Nuevamente.");
            $("#datepicker").val('');
            $("div.row #divInputs input").val('0.00000');
        } else {
            $('#datepicker').val($('td', this).eq(0).text());
            $('#usd_mxn').val($('td', this).eq(1).text());
            $('#usd_euros').val($('td', this).eq(2).text());
            $('#euro_usd').val($('td', this).eq(3).text());
            $('#yuan_usd').val($('td', this).eq(4).text());
            $('#aud_usd').val($('td', this).eq(5).text());
            $('#cad_usd').val($('td', this).eq(6).text());
            $('#gbp_usd').val($('td', this).eq(7).text());
            $('#usd_mxn2').val($('td', this).eq(8).text());
        }
    });

    /*
     * 
     * @type type
     * return boolean
     * date validate divisas
     */
    function dateValidate(dateValidate) {
        var d = dateValidate.split("-");
        day = parseInt(d[2]);
        month = parseInt(d[1]);
        year = parseInt(d[0]);
        var fi = new Date(year, month - 1, day);
        var hoy = new Date();
        fi.setHours(0, 0, 0, 0);
        hoy.setHours(0, 0, 0, 0);
        if (fi.getTime() === hoy.getTime()) {
            return true;
        } else {
            return false;
        }
    }

});//End document Ready

//$("button").button();
var tabs = $("#tabs").tabs();

/*
 * btn.Controller
 */
var valInputs;
$(":button").click(function (event) {
    event.preventDefault();
    let id = this.id;
    valInputs = $("form").serialize();

    if (this.id === "btn-guardar") {
        $.ajax({
            type: "post",
            url: "./controller/Divisas.controller.php",
            data: valInputs,
            beforeSend: function () {

            },
            success: function (response) {
                $('#responseConverter').html(response, status);
                console.log(status);
//                $("#tableDivisas").load("index.php");
                $("#datepicker").val('');
                $("div.row #divInputs input").val('0.00000');
                tableDiv.ajax.reload();
            }
        });
    }
    /*btn-ExternalController*/
    else if (this.id === "btn-EraseExternal") {

        var extEmail = $("#externoEmail").val();
        var parametros = {
            "extEmail": extEmail
        };
        $.ajax({
            type: "post",
            url: "./controller/Externos.Controller.php",
            data: parametros,
            beforeSend: function () {

                $("#externoNombre").val('');
                $("#externoEmail").val('');
            },
            success: function (response) {
                $("#mensajeExternos").html(response).slice().delay(3000).fadeOut(800);
                tableExternal.ajax.reload();
            }
        });
    }
    /*btn-btn-dateInterval*/
    else if (this.id === "btn-dateInterval") {
        var dateFirst = $("#dateIntervalDE").val();
        var dateLast = $("#dateIntervalAL").val();
        var params = {
            "dateFirst": dateFirst,
            "dateLast": dateLast
        };
//        console.log(params);
        $.ajax({
            type: "post",
            url: "./controller/Average.controller.php",
            data: params,
            beforeSend: function () {

            },
            success: function (response) {
                $("#messageResponse").html(response);
            }
        });
    }else if(this.id === "btn-report"){
        console.log("Abre modal");
//        $( "#exportarExcel").modal('show');
    }
});

$("#btn-crearExternos").click(function (e) {
    e.preventDefault();
    var extNombre = $("#externoNombre").val();
    var extEmail = $("#externoEmail").val();
    var parametros = {
        "externoNom": extNombre,
        "externoEmail": extEmail
    };
    $.ajax({
        type: "post",
        url: "./controller/Externos.Controller.php",
        data: parametros,
        beforeSend: function () {
            $("#externoNombre").val('');
            $("#externoEmail").val('');
        },
        success: function (response) {
            $("#mensajeExternos").html(response).slice().delay(3000).fadeOut(800);
            tableExternal.ajax.reload();
//            $("#externosContact").load("index.php");
//              $("#externoNombre").load("index.php");  
        }
    });
});
