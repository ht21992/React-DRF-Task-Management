
from tasks.models import Task
from user_profiles.models import UserProfile


def get_tasks_num(request: object):
    """
    This function is responsible for counting tasks

    Args:
        request (object)

    Returns:
        dict : a dictionary of that consist of tasks that have been assigned to a specific user profile
    """
    if request.user.is_authenticated:
        user_profile = UserProfile.objects.get(user=request.user.id)
        tasks_num = Task.objects.filter(
            assignee=user_profile.id).count()
        return {'tasks_num': tasks_num}

    return {}
