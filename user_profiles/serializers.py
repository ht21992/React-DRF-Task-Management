from rest_framework import serializers
from .models import UserProfile


# class UserProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserProfile
#         fields = '__all__'


class UserProfileSerializer(serializers.ModelSerializer):
    tasks_num = serializers.SerializerMethodField(
        '_get_tasks_num')

    def _get_tasks_num(self, obj):
        
        return f"{obj.get_tasks_num()}"

    class Meta:
        model = UserProfile
        model_fields = ['id', 'user', 'first_name',
                        'last_name', 'position', 'phone', 'city', 'avatar']
        extra_fields = ['tasks_num']
        fields = model_fields + extra_fields
