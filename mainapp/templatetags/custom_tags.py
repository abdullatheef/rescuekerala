from django import template
from django.conf import settings
from pathlib import Path
import os

register = template.Library()

@register.simple_tag
def check_audio_path(id):
    return Path(os.path.join(settings.MEDIA_ROOT, "audio_%d.wav" %id)).exists()