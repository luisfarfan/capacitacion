/**
 * Created by LFarfan on 16/01/2017.
 */


/** APIS URL */

$(function () {
    listReportes();
})

var url_directorio_local = `${BASEURL}/reportes/api_directorio_locales/`;
var url = {
    lista_reporte: `${BASEURL}/reportes/getReportesList/`,
}
var reporte_data = [];
var ubigeo = {ccdd: '', ccpp: '', ccdi: '', zona: ''};
var queryParameters = '';
var cursos = [];

function listReportes() {
    $.getJSON(url.lista_reporte, response => {
        setSelect_v2('select_reportes_list', response, ['id', 'nombre']);
         $('.bootstrap-select').selectpicker();
    });
}

function getUbigeoQueryParameters() {
    "use strict";
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
    return queryParameters;
}
function getReporte() {
    "use strict";
    getUbigeoQueryParameters();
    $.getJSON(`${url_directorio_local}${queryParameters}`, response => {
        let html = '';
        reporte_data = response;
        //console.log(reporte_data);
        reporte_data.map((key, val) => {
            html += `<tr>`;
            html += `<td>${parseInt(val) + 1}</td><td>${key.ubigeo__departamento}</td><td>${key.ubigeo__provincia}</td><td>${key.ubigeo__distrito}</td><td>${key.id_curso__nombre_curso}</td><td>${key.nombre_local}</td>
                     <td>${key.tipo_via}</td><td>${key.nombre_via}</td><td>${key.n_direccion}</td><td>${key.piso_direccion}</td><td>${key.mz_direccion}</td><td>${key.lote_direccion}</td><td>${key.km_direccion}</td>
                     <td>${key.responsable_nombre}</td><td>${key.responsable_telefono}</td><td>${key.dcount}</td>`;
            html += `</tr>`;
        });
        $('#tabla_reporte').find('tbody').html(html);
    });
}

