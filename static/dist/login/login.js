/**
 * Created by LFarfan on 01/12/2016.
 */
$('#iniciar_sesion').click(event => {
    "use strict";
    do_login();
});

function do_login() {
    "use strict";
    $.ajax({
        url: '/do_login/',
        type: 'POST',
        data: {usuario: $('#usuario').val(), clave: $('#clave').val()},
        success: function (response) {
            if (response.length > 0) {
                localStorage.setItem('usuario', JSON.stringify(response[0]));
                window.location.replace('http://192.168.200.123:3000/modulo_registro');
            } else {
                alert('ERROR!')
            }
        },
        error: function (response) {
            console.log(response);
            $('#error').show();
        }
    })
}
