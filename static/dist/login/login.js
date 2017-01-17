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
            if (response.length > 0) {
                session_response = response[0];
                session_response[0]['descripcion_curso'] = response[1];
                localStorage.setItem('usuario', JSON.stringify(session_response[0]));
                window.location.replace(`${BASEURL}/modulo_registro`);
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
