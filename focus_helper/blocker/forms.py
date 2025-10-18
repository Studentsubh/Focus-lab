# blocker/forms.py
from django import forms
from .models import BlockedApp

class BlockedAppForm(forms.ModelForm):
    path = forms.CharField(widget=forms.FileInput)

    class Meta:
        model = BlockedApp
        fields = "__all__"
