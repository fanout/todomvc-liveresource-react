import json
from django.http import HttpResponse, HttpResponseBadRequest, \
	HttpResponseNotAllowed, HttpResponseNotFound
from gripcontrol import HttpResponseFormat, Channel
from django_grip import set_hold_longpoll, publish
from models import TodoItem

def _json_response(data, pretty=True):
	if pretty:
		indent = 4
	else:
		indent = None
	return HttpResponse(json.dumps(data, indent=indent) + '\n',
		content_type='application/json')

def _list_response(items):
	return _json_response([i.to_data() for i in items])

def _item_response(item):
	return _json_response(item.to_data())

def _publish_item(item, id, prev_id):
	body = json.dumps([item.to_data()]) + '\n'
	headers = {'Link': '</todos/?after=%s>; rel=changes-wait' % prev_id}
	publish('todos', HttpResponseFormat(headers=headers, body=body),
		 id=id, prev_id=prev_id)

def todos(request):
	if request.method == 'HEAD':
		last_cursor = TodoItem.get_last_cursor()
		resp = HttpResponse()
		resp['Link'] = '</todos/?after=%s>; rel=changes-wait' % last_cursor
		return resp
	elif request.method == 'GET':
		after = request.GET.get('after')
		wait = request.META.get('HTTP_WAIT')
		if wait:
			wait = int(wait)
		if after:
			try:
				items, last_cursor = TodoItem.get_after(after)
			except TodoItem.DoesNotExist:
				return HttpResponseNotFound()
		else:
			items, last_cursor = TodoItem.get_all()
		resp = _list_response(items)
		resp['Link'] = '</todos/?after=%s>; rel=changes-wait' % last_cursor
		if len(items) == 0 and wait:
			set_hold_longpoll(request, Channel('todos', prev_id=last_cursor), timeout=wait)
		return resp
	elif request.method == 'POST':
		params = json.loads(request.body)
		i = TodoItem()
		if 'text' in params:
			i.text = params['text']
		if 'completed' in params:
			if not isinstance(params['completed'], bool):
				raise HttpResponseBadRequest()
			i.completed = params['completed']
		cursor, prev_cursor = i.save()
		if cursor != prev_cursor:
			_publish_item(i, cursor, prev_cursor)
		return _item_response(i)
	else:
		return HttpResponseNotAllowed(['HEAD', 'GET', 'POST'])

def todos_item(request, todo_id):
	try:
		i = TodoItem.get(todo_id)
	except TodoItem.DoesNotExist:
		return HttpResponseNotFound()

	if request.method == 'GET':
		return _item_response(i)
	elif request.method == 'PUT':
		params = json.loads(request.body)
		fields = []
		if 'text' in params:
			i.text = params['text']
			fields.append('text')
		if 'completed' in params:
			if not isinstance(params['completed'], bool):
				raise HttpResponseBadRequest()
			i.completed = params['completed']
			fields.append('completed')
		cursor, prev_cursor = i.save(fields=fields)
		if cursor != prev_cursor:
			_publish_item(i, cursor, prev_cursor)
		return _item_response(i)
	elif request.method == 'DELETE':
		cursor, prev_cursor = i.delete()
		if cursor != prev_cursor:
			_publish_item(i, cursor, prev_cursor)
		return HttpResponse('Deleted\n', content_type='text/plain')
	else:
		return HttpResponseNotAllowed(['GET', 'POST', 'DELETE'])
