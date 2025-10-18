import time
import psutil
import requests
import os

API_URL = "http://127.0.0.1:8000/api/blocked-items/"
hosts_path = r"C:\Windows\System32\drivers\etc\hosts"
redirect_ip = "127.0.0.1"

def get_blocklist():
    try:
        r = requests.get(API_URL)
        return r.json()
    except Exception as e:
        print("⚠️ Failed to fetch blocklist:", e)
        return []

def block_sites(blocklist):
    with open(hosts_path, "r+") as file:
        content = file.read()
        for item in blocklist:
            if item["type"] == "website":
                domain = item["url"].replace("https://", "").replace("http://", "").strip("/")
                line = f"{redirect_ip} {domain}\n"
                if line not in content:
                    file.write(line)
    print("✅ Sites blocked.")

def unblock_sites(blocklist):
    with open(hosts_path, "r") as file:
        lines = file.readlines()

    new_lines = []
    for line in lines:
        if not any(item["url"].replace("https://", "").replace("http://", "").strip("/") in line for item in blocklist):
            new_lines.append(line)

    with open(hosts_path, "w") as file:
        file.writelines(new_lines)

    print("🚪 Sites unblocked.")

def monitor_apps(blocklist):
    blocked_exes = [item["path"].split("\\")[-1] for item in blocklist if item["type"] == "app"]

    while True:
        for proc in psutil.process_iter(['name']):
            if proc.info['name'] in blocked_exes:
                proc.kill()
                print(f"🚫 Blocked: {proc.info['name']}")
        time.sleep(2)

if __name__ == "__main__":
    print("🔒 Focus Helper running...")
    blocklist = get_blocklist()
    print("Loaded:", blocklist)
    block_sites(blocklist)

    try:
        monitor_apps(blocklist)
    except KeyboardInterrupt:
        print("\n🧹 Unblocking and exiting...")
        unblock_sites(blocklist)
        print("✅ All websites unblocked.")
