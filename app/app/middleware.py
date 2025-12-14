import time
import json
from django.http import JsonResponse

class RateLimitMiddleware:
    """rate limit if requests > TIMES for the last SECONDS"""
    SECONDS = 60
    TIMES = 8
    calls = {}
    def __init__(self,get_response):
        self.get_response = get_response

    def __call__(self, request):
        ip =  self.get_client_ip(request)
        now = time.time()
        if ip not in self.calls:
            self.calls[ip]=[]
        self.calls[ip] = [t for t in self.calls[ip] if now - t< self.SECONDS]
        if len(self.calls[ip]) > self.TIMES:
            return JsonResponse({"error":'429',
                                 'message':'Too many requests'})
        self.calls[ip].append(now)
        return self.get_response(request)

    def get_client_ip(self,request):
        x_forwared = request.headers.get('X-Forwarded-For')
        if x_forwared:
            return x_forwared.split(',')[0].strip()
        return request.META.get('REMOTE_ADDR')