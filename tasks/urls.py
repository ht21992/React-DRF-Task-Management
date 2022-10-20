
from django.urls import path, include

from . import views

from rest_framework import routers

router = routers.SimpleRouter()
router.register(r'tasks', views.TaskViewSet)
router.register(r'logs', views.LogViewSet)
router.register(r'comments', views.CommentViewSet)

urlpatterns = [
    path('', include((router.urls, 'tasks'))),
    path('', include((router.urls, 'logs'))),
    path('', include((router.urls, 'comments'))),
]
