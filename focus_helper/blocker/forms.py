# blocker/forms.py
from django import forms
from .models import BlockedItem

class BlockedItemForm(forms.ModelForm):
    class Meta:
        model = BlockedItem
        fields = "__all__"
