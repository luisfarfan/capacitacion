/**
 * Created by LFarfan on 23/01/2017.
 */
/**
 * Created by lfarfan on 23/01/2017.
 */
/**
 * Created by lfarfan on 23/01/2017.
 */
$(function () {
    getDepartamentos();
    getCursos2();
});
$('#departamentos').change(function () {
    $('#provincias').find('option').remove();
    $("#distritos").find('option').remove();
    $("#zona").find('option').remove();
    getProvincias();
});

$('#provincias').change(function () {
    $("#distritos").find('option').remove();
    $("#zona").find('option').remove();
    getDistritos();
});

$('#distritos').change(function () {
    $("#zona").find('option').remove();
    getZonas();
});

/** APIS URL */
var url = `${BASEURL}/reportes/api_personal_alta_por_curso/`;
var reporte_data = [];
var ubigeo = {ccdd: '', ccpp: '', ccdi: '', zona: ''};
var queryParameters = '';
var cursos = [];

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
    let thead = `<tr>
        <th rowspan="2">Departamento</th>
        <th rowspan="2">Provincia</th>
        <th rowspan="2">Distrito</th>
        <th rowspan="2">Total</th>
        <th colspan="6">Curso de Capacitación (EXPERIMENTAL)</th>
    </tr>
    <tr>`;
    $.getJSON(`${url}${queryParameters}`, response => {
        let body = `<tr><td>${$('#departamentos :selected').text()}</td><td>${$('#provincias :selected').text()}</td><td>${$('#distritos :selected').text()}</td><td><span id="total"></span></td>`;
        let total = 0;
        reporte_data = response;
        reporte_data.map((key, value) => {
            thead += `<th>${key.nombre_curso}</th>`;
            body += `<td>${key.cantidad_pea_alta}</td>`;
            total += parseInt(key.cantidad_pea_alta);
        });
        thead += `</tr>`;
        body += `</tr>`;
        $('#tabla_reporte').find('thead').html(thead)
        $('#tabla_reporte').find('tbody').html(body)
        $('#total').text(total);
    });
}