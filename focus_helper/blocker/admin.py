from django.contrib import admin
from django import forms
from .models import BlockedItem

class BlockedItemForm(forms.ModelForm):
    class Meta:
        model = BlockedItem
        fields = "__all__"

    def clean(self):
        cleaned_data = super().clean()
        item_type = cleaned_data.get("type")
        path = cleaned_data.get("path")
        url = cleaned_data.get("url")

        if item_type == "app" and not path:
            raise forms.ValidationError("App type requires a file path.")
        if item_type == "website" and not url:
            raise forms.ValidationError("Website type requires a URL.")
        return cleaned_data

class BlockedItemAdmin(admin.ModelAdmin):
    form = BlockedItemForm
    list_display = ("name", "type", "path", "url")

admin.site.register(BlockedItem, BlockedItemAdmin)
