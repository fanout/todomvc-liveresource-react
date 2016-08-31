import json
from copy import deepcopy
from django.http import HttpResponse, HttpResponseBadRequest, \
	HttpResponseForbidden, HttpResponseNotAllowed, HttpResponseNotFound
from django.core.urlresolvers import reverse
from gripcontrol import HttpResponseFormat, HttpStreamFormat, Channel
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

def _changes_link(list_id, change_id):
	return '</todos/%s/items/?after_change=%s>; rel=changes-wait' % (list_id, change_id)

def _publish_item(list_id, item, cursor):
	total, completed = TodoItem.get_totals(list_id)

	data = item.to_data()
	data['total-items'] = total
	data['total-completed'] = completed

	body = _json_data([data]) + '\n'
	stream_data = deepcopy(data)
	stream_data['change-id'] = str(cursor.cur)
	stream_content = _json_data(stream_data, False) + '\n'
	headers = {'Link': _changes_link(list_id, cursor.cur)}
	formats = []
	formats.append(HttpResponseFormat(headers=headers, body=body))
	formats.append(HttpStreamFormat(stream_content))
	publish('todos', formats, id='%s-%s' % (list_id, cursor.cur), prev_id='%s-%s' % (list_id, cursor.prev))

def todos(request, list_id):
	if request.method == 'OPTIONS':
		resp = HttpResponse()
		resp['Access-Control-Max-Age'] = '3600'
		return resp

	if request.method == 'HEAD':
		last_cursor = TodoItem.get_last_cursor(list_id)
		resp = HttpResponse()
		resp['Link'] = _changes_link(list_id, last_cursor.cur)
		return resp
	elif request.method == 'GET':
		stream = request.GET.get('stream')
		after = request.GET.get('after_change')
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
					items, last_cursor = TodoItem.get_after(list_id, after)
				except TodoItem.DoesNotExist:
					return HttpResponseNotFound()
			else:
				items, last_cursor = TodoItem.get_all(list_id)
			resp = _list_response(items)
			resp['Link'] = _changes_link(list_id, last_cursor.cur)
			if len(items) == 0 and wait:
				set_hold_longpoll(request, Channel('todos', prev_id='%s-%s' % (list_id, last_cursor.cur)), timeout=wait)
			return resp
	elif request.method == 'POST':
		params = json.loads(request.body)
		i = TodoItem(list_id=list_id)
		if 'text' in params:
			i.text = params['text']
		if 'completed' in params:
			if not isinstance(params['completed'], bool):
				return HttpResponseBadRequest('completed must be a bool\n', content_type='text/plain')
			i.completed = params['completed']
		try:
			cursor = i.save()
		except TodoItem.LimitError:
			return HttpResponseForbidden('limit reached\n', content_type='text/plain')
		if cursor.cur != cursor.prev:
			_publish_item(list_id, i, cursor)
		resp = _item_response(i, status=201)
		resp['Location'] = reverse('todos-item', args=[list_id, i.id])
		return resp
	else:
		return HttpResponseNotAllowed(['HEAD', 'GET', 'POST'])

def todos_item(request, list_id, item_id):
	if request.method == 'OPTIONS':
		return HttpResponse()

	try:
		i = TodoItem.get(list_id, item_id)
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
			_publish_item(list_id, i, cursor)
		return _item_response(i)
	elif request.method == 'DELETE':
		cursor = i.delete()
		if cursor.cur != cursor.prev:
			_publish_item(list_id, i, cursor)
		return HttpResponse(status=204)
	else:
		return HttpResponseNotAllowed(['GET', 'POST', 'DELETE'])
