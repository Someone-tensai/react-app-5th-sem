from django.urls import path
from .views import get_question, submit_score

urlpatterns = [
    path('question/', get_question),
    path('score/', submit_score),
]
