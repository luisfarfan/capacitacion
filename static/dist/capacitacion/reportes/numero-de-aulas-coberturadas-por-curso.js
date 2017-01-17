/**
 * Created by LFarfan on 16/01/2017.
 */

$(function () {
    getDepartamentos();
    getCursos();
    enableBuscar();
});

var cursos = [];
var ubigeo = {ccdd: '', ccdd_nombre: '', ccpp: '', ccpp_nombre: '', ccdi: '', ccdi_nombre: '', curso: ''};
var url = `${BASEURL}/reportes/api_aulas_coberturas_curso/`;
var reporte_data = [];

$('#departamentos').change(function () {
    $('#provincias').find('option').remove();
    $("#distritos").find('option').remove();
    getProvincias();
    enableBuscar()
});

$('#provincias').change(function () {
    $("#distritos").find('option').remove();
    getDistritos();
    enableBuscar()
});

$('#distritos').change(function () {
    "use strict";
    enableBuscar()
});
$('#cursos').change(() => {
    "use strict";
});


function getCursos() {
    "use strict";
    let array_cursos = [];
    $.getJSON(`${BASE_URL}cursobyetapa/1`, response => {
        cursos = response;
        $.each(cursos, function (key, val) {
            array_cursos.push({id: val.id_curso, text: val.nombre_curso})
        });
        setSelect('cursos', array_cursos);
        $('#cursos').val(cursos[0]['id_curso']).trigger('change');
    });
}

function enableBuscar() {
    "use strict";
    setUbigeo();
    $('#btn_reporte').addClass('disabled');
    let enabled = true;
    for (let i in ubigeo) {
        if (ubigeo[i] == '' || ubigeo[i] == undefined || ubigeo[i] == 'Seleccione' || ubigeo[i] == null) {
            enabled = false;
        }
    }
    enabled ? $('#btn_reporte').removeClass('disabled') : $('#btn_reporte').addClass('disabled');
}

function setUbigeo() {
    "use strict";
    ubigeo.ccdd = $('#departamentos').val();
    ubigeo.ccpp = $('#provincias').val();
    ubigeo.ccdi = $('#distritos').val();
    ubigeo.ccdd_nombre = $('#departamentos').text();
    ubigeo.ccpp_nombre = $('#provincias').text();
    ubigeo.ccdi_nombre = $('#distritos').text();
    ubigeo.curso = $('#cursos').val();
}

function getReporte() {
    "use strict";
    setUbigeo();
    $.getJSON(`${url}${ubigeo.ccdd}${ubigeo.ccpp}${ubigeo.ccdi}/${ubigeo.curso}`, response => {
        reporte_data = response;
    });
}