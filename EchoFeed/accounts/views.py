from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import authenticate, login
from django.contrib import messages


from .forms import *

import random

def generate_otp():
    return random.randint(100000, 999999)
# Create your views here.
def register(request):

    errors = None

    if request.method == "POST":
        form = UserRegistrationForm(data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username').strip().lower()
            if len(username) <= 15:
                email = form.cleaned_data.get('email').strip().lower()
                password = form.cleaned_data.get('password').strip()
                otp = generate_otp()

                subject = "OTP For EchoFeed"
                message = f"Your OTP is {otp}"
                email_from = settings.EMAIL_HOST_USER

                send_mail(subject, message, email_from, [email])


                request.session['user_data'] = {
                    'username': username,
                    'email': email,
                    'password': password,
                    'otp': otp
                }
                return JsonResponse({'go_ahed':True})
            else:
                return JsonResponse({'username_is_long':True})

        else:
            errors = form.errors

    if errors:
        data = {'errors' : errors}
        return JsonResponse(data)
    
    form = UserRegistrationForm()
    context = {
        'form':form,
        'errors': errors,
    }
    return render(request, 'accounts/register.html', context)


def check_username(request):
    username = request.GET.get('username', '').strip().lower()
    is_username_exist = User.objects.filter(username=username).exists()
    data = {}
    if is_username_exist:
        data = {'exists': True}
    else:
        data = {'exists': False}

    return JsonResponse(data)

def check_email(request):
    email = request.GET.get('email', '').strip().lower()
    is_email_exist = User.objects.filter(email=email).exists()
    data = {}
    if is_email_exist:
        data = {'exists': True}
    else:
        data = {'exists': False}

    return JsonResponse(data)

def verify_otp(request):
    try:
        user_data = request.session.get('user_data')
        if not user_data:
            return redirect('register')
        if request.method == "POST":
            user_otp = request.POST.get('otp')

            if not user_otp.isdigit():
                messages.error(request, "Invalid OTP. Please try again.")
                return redirect('verify_otp')

            if user_otp:
                user_otp = int(user_otp.strip())

            original_otp = user_data.get('otp')

            if user_otp == original_otp:
                username = user_data.get('username')
                email = user_data.get('email')
                password = user_data.get('password')
                user = User.objects.create_user(username=username, email=email, password=password)
                user.save()

                # Login process after valid otp
                authenticated_user = authenticate(request, username=username, password=password)
                if authenticated_user:
                    login(request, authenticated_user)
                    # Clear session data after successful login
                    del request.session['user_data']
                    print("Login and register success")
                    return redirect("feed:index")
            else:
                print('try again')
    except Exception as e:
        print(f"Error occurred: {e}")
        return redirect('register')

    return render(request, 'accounts/verify_otp.html')


def login_page(request):
    if request.method == "POST":
        username = request.POST['username'].strip()
        password = request.POST['password']

        if username == "":
            data = {
                "blank_username":True
            }
            return JsonResponse(data)

        if '@' in username:
            try:
                user = User.objects.get(email = username)
            except:
                user = None
        else:
            user = User.objects.filter(username = username).first()

        if user is not None:
            user = authenticate(request, username = user.username, password=password)
            if user is not None:
                login(request, user)
                data = {"success": True}  # Add the redirect URL here
                return JsonResponse(data)
            else:
                data = {
                    "invalid_password":True
                }
                return JsonResponse(data)
        else:
            data = {
                "no_user_found":True
            }
            return JsonResponse(data)
    else:
        return HttpResponse("Invalid Request")