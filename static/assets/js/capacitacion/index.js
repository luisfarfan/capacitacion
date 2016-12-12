/**
 * Created by LFarfan on 21/11/2016.
 */
//BASE_URL = `http://localhost:8000/`;

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

    $('.daterange-single').daterangepicker({
        singleDatePicker: true,
        locale: {
            format: 'DD/MM/YYYY'
        }
    });
    getDepartamentos();
    getCursos(1);
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

function getDepartamentos() {
    let array_departamentos = [{id: '', text: 'Seleccione'}];
    $.getJSON(`${BASE_URL}departamentos`, function (data) {
        $.each(data, function (key, val) {
            array_departamentos.push({id: val.ccdd, text: val.departamento})
        });
        console.log(array_departamentos);
        $('#departamentos').select2({data: array_departamentos});
    });
}
function getProvincias() {
    let array_provincias = [{id: '', text: 'Seleccione'}];
    var ccdd = $('#departamentos').val();
    $.getJSON(`${BASE_URL}provincias/${ccdd}`, function (data) {
        $.each(data, function (key, val) {
            array_provincias.push({id: val.ccpp, text: val.provincia})
        });
        console.log(array_provincias);
        $('#provincias').select2({data: array_provincias});
    });
}

function getDistritos() {
    let array_distritos = [{id: '', text: 'Seleccione'}];
    var ccdd = $('#departamentos').val();
    var ccpp = $('#provincias').val();
    $.getJSON(`${BASE_URL}distritos/${ccdd}/${ccpp}`, function (data) {
        $.each(data, function (key, val) {
            array_distritos.push({id: val.ccdi, text: val.distrito})
        });
        $('#distritos').select2({data: array_distritos});
    });
}

function getZonas() {
    "use strict";
    let array_zonas = [{id: '', text: 'Seleccione'}];
    var ccdd = $('#departamentos').val();
    var ccpp = $('#provincias').val();
    var ccdi = $('#distritos').val();
    $.getJSON(`${BASE_URL}zonas/${ccdd}${ccpp}${ccdi}/`, function (data) {
        $.each(data, function (key, val) {
            array_zonas.push({id: val.ZONA, text: val.ZONA})
        });
        $('#zona').select2({data: array_zonas});
        $('#zona_ubicacion_local').select2({data: array_zonas});
    });
}


function getLocalesbyUbigeo() {
    var ubigeo = `${$('#departamentos').val()}${$('#provincias').val()}${$('#distritos').val()}`;
    $.ajax({
        async: false,
        url: `${BASE_URL}localubigeo/${ubigeo}`,
        success: function (data) {
            console.log(data);
            var html = '';
            $.each(data, function (key, val) {
                html += `<tr><td>${val.nombre_local}</td><td>${val.nombre_via}</td><td>${val.referencia}</td><td>
                    <button onclick="getLocal(${val.id_local})" type="button"class="btn btn-info btn-float btn-rounded btn-loading" data-loading-text="<i class='icon-spinner4 spinner'></i>">
                    <i class="icon-spinner4"></i></button></button></td></tr>`;
            });
            console.log(html);
            $('#table_localesubigeo').find('tbody').html(html);
            $('#table_localesubigeo').DataTable();
        }
    });
}

function getLocal(id_local) {
    $('#id_local').val(id_local);
    $.ajax({
        url: `${BASE_URL}rest/local/${id_local}`,
        success: function (data) {
            console.log(data);
            $.each(data, function (key, val) {
                if (key == 'tipo_via' || key == 'turno_uso_local' || key == 'id_curso' || key == 'zona_ubicacion_local') {
                    $(`select[name=${key}]`).val(val).trigger('change')
                } else {
                    $(`input[name=${key}]`).val(val)
                }
            });
            center = {
                lat: $('#x').val() != '' ? parseFloat($('#x').val()) : -12.034467,
                lng: $('#y').val() != '' ? parseFloat($('#y').val()) : -77.095752
            };

            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(center.lat, center.lng),
                title: "Aqui!"
            });
            $('#capacidad_total').text(0);
            marker.setMap(map);

// To add the marker to the map, call setMap();
            marker.setMap(map);
            $('#pac-input').val($('input[name="nombre_via"]').val());

            $('#registrar_aulas_modal').prop('disabled', false);
            $('#modal_localesbyubigeo').modal('hide');

            getLocalAmbientes();
        }
    });
}
function getCursos(id_etapa) {
    $('#cursos').find('option').remove();
    let array_cursos = [{id: '', text: 'Seleccione'}];
    $.getJSON(`${BASE_URL}cursobyetapa/${id_etapa}`, function (data) {
        $.each(data, function (key, val) {
            array_cursos.push({id: val.id_curso, text: val.nombre_curso})
        });
        setSelect('cursos', array_cursos);
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
    return f > i
}, jQuery.validator.format("Fecha de Inicio tiene que ser menor que la Fecha Fin"));

jQuery.validator.addMethod("esMenor", function (value, element) {
    var nameelement = $(element).attr('name');
    nameelement = nameelement.replace('usar', 'disponible');
    var val_ne = $('#' + nameelement).val();
    return parseInt(value) <= parseInt(val_ne)
}, jQuery.validator.format("Debe ser menor a Disponible"));

jQuery.validator.addMethod("esMenor2", function (value, element) {
    var nameelement = $(element).attr('name');
    nameelement = nameelement.replace('disponible', 'total');
    var val_ne = $('#' + nameelement).val();
    return parseInt(value) <= parseInt(val_ne)
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
    return f < i
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
    success: function (label) {
        label.addClass("validation-valid-label").text("Correcto.")
    },
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
            range: [1, 100]
        },
        mz_direccion: {
            maxlength: 4
        },
        lote_direccion: {
            maxlength: 4
        },
        piso_direccion: {
            range: [1, 5]
        },
        telefono_local_fijo: {
            minlength: 9,
            maxlength: 9
        },
        telefono_local_celular: {
            minlength: 9,
            maxlength: 10,
            validar9: true
        },
        capacidad_local: {
            range: [1, 9999]
        },
        fecha_fin: {
            validateFechaFin: true,
        },
        funcionario_nombre: {
            minlength: 9,
        },
        funcionario_email: {
            email: true
        },
        funcionario_telefono: {
            minlength: 9,
            maxlength: 9
        },
        funcionario_celular: {
            minlength: 9,
            maxlength: 10,
            validar9: true
        },
        responsable_nombre: {
            minlength: 9,
        },
        responsable_email: {
            email: true
        },
        responsable_telefono: {
            minlength: 9,
            maxlength: 9
        },
        responsable_celular: {
            minlength: 9,
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
    resetForm('form_local');
    $('#id_local').val('');
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
        title = 'Edición!';
        text = 'El Local se ha editado con exito!';
        title_entry = 'Esta usted seguro de Editar el Local?'
    } else {
        url = `${BASE_URL}rest/local/`;
        method = 'POST';
        title = 'Agregado!';
        text = 'El Local se ha Agregado con exito!';
        title_entry = 'Esta usted seguro de Agregar el Local?'
    }
    if (validator.numberOfInvalids() == 0) {
        swal({
                title: title_entry,
                text: "",
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
                    datapost['zona'] = `${$('#zona').val()}`;

                    $.ajax({
                        method: method,
                        data: datapost,
                        url: url,
                        success: function (data) {
                            resetForm('form_local');
                            validator.resetForm();
                            $('#tabla_aulas').dataTable().fnDestroy();
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
        let capacidad_total = 0;
        $('#tabla_aulas').find('tbody').empty();
        if (data.length > 0) {
            $.each(data, function (key, val) {
                capacidad_total = capacidad_total + parseInt(val.capacidad);
                let ambiente = '';
                console.log(val);
                switch (val.id_ambiente) {
                    case 1:
                        ambiente = 'Aula';
                        break;
                    case 2:
                        ambiente = 'Auditorios';
                        break;
                    case 3:
                        ambiente = 'Sala Reunion';
                        break;
                    case 4:
                        ambiente = 'Oficina Administrativa';
                        break;
                    case 5:
                        ambiente = 'Laboratorio de Computo';
                        break;
                    case 6:
                        ambiente = 'Otros';
                        break;
                }
                html += `<tr><td>${val.numero}</td><td>${ambiente}</td><td>${val.capacidad}</td><td><button type="button" onclick="setLocalAmbienteForm(${val.id_localambiente})">Editar</button></td></tr>`;
            });
            console.log(capacidad_total);
            $('#capacidad_total').text(capacidad_total);
            $('#tabla_aulas').find('tbody').html(html);
            $('#tabla_aulas').DataTable({
                "pageLength": 5,
                "lengthMenu": [[5, 10, 30, -1], [5, 10, 30, "All"]]
            });
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


$('#cantidad_usar_otros').keyup(e => {
    "use strict";
    ($('#cantidad_usar_otros').val() == '' || $('#cantidad_usar_otros').val() == 0) ? $('#especifique_otros').prop('readonly', true) : $('#especifique_otros').prop('readonly', false)
});