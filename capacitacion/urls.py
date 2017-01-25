from rest_framework import routers
from views import *

router = routers.DefaultRouter()
router.register(r'local', LocalViewSet)
router.register(r'directorio_local', DirectorioLocalViewSet)
router.register(r'ambiente', AmbienteViewSet)
router.register(r'criterio', CriteriosViewSet)
router.register(r'localambiente', LocalAmbienteViewSet)
router.register(r'directorio_localambiente', DirectorioLocalAmbienteViewSet)
router.register(r'criterio', CriteriosViewSet)
router.register(r'cursocriterios', CursoCriteriosViewSet)
router.register(r'cursos', CursoViewSet)
router.register(r'pea_aula', PEA_BY_AULAViewSet)
router.register(r'pea_asistencia', PEA_ASISTENCIAViewSet)
router.register(r'pea', PEAViewSet)
router.register(r'pea_nota_final', PeaNotaFinalViewSet)
router.register(r'curso_local', CursoLocalViewSet)


# router.register(r'pea_cursocriterio', PEA_CURSOCRITERIOViewSet)
