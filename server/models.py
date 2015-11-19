import os
import urlparse
from datetime import datetime
import dateutil.parser
import json
import redis

redis_url = os.environ.get('REDISCLOUD_URL')
if redis_url:
	url = urlparse.urlparse(redis_url)
	r = redis.Redis(host=url.hostname, port=url.port, password=url.password)
else:
	r = redis.Redis()

class Cursor:
	def __init__(self, cur, prev=None):
		self.cur = cur
		self.prev = prev

class TodoItem(object):
	class DoesNotExist(Exception):
		pass

	class LimitError(Exception):
		pass

	def __init__(self, id=None, text='', completed=False):
		self.id = id
		self.deleted = False
		self.text = text
		self.completed = completed
		self.modified = datetime.utcnow()

	# return cursor after write
	def save(self, fields=None):
		if not self.id:
			if int(r.hlen('todos-items')) >= 50:
				raise TodoItem.LimitError('maximum item count reached')

			self.id = str(r.incr('todos-auto-id'))
			r.hset('todos-items', self.id, self.dumps())
			version = int(r.incr('todos-events-version'))
			prev_version = version - 1
			r.hset('todos-events', version, self.dumps())
			r.zadd('todos-events-order-created', version, version)
		else:
			if fields:
				i = TodoItem.loads(r.hget('todos-items', self.id))
				if 'text' in fields:
					i.text = self.text
				if 'completed' in fields:
					i.completed = self.completed
			else:
				i = self
			r.hset('todos-items', i.id, i.dumps())
			version = int(r.incr('todos-events-version'))
			prev_version = version - 1
			r.hset('todos-events', version, i.dumps())
			r.zadd('todos-events-order-created', version, version)
		return Cursor(str(version), str(prev_version))

	# return cursor after write
	def delete(self):
		r.hdel('todos-items', self.id)
		version = int(r.incr('todos-events-version'))
		prev_version = version - 1
		self.deleted = True
		r.hset('todos-events', version, self.dumps())
		r.zadd('todos-events-order-created', version, version)
		return Cursor(str(version), str(prev_version))

	def to_data(self):
		out = { 'id': self.id }
		if not self.deleted:
			out['text'] = self.text
			out['completed'] = self.completed
		else:
			out['deleted'] = True
		out['modified-time'] = self.modified.isoformat()
		return out

	def dumps(self):
		return json.dumps(self.to_data())

	@staticmethod
	def loads(s):
		data = json.loads(s)
		i = TodoItem()
		i.id = data['id']
		i.deleted = data.get('deleted', False)
		if not i.deleted:
			i.text = data['text']
			i.completed = data.get('completed', False)
		i.modified = dateutil.parser.parse(data['modified-time'])
		return i

	@staticmethod
	def get(id):
		data_raw = r.hget('todos-items', id)
		if not data_raw:
			raise TodoItem.DoesNotExist()
		return TodoItem.loads(data_raw)

	@staticmethod
	def get_last_cursor():
		data_raw = r.get('todos-events-version')
		if not data_raw:
			return Cursor(0)
		return Cursor(data_raw)

	# return (items, last cursor)
	@staticmethod
	def get_all():
		data_raw = r.get('todos-events-version')
		if data_raw:
			version = int(data_raw)
		else:
			version = 0
		event_ids = r.zrangebyscore('todos-events-order-created', '-inf', '+inf')
		items = []
		item_ids = set()
		for event_id in reversed(event_ids):
			i = TodoItem.loads(r.hget('todos-events', event_id))
			if i.id in item_ids:
				# only keep the most recent event per item
				continue
			items.append(i)
			item_ids.add(i.id)
		items.reverse()
		return (items, Cursor(str(version)))

	# return (items, last cursor)
	@staticmethod
	def get_after(cursor):
		data_raw = r.get('todos-events-version')
		if data_raw:
			version = int(data_raw)
		else:
			version = 0
		event_ids = r.zrangebyscore('todos-events-order-created', int(cursor) + 1, '+inf')
		items = []
		for event_id in event_ids:
			i = TodoItem.loads(r.hget('todos-events', event_id))
			items.append(i)
		return (items, Cursor(str(version)))

	@staticmethod
	def trim():
		# TODO
		pass
