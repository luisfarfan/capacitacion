from django.http import HttpResponse
from django.template import loader
from .models import *
from django.http import JsonResponse
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
        user = User.objects.filter(usuario=usuario, clave=clave).values()
        if user is not None:
            return JsonResponse(list(user), safe=False)

    return JsonResponse({'msg': True}, safe=False)
