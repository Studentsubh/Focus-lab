from django.db import models

class BlockedItem(models.Model):
    ITEM_TYPES = [
        ("app", "Application"),
        ("website", "Website"),
    ]

    type = models.CharField(max_length=10, choices=ITEM_TYPES)
    name = models.CharField(max_length=200)
    path = models.CharField(max_length=500, blank=True, null=True)
    url = models.CharField(max_length=500, blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.type})"
