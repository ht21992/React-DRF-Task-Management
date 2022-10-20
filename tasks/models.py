
from django.db import models

from user_profiles.models import UserProfile
from django.core.validators import MaxValueValidator

from colorfield.fields import ColorField


TASK_STATUS = (('backlog', "backlog"),
               ('in progress', "in progress"),
               ('completed', "completed")
               )

LOG_TYPES = (('Task Created', "Task Created"),
             ('Task Updated', "Task Updated"),
             )

PROGRESS_DICT = {'backlog': 0, 'in progress': 50, 'completed': 100}


class Task(models.Model):
    title = models.CharField(max_length=255, default="No Title")
    desc = models.TextField(max_length=2000, default="No description")
    assignee = models.ForeignKey(
        UserProfile, related_name='tasks', on_delete=models.CASCADE, null=True)
    parent_task = models.ForeignKey(
        'self', on_delete=models.CASCADE, null=True, blank=True, related_name='subs')
    status = models.CharField(
        default="backlog", max_length=255, choices=TASK_STATUS)
    completion_percentage = models.PositiveBigIntegerField(
        default=0,
        validators=[MaxValueValidator(100)])
    archieved = models.BooleanField(default=False)
    updated = models.DateTimeField(auto_now=True)
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return f"Task-{self.id}"

    def get_subtasks_num(self):
        return self.subs.all().count()

    def get_subtasks(self):
        return self.subs.all()

    def save(self, *args, **kwargs):

        self.completion_percentage = PROGRESS_DICT[self.status]
        super().save(*args, **kwargs)


class Log(models.Model):
    user = models.ForeignKey(
        UserProfile, related_name='logs', on_delete=models.CASCADE, null=True)
    task = models.ForeignKey(Task, related_name='logs',
                             on_delete=models.CASCADE)
    log_text = models.CharField(max_length=255)
    log_type = models.CharField(
        max_length=255, choices=LOG_TYPES, default="Task Created")
    log_color = ColorField(default='#955251')
    created = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created']

    def __str__(self):
        return f"Log-{self.id}"


class Comment(models.Model):
    user = models.ForeignKey(
        UserProfile, related_name='comments', on_delete=models.CASCADE, null=True)
    task = models.ForeignKey(Task, related_name='comments',
                             on_delete=models.CASCADE)
    text = models.TextField(max_length=1250, blank=False)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.text}"
