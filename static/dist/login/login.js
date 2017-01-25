/**
 * Created by LFarfan on 01/12/2016.
 */
var pathArray = location.href.split('/');
var protocol = pathArray[0];
var host = pathArray[2];
BASEURL = protocol + '//' + host;
$('#iniciar_sesion').click(event => {
    "use strict";
    do_login();
});

function do_login() {
    "use strict";
    let session_response;
    $.ajax({
        url: '/do_login/',
        type: 'POST',
        data: {usuario: $('#usuario').val(), clave: $('#clave').val()},
        success: function (response) {
            let modulo = 'modulo_registro';
            if (response.length > 0) {
                localStorage.setItem('usuario', JSON.stringify(response[0]));
                if (response[0].rol__id == 2 || response[0].rol__id == 4) {
                    modulo = 'asistencia';
                }
                window.location.replace(`${BASEURL}/${modulo}`);
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
