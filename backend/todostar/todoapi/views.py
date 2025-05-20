from django.shortcuts import render
from rest_framework import status,serializers
from rest_framework.views import APIView
from rest_framework.response import Response
from.serializers import TodoSerializer
from.models import Todo

# crud
# create
# retrieve
# update
# delete

# Create your views here.
class TodoView(APIView):
    def get(self, request):
        try:
            get_tasks= Todo.objects.all()
            serializers= TodoSerializer(get_tasks, many=True)
            return Response(serializers.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

# create a task
    def post(self, request):
        try:
            serializers = TodoSerializer(data=request.data)
            if serializers.is_valid():
                serializers.save()
                return Response(serializers.data, status=status.HTTP_201_CREATED)
            return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
# get a task
class TodoGetTaskView(APIView):   
    # get a single task
    def get(self, request, id):
        try:
            get_task = Todo.objects.get(id=id)
            serializers = TodoSerializer(get_task)
            return Response(serializers.data, status=status.HTTP_200_OK)
        except Todo.DoesNotExist:
            return Response({"error": "Todo not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
    # update a task
    def put(self, request, id):
        try:
            get_task = Todo.objects.get(id=id)
            serializers = TodoSerializer(instance=get_task, data=request.data, partial=True)
            if serializers.is_valid():
                serializers.save()
                return Response({"message": f'{get_task.title} was sucessfully updated'}, status=status.HTTP_200_OK)
            return Response(serializers.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    # delete a task
    def delete(self, request, id):
        try:
            get_task = Todo.objects.get(id=id)
            get_task.delete()
            return Response({"message": f'{get_task.title} was sucessfully deleted'}, status=status.HTTP_200_OK)
        except Todo.DoesNotExist:
            return Response({"error": "Todo not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)