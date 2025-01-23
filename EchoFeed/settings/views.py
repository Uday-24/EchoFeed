from django.shortcuts import render
from django.http import JsonResponse, HttpResponse

from accounts.models import UserProfile
from django.contrib.auth.models import User
from .models import UserSettings
# Create your views here.
def edit_profile(request):
    user_info = UserProfile.objects.get(user__username = request.user.username)
    gender = UserSettings.objects.filter(user__username=request.user.username).values_list('gender', flat=True).first()

    if gender == None or gender == '':
        gender = 'no'
        
    context = {
        'user_info': user_info,
        'gender': gender,
    }
    return render(request, 'settings/editProfile.html', context)

def account_privacy(request):
    is_private = UserSettings.objects.filter(user__username=request.user.username).values_list('is_private_account', flat=True).first()
    context = {
        'is_private': is_private,
    }
    return render(request, 'settings/accountPrivacy.html', context)

def comments(request):
    return render(request, 'settings/comments.html')

def blocked(request):
    return render(request, 'settings/blocked.html')

def password_and_security(request):
    is_2fa_on = UserSettings.objects.filter(user__username=request.user.username).values_list('is_2fa_on', flat=True).first()
    context = {
        'is_2fa_on': is_2fa_on,
    }
    return render(request, 'settings/passAndSec.html', context)

def personal_details(request):
    birthdate = UserSettings.objects.filter(user__username=request.user.username).values_list('birth_date', flat=True).first()
    context = {
        'birthdate': birthdate,
    }
    return render(request, 'settings/personalDetails.html', context)

def handle_2fa_private_account(request):
    try:
        if request.method == 'POST':
            message = int(request.POST.get('message'))
            if message == 0:
                UserSettings.objects.filter(user__username=request.user.username).update(is_2fa_on=False)
            elif message == 1:
                UserSettings.objects.filter(user__username=request.user.username).update(is_2fa_on=True)
            elif message == 2:
                UserSettings.objects.filter(user__username=request.user.username).update(is_private_account=False)
            elif message == 3:
                UserSettings.objects.filter(user__username=request.user.username).update(is_private_account=True)
            else:
                return HttpResponse("Invalid request")

            return JsonResponse({'success':True})
        else:
            return HttpResponse("Invalid request")
    except:
        return HttpResponse("Invalid request")

def birthday(request):
    if request.method == 'POST':
        birthdate = request.POST.get('birthdate')
        if birthdate:
            UserSettings.objects.filter(user__username=request.user.username).update(birth_date=birthdate)
        else:
            return JsonResponse({'success':False})
            
    return JsonResponse({'success':True})