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
//

$('#local').change(e => {
    "use strict";
    getAmbientes($('#local').val());
    $('#tabla_pea').find('tbody').empty();
});

$('#ambiente').change(e => {
    "use strict";
    getPEA($('#ambiente').val());
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
            id_curso = response.id_curso;
            setTable('tabla_detalle_ambientes', response.ambientes, ['numero', 'capacidad', 'nombre_ambiente', {pk: 'id_localambiente'}]);
        },
        error: error => {
            console.log('ERROR!!', error);
        }
    })
}

function getPEA(id_ambiente) {
    "use strict";
    $.ajax({
        url: `${BASEURL}/rest/pea_aula/${id_ambiente}/`,
        type: 'GET',
        success: response => {
            console.log(response)
            setTable('tabla_pea', response.pea, ['dni', 'ape_paterno', 'ape_materno', 'nombre', {'cargo': ['id_cargofuncional', 'nombre_funcionario']}]);
        },
        error: error => {
            console.log('ERROR!!', error)
        }
    })
}

function doAsignacion() {
    "use strict";
    let ubigeo = `${session.ccdd}${session.ccpp}${session.ccdi}`;
    $.ajax({
        url: `${BASEURL}/asignacion/`,
        type: 'POST',
        data: {ubigeo: ubigeo, zona: `${session.zona}`},
        success: response => {
            console.log(response);
            $('#modal_pea_sobrante').unblock();
            getSobrantes();
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
    let _id_curso = session.usuario;
    $('#tabla_pea_sobrante').DataTable();
    $('#tabla_pea_sobrante').dataTable().fnDestroy();
    $.ajax({
        url: `${BASEURL}/sobrantes_zona/`,
        type: 'POST',
        data: {ubigeo: ubigeo, zona: `${session.zona}`, id_curso: id_curso},
        success: response => {
            console.log(response);

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