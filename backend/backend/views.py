from django.http import HttpResponse


def multiply(request):
    if request.method == 'GET':
        x = int(request.GET.get('x', 0))
        y = int(request.GET.get('y', 0))

        res: int = 0
        for i in range(x):
            for j in range(y):
                res += i + j
        return HttpResponse(res)
