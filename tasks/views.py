from django.shortcuts import render
from .models import Task, Log, Comment
from .serializers import TaskSerializer, LogSerializer, CommentSerializer
from rest_framework import viewsets, status
from rest_framework.response import Response


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all().order_by('-updated')
    lookup_body_field = 'id'
    serializer_class = TaskSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        try:
            parent_task = instance.parent_task.id
        except AttributeError:
            parent_task = 'No parent'

        self.perform_destroy(instance)
        return Response(data={'parent_task': parent_task}, status=status.HTTP_206_PARTIAL_CONTENT)

    def get_queryset(self):
        if 'filter' in str(self.request.get_full_path()):
            filter_index = str(self.request.get_full_path()).rfind("filter")
            filter_text = str(self.request.get_full_path())[
                filter_index + len("filter") + 1:]
            queryset = Task.objects.filter(id__contains=filter_text)
        else:

            queryset = Task.objects.all().order_by('-updated')

        return queryset


class LogViewSet(viewsets.ModelViewSet):
    queryset = Log.objects.all().order_by('-created')
    lookup_body_field = 'id'
    serializer_class = LogSerializer

    def list(self, request, *args, **kwargs):
        try:
            task_id = str(self.request.get_full_path()).split("filter=", 1)[1]
            task = Task.objects.get(id=task_id)
            queryset = Log.objects.filter(task=task)

        except:
            queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        user = request.user
        request.data['user'] = user.id
        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all().order_by('-updated')
    lookup_body_field = 'id'
    serializer_class = CommentSerializer

    def list(self, request, *args, **kwargs):
        try:
            task_id = str(self.request.get_full_path()).split("filter=", 1)[1]
            task = Task.objects.get(id=task_id)
            queryset = Comment.objects.filter(task=task)

        except:
            queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        user = request.user
        request.data['user'] = user.id
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        user = request.user
        request.data['user'] = user.id
        instance = self.get_object()
        if (request.data["task"] != instance.task.id or request.data["user"] != request.user.id):
            return Response({"error": "Access Denied"})
        serializer = self.get_serializer(
            instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)
