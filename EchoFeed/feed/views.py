from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from accounts.models import UserProfile
# Create your views here.

@login_required
def index(request):
    return render(request, 'feed/index.html')

@login_required
def profile(request):
    profile = UserProfile.objects.get(user__username=request.user)
    context = {
        "profile": profile, 
    }
    return render(request, 'feed/profile.html', context)