from capacitacion.models import *


def asignar(ubigeo='020601', zona='00200'):
    # ubigeo = 020601
    # zona = 00100
    locales_zona = Local.objects.filter(ubigeo=ubigeo, zona=zona)
    for e in locales_zona:
        aulas_by_local = LocalAmbiente.objects.filter(id_local=e.id_local)
        print aulas_by_local
        for a in aulas_by_local:
            if disponibilidad_aula(a.id_localambiente):
                pea_ubicar = PEA.objects.exclude(id_pea__in=PEA_AULA.objects.values('id_pea')).filter(ubigeo=ubigeo,
                                                                                                      zona=zona).order_by(
                    'ape_paterno')[:a.capacidad]

                for p in pea_ubicar:
                    pea = PEA.objects.get(pk=p.id_pea)
                    aula = LocalAmbiente.objects.get(pk=a.id_localambiente)
                    pea_aula = PEA_AULA(id_pea=pea, id_localambiente=aula)
                    pea_aula.save()



def disponibilidad_aula(aula):
    aula = LocalAmbiente.objects.get(pk=aula)
    cantidad_asignada = PEA_AULA.objects.filter(id_localambiente=aula).count()
    is_disponible = True

    if cantidad_asignada >= aula.capacidad:
        is_disponible = False

    return is_disponible





