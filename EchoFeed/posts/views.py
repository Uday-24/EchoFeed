from django.shortcuts import render
from django.http import JsonResponse
from .models import UserPosts
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