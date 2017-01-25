/**
 * Created by LFarfan on 21/11/2016.
 */
//BASE_URL = `http://localhost:8000/`;
if (session.rol__id == 1) {
    $('#zona').parent().remove();
    //$('#zona_ubicacion_local').parent().remove()
} else {
    $('#zona').parent().show();
}

var local_selected = [];
var fecha_hoy = moment().format('DD/MM/YYYY');
var local_marco = [];
var local_marco_selected = {};
var is_directorio = true;


function getLocalesbyUbigeo() {
    var ubigeo = `${$('#departamentos').val()}${$('#provincias').val()}${$('#distritos').val()}`;
    let url = session.rol__id == 1 ? `${BASE_URL}localubigeo/${ubigeo}/${session.curso}/` : `${BASE_URL}localzona/${session.ccdd}${session.ccpp}${session.ccdi}/${session.curso}/${session.zona}`;
    $.ajax({
        async: false,
        url: url,
        success: function (data) {
            var html = '';
            $.each(data, function (key, val) {
                html += `<tr>
                            <td>${val.nombre_local}</td><td>${val.nombre_via}</td><td>${val.referencia}</td><td>${val.zona}</td>
                            <td>
								<ul class="icons-list">
                                    <li class="text-primary-600"><a data-popup="tooltip" title="Mostrar" onclick="getLocal(${val.id_local},false)" href="#"><i class="icon-pencil7"></i></a></li>
                                    <li class="text-danger-600"><a data-popup="tooltip" title="Eliminar" onclick="eliminarLocal(${val.id_local},${val.curso_local})" href="#"><i class="icon-trash"></i></a></li>
								</ul>
							</td>
                          </tr>`;
            });

            $('#table_localesubigeo').find('tbody').html(html);
            $('#table_localesubigeo').DataTable();
            $('[data-popup]').tooltip({
                template: '<div class="tooltip"><div class="bg-slate-800"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div></div>'
            });
        }
    });
}

function getLocalesbyMarco() {
    var ubigeo = `${$('#departamentos').val()}${$('#provincias').val()}${$('#distritos').val()}`;
    //let url = `${BASE_URL}localmarco/${ubigeo}/${session.zona}/`;
    let url = `${BASE_URL}directoriolocal/${ubigeo}/`;
    $.ajax({
        url: url,
        success: function (data) {
            local_marco = data;
            var html = '';
            $.each(data, function (key, val) {
                let atributo = '';
                if ('id_curso' in findInObject2(val.cursos_locales, session.curso, 'id_curso')) {
                    atributo = 'checked disabled';
                } else {
                    atributo = '';
                }
                html += `<tr>
                            <td>${val.nombre_local}</td><td>${val.zona}</td>
                            <td>
								<ul class="icons-list">
                                    <li class="text-primary-600"><a data-popup="tooltip" title="Mostrar" onclick="setMarco(${val.id_local},true)" href="#"><i class="icon-pencil7"></i></a></li>
                                    <li class="text-primary-600"><input type="checkbox" ${atributo}  name="local_seleccionado" onclick="saveUsuarioLocal(this,${val.id_local})"></a></li>
								</ul>
							</td>
                          </tr>`;
            });
            $('#table_localesmarco').find('tbody').html(html);
            $('#table_localesmarco').DataTable();
            $('[data-popup]').tooltip({
                template: '<div class="tooltip"><div class="bg-slate-800"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div></div>'
            });
        }
    });
}

function saveUsuarioLocal(element, id_local) {
    "use strict";
    $(element).prop('checked', false);
    alert_confirm(() => {
        $.ajax({
            url: `${BASEURL}/rest/curso_local/`,
            type: 'POST',
            data: {id_cursolocal: id_local, curso: session.curso},
            success: (response) => {
                $(element).prop('checked', true);
                $.ajax({
                    url: `${BASEURL}/copy_directorio_to_seleccionado/${id_local}/${session.curso}/`,
                    success: (data) => {
                        console.log(data);
                    }
                })
            }
        })
    }, 'Esta usted seguro de seleccionar este Local?')
}

function getLocal(id_local, directorio = true) {
    is_directorio = directorio;
    let url = '';
    if (is_directorio) {
        url = `${BASE_URL}rest/directorio_local/`;
    } else {
        url = `${BASE_URL}rest/local/`;
    }
    $('#id_local').val(id_local);
    $.ajax({
        url: `${url}${id_local}`,
        success: function (data) {
            local_selected = data;
            $(`#etapa`).val(1);
            $.each(data, function (key, val) {
                if (key == 'tipo_via' || key == 'turno_uso_local' || key == 'id_curso' || key == 'zona_ubicacion_local' || key == 'funcionario_nombre') {
                    $(`select[name=${key}]`).val(val).trigger('change')
                } else {
                    $(`input[name=${key}]`).val(val)
                }
            });
            $('#cursos').val(session.curso);
            $('#capacidad_total').text(0);
            $('#funcionario_nombre').trigger('change');
            $('#registrar_aulas_modal').prop('disabled', false);
            $('#modal_localesbyubigeo').modal('hide');
            getLocalAmbientes()

        }
    });
}

function setMarco(id_local) {
    is_directorio = true;

    $('#id_local').val(id_local);
    local_selected = findInObject2(local_marco, id_local, 'id_local');
    $(`#etapa`).val(1);
    $.each(local_selected, function (key, val) {
        if (key == 'tipo_via' || key == 'turno_uso_local' || key == 'id_curso' || key == 'zona_ubicacion_local' || key == 'funcionario_nombre') {
            $(`select[name=${key}]`).val(val).trigger('change')
        } else {
            $(`input[name=${key}]`).val(val)
        }
    });
    $('#capacidad_total').text(0);
    $('#funcionario_nombre').trigger('change');
    $('#registrar_aulas_modal').prop('disabled', false);
    $('#modal_localesbyubigeo').modal('hide');
    getLocalAmbientes();
    $('#modal_localesmarco').modal('hide');
}
function getCursos(id_etapa) {
    $('#cursos').find('option').remove();
    let array_cursos = [{id: '', text: 'Seleccione'}];
    $.getJSON(`${BASE_URL}cursobyetapa/${id_etapa}`, function (data) {
        $.each(data, function (key, val) {
            array_cursos.push({id: val.id_curso, text: val.nombre_curso})
        });
        setSelect('cursos', array_cursos);
        $('#cursos').val(session.curso);
    });
}

$('#registrar').on('click', function () {
    validator.form();
    let url = '';
    let method = '';

    if (is_directorio) {
        url = `${BASE_URL}rest/directorio_local/`;
    } else {
        url = `${BASE_URL}rest/local/`;
    }

    if ($('#id_local').val() != '') {
        url += `${$('#id_local').val()}/`;
        method = 'PUT';
    } else {
        method = 'POST';
    }
    if (validator.numberOfInvalids() == 0) {
        swal({
                title: 'Guardar',
                text: "Esta seguro de guardar?",
                type: "success",
                showCancelButton: true,
                confirmButtonColor: "#EF5350",
                confirmButtonText: "Si!",
                cancelButtonText: "No, Cancelar!",
                closeOnConfirm: true,
                closeOnCancel: true
            },
            function (isConfirm) {
                window.onkeydown = null;
                window.onfocus = null;
                if (isConfirm) {
                    let data = $('#form_local').serializeArray();
                    let datapost = {};
                    var array_ambientes = [];
                    $.each(data, function (key, val) {
                        datapost[val.name] = val.value;
                        if (val.name == "zona_ubicacion_local") {
                            datapost['zona'] = val.value;
                        }
                    });
                    datapost['ubigeo'] = `${$('#departamentos').val()}${$('#provincias').val()}${$('#distritos').val()}`;
                    session.zona != null ? datapost['zona'] = session.zona : '';

                    $.ajax({
                        method: method,
                        data: datapost,
                        url: url,
                        success: function (data) {
                            object = {
                                'id_local': data.id_local,
                                'cantidad_usar_aulas': data.cantidad_usar_aulas,
                                'cantidad_usar_auditorios': data.cantidad_usar_auditorios,
                                'cantidad_usar_sala': data.cantidad_usar_sala,
                                'cantidad_usar_oficina': data.cantidad_usar_oficina,
                                'cantidad_usar_computo': data.cantidad_usar_computo,
                                'cantidad_usar_otros': data.cantidad_usar_otros,
                                'directorio': 1
                            }
                            is_directorio ? object.directorio = 1 : object.directorio = 0;
                            console.log(object);
                            $.ajax({
                                url: `${BASEURL}/generar_ambientes/`,
                                type: 'POST',
                                data: object,
                                success: response => {
                                    "use strict";
                                    resetForm('form_local');
                                    $('#tabla_aulas').dataTable().fnDestroy();
                                    $('#tabla_aulas').find('tbody').empty();
                                    $('#capacidad_total').text(0);
                                    $('#etapa').val(1);
                                    getLocal(data.id_local, is_directorio);
                                }
                            });
                        }
                    });
                }
            });
    }
});

function getLocalAmbientes() {
    let id_local = $('#id_local').val();

    let url = ``;
    if (is_directorio) {
        url = `${BASE_URL}directorio_localambiente/${id_local}`;
    } else {
        url = `${BASE_URL}localambiente/${id_local}/`;
    }

    let html = '';
    $('#tabla_aulas').dataTable().fnDestroy();
    $.getJSON(url, function (data) {
        let capacidad_total = 0;
        $('#tabla_aulas').find('tbody').empty();
        let otros_label = `Otros(${local_selected.especifique_otros})`;
        if (data.ambientes.length > 0) {
            $.each(data.ambientes, function (key, val) {
                capacidad_total = capacidad_total + parseInt(val.capacidad == null ? 0 : val.capacidad);
                html += `<tr><td>${parseInt(key) + 1}</td><td>${val.nombre_ambiente == 'Otros' ? otros_label : val.nombre_ambiente}</td><td>${val.numero}</td>
                <td><input type="text" name="capacidad_ambiente" class="form-control" value="${val.capacidad == null ? '' : val.capacidad}"></td>
                <td><input type="text" name="piso_ambiente" class="form-control" value="${val.n_piso == null ? '' : val.n_piso}"></td>
                <td>
                    <ul class="icons-list">
                        <li class="text-primary-600"><a onclick="saveLocalambiente(this,${val.id_localambiente})"><i class="icon-pencil7"></i></a></li>
                    </ul>
		        </td></tr>`;
            });
            $('#capacidad_total').text(capacidad_total);
            $('#tabla_aulas').find('tbody').html(html);
            $('#tabla_aulas').DataTable({
                "pageLength": 10,
                "lengthMenu": [[5, 10, 30, -1], [5, 10, 30, "All"]]
            });
            validarMetaPea();
        }
    });
}

function AddEditAula() {
    "use strict";
    let ambientescheck = $('#ambientesdata :input[name*="usar"]');
    $('#id_ambiente').find('option').remove();
    let data = [{id: '', text: 'Seleccione'}];
    let html = '';
    $.each(ambientescheck, function (key, val) {
        let texto = $(val).parent().parent().find('td').eq(0).text();
        let id = parseInt(key) + 1;
        $(val).val() != 0 ? html += `<option value="${id}">${texto}</option>` : '';
    });
    $('#id_ambiente').append(html);
    getLocalAmbientes();
    resetForm('form_aula');
    validator_aula.resetForm()
    $('#msg_error').hide();
}

function getMetaPea() {
    "use strict";
    let ubigeo = `${session.ccdd}${session.ccpp}${session.ccdi}`;
    let id_curso = session.curso;
    $.ajax({
        url: `${BASEURL}/getMeta/`,
        type: 'POST',
        data: {ubigeo: ubigeo, zona: session.zona, id_curso: id_curso},
        success: response => {
            console.log(response);
            $('#cant_meta').val(response.cant);
            $('#cant_reclutada').val(1500);
            if (session.curso == '1') {
                $('#capacidad_ambiente').val(response.total_ambientes_distrito)
                $('#cant_meta').val(3);
                $('#cant_reclutada').val(10);
                $('#aulas_meta_cantidad').val(1);
            } else {
                $('#capacidad_ambiente').val(response.total_ambientes_zona)
            }
            validarMetaPea();
        },
        error: error => {
            console.log('ERROR!!', error)
        }
    })
}

function validarMetaPea() {
    "use strict";
    let cant_meta = parseInt($('#cant_meta').text());
    let capacidad_local = parseInt($('#capacidad_total').text());

    $('#capacidad_meta_local').text(capacidad_local);
}

function eliminarAmbiente(id_localambiente) {
    "use strict";
    let url = `${BASE_URL}rest/localambiente/${id_localambiente}/`;
    swal({
            title: '',
            text: "Está seguro de eliminar el Ambiente?",
            type: "success",
            showCancelButton: true,
            confirmButtonColor: "#EF5350",
            confirmButtonText: "Si!",
            cancelButtonText: "No, Cancelar!",
            closeOnConfirm: true,
            closeOnCancel: true,
        }, (isConfirm) => {
            window.onkeydown = null;
            window.onfocus = null;
            if (isConfirm) {
                $.ajax({
                    url: url,
                    type: 'DELETE',
                    success: response => {
                        getLocalAmbientes();
                    }
                })
            }
        }
    );

}


function saveLocalambiente(element, id_localambiente) {
    "use strict";
    let id_local = $('#id_local').val();
    let url = `${BASE_URL}localambiente/${id_local}/`;

    let url_set_capacidad = is_directorio ? `${BASE_URL}rest/directorio_localambiente/${id_localambiente}/` : `${BASE_URL}rest/localambiente/${id_localambiente}/`;
    let tr = $(element).parent().parent().parent().parent();
    let capacidad = $(tr).find('input[name="capacidad_ambiente"]').val();
    let piso = $(tr).find('input[name="piso_ambiente"]').val();
    $.ajax({
        url: url_set_capacidad,
        type: 'PATCH',
        data: {capacidad: capacidad, n_piso: piso},
        success: response => {
            new PNotify({
                title: 'Correcto!',
                text: 'Datos del Ambiente guardados con éxito!',
                addclass: 'bg-success'
            });

            $.getJSON(url, function (data) {
                let capacidad_total = 0;
                if (data.ambientes.length > 0) {
                    $.each(data.ambientes, function (key, val) {
                        capacidad_total = capacidad_total + parseInt(val.capacidad == null ? 0 : val.capacidad);
                    });
                    $('#capacidad_total').text(capacidad_total);
                    validarMetaPea();
                    getMetaPea();
                }
            });
        }
    })
}


function eliminarLocal(id_local, curso_local) {
    alert_confirm(function () {
        var ubigeo = `${$('#departamentos').val()}${$('#provincias').val()}${$('#distritos').val()}`;
        $.ajax({
            url: `${BASEURL}/rest/local/${id_local}`,
            type: 'DELETE',
            success: response => {
                validarMetaPea();
                getLocalesbyUbigeo();
                $.ajax({
                    url: `${BASEURL}/rest/curso_local/${curso_local}/`,
                    type: 'DELETE',
                    success: response => {

                    }

                })
            },
            error: error => {
                console.log('ERROR!!', error)
            }
        })
    }, 'Esta seguro de eliminar el Local?');
}


// $('input[name="fecha_fin"]').on('change', function (e) {
//     $('input[name="fecha_fin"]').valid();
// });