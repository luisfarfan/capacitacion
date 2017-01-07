/**
 * Created by LFarfan on 01/12/2016.
 */

//Document on ready -------------
$(function () {
    "use strict";
    getLocales();
});
// -- END DOCUEMTNT ON READY

//VARIABLES COMUNES
var id_curso;
var rangofechas = [];
var id_localambiente;
var id_ambiente = undefined;
//

$('#local').change(e => {
    "use strict";
    getAmbientes($('#local').val());
    getRangoFechas($('#local').val());
    $('#tabla_pea').find('tbody').empty();
});

$('#ambiente').change(e => {
    "use strict";
    id_ambiente = $('#ambiente').val();
    getPEA(id_localambiente);
});

$('#fechas').change(e => {
    if (id_localambiente !== undefined) {
        getPEA(id_localambiente)
    }
});

function getLocales() {
    let ubigeo = `${session.ccdd}${session.ccpp}${session.ccdi}`;
    let url = session.curso == '1' ? `${BASE_URL}localubigeo/${ubigeo}/${session.curso}/` : `${BASE_URL}localzona/${ubigeo}/${session.zona}/${session.curso}/`;
    "use strict";
    $.ajax({
        url: url,
        type: 'GET',
        success: response => {
            setSelect_v2('local', response, ['id_local', 'nombre_local'])
        },
        error: error => {
            console.log('ERROR!!', error)
        }
    })
}

function getRangoFechas(id_local) {
    "use strict";
    $.ajax({
        url: `${BASEURL}/getRangeDatesLocal/${id_local}/`,
        type: 'GET',
        success: response => {
            setSelect_v2('fechas', response.fechas);
            rangofechas = response.fechas;
            $('#fechas').val(rangofechas[0]);
        },
        error: error => {
            console.log(error);
        }
    });
}

function getAmbientes(id_local) {
    "use strict";
    $.ajax({
        url: `${BASEURL}/localambiente/${id_local}/`,
        type: 'GET',
        success: response => {
            id_curso = response.id_curso;
            setTable2('tabla_detalle_ambientes', response.ambientes, ['numero', 'capacidad', 'nombre_ambiente', {pk: 'id_localambiente'}]);
        },
        error: error => {
            console.log('ERROR!!', error);
        }
    })
}

function getPEA(id_ambiente) {
    "use strict";
    id_localambiente = id_ambiente;
    $.ajax({
        url: `${BASEURL}/getPeaCurso5/`,
        type: 'POST',
        data: {'id_localambiente': id_ambiente, fecha: $('#fechas').val()},
        success: response => {
            let html = '';
            $('#tabla_pea').find('tbody').empty();
            $.each(response, (key, val) => {
                html += `<tr>`;
                html += `<td>${parseInt(key) + 1}</td>`;
                html += `<td>${val.id_pea.dni}</td>`;
                html += `<td>${val.id_pea.ape_paterno}</td>`;
                html += `<td>${val.id_pea.ape_materno}</td>`;
                html += `<td>${val.id_pea.nombre}</td>`;
                html += `<td>${val.id_pea.id_cargofuncional.nombre_funcionario}</td>`;
                html += `</tr>`;
            });
            $('#tabla_pea').find('tbody').html(html);
        },
        error: error => {
            console.log('ERROR!!', error)
        }
    })
}

function doAsignacion(show = false) {
    let ubigeo = `${session.ccdd}${session.ccpp}${session.ccdi}`;
    $.ajax({
        url: `${BASEURL}/asignacion/`,
        type: 'POST',
        data: {ubigeo: ubigeo, zona: `${session.zona}`, id_curso: session.curso},
        success: response => {
            console.log(response);
            $('#modal_pea_sobrante').unblock();
            show ? getSobrantes() : '';
        },
        error: error => {
            console.log('ERROR!!', error)
            $('#modal_pea_sobrante').unblock();
        }
    })
}
function doAsignacionReserva() {
    "use strict";
    let ubigeo = `${session.ccdd}${session.ccpp}${session.ccdi}`;
    $.ajax({
        url: `${BASEURL}/asignacion/`,
        type: 'POST',
        data: {ubigeo: ubigeo, zona: `${session.zona}`, contingencia: 1, id_curso: session.curso},
        success: response => {
            $('#modal_pea_sobrante').unblock();
            getReserva();
        },
        error: error => {
            console.log('ERROR!!', error)
            $('#modal_pea_sobrante').unblock();
        }
    })
}

function getSobrantes() {
    "use strict";
    let ubigeo = `${session.ccdd}${session.ccpp}${session.ccdi}`;
    let _id_curso = session.curso;
    $('#tabla_pea_sobrante').DataTable();
    $('#tabla_pea_sobrante').dataTable().fnDestroy();
    $.ajax({
        url: `${BASEURL}/sobrantes_zona/`,
        type: 'POST',
        data: {ubigeo: ubigeo, zona: `${session.zona}`, id_curso: _id_curso, contingencia: 0},
        success: response => {
            $('#tabla_pea_sobrante').DataTable({
                "data": response,
                "columns": [
                    {"data": "dni"},
                    {"data": "ape_paterno"},
                    {"data": "ape_materno"},
                    {"data": "nombre"},
                    {"data": "cargo"},
                ]
            });

            $('#modal_pea_sobrante').modal('show');
        },
        error: error => {
            console.log('ERROR!!', error)
        }
    })
}

function getReserva() {
    "use strict";
    let ubigeo = `${session.ccdd}${session.ccpp}${session.ccdi}`;
    let _id_curso = session.curso;
    $('#tabla_pea_reserva').DataTable();
    $('#tabla_pea_reserva').dataTable().fnDestroy();
    $.ajax({
        url: `${BASEURL}/sobrantes_zona/`,
        type: 'POST',
        data: {ubigeo: ubigeo, zona: `${session.zona}`, id_curso: _id_curso, contingencia: 1},
        success: response => {
            $('#tabla_pea_reserva').DataTable({
                "data": response,
                "columns": [
                    {"data": "dni"},
                    {"data": "ape_paterno"},
                    {"data": "ape_materno"},
                    {"data": "nombre"},
                    {"data": "cargo"},
                ]
            });

            $('#modal_pea_reserva').modal('show');
        },
        error: error => {
            console.log('ERROR!!', error)
        }
    })
}

$('#btn_do_asignar_pea').on('click', function () {
    var light_4 = $('#modal_pea_sobrante');
    $(light_4).block({
        message: '<i class="icon-spinner4 spinner"></i><h5>Espere por favor, se esta realizando el proceso de asignación automática</h5>',
        overlayCSS: {
            backgroundColor: '#fff',
            opacity: 0.8,
            cursor: 'wait'
        },
        css: {
            border: 0,
            padding: 0,
            backgroundColor: 'none'
        }
    });
    $('#modal_pea_sobrante').modal('show');
    doAsignacion()
});

function redistribuirAula(id_localambiente) {
    alert_confirm(()=> {
        $.ajax({
            url: `${BASEURL}/redistribuir_aula/${id_localambiente}`,
            type: 'GET',
            success: response => {
                doAsignacion();
                getPEA(id_localambiente);
            },
            error: error => {
                console.log('ERROR!!', error)
            }
        });

    }, 'Esta usted seguro de redistribuir la PEA de esta aula?')

}