/**
 * Created by LFarfan on 21/11/2016.
 */
//BASE_URL = `http://localhost:8000/`;
if (session.rol == '3') {
    $('#zona').parent().remove();
    $('#zona_ubicacion_local').parent().remove()
} else {
    $('#zona').parent().show();
}

var local_selected = [];
var fecha_hoy = moment().format('DD/MM/YYYY');
var local_marco = [];
var local_marco_selected = {};

$('#etapa').val(1);
function resetForm(idform) {
    "use strict";
    $('#' + idform + ' :input').map(function () {
        $(this).val('')
    });
    $('#' + idform + ' :input[type="checkbox"]').map(function () {
        $(this).prop('checked', false);
        $.uniform.update();
    });
}
$(function () {
    jQuery.extend(jQuery.validator.messages, {
        required: "Este campo es obligatorio.",
        remote: "Por favor, rellena este campo.",
        email: "Por favor, escribe una dirección de correo válida",
        url: "Por favor, escribe una URL válida.",
        date: "Por favor, escribe una fecha válida.",
        dateISO: "Por favor, escribe una fecha (ISO) válida.",
        number: "Por favor, escribe un número entero válido.",
        digits: "Por favor, escribe sólo dígitos.",
        creditcard: "Por favor, escribe un número de tarjeta válido.",
        equalTo: "Por favor, escribe el mismo valor de nuevo.",
        accept: "Por favor, escribe un valor con una extensión aceptada.",
        maxlength: jQuery.validator.format("Por favor, no escribas más de {0} caracteres."),
        minlength: jQuery.validator.format("Por favor, no escribas menos de {0} caracteres."),
        rangelength: jQuery.validator.format("Por favor, escribe un valor entre {0} y {1} caracteres."),
        range: jQuery.validator.format("Por favor, escribe un valor entre {0} y {1}."),
        max: jQuery.validator.format("Por favor, escribe un valor menor o igual a {0}."),
        min: jQuery.validator.format("Por favor, escribe un valor mayor o igual a {0}.")
    });
    $('.select').select2();
    $(".styled, .multiselect-container input").uniform({
        radioClass: 'choice'
    });

    $('input[name="fecha_inicio"]').daterangepicker({
        "minDate": fecha_hoy,
        "maxDate": "31/10/2017",
        singleDatePicker: true,
        locale: {
            format: 'DD/MM/YYYY'
        }
    }, function (chosen_date) {
        $('input[name="fecha_inicio"]').val(chosen_date.format('DD/MM/YYYY'));
    });

    $('input[name="fecha_fin"]').daterangepicker({
        "minDate": fecha_hoy,
        "maxDate": "31/10/2017",
        singleDatePicker: true,
        locale: {
            format: 'DD/MM/YYYY'
        }
    }, function (chosen_date) {
        $('input[name="fecha_fin"]').val(chosen_date.format('DD/MM/YYYY'));
    });
    getDepartamentos();
    getCursos(1);
    getMetaPea()
});
$('#departamentos').change(function () {
    $('#provincias').find('option').remove();
    getProvincias();
});

$('#provincias').change(function () {
    $("#distritos").find('option').remove();
    getDistritos();
});

$('#distritos').change(function () {
    $("#zona").find('option').remove();
    $('#zona_ubicacion_local').find('option').remove();
    getZonas();
});

$('#buscarlocal').click(function () {
    getLocalesbyUbigeo();
});

$('#buscarlocalmarco').click(function () {
    getLocalesbyMarco();
});


$('#cursos').change(() => {
    "use strict";
    getMetaPea();
});

function getLocalesbyUbigeo() {
    var ubigeo = `${$('#departamentos').val()}${$('#provincias').val()}${$('#distritos').val()}`;
    let url = session.rol == '3' ? `${BASE_URL}localubigeo/${ubigeo}/${session.curso}/` : `${BASE_URL}localzona/${ubigeo}/${session.zona}/${session.curso}/`;
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
                                    <li class="text-primary-600"><a data-popup="tooltip" title="Mostrar" onclick="getLocal(${val.id_local})" href="#"><i class="icon-pencil7"></i></a></li>
                                    <li class="text-danger-600"><a data-popup="tooltip" title="Eliminar" onclick="eliminarLocal(${val.id_local})" href="#"><i class="icon-trash"></i></a></li>
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
    let url = `${BASE_URL}localmarco/${ubigeo}/`;
    $.ajax({
        url: url,
        success: function (data) {
            local_marco = data;
            var html = '';
            $.each(data, function (key, val) {
                html += `<tr>
                            <td>${val.nombre_local}</td><td>${val.zona}</td>
                            <td>
								<ul class="icons-list">
                                    <li class="text-primary-600"><a data-popup="tooltip" title="Mostrar" onclick="setMarco(${val.id})" href="#"><i class="icon-pencil7"></i></a></li>
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

function getLocal(id_local) {
    $('#id_local').val(id_local);
    $.ajax({
        url: `${BASE_URL}rest/local/${id_local}`,
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
            $('#capacidad_total').text(0);
            $('#funcionario_nombre').trigger('change');
            $('#registrar_aulas_modal').prop('disabled', false);
            $('#modal_localesbyubigeo').modal('hide');

            getLocalAmbientes();
        }
    });
}

function setMarco(id_local) {
    local_selected = findInObject2(local_marco, id_local, 'id');
    $(`#etapa`).val(1);
    $.each(local_selected, function (key, val) {
        if (key == 'tipo_via' || key == 'turno_uso_local' || key == 'id_curso' || key == 'zona_ubicacion_local' || key == 'funcionario_nombre') {
            $(`select[name=${key}]`).val(val).trigger('change')
        } else {
            $(`input[name=${key}]`).val(val)
        }
    });
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

jQuery.validator.addMethod("validateFechaInicio", function (value, element) {
    let fechafin = $('input[name="fecha_fin"]').val();
    var part_ff = fechafin.split("/");
    var fin = new Date(`${part_ff[1]}/${part_ff[0]}/${part_ff[2]}`);
    var part_fi = value.split("/");
    var inicio = new Date(`${part_fi[1]}/${part_fi[0]}/${part_fi[2]}`);

    var f = Date.parse(fin);
    var i = Date.parse(inicio);
    return f >= i
}, jQuery.validator.format("Fecha de Inicio tiene que ser menor que la Fecha Fin"));

jQuery.validator.addMethod("esMenor", function (value, element) {
    var nameelement = $(element).attr('name');
    nameelement = nameelement.replace('usar', 'disponible');
    var val_ne = $('#' + nameelement).val();
    if (value == '') {
        return true
    } else {
        return parseInt(value) <= parseInt(val_ne)
    }

}, jQuery.validator.format("Debe ser menor a Disponible"));

jQuery.validator.addMethod("esMenor2", function (value, element) {
    var nameelement = $(element).attr('name');
    nameelement = nameelement.replace('disponible', 'total');
    var val_ne = $('#' + nameelement).val();
    if (value == '') {
        return true
    } else {
        return parseInt(value) <= parseInt(val_ne)
    }

}, jQuery.validator.format("Debe ser menor a Total"));


jQuery.validator.addMethod("validar9", function (value, element) {
    var count = 0;
    if (value.length > 0) {
        for (let k in value) {
            if (value[0] == value[parseInt(k) + 1]) {
                count++;
            }
        }
    }
    console.log(count);
    return (count > 5) ? false : true;
}, jQuery.validator.format("Número no permitido"));

jQuery.validator.addMethod("validateFechaFin", function (value, element) {
    let fechafin = $('input[name="fecha_inicio"]').val();
    var part_ff = fechafin.split("/");
    var fin = new Date(`${part_ff[1]}/${part_ff[0]}/${part_ff[2]}`);
    var part_fi = value.split("/");
    var inicio = new Date(`${part_fi[1]}/${part_fi[0]}/${part_fi[2]}`);

    var f = Date.parse(fin);
    var i = Date.parse(inicio);

    console.log(f, i);
    console.log(f < i);
    return f <= i
}, jQuery.validator.format("Fecha de Fin tiene que ser mayor que la Fecha Inicio"));

var validator = $(".form-validate-jquery").validate({
    ignore: 'input[type=hidden], .select2-search__field', // ignore hidden fields
    errorClass: 'validation-error-label',
    successClass: 'validation-valid-label',
    highlight: function (element, errorClass) {
        $(element).removeClass(errorClass);
    },
    unhighlight: function (element, errorClass) {
        $(element).removeClass(errorClass);
    },

    // Different components require proper error label placement
    errorPlacement: function (error, element) {

        // Styled checkboxes, radios, bootstrap switch
        if (element.parents('div').hasClass("checker") || element.parents('div').hasClass("choice") || element.parent().hasClass('bootstrap-switch-container')) {
            if (element.parents('label').hasClass('checkbox-inline') || element.parents('label').hasClass('radio-inline')) {
                error.appendTo(element.parent().parent().parent().parent());
            } else {
                error.appendTo(element.parent().parent().parent().parent().parent());
            }
        }

        // Unstyled checkboxes, radios
        else if (element.parents('div').hasClass('checkbox') || element.parents('div').hasClass('radio')) {
            error.appendTo(element.parent().parent().parent());
        }

        // Input with icons and Select2
        else if (element.parents('div').hasClass('has-feedback') || element.hasClass('select2-hidden-accessible')) {
            error.appendTo(element.parent());
        }

        // Inline checkboxes, radios
        else if (element.parents('label').hasClass('checkbox-inline') || element.parents('label').hasClass('radio-inline')) {
            error.appendTo(element.parent().parent());
        }

        // Input group, styled file input
        else if (element.parent().hasClass('uploader') || element.parents().hasClass('input-group')) {
            error.appendTo(element.parent().parent());
        } else {
            error.insertAfter(element);
        }
    },
    validClass: "validation-valid-label",
    rules: {
        nombre_local: {
            maxlength: 100
        },
        nombre_via: {
            maxlength: 200
        },
        referencia: {
            maxlength: 100
        },
        n_direccion: {
            maxlength: 4
        },
        km_direccion: {
            maxlength: 3
        },
        mz_direccion: {
            maxlength: 4
        },
        lote_direccion: {
            maxlength: 4
        },
        piso_direccion: {
            maxlength: 1
        },
        telefono_local_fijo: {
            maxlength: 9
        },
        telefono_local_celular: {
            maxlength: 10,
            validar9: true
        },
        fecha_fin: {
            validateFechaFin: true,
        },
        responsable_nombre: {
            minlength: 9,
        },
        responsable_email: {
            minlength: 1,
        },
        responsable_telefono: {
            maxlength: 9
        },
        responsable_celular: {
            maxlength: 10,
            validar9: true
        },
        cantidad_disponible_aulas: {
            esMenor2: true
        },
        cantidad_disponible_auditorios: {
            esMenor2: true
        },
        cantidad_disponible_sala: {
            esMenor2: true
        },
        cantidad_disponible_oficina: {
            esMenor2: true
        },
        cantidad_disponible_otros: {
            esMenor2: true
        },
        cantidad_usar_aulas: {
            esMenor: true
        },
        cantidad_usar_auditorios: {
            esMenor: true
        },
        cantidad_usar_sala: {
            esMenor: true
        },
        cantidad_usar_oficina: {
            esMenor: true
        },
        cantidad_usar_otros: {
            esMenor: true
        },
    },
    messages: {
        custom: {
            required: "El campo es requerido",
        },
        agree: "Please accept our policy"
    }
});

$('#reset').on('click', function () {
    location.reload();
});

$('#registrar').on('click', function () {
    validator.form();
    let url = '';
    let method = '';
    let title = '';
    let text = '';
    if ($('#id_local').val() != '') {
        url = `${BASE_URL}rest/local/${$('#id_local').val()}/`;
        method = 'PUT';
    } else {
        url = `${BASE_URL}rest/local/`;
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
                    });
                    datapost['ubigeo'] = `${$('#departamentos').val()}${$('#provincias').val()}${$('#distritos').val()}`;
                    datapost['zona'] = `${session.zona}`;

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
                            }
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
                                    getLocal(data.id_local);
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
    let url = `${BASE_URL}localambiente/${id_local}/`;

    let html = '';
    $('#tabla_aulas').dataTable().fnDestroy();

    $.getJSON(url, function (data) {
        console.log(data);
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


$('#funcionario_nombre').change(e => {
    "use strict";
    let id_per = $('#funcionario_nombre').val();
    id_per = id_per.trim();
    $.getJSON(`${BASEURL}/get_funcionarioinei/${id_per}/`, response => {
        $('input[name="funcionario_email"]').val(response[0].correo);
        $('input[name="funcionario_cargo"]').val(response[0].cargo);
        $('input[name="funcionario_celular"]').val(response[0].celular);
    });
});

function saveLocalambiente(element, id_localambiente) {
    "use strict";
    let id_local = $('#id_local').val();
    let url = `${BASE_URL}localambiente/${id_local}/`;

    let tr = $(element).parent().parent().parent().parent();
    let capacidad = $(tr).find('input[name="capacidad_ambiente"]').val();
    let piso = $(tr).find('input[name="piso_ambiente"]').val();
    $.ajax({
        url: `${BASE_URL}rest/localambiente/${id_localambiente}/`,
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


function eliminarLocal(id_local) {
    alert_confirm(function () {
        var ubigeo = `${$('#departamentos').val()}${$('#provincias').val()}${$('#distritos').val()}`;
        $.ajax({
            url: `${BASEURL}/rest/local/${id_local}`,
            type: 'DELETE',
            success: response => {
                validarMetaPea();
                getLocalesbyUbigeo();
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