from django.urls import path
from . import views
urlpatterns = [
    path('profiles/', views.GetUserProfilesView.as_view(),
         name="profiles-list-view"),
    path('user/', views.GetUserProfileSingleView.as_view(),
         name="profile-view"),
    path('update/', views.UpdateUserProfileView.as_view(),
         name="profile-update-view"),
]
