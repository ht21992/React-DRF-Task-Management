from django.urls import path
from . import views
urlpatterns = [
    path('signup/', views.SignUpView.as_view(), name="signup-view"),
    path('login/', views.LoginView.as_view(), name="login-view"),
    path('logout/', views.LogoutView.as_view(), name="logout-view"),
    path('delete/', views.DeleteAccountView.as_view(), name="delete-view"),
    path('users/', views.GetUsersView.as_view(), name="user-list-view"),
    path('is_authenticated/', views.CheckAuthenticatedView.as_view(),
         name="check-authentication-view"),
    path('csrf_cookie/', views.GetCSRFToken.as_view(), name="csrf-view"),
]
