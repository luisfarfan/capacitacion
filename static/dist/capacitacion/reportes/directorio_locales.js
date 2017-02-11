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
    cargos: `${BASEURL}/rest/cargos/`,
    num_aulas_coberturadas: `${BASEURL}/reportes/api_aulas_coberturas_curso/`,
    reporte_total_cantidades: `${BASEURL}/reportes/ReporteTotalCantidades/`,
    postulante_selec_curso: `${BASEURL}`,
    postulante_asistieron_curso: `${BASEURL}`,
    postulante_que_dio_baja: `${BASEURL}`,
    n_postulante_capacitados: `${BASEURL}`,
    personal_selec_para_trabajar: `${BASEURL}`,
    direct_local_capacitacion_x_num_ambiente: `${BASEURL}/reportes/api_directorio_locales/`,
    directorio_locales: `${BASEURL}`,
}
var url_current = '';
var reporte_data = [];
var ubigeo = {id_curso: '', id_funcionario: '', ccdd: '', ccpp: '', ccdi: '', zona: ''};
var queryParameters = '';
var cursos = [];
var title_reporte = '';

function hiddenTables() {
    $('#content_tables_reportes').find('table').map((pos, table) => {
        $(table).addClass('hidden')
    });
    $('#div_cargos').hide();
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
        case "10":
            hiddenTables();
            $('#postulante_selec_curso').removeClass('hidden');
            url_current = url.postulante_selec_curso;
            break;
        case "11":
            hiddenTables();
            $('#postulante_asistieron_curso').removeClass('hidden');
            url_current = url.postulante_asistieron_curso;
            break;
        case "12":
            hiddenTables();
            $('#postulante_que_dio_baja').removeClass('hidden');
            url_current = url.postulante_que_dio_baja;
            break;

        case "13":
            hiddenTables();
            $('#n_Postulantes_Capacitados').removeClass('hidden');
            url_current = url.n_postulante_capacitados;
            break;
        case "14":
            hiddenTables();
            $('#personal_selec_para_trabajar').removeClass('hidden');
            url_current = url.personal_selec_para_trabajar;
            break;
        case "15":
            hiddenTables();
            $('#direct_local_capacitacion_x_num_ambiente').removeClass('hidden');
            url_current = url.direct_local_capacitacion_x_num_ambiente;
            break;
        case "16":
            hiddenTables();
            $('#directorio_locales').removeClass('hidden');
            url_current = directorio_locales;
            break;
        case "17":
            hiddenTables();
            $('#div_cursos').hide();
            $('#cursos').val(undefined);
            $('#div_cargos').show();
            listCargos();
            $('#reporte_titulares_reserva_selecc_baja_alta').removeClass('hidden');
            url_current = url.reporte_total_cantidades
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

function listCargos() {
    $.getJSON(url.cargos, response => {
        setSelect_v2('select_cargos_list', response, ['id_funcionario', 'nombre_funcionario']);
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
    ubigeo.id_funcionario = $('#select_cargos_list').val();
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

    var texto_curso = $('#cursos :selected').text();
    $.getJSON(`${url_current}${queryParameters}`, response => {
        let report_id = $('#select_reportes_list').val();
        let html_body = '';
        switch (report_id) {
            case "9":
                let html1 = '';
                reporte_data = response;
                console.log(reporte_data);
                html1 = reportes.direct_numero_aulas_cobertura(reporte_data);
                $('#num_aulas_coberturadas').find('tbody').html(html1);
                document.getElementById('p').textContent = texto_curso;
                break;
            case "16":
                let html = '';
                reporte_data = response
                html = reportes.DirectorioLocales(reporte_data);
                $('#direct_local_capacitacion_x_num_ambiente').find('tbody').html(html);
                break;
            case "17":
                reporte_data = response
                html_body = reportes.ReporteTotalCantidades(reporte_data);
                $('#reporte_titulares_reserva_selecc_baja_alta').find('tbody').html(html_body);
                break;
        }
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
        response.map((key, val) => {
            html += `<tr>`;
            html += `<td>${parseInt(val) + 1}</td><td>${key.ubigeo__departamento}</td><td>${key.ubigeo__provincia}</td><td>${key.ubigeo__distrito}</td><td>${key.id_curso__nombre_curso}</td><td>${key.nombre_local}</td>
                     <td>${key.tipo_via}</td><td>${key.nombre_via}</td><td>${key.n_direccion}</td><td>${key.piso_direccion}</td><td>${key.mz_direccion}</td><td>${key.lote_direccion}</td><td>${key.km_direccion}</td>
                     <td>${key.responsable_nombre}</td><td>${key.responsable_telefono}</td><td>${key.dcount}</td>`;
            html += `</tr>`;
        });
        return html;
    },
    direct_numero_aulas_cobertura: response => {
        let html = '';
        response.map((key, val) => {
            html += `<tr>`;
            html += `<td>${key.ubigeo__departamento}</td> 
                     <td>${'ubigeo__provincia' in key ? key.ubigeo__provincia : ''}</td>                  
                     <td>${'ubigeo__distrito' in key ? key.ubigeo__distrito : ''}</td>
                     <td></td>;
                     <td>${key.dcount}</td>`;
            html += `</tr>`;
        });
        return html;
    },

    NumeroAulasCoberturadas: response => {
        let html = '';
        return html;
    },
    ReporteTotalCantidades: response => {
        let html = '';
        response.map((key, val) => {
            html += `<tr>`;
            html += `<td>${key.departamento}</td> 
                     <td>${key.provincia}</td>                  
                     <td>${key.distrito}</td>
                     <td style="background-color: #4CAF50;color: #fff;">${key.titulares}</td>
                     <td style="background-color: #00BCD4;color: #fff;">${key.reservas}</td>
                     <td style="background-color: #FF5722;color: #fff;">${key.no_seleccionados}</td>
                     <td style="background-color: #F44336;color: #fff;">${key.bajas}</td>
                     <td style="background-color: #00838F;color: #fff;">${key.altas}</td>`
            html += `</tr>`;
        });
        return html;
    }
}
