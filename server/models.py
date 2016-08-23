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
			while True:
				with r.pipeline() as pipe:
					try:
						pipe.watch('todos-auto-id')
						pipe.watch('todos-items')
						pipe.watch('todos-items-order-created')
						pipe.watch('todos-events-version')
						pipe.watch('todos-events')
						pipe.watch('todos-events-order-created')

						if int(pipe.hlen('todos-items')) >= 50:
							raise TodoItem.LimitError('maximum item count reached')

						item_id = pipe.get('todos-auto-id')
						if item_id:
							item_id = int(item_id) + 1
						else:
							item_id = 1

						version = pipe.get('todos-events-version')
						if version:
							version = int(version) + 1
						else:
							version = 1

						prev_version = version - 1
						modified = datetime.utcnow()

						pipe.multi()
						pipe.set('todos-auto-id', item_id)
						pipe.hset('todos-items', item_id, self.dumps(id=item_id, modified=modified))
						pipe.zadd('todos-items-order-created', item_id, item_id)
						pipe.set('todos-events-version', version)
						pipe.hset('todos-events', version, self.dumps(id=item_id, modified=modified))
						pipe.zadd('todos-events-order-created', version, version)
						pipe.execute()
						self.id = str(item_id)
						self.modified = modified
						break
					except redis.WatchError:
						continue
		else:
			while True:
				with r.pipeline() as pipe:
					try:
						pipe.watch('todos-items')
						pipe.watch('todos-events-version')
						pipe.watch('todos-events')
						pipe.watch('todos-events-order-created')

						version = pipe.get('todos-events-version')
						if version:
							version = int(version) + 1
						else:
							version = 1

						prev_version = version - 1
						modified = datetime.utcnow()

						if fields:
							i = TodoItem.loads(pipe.hget('todos-items', self.id))
							if 'text' in fields:
								i.text = self.text
							if 'completed' in fields:
								i.completed = self.completed
							i.modified = self.modified
						else:
							i = self

						pipe.multi()
						pipe.hset('todos-items', i.id, i.dumps(modified=modified))
						pipe.set('todos-events-version', version)
						pipe.hset('todos-events', version, i.dumps(modified=modified))
						pipe.zadd('todos-events-order-created', version, version)
						pipe.execute()
						self.modified = modified
						break
					except redis.WatchError:
						continue
		return Cursor(str(version), str(prev_version))

	# return cursor after write
	def delete(self):
		while True:
			with r.pipeline() as pipe:
				try:
					pipe.watch('todos-items')
					pipe.watch('todos-items-order-created')
					pipe.watch('todos-events-version')
					pipe.watch('todos-events')
					pipe.watch('todos-events-order-created')

					version = pipe.get('todos-events-version')
					if version:
						version = int(version) + 1
					else:
						version = 1

					prev_version = version - 1
					modified = datetime.utcnow()

					pipe.multi()
					pipe.hdel('todos-items', self.id)
					pipe.zrem('todos-items-order-created', self.id)
					pipe.set('todos-events-version', version)
					pipe.hset('todos-events', version, self.dumps(deleted=True, modified=modified))
					pipe.zadd('todos-events-order-created', version, version)
					pipe.execute()
					self.deleted = True
					self.modified = modified
					break
				except redis.WatchError:
					continue
		return Cursor(str(version), str(prev_version))

	def to_data(self):
		out = { 'id': self.id }
		if not self.deleted:
			out['text'] = self.text
			out['completed'] = self.completed
		else:
			out['deleted'] = True
		out['modified-at'] = self.modified.isoformat()
		return out

	def dumps(self, id=None, deleted=None, modified=None):
		data = self.to_data()
		if id:
			data['id'] = id
		if deleted is not None and deleted == True:
			data['deleted'] = True
			if 'text' in data:
				del data['text']
			if 'completed' in data:
				del data['completed']
		if modified:
			data['modified-at'] = modified.isoformat()
		return json.dumps(data)

	@staticmethod
	def loads(s):
		data = json.loads(s)
		i = TodoItem()
		i.id = str(data['id'])
		i.deleted = data.get('deleted', False)
		if not i.deleted:
			i.text = data['text']
			i.completed = data.get('completed', False)
		i.modified = dateutil.parser.parse(data['modified-at'])
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
		while True:
			with r.pipeline() as pipe:
				try:
					pipe.watch('todos-items')
					pipe.watch('todos-items-order-created')
					pipe.watch('todos-events-version')

					version = pipe.get('todos-events-version')
					if version:
						version = int(version)
					else:
						version = 0

					item_ids = pipe.zrangebyscore('todos-items-order-created', '-inf', '+inf')

					pipe.multi()
					for item_id in item_ids:
						pipe.hget('todos-items', item_id)
					ret = pipe.execute()

					items = []
					for item_raw in ret:
						i = TodoItem.loads(item_raw)
						items.append(i)
					return (items, Cursor(str(version)))
				except redis.WatchError:
					continue

	# return (items, last cursor)
	@staticmethod
	def get_after(cursor):
		while True:
			with r.pipeline() as pipe:
				try:
					pipe.watch('todos-events-version')
					pipe.watch('todos-events')
					pipe.watch('todos-events-order-created')

					version = pipe.get('todos-events-version')
					if version:
						version = int(version)
					else:
						version = 0

					event_ids = pipe.zrangebyscore('todos-events-order-created', int(cursor) + 1, '+inf')

					pipe.multi()
					for event_id in event_ids:
						pipe.hget('todos-events', event_id)
					ret = pipe.execute()

					items = []
					for item_raw in ret:
						i = TodoItem.loads(item_raw)
						items.append(i)
					return (items, Cursor(str(version)))
				except redis.WatchError:
					continue

	@staticmethod
	def trim():
		# TODO
		pass

	@staticmethod
	def get_totals():
		total_completed = 0
		items_raw = r.hgetall('todos-items')
		for id, item_raw in items_raw.iteritems():
			i = TodoItem.loads(item_raw)
			if i.completed:
				total_completed += 1
		total_items = len(items_raw)
		return (total_items, total_completed)
