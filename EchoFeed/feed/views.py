from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core.serializers import serialize

from accounts.models import UserProfile, Follow
from posts.models import UserPosts, Like, Comment
# Create your views here.

@login_required
def index(request):
    current_user = User.objects.get(username='uday')
    user_profile = UserProfile.objects.get(user=current_user)
    following = Follow.objects.filter(follower=user_profile).values_list('following__user',flat=True)
    liked_post = Like.objects.filter(user=current_user).values_list('post', flat=True)
    posts = UserPosts.objects.filter(user__in=following).order_by('-creation_time').exclude(id__in=liked_post)

    context = {
        'posts':posts,
    }

    return render(request, 'feed/index.html', context)

@login_required
def profile(request):
    profile = UserProfile.objects.get(user__username=request.user)
    myPosts = UserPosts.objects.filter(user__username=request.user).order_by('-creation_time')
    context = {
        "profile": profile,
        "myPosts": myPosts,
    }
    return render(request, 'feed/profile.html', context)

@login_required
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

@login_required
def profile_search(request):
    try:
        query = request.GET.get('query')
        profiles = UserProfile.objects.filter(user__username__icontains=query).values('id', 'user__username', 'profile_image', 'nickname')
        if profiles.exists():
            data = list(profiles)
            return JsonResponse({'res': data}, safe=False)
        else:
            return JsonResponse({'no_record_found': True})
    except:
            return JsonResponse({'no_record_found': True})

    
@login_required
def user_profile(request, user):
    try:
        if user == request.user.username:
            return redirect('feed:profile')
        profile = UserProfile.objects.get(user__username = user)
        posts = UserPosts.objects.filter(user__username = user).order_by("-creation_time")
        follows = False
        if Follow.objects.filter(follower__user__username=request.user.username, following__user__username=user).exists():
            follows = True
        context = {
            "profile": profile,
            "myPosts": posts,
            "follows": follows,
        }
        return render(request, 'feed/profile.html', context)
    except:
        return HttpResponse("Invalid request")

@login_required
def follow(request):
    try:
        if request.method == "POST":
            follower_name = request.user.username
            following_name = request.POST.get('following')

            if follower_name == following_name:
                return redirect("feed:profile")

            follower = UserProfile.objects.get(user__username = follower_name)
            following = UserProfile.objects.get(user__username = following_name)
        
            Follow.objects.create(follower=follower, following=following)

            return JsonResponse({'success': True})
    except:
            return JsonResponse({'success': False})

    
    return HttpResponse("Invalid request")
        

@login_required
def unfollow(request):
    try:
        if request.method == "POST":
            following = request.POST.get('following')
            follower = request.user.username
            data = Follow.objects.get(follower__user__username=follower, following__user__username=following)
            data.delete()
            return JsonResponse({'success': True})
    except:
        return HttpResponse("Invalid request")

@login_required
def show_follow(request):
    try:
        request_type = request.GET.get('request_type')
        username = request.GET.get('username')
        if username == '':
            username = request.user.username

        if request_type == 'follower_request':
            follower = Follow.objects.filter(following__user__username=username)
            data = [{'id': f.id, 'username': f.follower.user.username, 'nickname': f.follower.nickname, 'img': f.follower.profile_image.url} for f in follower]
            return JsonResponse({'followers': data}, safe=False)
        
        elif request_type == 'following_request':
            following = Follow.objects.filter(follower__user__username = username)
            data = [{'id': f.id, 'username': f.following.user.username, 'nickname': f.following.nickname, 'img': f.following.profile_image.url} for f in following]
            return JsonResponse({'followings': data}, safe=False)

        else:
            print("Invalid request")
        return JsonResponse({'success':True})

    except:
        return HttpResponse("Invalid request")
    

def explore(request):
    # random_posts = UserPosts.objects.filter(user__usersettings__is_private_account=False).order_by('?')[:5]
    random_posts = UserPosts.objects.filter(id=1)
    context = {
        'random_posts': random_posts,
    }
    return render(request, 'feed/explore.html', context)

def show_post(request):
    if request.GET.get('id'):

        # Post id from front-end
        id = request.GET.get('id')

        # Getting UserPosts object
        post = UserPosts.objects.get(id=id)

        # Getting profile_image, username and number of likes
        profile_image = post.user.userprofile.profile_image.url
        likes = post.like_count
        username = post.user.username
        caption = post.caption

        # Getting user object for checking if post liked by logged_in user or not
        user = User.objects.get(username=request.user.username)
        is_liked = Like.objects.filter(user=user, post=post).exists()

        # Checking for follow or unfollow
        is_follows = Follow.objects.filter(follower__user__username=request.user.username, following__user__username=username).exists()

        # Getting comments for the post
        comments = Comment.objects.filter(post=post).order_by('-created_at')
        comments = [{'id': c.id, 'profile_image':c.user.userprofile.profile_image.url, 'username': c.user.username, 'comment': c.comment, 'created_at': c.created_at} for c in comments]
        res = {
            'success': True,
            'profile_image': profile_image,
            'username': username,
            'follows': is_follows,
            'likes':likes,
            'is_liked':is_liked,
            'comments':comments,
            'caption':caption,
        }

        return JsonResponse(res)
    else:
        return HttpResponse('Invalid Request')