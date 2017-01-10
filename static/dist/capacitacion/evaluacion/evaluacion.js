/**
 * Created by LFarfan on 12/12/2016.
 */
/**
 * Created by lfarfan on 05/12/2016.
 */
$(function () {
    getLocales();
});

var criterios = [];
var aula_selected;
var id_curso;

var columns = [];
var position_nota_final = 0;


$('#local').change(e => {
    "use strict";
    let id_local = $('#local').val();
    getAmbientes(id_local);
});

$('#btn_getpea').click(event => {
    "use strict";
    aula_selected = $('#aulas').val();
    getPEA(aula_selected);
});

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
            id_curso = response.id_curso;
            getCriterios();
            setSelect_v2('aulas', response.ambientes, ['id_localambiente', ['numero', 'nombre_ambiente']]);
            //setTable('tabla_detalle_ambientes', response.ambientes, ['numero', 'capacidad', 'nombre_ambiente', {pk: 'id_localambiente'}]);
        },
        error: error => {
            console.log('ERROR!!', error);
        }
    })
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
    $(`input[name="nota_final"]`)[rowindex].value = Math.round(promedio * 100) / 100;
    //$($(`input[name="nota_final"]`)[rowindex]).parent().text(Math.round(promedio));
}


function saveNotas() {
    "use strict";
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

