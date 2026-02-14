import random
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def get_question(request):
    num1 = random.randint(1, 10)
    num2 = random.randint(1, 10)

    return Response({
        "num1": num1,
        "num2": num2,
        "operation": "+"
    })


@api_view(['POST'])
def submit_score(request):
    score = request.data.get("score")

    return Response({
        "message": f"Server received your score: {score}"
    })
