from django import forms
from django.contrib.auth.models import User

class UserRegistrationForm(forms.ModelForm):

    password = forms.CharField(widget=forms.PasswordInput, label='Password')
    confirm_password = forms.CharField(widget=forms.PasswordInput, label='Confirm Password')

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def clean_confirm_password(self):
        password = self.cleaned_data.get('password')
        confirm_password = self.cleaned_data.get('confirm_password')
        
        if password != confirm_password:
            raise forms.ValidationError("Passwords do not match.")
        
        return confirm_password
    
    def clean_email(self):
        email = self.cleaned_data.get('email').strip()
        # Check if email already exists
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError("This email address is already registered.")
        elif email == '':
            raise forms.ValidationError("This field is required.")
        return email
    