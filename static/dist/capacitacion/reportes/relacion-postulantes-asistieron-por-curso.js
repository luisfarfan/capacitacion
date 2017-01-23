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

$('#cursos').change(function () {
    getLocales2();
});

$('#locales').change(()=> {
    getRangoFechas($('#locales').val());
    getAmbientes($('#locales').val());
});

$('#aulas').change(function () {
    getPEA($('#aulas').val())
});
var rangofechas = [];
var peaaula = [];
var id_curso = [];
var aula_selected;
var ambiente_selected;
var turno;


function getAmbientes(id_local) {
    "use strict";
    $.ajax({
        url: `${BASEURL}/localambiente/${id_local}/`,
        type: 'GET',
        success: response => {
            id_curso = response.id_curso;
            setSelect_v2('aulas', response.ambientes, ['id_localambiente', ['nombre_ambiente', 'numero']]);
            //setTable('tabla_detalle_ambientes', response.ambientes, ['numero', 'capacidad', 'nombre_ambiente', {pk: 'id_localambiente'}]);
        },
        error: error => {
            console.log('ERROR!!', error);
        }
    })
}

function getPEA(id_localambiente) {
    "use strict";
    aula_selected = id_localambiente;
    $.ajax({
        url: `${BASEURL}/peaaulaasistencia/${id_localambiente}/`,
        type: 'GET',
        success: response => {
            peaaula = response;
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
            turno = response.turno;
            rangofechas = response.fechas;
        },
        error: error => {
            console.log(error);
        }
    });
}

function reporte_pea_asistencia() {
    "use strict";
    let html = `<tr><th rowspan="2">N°</th><th rowspan="2">APELLIDOS</th><th rowspan="2">NOMBRES</th><th rowspan="2">CARGO</th>`;
    let td_mt = `<tr>`;
    if ($('#cursos').val() == 4) {
        rangofechas = [$('#fechas').val()]
    }
    $.each(rangofechas, (i, v) => {
        html += `<th colspan="2">${v.substring(0, 5)}</th>`;
        td_mt += `<th>M</th><th>T</th>`;
    });
    html += `</tr>`;
    td_mt += `</tr>`;
    html = html + td_mt;

    $('#tabla_reporte_pea_asistencia').find('thead').html(html);
    set_reporte_pea_asistencia();

}

function set_reporte_pea_asistencia() {
    "use strict";
    let html = '';
    let fechas_persona = [];
    let obj_fecha = {};

    let pea_por_fecha = [];
    if ($('#cursos').val() == 4) {
        pea_por_fecha = peaaula.filter(function (e) {
            return e.pea_fecha == $('#fechas').val();
        });
    } else {
        pea_por_fecha = peaaula;
    }
    pea_por_fecha.map((key, val) => {
        html += `<tr>`;
        html += `<td>${val + 1}</td>`;
        html += `<td>${key.id_pea.ape_paterno} ${key.id_pea.ape_materno}</td>`;
        html += `<td>${key.id_pea.nombre}</td>`;
        html += `<td>${key.id_pea.id_cargofuncional.nombre_funcionario}</td>`;
        fechas_persona = [];
        key.peaaulas.map(f => {
            fechas_persona.push(f.fecha);
        });
        if (session.curso == 4) {
            rangofechas = [$('#fechas').val()]
        }
        if (key.id_pea.baja_estado == 1) {
            html += `<td colspan=${(rangofechas.length) * 2}><span>DADO DE BAJA</span></td>`;
        } else {
            rangofechas.map(fecha => {
                if ($.inArray(fecha, fechas_persona) >= 0) {
                    obj_fecha = findInObject2(key.peaaulas, fecha, 'fecha');
                    switch (obj_fecha.turno_manana) {
                        case 0:
                            html += `<td>P</td>`;
                            break;
                        case 1:
                            html += `<td>T</td>`;
                            break;
                        case 2:
                            html += `<td style="background-color: red">F</td>`;
                            break;
                        default:
                            html += `<td></td>`;
                    }
                    switch (obj_fecha.turno_tarde) {
                        case 0:
                            html += `<td>P</td>`;
                            break;
                        case 1:
                            html += `<td>T</td>`;
                            break;
                        case 2:
                            html += `<td style="background-color: red">F</td>`;
                            break;
                        default:
                            html += `<td></td>`;
                    }
                    if (obj_fecha.baja_estado == 1) {
                        html += `<td>B</td>`;
                    }
                } else {
                    html += `<td></td><td></td>`;
                }
            });
        }
        html += `</tr>`;
    });
    $('#tabla_reporte_pea_asistencia').find('tbody').html(html);
}
