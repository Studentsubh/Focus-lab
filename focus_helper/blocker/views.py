from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from .models import BlockedItem
import json, psutil, os

hosts_path = r"C:\Windows\System32\drivers\etc\hosts"
backup_path = r"C:\Windows\System32\drivers\etc\hosts_backup"


def modify_hosts(blocklist, restore=False):
    """Backup and modify hosts file to block or unblock websites."""
    if restore:
        if os.path.exists(backup_path):
            os.replace(backup_path, hosts_path)
        return

    if not os.path.exists(backup_path):
        os.replace(hosts_path, backup_path)

    with open(backup_path, "r") as src, open(hosts_path, "w") as dest:
        dest.writelines(src.readlines())
        for site in blocklist:
            # Block both www and non-www variants
            dest.write(f"127.0.0.1 {site}\n")
            if not site.startswith("www."):
                dest.write(f"127.0.0.1 www.{site}\n")
            else:
                dest.write(f"127.0.0.1 {site[4:]}\n")


def kill_apps(app_paths):
    """Kill specified apps by name or path."""
    for proc in psutil.process_iter(['pid', 'name', 'exe']):
        try:
            for app in app_paths:
                # Check both process name and executable path
                if (app.lower() in proc.info['name'].lower() or
                    (proc.info['exe'] and app.lower() in proc.info['exe'].lower())):
                    psutil.Process(proc.info['pid']).kill()
                    print(f"Terminated {app} (PID: {proc.info['pid']})")
        except Exception as e:
            print(f"Error terminating process: {e}")
            pass


@csrf_exempt
def blocked_items_list(request):
    """List all blocked items."""
    if request.method == "GET":
        items = BlockedItem.objects.all()
        data = [
            {
                "id": item.id,
                "name": item.name,
                "type": item.type,
                "path": item.path,
                "url": item.url
            }
            for item in items
        ]
        return JsonResponse(data, safe=False)

    if request.method == "POST":
        try:
            data = json.loads(request.body.decode('utf-8'))
            item = BlockedItem.objects.create(
                name=data['name'],
                type=data['type'],
                path=data.get('path'),
                url=data.get('url')
            )
            return JsonResponse({
                "id": item.id,
                "name": item.name,
                "type": item.type,
                "path": item.path,
                "url": item.url
            }, status=201)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def blocked_item_detail(request, id):
    """Get, update, or delete a specific blocked item."""
    item = get_object_or_404(BlockedItem, id=id)

    if request.method == "GET":
        return JsonResponse({
            "id": item.id,
            "name": item.name,
            "type": item.type,
            "path": item.path,
            "url": item.url
        })

    if request.method == "PUT":
        try:
            data = json.loads(request.body.decode('utf-8'))
            item.name = data.get('name', item.name)
            item.type = data.get('type', item.type)
            item.path = data.get('path', item.path)
            item.url = data.get('url', item.url)
            item.save()
            return JsonResponse({
                "id": item.id,
                "name": item.name,
                "type": item.type,
                "path": item.path,
                "url": item.url
            })
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    if request.method == "DELETE":
        item.delete()
        return JsonResponse({"message": "Item deleted"}, status=204)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def start_blocking(request):
    """Block websites and apps based on BlockedItem model data."""
    if request.method == "POST":
        try:
            # Get all blocked items from database
            blocked_items = BlockedItem.objects.all()
            websites = []
            apps = []

            for item in blocked_items:
                if item.type == "website" and item.url:
                    # Extract domain from URL
                    domain = item.url.replace("https://", "").replace("http://", "").replace("www.", "").split("/")[0]
                    websites.append(domain)
                elif item.type == "app":
                    # Use path if available, otherwise use name
                    app_identifier = item.path if item.path else item.name
                    if app_identifier:
                        apps.append(app_identifier)

            modify_hosts(websites)
            kill_apps(apps)

            return JsonResponse({
                "status": "blocking_started",
                "websites_blocked": websites,
                "apps_blocked": apps
            })
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def stop_blocking(request):
    """Unblock all websites."""
    try:
        modify_hosts([], restore=True)
        return JsonResponse({"status": "blocking_stopped"})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
