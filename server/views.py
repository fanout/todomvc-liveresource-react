import json
from django.http import HttpResponse, HttpResponseBadRequest, \
	HttpResponseNotAllowed, HttpResponseNotFound
from django.core.urlresolvers import reverse
from gripcontrol import HttpResponseFormat, Channel
from django_grip import set_hold_longpoll, set_hold_stream, publish
from models import TodoItem

def _json_data(data, pretty=True):
	if pretty:
		indent = 4
	else:
		indent = None
	return json.dumps(data, indent=indent)

def _json_response(data, status=200):
	return HttpResponse(_json_data(data) + '\n', status=status,
		content_type='application/json')

def _list_response(items):
	return _json_response([i.to_data() for i in items])

def _item_response(item, status=200):
	return _json_response(item.to_data(), status=status)

def _publish_item(item, cursor):
	body = _json_data([item.to_data()]) + '\n'
	stream_content = _json_data(item.to_data(), False) + '\n'
	headers = {'Link': '</todos/?after=%s>; rel=changes-wait' % id}
	formats = []
	formats.append(HttpResponseFormat(headers=headers, body=body))
	formats.append(HttpStreamFormat(stream_content))
	publish('todos', formats, id=cursor.cur, prev_id=cursor.prev)

def todos(request):
	if request.method == 'OPTIONS':
		return HttpResponse()

	if request.method == 'HEAD':
		last_cursor = TodoItem.get_last_cursor()
		resp = HttpResponse()
		resp['Link'] = '</todos/?after=%s>; rel=changes-wait' % last_cursor
		return resp
	elif request.method == 'GET':
		stream = request.GET.get('stream')
		after = request.GET.get('after')
		wait = request.META.get('HTTP_WAIT')
		if stream:
			stream = (stream == 'true')
		if wait:
			wait = int(wait)

		if stream:
			set_hold_stream(request, Channel('todos'))
			return HttpResponse(content_type='text/plain')
		else:
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
		cursor = i.save()
		if cursor.cur != cursor.prev:
			_publish_item(i, cursor)
		resp = _item_response(i, status=201)
		resp['Location'] = reverse('todos-item', args=[i.id])
		return resp
	else:
		return HttpResponseNotAllowed(['HEAD', 'GET', 'POST'])

def todos_item(request, todo_id):
	if request.method == 'OPTIONS':
		return HttpResponse()

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
		cursor = i.save(fields=fields)
		if cursor.cur != cursor.prev:
			_publish_item(i, cursor)
		return _item_response(i)
	elif request.method == 'DELETE':
		cursor = i.delete()
		if cursor.cur != cursor.prev:
			_publish_item(i, cursor)
		return HttpResponse(status=204)
	else:
		return HttpResponseNotAllowed(['GET', 'POST', 'DELETE'])
