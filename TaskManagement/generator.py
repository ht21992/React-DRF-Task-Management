import random
import string


def get_random_secret_key(length):
    characters = string.ascii_letters + string.digits + string.punctuation
    secret_key = ''.join(random.choice(characters) for i in range(length))
    return secret_key