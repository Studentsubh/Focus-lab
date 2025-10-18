import psutil
import os

def block_apps():
    from .models import BlockedApp
    blocked = BlockedApp.objects.all()
    for app in blocked:
        for proc in psutil.process_iter(['pid', 'name']):
            try:
                if app.name.lower() in proc.info['name'].lower():
                    psutil.Process(proc.info['pid']).terminate()
                    print(f"Terminated {app.name}")
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue

def unblock_apps():
    print("Focus mode ended. You can reopen your apps now.")
