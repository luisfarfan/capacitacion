$('#registrar_aulas_modal').on('click', function () {
    AddEditAula();
});

function setLocalAmbienteForm(id_localambiente) {
    $('#id_localambiente').val(id_localambiente);
    let url = `${BASE_URL}rest/localambiente/${id_localambiente}/`;
    resetForm('form_aula');
    $.getJSON(url, data=> {
        "use strict";
        console.log(data);
        AddEditAula();
        $.each(data, (key, val)=> {
            $(`input[name=${key}]`).val(val);
        });
        $('#modal_registroaula').modal('show');
        $('#id_ambiente').val(data.id_ambiente).trigger('change');

    });
}

var validator_aula = $(".form-validate-aula").validate({
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
        mesas_cant: {
            range: [0, 50]
        },
        sillas_cant: {
            range: [0, 50]
        },
        carpindividuales_cant: {
            range: [0, 50]
        },
        carpbipersonales_cant: {
            range: [0, 50]
        },
        numero: {
            range: [0, 99]
        },
        n_piso: {
            range: [0, 10]
        },
        capacidad: {
            range: [0, 500]
        },
    },
    messages: {
        custom: {
            required: "El campo es requerido",
        },
    }
});

$('#registrar_aula_submit').on('click', ()=> {
    let ambienteusar = ''
    switch ($('#id_ambiente').val()) {
        case "1":
            ambienteusar = 'cantidad_usar_aulas';
            break;
        case "2":
            ambienteusar = 'cantidad_usar_auditorios';
            break;
        case "3":
            ambienteusar = 'cantidad_usar_oficina';
            break;
        case "4":
            ambienteusar = 'cantidad_usar_sala';
            break;
        case "5":
            ambienteusar = 'cantidad_usar_otros';
            break;
    }
    validarCantidadAmbientes($('#id_ambiente').val(), ambienteusar)
});


function validarCantidadAmbientes(ambientenum, ambiente_usar) {
    let id_local = $('#id_local').val();
    let url = `${BASE_URL}localambiente/${id_local}/`;
    $.getJSON(url, function (data) {
        let count = 1;
        $.each(data, function (key, val) {
            let ambiente = '';
            if (val.id_ambiente == ambientenum) {
                count++;
            }
        });
        if ($('#id_localambiente').val() == '' && count > $('#' + ambiente_usar).val()) {
            $('#msg_error').show();
        } else {
            if (validator_aula.numberOfInvalids() == 0) {
                swal({
                        title: '',
                        text: "Está seguro de guardar?",
                        type: "success",
                        showCancelButton: true,
                        confirmButtonColor: "#EF5350",
                        confirmButtonText: "Si!",
                        cancelButtonText: "No, Cancelar!",
                        closeOnConfirm: true,
                        closeOnCancel: true
                    }, function (isConfirm) {
                        window.onkeydown = null;
                        window.onfocus = null;
                        if (isConfirm) {
                            dataSave();
                        }
                        else {
                            swal({
                                title: "Cancelado",
                                text: "La acción fue cancelada",
                                confirmButtonColor: "#2196F3",
                                type: "error"
                            });
                        }
                    }
                );
            }
        }
    });
}

function dataSave() {
    "use strict";
    let url = '';
    let method = '';
    let title = '';
    let text = '';
    let title_entry = '';
    if ($('#id_localambiente').val() != '') {
        url = `${BASE_URL}rest/localambiente/${$('#id_localambiente').val()}/`;
        method = 'PUT';
        title = 'Edición!';
        text = 'El Aula se ha editado con exito!';
        title_entry = 'Esta usted seguro de Editar el Aula?';
        // swal({
        //     title: title,
        //     text: text,
        //     confirmButtonColor: "#66BB6A",
        //     type: "success"
        // });
    } else {
        url = `${BASE_URL}rest/localambiente/`;
        method = 'POST';
        title = 'Agregado!';
        text = 'El Aula se ha Agregado con exito!';
        title_entry = 'Esta usted seguro de Agregar el Aula?'
        // swal({
        //     title: title,
        //     text: text,
        //     confirmButtonColor: "#66BB6A",
        //     type: "success"
        // });
    }
    let id_localambiente = $('#id_localambiente').val();
    let form_data = $('#form_aula :not(:checkbox)').serializeArray();

    $('#form_aula :checkbox').map((key, val)=> {
        if ($(val).is(':checked')) {
            form_data.push({name: val.name, value: '1'});
        } else {
            form_data.push({name: val.name, value: '0'});
        }
    });
    let dataupdate = {};
    dataupdate['id_local'] = $('#id_local').val();
    $.each(form_data, function (key, val) {
        val.value == "on" ? dataupdate[val.name] = 1 : dataupdate[val.name] = val.value;
    });
    dataupdate['id_ambiente'] = $('#id_ambiente').val();
    $.ajax({
        url: url,
        type: method,
        data: dataupdate,
        success: function (data) {
            console.log(data);
            $('#id_localambiente').val('');
            validator_aula.resetForm();
            resetForm('form_aula');
            getLocalAmbientes();
            $('#id_localambiente').val('');
            $('#msg_error').hide();
        }
    });
}

$('#limpiar_form_aula').on('click', function () {
    "use strict";
    resetForm('form_aula');
    $('#id_localambiente').val('');
    $('#msg_error').hide();
});
