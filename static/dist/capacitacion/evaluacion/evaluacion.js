/**
 * Created by LFarfan on 12/12/2016.
 */
/**
 * Created by lfarfan on 05/12/2016.
 */
$(function () {
    getLocales();
});

var turno;
var rangofechas = [];
var aula_selected;

$('#local').change(e=> {
    "use strict";
    let id_local = $('#local').val();
    getAmbientes(id_local);
});


function getLocales() {
    "use strict";
    let ubigeo = `${session.ccdd}${session.ccpp}${session.ccdi}`;
    $.ajax({
        url: `${BASEURL}/localbyzona/${ubigeo}/${session.zona}/`,
        type: 'GET',
        success: response => {
            setSelect_v2('local', response, ['id_local', 'nombre_local'])
        },
        error: error => {
            console.log('ERROR!!', error)
        }
    })
}
function getAmbientes(id_local) {
    "use strict";
    $.ajax({
        url: `${BASEURL}/localambiente/${id_local}/`,
        type: 'GET',
        success: response => {
            console.log(response);
            setTable('tabla_detalle_ambientes', response.ambientes, ['numero', 'capacidad', 'nombre_ambiente', {pk: 'id_localambiente'}]);
        },
        error: error => {
            console.log('ERROR!!', error);
        }
    })
}

function setCheckedTurnoManana(obj, fecha, val) {
    "use strict";
    let checked = '';
    $.each(obj, (key, value)=> {
        if (value.fecha == fecha) {
            checked = value.turno_manana == val ? 'checked' : '';
            value.turno_manana == val ? console.log(value) : '';
        }
    });
    return checked;
}

function setCheckedTurnoTarde(obj, fecha, val) {
    "use strict";
    let checked = '';
    $.each(obj, (key, value)=> {
        if (value.fecha == fecha) {
            checked = value.turno_tarde == val ? 'checked' : '';
        }
    });
    return checked;
}

function getPEA(id_localambiente) {
    "use strict";
    aula_selected = id_localambiente;
    if ($.fn.DataTable.isDataTable('#tabla_pea')) {
        $('#tabla_pea').dataTable().fnDestroy();
    }
    $.ajax({
        url: `${BASEURL}/peaaulaasistencia/${id_localambiente}/`,
        type: 'GET',
    })
}

function saveAsistencia() {
    "use strict";
    let tabla_pea = $('#tabla_pea').dataTable();
    let fecha_selected = $('#fechas').val();
    let div_data = tabla_pea.$('div[name="m' + fecha_selected + '"]');
    let data = [];
    let faltantes = 0;
    $.each(div_data, (key, val)=> {
        let turno_manana = $(val).find('input[name^="turno_manana"]:checked').val();
        let id_peaaula = $(val).find(`input[name^="id_peaaula"]`).val();
        let input_tarde = tabla_pea.$(`input[name="id_peaaula${id_peaaula}"]`)[1];
        let turno_tarde = $(input_tarde).parent().find('input[name^="turno_tarde"]:checked').val();
        let json = {};
        if (turno_manana != undefined || turno_tarde != undefined) {
            json = {
                fecha: fecha_selected,
                turno_manana: turno_manana,
                turno_tarde: turno_tarde,
                id_peaaula: id_peaaula
            };
            data.push(json);
        } else {
            faltantes++;
        }
    });
    let title = 'Asistencia Completa, Guardar?';
    let type = 'success';
    if (faltantes > 0) {
        title = 'Aun tiene personas que ha marcado su asistencia, desea guardar?';
        type = 'warning';
    }
    swal({
        title: 'Guardar Asistencia',
        text: title,
        type: type,
        showCancelButton: true,
        confirmButtonColor: "#EF5350",
        confirmButtonText: "Si!",
        cancelButtonText: "No!",
        closeOnConfirm: true,
        closeOnCancel: true,
        showLoaderOnConfirm: true
    }, confirm => {
        if (confirm) {
            $.ajax({
                url: `${BASEURL}/save_asistencia/`,
                type: 'POST',
                data: JSON.stringify(data),
                success: function (response) {
                    swal({
                        title: "Asistencia Guardada con éxito!",
                        confirmButtonColor: "#2196F3"
                    });
                }
            });
        }
    });
}
