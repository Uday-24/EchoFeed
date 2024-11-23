from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User

from accounts.models import UserProfile
from posts.models import UserPosts
# Create your views here.

@login_required
def index(request):
    return render(request, 'feed/index.html')

@login_required
def profile(request):
    profile = UserProfile.objects.get(user__username=request.user)
    myPosts = UserPosts.objects.filter(user__username=request.user).order_by('-creation_time')
    context = {
        "profile": profile,
        "myPosts": myPosts,
    }
    return render(request, 'feed/profile.html', context)

def update_profile(request):
    try:
        if request.method == "POST":
            new_uname = request.POST.get('username').lower().strip()

            if len(new_uname) >=16:
                return JsonResponse({'long_username':True})

            old_uname = request.user.username
            bio = request.POST.get('bio').strip()
            nickname = request.POST.get('nickname')
            if new_uname != old_uname:
                if User.objects.filter(username=new_uname).exists():
                    return JsonResponse({'username_taken':True})
                else:
                    request.user.username = new_uname
                    request.user.save()

            profile = UserProfile.objects.get(user__username=request.user)

            if profile.bio != bio:
                if len(bio) >= 250:
                    return JsonResponse({'long_bio':True})
                profile.bio = bio
            
            if profile.nickname != nickname:
                if len(nickname) >= 15:
                    return JsonResponse({'long_nickname':True})
                profile.nickname = nickname

            if 'profile_image' in request.FILES:
                profile.profile_image = request.FILES['profile_image']

            profile.save()

            return JsonResponse({'success':True})    
        else:
            return JsonResponse({'invalid_request':True})
        
    except Exception as e:
        print(f"Exception-------------->{e}")
