/**
 * Created by LFarfan on 23/01/2017.
 */
$(function () {
    getDepartamentos();
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
    $('#zona_ubicacion_local').find('option').remove();
    getZonas();
});

var url = `${BASEURL}/reportes/aprobados_segun_cargo/`;
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
    let html = '';
    CARGO.map((key, value) => {
        $.getJSON(`${url}${ubigeo.ccdd}${ubigeo.ccpp}${ubigeo.ccdi}/${key}`, response => {
            reporte_data = reporte_data.concat(response);
            response.map((k, v) => {
                html += `<tr>`;
                html += `<td>${k.departamento}</td><td>${k.provincia}</td><td>${k.distrito}</td>
                     <td>${k.id_pea__ape_paterno} ${k.id_pea__ape_materno} ${k.id_pea__nombre}</td>
                     <td>${k.id_pea__dni}</td><td>${k.cargo}</td><td>${k.nota_final}</td>`;
                html += `</tr>`;
            });
            $('#tabla_reporte').find('tbody').append(html);
        });

    });


}
