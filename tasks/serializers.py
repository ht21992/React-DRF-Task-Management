from rest_framework import serializers
from .models import Task, Log, Comment
from user_profiles.models import UserProfile


class CommentSerializer(serializers.ModelSerializer):
    user_profile = serializers.SerializerMethodField(
        '_get_user_profile')

    user_profile_avatar = serializers.SerializerMethodField(
        '_get_user_profile_avatar')

    def _get_user_profile(self, comment_object):
        user_profile_name = UserProfile.objects.get(
            id=comment_object.user.id)
        return f"{user_profile_name.first_name} {user_profile_name.last_name}"

    def _get_user_profile_avatar(self, comment_object):
        user_profile_avatar = UserProfile.objects.get(
            id=comment_object.user.id)
        try:
            return f"{user_profile_avatar.avatar.url}"
        except ValueError:
            return None

    class Meta:
        model = Comment
        model_fields = ['id', 'user', 'task', 'text', 'created', 'updated']
        extra_fields = ['user_profile', 'user_profile_avatar']
        fields = model_fields + extra_fields


class TaskSerializer(serializers.ModelSerializer):
    user_profile = serializers.SerializerMethodField('_get_user_profile')

    user_profile_avatar = serializers.SerializerMethodField(
        '_get_user_profile_avatar')

    subtasks = serializers.SerializerMethodField(
        read_only=True, method_name="_get_subtaks")

    # The commented code snippets below can be used to only send one GET method request and get the task plus its logs and comments
    # in that case TaskSingle.js must be changed and instead of logs we can use task.logs (same way for comments)
    # after doing that we need to change the taskSlice to get the logs and comments state ( in that case we do not need to send seprate requests for getting logs and comments)

    # logs = serializers.SerializerMethodField(
    #     read_only=True, method_name="_get_logs")

    # comments = serializers.SerializerMethodField(
    #     read_only=True, method_name="_get_comments")

    def _get_user_profile(self, task_object):
        user_profile_name = UserProfile.objects.get(
            id=task_object.assignee.id)
        return f"{user_profile_name.first_name} {user_profile_name.last_name}"

    def _get_user_profile_avatar(self, task_object):
        user_profile_avatar = UserProfile.objects.get(
            id=task_object.assignee.id)
        try:
            return f"{user_profile_avatar.avatar.url}"
        except ValueError:
            return None

    def _get_subtaks(self, task_object):
        """ self referral field """
        serializer = TaskSerializer(
            instance=task_object.get_subtasks(),
            many=True
        )
        return serializer.data

    # def _get_logs(self, task_object):
    #     serializer = LogSerializer(
    #         instance=task_object.get_logs(),
    #         many=True
    #     )

    #     return serializer.data

    # def _get_comments(self, task_object):
    #     serializer = CommentSerializer(
    #         instance=task_object.get_comments(),
    #         many=True
    #     )
    #     return serializer.data

    class Meta:
        model = Task
        model_fields = ['id', 'title', 'desc', 'assignee', 'parent_task',
                        'status', 'completion_percentage', 'created', 'updated', 'archieved']
        # extra_fields = ['user_profile', 'user_profile_avatar', 'subtasks','logs', 'comments']
        extra_fields = ['user_profile', 'user_profile_avatar', 'subtasks']
        fields = model_fields + extra_fields


class LogSerializer(serializers.ModelSerializer):
    user_profile = serializers.SerializerMethodField('_get_user_profile')

    def _get_user_profile(self, task_object):
        user_profile_name = UserProfile.objects.get(
            id=task_object.user.id)
        return f"{user_profile_name.first_name} {user_profile_name.last_name}"

    class Meta:
        model = Log
        model_fields = ['id', 'user', 'task', 'log_text',
                        'log_type', 'log_color', 'created']
        extra_fields = ['user_profile']
        fields = model_fields + extra_fields
