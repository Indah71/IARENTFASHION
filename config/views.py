from django.http import HttpResponse

def home(request):
    return HttpResponse("Django berhasil di-deploy di Railway 🚀")
