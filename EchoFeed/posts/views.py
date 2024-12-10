from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from .models import UserPosts, Like, Comment
from django.contrib.auth.models import User
# Create your views here.


def upload_post(request):
    if request.method == "POST":
        if 'postImage' in request.FILES:
            image = request.FILES['postImage']
            caption = request.POST.get('postCaption')
            if len(caption) >= 501:
                return JsonResponse({'caption_too_long':True})
            user = request.user
            UserPosts.objects.create(user=user,post_img=image, caption=caption)
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'invalid_req': True})
    else:
        return JsonResponse({'invalid_req': True})
    
def like(request):
    try:
        if request.method == 'POST':
            post_id = request.POST.get('id')
            username = request.user.username
            post = UserPosts.objects.get(id=post_id)
            user = User.objects.get(username=username)
            like, created = Like.objects.get_or_create(user=user, post=post)
            if created:
                is_created = True
            else:
                is_created = True
            data = {
                'success': is_created,
            }
            return JsonResponse(data)
        else:
            return HttpResponse('Invalid request')
    except:
        return JsonResponse({'success': False})
    
def unlike(request):
    try:
        if request.method == 'POST':
            post_id = request.POST.get('id')
            user = User.objects.get(username=request.user.username)
            post = UserPosts.objects.get(id=post_id)
            unlike_obj = Like.objects.filter(user=user, post=post).first()
            if unlike_obj:
                unlike_obj.delete()
                return JsonResponse({'success': True})
            else:
                return JsonResponse({'success': False})
    except:
        return HttpResponse('Invalid request')
    
def submit_comment(request):
    if request.method == 'POST':
        post_id = request.POST.get('id')
        comment = request.POST.get('comment', '').strip()
        if comment != '':
            post = UserPosts.objects.get(id=post_id)
            user = User.objects.get(username=request.user.username)
            Comment.objects.create(user=user, post=post, comment=comment)

            data = {
                'success': True,
                'username': user.username,
                'profile_image': user.userprofile.profile_image.url,
            }
            return JsonResponse(data)
        else:
            return JsonResponse({'success': False})
    else:
        return HttpResponse('Invalid request')