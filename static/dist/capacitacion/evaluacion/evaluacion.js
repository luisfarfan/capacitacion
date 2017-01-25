/**
 * Created by LFarfan on 12/12/2016.
 */
/**
 * Created by lfarfan on 05/12/2016.
 */
$(function () {
    getLocales();
    if (session.rol__id == 3 || session.rol__id == 1) {
        $('#no_distrital').hide();
        $('#no_distrital_filtro').hide();
        $('#btn_exportar_evaluacion').hide();
    } else {
        $('#tabla_reporte').hide();
    }
    getReporte();
});

var criterios = [];
var aula_selected;
var id_curso;
var local = [];
var local_selected = {};
var rangofechas = [];
var columns = [];
var position_nota_final = 0;
var peaaula = [];


$('#local').change(e => {
    "use strict";
    let id_local = $('#local').val();
    getAmbientes(id_local);
    getRangoFechas(id_local);
});

$('#btn_getpea').click(event => {
    "use strict";
    aula_selected = $('#aulas').val();
    getPEA(aula_selected);
});

function getLocales() {
    let ubigeo = `${session.ccdd}${session.ccpp}${session.ccdi}`;
    //let url = session.rol == '3' ? `${BASE_URL}localubigeo/${ubigeo}/${session.curso}/` : `${BASE_URL}localzona/${ubigeo}/${session.zona}/${session.curso}/`;
    //let url = session.rol == '3' ? `${BASE_URL}localubigeo/${ubigeo}/${session.curso}/` : `${BASE_URL}localzona/${session.id}/`;
    //let url = session.rol == '3' ? `${BASE_URL}localubigeo/${ubigeo}/${session.curso}/` : `${BASE_URL}localzona/${session.id}/`;
    let url = session.rol__id == 1 || session.rol__id == 2 ? `${BASE_URL}localubigeo/${ubigeo}/${session.curso}/` : `${BASE_URL}localzona/${session.ccdd}${session.ccpp}${session.ccdi}/${session.curso}/${session.zona}`;
    "use strict";
    $.ajax({
        url: url,
        type: 'GET',
        success: response => {
            local = response;
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
            getCriterios();
            setSelect_v2('aulas', response.ambientes, ['id_localambiente', ['nombre_ambiente', 'numero']]);
            //setTable('tabla_detalle_ambientes', response.ambientes, ['numero', 'capacidad', 'nombre_ambiente', {pk: 'id_localambiente'}]);
        },
        error: error => {
            console.log('ERROR!!', error);
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

function getCriterios() {
    "use strict";
    $.ajax({
        url: `${BASEURL}/getCriteriosCurso/${id_curso}/`,
        type: 'GET',
        success: response => {
            criterios = response;
        },
        error: error => {
            console.log('ERROR!!', error);
        }
    })
}

function setColumnsDataTablePea() {
    columns = [];
    columns = [null, null, null]
    $.each(criterios, (key, val) => {
        columns.push({"orderDataType": "dom-text-numeric"})
    });
    columns.push({"orderDataType": "dom-text-numeric"})
    columns.push(null)
    position_nota_final = columns.length - 2;
}

function getPEA(id_localambiente) {
    "use strict";
    setColumnsDataTablePea();
    aula_selected = id_localambiente;
    if ($.fn.DataTable.isDataTable('#tabla_pea')) {
        $('#tabla_pea').dataTable().fnDestroy();
    }
    let json = {};
    let body = '';
    let thead = `<tr><th>N°</th><th>Nombre Completo</th><th>Cargo</th>`;
    $.each(criterios, i => {
        thead += `<th>${criterios[i].criterio}</th>`;
    });
    thead += `<th>Nota Final</th><th>Aptos</th></tr>`;
    var notas = [];
    $.ajax({
        url: `${BASEURL}/peaaulaasistencia/${id_localambiente}/`,
        type: 'GET',
        success: response => {
            let count = 1;
            $.each(response, (i, v) => {
                    $.ajax({
                        async: false,
                        url: `${BASEURL}/pea_notas/${response[i].id_peaaula}/`,
                        type: 'GET',
                        success: function (nota) {
                            notas = nota
                        }
                    });
                    body += `<tr ${response[i].id_pea.apto == 1 ? 'class="apto_selected"' : ''}>
                    <input type="hidden" name="id_peaaula" value="${response[i].id_peaaula}">   
                    <td>${count++}</td>
                    <td>${response[i].id_pea.ape_paterno} ${response[i].id_pea.ape_materno} ${response[i].id_pea.nombre}</td>
                    <td>${response[i].id_pea.id_cargofuncional.nombre_funcionario}</td>`;
                    let nota_asistencia = 18;
                    $.each(criterios, k => {
                        if (criterios[k].id_criterio == 2) {
                            $.each(response[i].peaaulas, a => {
                                switch (response[i].peaaulas[a].turno_manana) {
                                    case 1:
                                        nota_asistencia = nota_asistencia - 0.5;
                                        break;
                                    case 2:
                                        nota_asistencia = nota_asistencia - 1;
                                        break;
                                }
                                switch (response[i].peaaulas[a].turno_tarde) {
                                    case 1:
                                        nota_asistencia = nota_asistencia - 0.5;
                                        break;
                                    case 2:
                                        nota_asistencia = nota_asistencia - 1;
                                        break;
                                }
                            });
                            body += `<td><input type="number" min="0" max="20" maxlength="2" disabled name="${criterios[k].id_cursocriterio}" value="${nota_asistencia}"></td>`;
                        } else {
                            body += `<td><input type="number" min="0" max="20" maxlength="2" name="${criterios[k].id_cursocriterio}" value="${findInObject(notas, criterios[k].id_cursocriterio)}"></td>`;
                        }
                    });

                    body += `<td><input type="number" name="nota_final" disabled value="0"></td>`;
                    body += `<td><input type="checkbox" ${response[i].id_pea.apto == 1 ? 'checked' : ''} name="aptos" value="${response[i].id_pea.id_pea}"></td>`;
                }
            )

            json.html = body;
            $('#tabla_pea').find('thead').html(thead);
            setTable('tabla_pea', json);

            for (let i in criterios) {
                $(`input[name="${criterios[i].id_cursocriterio}"]`).keyup(function () {
                    calcularPromedio(this);
                })
            }
            for (let i in criterios) {
                $(`input[name="${criterios[i].id_cursocriterio}"]`).trigger('keyup');
            }

            $('#tabla_pea').DataTable({
                "bPaginate": false,
                "columns": columns,
                "order": [[position_nota_final, "desc"]]
            });
        },
    })
}

function findInObject(obj, search) {
    "use strict";
    let nota_res = 0;
    console.log(obj, search)
    if (obj.length > 0) {
        $.each(obj, (key, val) => {
            if (val['id_cursocriterio'] == search) {
                nota_res = val['nota'];
            }
        });
    }
    return nota_res;
}


function calcularPromedio(input) {
    "use strict";
    let rowindex = $(input).parent().parent()[0];
    rowindex = parseInt(rowindex.rowIndex) - 1;
    let promedio = 0;
    $.each(criterios, i => {
        let input_nota = $($(`input[name="${criterios[i].id_cursocriterio}"]`)[rowindex]).val();
        input_nota == '' ? input_nota = 0 : '';
        promedio = promedio + (parseInt(input_nota) * (parseInt(criterios[i].ponderacion) / 100));
    })
    //$($(`input[name="nota_final"]`)[rowindex]).val(Math.round(promedio * 100) / 100);
    promedio = Math.round(promedio * 1000) / 1000;
    $(`input[name="nota_final"]`)[rowindex].value = Math.round(promedio * 1000) / 1000;
    if (promedio >= 11) {
        $('input[name="aptos"]')[rowindex].checked = true
    } else {
        $('input[name="aptos"]')[rowindex].checked = false
    }

    //$($(`input[name="nota_final"]`)[rowindex]).parent().text(Math.round(promedio));
}


function saveNotas() {
    "use strict";
    if (session.rol__id == 3 || session.rol__id == 1) {
        alert_confirm(saveDistrital, 'Esta usted seguro de guardar?')
    } else {
        let data_send = [];
        let faltantes = 0;
        let aptos_input = [];
        $('input[name="aptos"]:checked').map((key, val) => {
            aptos_input.push($(val).val());
        });
        $.each(criterios, (i, v) => {
            let criterio_input = $(`input[name="${criterios[i].id_cursocriterio}"]`);
            $.each(criterio_input, (k, v) => {
                if ($(criterio_input[k]).val() != '') {
                    let json = {
                        nota: $(criterio_input[k]).val(),
                        id_peaaula: $(criterio_input[k]).parent().parent().find('input[name="id_peaaula"]').val(),
                        id_cursocriterio: criterios[i].id_cursocriterio,
                    };
                    data_send.push(json);
                } else {
                    faltantes++;
                }
            });
        });

        let title = 'Registro de Notas Completo, Guardar?';
        let type = 'success';
        if (faltantes > 0) {
            title = 'Aun tiene personas que no ha registrado sus Notas, desea guardar?';
            type = 'warning';
        }
        swal({
            title: 'Guardar Notas',
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
                    url: `${BASEURL}/save_notas/`,
                    type: 'POST',
                    data: JSON.stringify(data_send),
                    success: function (response) {
                        swal({
                            title: "Guardado con éxito!",
                            confirmButtonColor: "#2196F3"
                        });
                        $.ajax({
                            url: `${BASEURL}/save_nota_final/`,
                            type: 'POST',
                            data: JSON.stringify(getPeaNotaFinal()),
                            success: function (response) {

                            }
                        });

                    }
                });

                if (aptos_input.length) {
                    $.ajax({
                        url: `${BASEURL}/save_aptos/`,
                        type: 'POST',
                        data: {id_peas: aptos_input},
                        success: function (response) {

                        }
                    });
                }
            }
        });
    }

}


$("#btn_exportar_evaluacion").on('click', function () {
    $('#clone').html($('#tabla_pea').clone());
    $('#clone').find('input[type="number"]').map((key, val) => {
        "use strict";
        $(val).parent().text($(val).val());
    });
    $('#clone').find('input[name="aptos"]').map((key, value) => {
        $(value).remove()
    });
    var uri = $("#clone").battatech_excelexport({
        containerid: "clone",
        datatype: 'table',
        returnUri: true
    });

    $(this).attr('download', 'reporte_evaluacion.xls').attr('href', uri).attr('target', '_blank');
});

function getPeaNotaFinal() {
    let data_nota_final = []
    $('input[name="nota_final"]').map((key, value) => {
        data_nota_final.push({
            id_pea: $(value).parent().parent().find('input[name="aptos"]').val(),
            nota_final: value.value,
            id_curso: session.curso
        })
    })
    return data_nota_final
}

var url = `${BASEURL}/reportes/aprobados_curso/`;
var reporte_data;
function getReporte() {
    "use strict";
    let html = '';
    let zona = session.zona == '' ? '00' : session.zona;
    $.getJSON(`${url}${session.ccdd}${session.ccpp}${session.ccdi}/${zona}/${session.curso}`, response => {
        reporte_data = response;
        response.map((k, v) => {
            html += `<tr>`;
            html += `<td>${k.departamento}</td><td>${k.provincia}</td><td>${k.distrito}</td>
                     <td>${k.id_pea__ape_paterno} ${k.id_pea__ape_materno} ${k.id_pea__nombre}</td>
                     <td>${k.id_pea__dni}</td><td>${k.cargo}</td><td>${k.zona}</td><td>${k.nota_final}</td><td><input type="checkbox" ${k.aprobado == 1 ? 'checked' : ''} value="${k.id}" name="aprobado"></td>
                     <td><input type="checkbox" ${k.seleccionado == 1 ? 'checked' : ''} value="${k.id}" name="seleccionado"></td>`;
            html += `</tr>`;
        });
        $('#tabla_reporte').find('tbody').append(html);
        disabledApto();
    });
}

function disabledApto() {
    $('input[name="aprobado"]').map((key, value) => {
        $(value).prop('disabled', true)
    });
}
function saveDistrital() {
    let data_post = {aprobados: [], desaprobados: []}
    $('input[name="seleccionado"]').map((key, value) => {
        if (value.checked) {
            data_post.aprobados.push(value.value)
        } else {
            data_post.desaprobados.push(value.value)
        }
    });
    $.ajax({
        url: `${BASEURL}/save_aprobado_distrital/`,
        type: 'POST',
        data: data_post,
        success: response => {

        }

    })
}