# blocker/views.py
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json, psutil, os, ctypes

hosts_path = r"C:\Windows\System32\drivers\etc\hosts"
backup_path = r"C:\Windows\System32\drivers\etc\hosts_backup"

def modify_hosts(blocklist, restore=False):
    if restore and os.path.exists(backup_path):
        os.replace(backup_path, hosts_path)
        return
    os.replace(hosts_path, backup_path)
    with open(backup_path, "r") as src, open(hosts_path, "w") as dest:
        dest.writelines(src.readlines())
        for site in blocklist:
            dest.write(f"127.0.0.1 {site}\n")

def kill_apps(app_paths):
    for proc in psutil.process_iter(['pid', 'name']):
        try:
            for app in app_paths:
                if app.lower() in proc.info['name'].lower():
                    psutil.Process(proc.info['pid']).kill()
        except Exception:
            pass

@csrf_exempt
def start_blocking(request):
    data = json.loads(request.body)
    websites = data.get('websites', [])
    apps = data.get('apps', [])
    modify_hosts(websites)
    kill_apps(apps)
    return JsonResponse({'status': 'blocking_started'})

@csrf_exempt
def stop_blocking(request):
    modify_hosts([], restore=True)
    return JsonResponse({'status': 'blocking_stopped'})
