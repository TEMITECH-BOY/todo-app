from django.urls import path
from .import views


urlpatterns = [
    path('todos/',views.TodoView.as_view()),
    path('todos/<int:id>/',views.TodoGetTaskView.as_view() ),
]