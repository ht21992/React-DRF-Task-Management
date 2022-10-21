from .serializers import UserProfileSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .models import UserProfile


class GetUserProfilesView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, requset, format=None):
        try:
            profiles = UserProfile.objects.all()
            profiles = UserProfileSerializer(profiles, many=True)
            return Response(profiles.data)
        except:
            return Response({"Error": "Sth is wrong when trying to get profiles"})


class GetUserProfileSingleView(APIView):
    def get(self, request, format=None):
        try:
            user = self.request.user
            username = user.username

            user_profile = UserProfile.objects.get(user=user)
            user_profile = UserProfileSerializer(user_profile)

            return Response({'profile': user_profile.data, 'username': str(username)})
        except:
            return Response({'error': 'Something went wrong when retrieving profile'})


class UpdateUserProfileView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def put(self, request, format=None):
        try:
            user = self.request.user
            username = user.username

            data = self.request.data
            first_name = data['first_name']
            last_name = data['last_name']
            position = data['position']
            phone = data['phone']
            city = data['city']

            UserProfile.objects.filter(user=user).update(
                first_name=first_name, last_name=last_name, position=position, phone=phone, city=city)

            user_profile = UserProfile.objects.get(user=user)
            user_profile = UserProfileSerializer(user_profile)

            return Response({'profile': user_profile.data, 'username': str(username)})
        except:
            return Response({'error': 'Something went wrong when updating profile'})
