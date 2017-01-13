/**
 * Created by lfarfan on 05/12/2016.
 */
$(function () {
    getLocales();
});

var turno;
var local_selected = [];
var rangofechas = [];
var peaaula = [];
var aula_selected;

$('#local').change(e => {
    "use strict";
    let id_local = $('#local').val();
    getAmbientes(id_local);
    getRangoFechas(id_local);
});

$('#fechas').change(e => {
    "use strict";
    getPEA(aula_selected);
});

function disabledTurnos(turno) {
    if (turno == '0') {
        $('input[name^="turno_manana"]').map((key, val) => {
            "use strict";
            $(val).prop('disabled', false);
        });
        $('input[name^="turno_tarde"]').map((key, val) => {
            "use strict";
            $(val).prop('disabled', true);
        });
    } else if (turno == '1') {
        $('input[name^="turno_manana"]').map((key, val) => {
            "use strict";
            $(val).prop('disabled', true);
        });
        $('input[name^="turno_tarde"]').map((key, val) => {
            "use strict";
            $(val).prop('disabled', false);
        });
    }
}

function getRangoFechas(id_local) {
    "use strict";
    $.ajax({
        url: `${BASEURL}/getRangeDatesLocal/${id_local}/`,
        type: 'GET',
        success: response => {
            setSelect_v2('fechas', response.fechas);
            turno = response.turno;
            rangofechas = response.fechas;
            $('#fechas').val(rangofechas[0]);
        },
        error: error => {
            console.log(error);
        }
    });
}

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
    $.each(obj, (key, value) => {
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
    $.each(obj, (key, value) => {
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
        success: response => {
            peaaula = response;
            response[0].id_instructor != null ? $('#instructor').val(response[0].id_instructor).trigger("change") : $('#instructor').val(-1).trigger("change");
            let fecha_selected = $('#fechas').val();
            let json = {};
            let html = '';
            let thead = `<tr>
                            <th>N°</th>
                            <th>Nombre Completo</th>
                            <th>Cargo</th>`;
            $.each(response, (key, val) => {
                html += `<tr ${val.id_pea.baja_estado == 1 ? 'style="background-color: #f1a6a6"' : "" }>`;
                html += `<td>${key + 1}</td>`;
                html += `<td>${val.id_pea.ape_paterno} ${val.id_pea.ape_materno} ${val.id_pea.nombre}</td><td>${val.id_pea.id_cargofuncional.nombre_funcionario}</td>`;

                if (val.id_pea.baja_estado == 1) {
                    html += `<td></td><td></td>`;
                } else {
                    html += `<td><div name="m${fecha_selected}" class="form-group">
                                        <input type="hidden" id="id_peaaula" name="id_peaaula${val.id_peaaula}" value="${val.id_peaaula}">
										<div class="checkbox checkbox-right">
											<label>
												<input type="radio" name="turno_manana${key}${fecha_selected}" ${setCheckedTurnoManana(val.peaaulas, fecha_selected, "0")} value="0">
												Puntual
											</label>
										</div>
										<div class="checkbox checkbox-right">
											<label>
												<input type="radio" name="turno_manana${key}${fecha_selected}" ${setCheckedTurnoManana(val.peaaulas, fecha_selected, "1")} value="1">
												Tardanza
											</label>
										</div>
										<div class="checkbox checkbox-right">
											<label>
												<input type="radio" name="turno_manana${key}${fecha_selected}" ${setCheckedTurnoManana(val.peaaulas, fecha_selected, "2")} value="2">
                                                Falta
											</label>
										</div>
									</div></td>`;
                    html += `<td><div name="${fecha_selected}" class="form-group">
                                        <input type="hidden" id="id_peaaula" name="id_peaaula${val.id_peaaula}" value="${val.id_peaaula}">
										<div class="checkbox checkbox-right">
											<label>
												<input type="radio" name="turno_tarde${key}${fecha_selected}" ${setCheckedTurnoTarde(val.peaaulas, fecha_selected, "0")} value="0">
												Puntual
											</label>
										</div>

										<div class="checkbox checkbox-right">
											<label>
												<input type="radio" name="turno_tarde${key}${fecha_selected}" ${setCheckedTurnoTarde(val.peaaulas, fecha_selected, "1")} value="1">
												Tardanza
											</label>
										</div>
										<div class="checkbox checkbox-right">
											<label>
												<input type="radio" name="turno_tarde${key}${fecha_selected}" ${setCheckedTurnoTarde(val.peaaulas, fecha_selected, "2")} value="2">
                                                Falta
											</label>
										</div>
									</div></td>`;
                }


                html += '</tr>';
            });

            thead += `<th>MAÑANA</th><th>TARDE</th>`;

            thead += `</tr>`;
            json.html = html;
            $('#tabla_pea').find('thead').html(thead);
            setTable('tabla_pea', json);
            disabledTurnos(turno);
            $('#tabla_pea').DataTable();

        },
        error: error => {
            console.log('ERROR!!', error)
        }
    })
}

function saveAsistencia() {
    "use strict";
    let tabla_pea = $('#tabla_pea').dataTable();
    let fecha_selected = $('#fechas').val();
    let div_data = tabla_pea.$('div[name="m' + fecha_selected + '"]');
    let data = [];
    let faltantes = 0;
    $.each(div_data, (key, val) => {
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
                url: `${BASEURL}/update_peaaula/${aula_selected}/${$('#instructor').val()}/`,
                type: 'GET',
                success: function (response) {
                    getPEA(aula_selected);
                },
                error: function (error) {

                }
            });
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

function fn_darBaja() {
    "use strict";
    let id_pea = [];
    let inputs_checked_idpea = $('input[name="check_id_pea"]')
    $.each(inputs_checked_idpea, (key, val) => {
        if ($(val).is(':checked')) {
            id_pea.push($(val).val());
        }
    });
    $.ajax({
        url: `${BASEURL}/darBajaPea/`,
        type: 'POST',
        data: {'id_peas': id_pea},
        success: response => {
            $('#modal_pea_dar_baja').modal('hide');
            setTablaDarBaja();
        }
    });
}

function fn_darAlta() {
    "use strict";
    let id_pea = [];
    let inputs_checked_idpea = $('input[name="check_id_pea_dar_alta"]');
    $.each(inputs_checked_idpea, (key, val) => {
        if ($(val).is(':checked')) {
            id_pea.push($(val).val());
        }
    });
    $.ajax({
        url: `${BASEURL}/darAltaPea/`,
        type: 'POST',
        data: {'id_peas': id_pea},
        success: response => {
            $('#modal_pea_dar_alta').modal('hide');
            doAsignacion();
        }
    });
}

function darAlta() {
    "use strict";
    alert_confirm(fn_darAlta);
}
function darBaja() {
    "use strict";
    alert_confirm(fn_darBaja);
}

function getContingencia() {
    if ($.fn.DataTable.isDataTable('#tabla_pea_dar_alta')) {
        $('#tabla_pea_dar_alta').dataTable().fnDestroy();
    }
    $.ajax({
        url: `${BASEURL}/sobrantes_zona/`,
        type: 'POST',
        data: {
            ubigeo: `${session.ccdd}${session.ccpp}${session.ccdi}`,
            zona: `${session.zona}`,
            id_curso: `${session.curso}`,
            contingencia: 1
        },
        success: response => {
            $('#modal_pea_dar_alta').modal('show');
            let html = '';
            $('#tabla_pea_dar_alta').find('tbody').empty();
            $.each(response, (key, val) => {
                html += `<tr>`;
                html += `<td>${val.dni}</td>`;
                html += `<td>${val.ape_paterno}</td>`;
                html += `<td>${val.ape_materno}</td>`;
                html += `<td>${val.nombre}</td>`;
                html += `<td><input type="checkbox" name="check_id_pea_dar_alta" value="${val.id_pea}"></td>`;
                html += `</tr>`;
            });
            $('#tabla_pea_dar_alta').find('tbody').html(html);
            $('#tabla_pea_dar_alta').dataTable();

            $('#modal_pea_dar_alta').modal('show');
        },
        error: error => {
            console.log('ERROR!!', error)
        }
    })
}

function setTablaDarBaja() {
    getPEA(aula_selected);
    if ($.fn.DataTable.isDataTable('#tabla_pea_dar_baja')) {
        $('#tabla_pea_dar_baja').dataTable().fnDestroy();
    }
    if (peaaula.length) {
        $('#modal_pea_dar_baja').modal('show');
        let html = '';
        $('#tabla_pea_dar_baja').find('tbody').empty();
        $.each(peaaula, (key, val) => {
            html += `<tr>`;
            html += `<td>${val.id_pea.dni}</td>`;
            html += `<td>${val.id_pea.ape_paterno}</td>`;
            html += `<td>${val.id_pea.ape_materno}</td>`;
            html += `<td>${val.id_pea.nombre}</td>`;
            html += `<td><input type="checkbox" name="check_id_pea" value="${val.id_pea.id_pea}"></td>`;
            html += `</tr>`;
        });
        $('#tabla_pea_dar_baja').find('tbody').html(html);
        $('#tabla_pea_dar_baja').dataTable();
    } else {
        alert('Debe seleccionar un aula');
    }
}


function reporte_pea_asistencia() {
    "use strict";
    let html = `<tr><th rowspan="2">N°</th><th rowspan="2">APELLIDOS</th><th rowspan="2">NOMBRES</th><th rowspan="2">CARGO</th>`;
    let td_mt = `<tr>`;
    $.each(rangofechas, (i, v) => {
        html += `<th colspan="2">${v.substring(0, 5)}</th>`;
        td_mt += `<th>M</th><th>T</th>`;
    });
    html += `</tr>`;
    td_mt += `</tr>`;
    html = html + td_mt;

    $('#tabla_reporte_pea_asistencia').find('thead').html(html);
    set_reporte_pea_asistencia();
    $('#modal_reporte_pea_exportar').modal('show');

}

function set_reporte_pea_asistencia() {
    "use strict";
    let html = '';
    let fechas_persona = [];
    let obj_fecha = {};
    peaaula.map((key, val) => {
        html += `<tr>`;
        html += `<td>${val + 1}</td>`;
        html += `<td>${key.id_pea.ape_paterno} ${key.id_pea.ape_materno}</td>`;
        html += `<td>${key.id_pea.nombre}</td>`;
        html += `<td>${key.id_pea.id_cargofuncional.nombre_funcionario}</td>`;
        fechas_persona = [];
        key.peaaulas.map(f => {
            fechas_persona.push(f.fecha);
        });
        console.log(fechas_persona);
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
            } else {
                html += `<td></td><td></td>`;
            }
        });
        html += `</tr>`;
    });
    $('#tabla_reporte_pea_asistencia').find('tbody').html(html);
}


function reporte_pea_asistencia_blanco() {
    "use strict";
    let html = `<tr><th rowspan="2">N°</th><th rowspan="2">APELLIDOS</th><th rowspan="2">NOMBRES</th><th rowspan="2">CARGO</th>`;
    let td_mt = `<tr>`;
    $.each(rangofechas, (i, v) => {
        html += `<th colspan="2">${v.substring(0, 5)}</th>`;
        td_mt += `<th>M</th><th>T</th>`;
    });
    html += `</tr>`;
    td_mt += `</tr>`;
    html = html + td_mt;

    $('#tabla_reporte_pea_asistencia').find('thead').html(html);
    set_reporte_pea_asistencia_blanco();
    $('#modal_reporte_pea_exportar').modal('show');

}

function set_reporte_pea_asistencia_blanco() {
    "use strict";
    let html = '';
    peaaula.map((key, val) => {
        html += `<tr>`;
        html += `<td>${val + 1}</td>`;
        html += `<td>${key.id_pea.ape_paterno} ${key.id_pea.ape_materno}</td>`;
        html += `<td>${key.id_pea.nombre}</td>`;
        html += `<td>${key.id_pea.id_cargofuncional.nombre_funcionario}</td>`;
        rangofechas.map(fecha => {
            html += `<td></td><td></td>`;
        });
        html += `</tr>`;
    });
    $('#tabla_reporte_pea_asistencia').find('tbody').html(html);
}

$("#btn_exportar_evaluacion").on('click', function () {
    var uri = $("#div_listado_reporte").battatech_excelexport({
        containerid: "div_listado_reporte",
        datatype: 'table',
        returnUri: true
    });

    $(this).attr('download', 'listado_asistencia.xls').attr('href', uri).attr('target', '_blank');
});

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
            $('#local').trigger('change');
            getPEA(aula_selected);
        },
        error: error => {
            console.log('ERROR!!', error)
            $('#modal_pea_sobrante').unblock();
        }
    })
}