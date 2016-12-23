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
$('#local').change(e=> {
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

function getPEA(id_localambiente) {
    "use strict";
    aula_selected = id_localambiente;
    if ($.fn.DataTable.isDataTable('#tabla_pea')) {
        $('#tabla_pea').dataTable().fnDestroy();
    }
    let json = {};
    let body = '';
    let thead = `<tr><th>N°</th><th>Nombre Completo</th><th>Cargo</th>`;
    for (let i in criterios) {
        thead += `<th>${criterios[i].criterio}</th>`;
    }
    thead += `<th>Nota Final</th><th>Aptos</th></tr>`;
    var notas = [];
    $.ajax({
        url: `${BASEURL}/peaaulaasistencia/${id_localambiente}/`,
        type: 'GET',
        success: response => {
            console.log(response);
            let count = 1;
            for (let i in response) {
                $.ajax({
                    async: false,
                    url: `${BASEURL}/pea_notas/${response[i].id_peaaula}/`,
                    type: 'GET',
                    success: function (nota) {
                        notas = nota
                    }
                });
                body += `<tr>
                    <input type="hidden" name=  "id_peaaula" value="${response[i].id_peaaula}">   
                    <td>${count++}</td>
                    <td>${response[i].id_pea.ape_paterno} ${response[i].id_pea.ape_materno} ${response[i].id_pea.nombre}</td>
                    <td>${response[i].id_pea.id_cargofuncional.nombre_funcionario}</td>`;
                let nota_asistencia = 18;
                for (let k in criterios) {
                    if (criterios[k].id_criterio == 2) {
                        for (let a in response[i].peaaulas) {
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
                        }
                        body += `<td><input type="number" min="0" max="20" maxlength="2" disabled name="${criterios[k].id_cursocriterio}" value="${nota_asistencia}" class="form_control"></td>`;
                    } else {
                        body += `<td><input type="number" min="0" max="20" maxlength="2" name="${criterios[k].id_cursocriterio}" value="${findInObject(notas, criterios[k].id_cursocriterio)}" class="form_control"></td>`;
                    }

                }
                body += `<td><input type="number" name="nota_final" disabled class="form_control"></td>`;
                body += `<td><input type="checkbox" name="aptos" value="${response[i].id_peaaula}"></td>`;
            }
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

        },
    })
}

function findInObject(obj, search) {
    "use strict";
    let nota = 0;
    console.log(obj);
    if (obj.length > 0) {
        $.each(obj, (key, val)=> {
            if (val['id_cursocriterio'] == search) {
                nota = val['nota'];
            }
        });
    }
    return nota;
}

function calcularPromedio(input) {
    "use strict";
    let rowindex = $(input).parent().parent()[0];
    rowindex = parseInt(rowindex.rowIndex) - 1;
    let promedio = 0;
    for (let i in criterios) {
        let input_nota = $($(`input[name="${criterios[i].id_cursocriterio}"]`)[rowindex]).val();
        input_nota == '' ? input_nota = 0 : '';
        promedio = promedio + (parseInt(input_nota) * (parseInt(criterios[i].ponderacion) / 100));
    }
    $($(`input[name="nota_final"]`)[rowindex]).val(Math.round(promedio));
}

function saveNotas() {
    "use strict";
    let data_send = [];
    let faltantes = 0;
    $.each(criterios, (i, v)=> {
        let criterio_input = $(`input[name="${criterios[i].id_cursocriterio}"]`);
        $.each(criterio_input, (k, v)=> {
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
                        title: "Asistencia Guardada con éxito!",
                        confirmButtonColor: "#2196F3"
                    });
                }
            });
        }
    });

}
