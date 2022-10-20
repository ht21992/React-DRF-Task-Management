
from django.urls import path
from .views import index


urlpatterns = [

    path('', index),
    path('login/', index),
    path('register/', index),
    path('task/<str:taskId>', index),
    path('dashboard/', index),
]
