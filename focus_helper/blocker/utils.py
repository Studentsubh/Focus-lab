import psutil
import os

def block_apps():
    """Block apps based on BlockedItem model data."""
    from .models import BlockedItem
    blocked = BlockedItem.objects.filter(type="app")
    for app in blocked:
        for proc in psutil.process_iter(['pid', 'name']):
            try:
                if app.name.lower() in proc.info['name'].lower():
                    psutil.Process(proc.info['pid']).kill()
                    print(f"Terminated {app.name}")
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue

def unblock_apps():
    """Print message when focus mode ends."""
    print("Focus mode ended. You can reopen your apps now.")
