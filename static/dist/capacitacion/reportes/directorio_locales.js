/**
 * Created by LFarfan on 16/01/2017.
 */


/** APIS URL */

$(function () {
    listReportes();
    getCursos();
})

var url_directorio_local = `${BASEURL}/reportes/api_directorio_locales/`;
var url = {
    lista_reporte: `${BASEURL}/reportes/getReportesList/`,
    num_aulas_coberturadas: `${BASEURL}/reportes/api_aulas_coberturas_curso/`,
}
var url_current = '';
var reporte_data = [];
var ubigeo = {id_curso: '', ccdd: '', ccpp: '', ccdi: '', zona: ''};
var queryParameters = '';
var cursos = [];
var title_reporte = '';

function hiddenTables() {
    $('#content_tables_reportes').find('table').map((pos, table) => {
        $(table).addClass('hidden')
    });
}
$('#select_reportes_list').change(event => {
    title_reporte = $('#select_reportes_list :selected').text();
    document.getElementById('nombre_reporte').textContent = title_reporte;
    switch (event.target.value) {
        case "9":
            hiddenTables();
            $('#num_aulas_coberturadas').removeClass('hidden');
            url_current = url.num_aulas_coberturadas;
            break;
        default:
            hiddenTables();
    }

});

function listReportes() {
    $.getJSON(url.lista_reporte, response => {
        setSelect_v2('select_reportes_list', response, ['id', 'nombre']);
        $('.bootstrap-select').selectpicker();
    });
}

function getUbigeoQueryParameters() {
    "use strict";
    ubigeo.id_curso = $('#cursos').val();
    ubigeo.ccdd = $('#departamentos').val();
    ubigeo.ccpp = $('#provincias').val();
    ubigeo.ccdi = $('#distritos').val();
    ubigeo.zona = $('#zona').val();
    queryParameters = '';
    for (let i in ubigeo) {
        if (ubigeo[i] != '' & ubigeo[i] != undefined & ubigeo[i] != 'Seleccione' & ubigeo[i] != null) {
            queryParameters += `${ubigeo[i]}/`
        }
    }
    let tr_header = `<th rowspan="3">DEPARTAMENTO</th>`;
    tr_header += ubigeo.ccdd != '' || ubigeo.ccdd != undefined || ubigeo.ccdd != null ? `<th rowspan="3">PROVINCIA</th>` : '';
    tr_header += ubigeo.ccpp != '' || ubigeo.ccpp != undefined || ubigeo.ccpp != null ? `<th rowspan="3">DISTRITO</th>` : '';
    tr_header += ubigeo.ccdi != '' || ubigeo.ccdi != undefined || ubigeo.ccdi != null ? `<th rowspan="3">DISTRITO</th>` : '';
    tr_header += `<th colspan="3">Curso</th>`;

    return queryParameters;
}
function getReporte() {
    "use strict";
    getUbigeoQueryParameters();
    $.getJSON(`${url_current}${queryParameters}`, response => {

        reporte_data = response;
        console.log(reporte_data);
        //let html = reportes.DirectorioLocales(reporte_data);

        //$('#tabla_reporte').find('tbody').html(html);
    });
}

function getCursos(id_etapa = 1) {
    $.getJSON(`${BASE_URL}cursobyetapa/${id_etapa}`, data => {
        setSelect_v2('cursos', data, ['id_curso', 'nombre_curso']);
    });
}

var reportes = {
    DirectorioLocales: response => {
        let html = '';
        reporte_data.map((key, val) => {
            html += `<tr>`;
            html += `<td>${parseInt(val) + 1}</td><td>${key.ubigeo__departamento}</td><td>${key.ubigeo__provincia}</td><td>${key.ubigeo__distrito}</td><td>${key.id_curso__nombre_curso}</td><td>${key.nombre_local}</td>
                     <td>${key.tipo_via}</td><td>${key.nombre_via}</td><td>${key.n_direccion}</td><td>${key.piso_direccion}</td><td>${key.mz_direccion}</td><td>${key.lote_direccion}</td><td>${key.km_direccion}</td>
                     <td>${key.responsable_nombre}</td><td>${key.responsable_telefono}</td><td>${key.dcount}</td>`;
            html += `</tr>`;
        });
        return html;
    },
    NumeroAulasCoberturadas: response => {
        let html = '';
        return html;
    }
}