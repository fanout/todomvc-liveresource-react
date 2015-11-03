import json
import uuid
from django.http import HttpResponse, HttpResponseNotAllowed

class TodoItem(object):
	def __init__(self, id=None, text='', completed=False):
		self.id = id
		self.deleted = False
		self.text = text
		self.completed = completed

	def to_data(self):
		out = { 'id': self.id }
		if not self.deleted:
			out['text'] = self.text
			out['completed'] = self.completed
		else:
			out['deleted'] = True
		return out

def _json_response(data, pretty=True):
	if pretty:
		indent = 4
	else:
		indent = None
	return HttpResponse(json.dumps(data, indent=indent) + '\n', content_type='application/json')

def _list_response(items):
	return _json_response([i.to_data() for i in items])

def _item_response(item):
	return _json_response(item.to_data())

def todos(request):
	if request.method == 'GET':
		items = []
		for text in ('chop apples', 'peel bananas', 'pit cherries'):
			i = TodoItem()
			i.id = str(uuid.uuid4())
			i.text = text
			items.append(i)
		items[0].completed = True
		return _list_response(items)
	elif request.method == 'POST':
		params = json.loads(request.body)
		i = TodoItem()
		i.id = str(uuid.uuid4())
		i.text = params['text']
		return _item_response(i)
	else:
		return HttpResponseNotAllowed(['GET', 'POST'])

def todos_item(request, todo_id):
	i = TodoItem()
	i.id = todo_id
	i.text = 'eat apples'
	if request.method == 'GET':
		return _item_response(i)
	elif request.method == 'PUT':
		params = json.loads(request.body)
		i.text = params['text']
		i.completed = params.get('completed', True)
		return _item_response(i)
	elif request.method == 'DELETE':
		return HttpResponse('Deleted\n', content_type='text/plain')
	else:
		return HttpResponseNotAllowed(['GET', 'POST', 'DELETE'])
