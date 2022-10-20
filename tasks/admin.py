from django.contrib import admin
from .models import Task, Log, Comment


admin.site.register(Log)
admin.site.register(Comment)


class SubTaskInline(admin.StackedInline):
    model = Task
    fk_name = 'parent_task'
    verbose_name = "Subtask"
    verbose_name_plural = "Subtasks"
    extra = 1


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('assignee', 'status')
    list_filter = ('assignee', 'created')

    fieldsets = (
        ('Task Information', {
            'fields': ('title', 'desc', 'parent_task')
        }),
        ('Task Statue',
         {'fields': ('assignee', 'status',)}),

    )
    inlines = [
        SubTaskInline,
    ]
