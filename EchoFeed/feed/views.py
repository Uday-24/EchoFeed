from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from accounts.models import UserProfile
from django.contrib.auth.models import User
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

def update_profile(request):
    try:
        if request.method == "POST":
            print("Post req")
            new_uname = request.POST.get('username').lower().strip()
            old_uname = request.user.username
            bio = request.POST.get('bio').strip()
            nickname = request.POST.get('nickname')
            if new_uname != old_uname:
                if User.objects.filter(username=new_uname).exists():
                    print("This is taken bro")
                else:
                    request.user.username = new_uname
                    request.user.save()
            
            # request.user.profile.bio = bio
            # request.user.profile.nickname = nickname
            # request.user.profile.bio = bio
            
        else:
            print("Invalid request")
    except Exception as e:
        print(f"Exception-------------->{e}")

    return