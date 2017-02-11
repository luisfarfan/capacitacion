from django.http import HttpResponse
from django.template import loader
from .models import *
from django.http import JsonResponse
from capacitacion.models import Curso
from django.views.decorators.csrf import csrf_exempt
import json


def login(request):
    template = loader.get_template('login.html')
    context = {
        'titulo_padre': 'Login',
        'titulo_hijo': 'REGISTRO DE LOCAL'
    }
    return HttpResponse(template.render(context, request))


@csrf_exempt
def do_login(request):
    if request.method == "POST" and request.is_ajax():
        usuario = request.POST['usuario']
        clave = request.POST['clave']
        user = User.objects.filter(usuario=usuario, clave=clave).values('id', 'usuario', 'ccdd', 'ccpp', 'ccdi', 'zona',
                                                                        'curso', 'rol__rol', 'curso__nombre_curso',
                                                                        'rol__id', 'cierre_dia1', 'cierre_dia2',
                                                                        'cierre_dia3')

        if user is not None:
            return JsonResponse(list(user), safe=False)

        return JsonResponse({'msg': True}, safe=False)


def updateUserSession(request, id):
    user = User.objects.filter(pk=id).values('id', 'usuario', 'ccdd', 'ccpp', 'ccdi', 'zona',
                                             'curso', 'rol__rol', 'curso__nombre_curso',
                                             'rol__id', 'cierre', 'cierre_dia1', 'cierre_dia2',
                                             'cierre_dia3')
    return JsonResponse(list(user), safe=False)


def updateLogin(request, id, curso):
    User.objects.filter(pk=id).update(curso_id=curso)
    user = User.objects.filter(pk=id).values('id', 'usuario', 'ccdd', 'ccpp', 'ccdi', 'zona',
                                             'curso', 'rol__rol', 'curso__nombre_curso',
                                             'rol__id', 'cierre', 'cierre_dia1', 'cierre_dia2',
                                             'cierre_dia3')
    return JsonResponse(list(user), safe=False)
