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

def encode_list_id(s):
	if len(s) > 64:
		raise ValueError('list id too long')
	out = ''
	for c in s:
		if c in ('% -'):
			out += '%%%02X' % ord(c)
		else:
			out += c
	return out

class Cursor:
	def __init__(self, cur, prev=None):
		self.cur = cur
		self.prev = prev

class TodoItem(object):
	class DoesNotExist(Exception):
		pass

	class LimitError(Exception):
		pass

	def __init__(self, id=None, list_id=None, text='', completed=False):
		self.id = id
		self.list_id = list_id
		self.deleted = False
		self.text = text
		self.completed = completed
		self.modified = datetime.utcnow()

	# return cursor after write
	def save(self, fields=None):
		list_base = 'todos-%s' % encode_list_id(self.list_id)
		auto_id_key = '%s-auto-id' % list_base
		items_key = '%s-items' % list_base
		items_order_created_key = '%s-items-order-created' % list_base
		events_version_key = '%s-events-version' % list_base
		events_key = '%s-events' % list_base
		events_order_created_key = '%s-events-order-created' % list_base
		if not self.id:
			while True:
				with r.pipeline() as pipe:
					try:
						pipe.watch(auto_id_key)
						pipe.watch(items_key)
						pipe.watch(items_order_created_key)
						pipe.watch(events_version_key)
						pipe.watch(events_key)
						pipe.watch(events_order_created_key)

						if int(pipe.hlen(items_key)) >= 50:
							raise TodoItem.LimitError('maximum item count reached')

						item_id = pipe.get(auto_id_key)
						if item_id:
							item_id = int(item_id) + 1
						else:
							item_id = 1

						version = pipe.get(events_version_key)
						if version:
							version = int(version) + 1
						else:
							version = 1

						prev_version = version - 1
						modified = datetime.utcnow()

						pipe.multi()
						pipe.set(auto_id_key, item_id)
						pipe.hset(items_key, item_id, self.dumps(id=item_id, modified=modified))
						pipe.zadd(items_order_created_key, item_id, item_id)
						pipe.set(events_version_key, version)
						pipe.hset(events_key, version, self.dumps(id=item_id, modified=modified))
						pipe.zadd(events_order_created_key, version, version)
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
						pipe.watch(items_key)
						pipe.watch(events_version_key)
						pipe.watch(events_key)
						pipe.watch(events_order_created_key)

						version = pipe.get(events_version_key)
						if version:
							version = int(version) + 1
						else:
							version = 1

						prev_version = version - 1
						modified = datetime.utcnow()

						if fields:
							i = TodoItem.loads(self.list_id, pipe.hget(items_key, self.id))
							if 'text' in fields:
								i.text = self.text
							if 'completed' in fields:
								i.completed = self.completed
							i.modified = self.modified
						else:
							i = self

						pipe.multi()
						pipe.hset(items_key, i.id, i.dumps(modified=modified))
						pipe.set(events_version_key, version)
						pipe.hset(events_key, version, i.dumps(modified=modified))
						pipe.zadd(events_order_created_key, version, version)
						pipe.execute()
						self.modified = modified
						break
					except redis.WatchError:
						continue
		return Cursor(str(version), str(prev_version))

	# return cursor after write
	def delete(self):
		list_base = 'todos-%s' % encode_list_id(self.list_id)
		items_key = '%s-items' % list_base
		items_order_created_key = '%s-items-order-created' % list_base
		events_version_key = '%s-events-version' % list_base
		events_key = '%s-events' % list_base
		events_order_created_key = '%s-events-order-created' % list_base
		while True:
			with r.pipeline() as pipe:
				try:
					pipe.watch(items_key)
					pipe.watch(items_order_created_key)
					pipe.watch(events_version_key)
					pipe.watch(events_key)
					pipe.watch(events_order_created_key)

					version = pipe.get(events_version_key)
					if version:
						version = int(version) + 1
					else:
						version = 1

					prev_version = version - 1
					modified = datetime.utcnow()

					pipe.multi()
					pipe.hdel(items_key, self.id)
					pipe.zrem(items_order_created_key, self.id)
					pipe.set(events_version_key, version)
					pipe.hset(events_key, version, self.dumps(deleted=True, modified=modified))
					pipe.zadd(events_order_created_key, version, version)
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
	def loads(list_id, s):
		data = json.loads(s)
		i = TodoItem()
		i.id = str(data['id'])
		i.list_id = list_id
		i.deleted = data.get('deleted', False)
		if not i.deleted:
			i.text = data['text']
			i.completed = data.get('completed', False)
		i.modified = dateutil.parser.parse(data['modified-at'])
		return i

	@staticmethod
	def get(list_id, id):
		list_base = 'todos-%s' % encode_list_id(list_id)
		items_key = '%s-items' % list_base
		data_raw = r.hget(items_key, id)
		if not data_raw:
			raise TodoItem.DoesNotExist()
		return TodoItem.loads(list_id, data_raw)

	@staticmethod
	def get_last_cursor(list_id):
		list_base = 'todos-%s' % encode_list_id(list_id)
		events_version_key = '%s-events-version' % list_base
		data_raw = r.get(events_version_key)
		if not data_raw:
			return Cursor(0)
		return Cursor(data_raw)

	# return (items, last cursor)
	@staticmethod
	def get_all(list_id):
		list_base = 'todos-%s' % encode_list_id(list_id)
		items_key = '%s-items' % list_base
		items_order_created_key = '%s-items-order-created' % list_base
		events_version_key = '%s-events-version' % list_base
		while True:
			with r.pipeline() as pipe:
				try:
					pipe.watch(items_key)
					pipe.watch(items_order_created_key)
					pipe.watch(events_version_key)

					version = pipe.get(events_version_key)
					if version:
						version = int(version)
					else:
						version = 0

					item_ids = pipe.zrangebyscore(items_order_created_key, '-inf', '+inf')

					pipe.multi()
					for item_id in item_ids:
						pipe.hget(items_key, item_id)
					ret = pipe.execute()

					items = []
					for item_raw in ret:
						i = TodoItem.loads(list_id, item_raw)
						items.append(i)
					return (items, Cursor(str(version)))
				except redis.WatchError:
					continue

	# return (items, last cursor)
	@staticmethod
	def get_after(list_id, cursor):
		list_base = 'todos-%s' % encode_list_id(list_id)
		events_version_key = '%s-events-version' % list_base
		events_key = '%s-events' % list_base
		events_order_created_key = '%s-events-order-created' % list_base
		while True:
			with r.pipeline() as pipe:
				try:
					pipe.watch(events_version_key)
					pipe.watch(events_key)
					pipe.watch(events_order_created_key)

					version = pipe.get(events_version_key)
					if version:
						version = int(version)
					else:
						version = 0

					event_ids = pipe.zrangebyscore(events_order_created_key, int(cursor) + 1, '+inf')

					pipe.multi()
					for event_id in event_ids:
						pipe.hget(events_key, event_id)
					ret = pipe.execute()

					items = []
					for item_raw in ret:
						i = TodoItem.loads(list_id, item_raw)
						items.append(i)
					return (items, Cursor(str(version)))
				except redis.WatchError:
					continue

	@staticmethod
	def trim(list_id):
		# TODO
		pass

	@staticmethod
	def get_totals(list_id):
		list_base = 'todos-%s' % encode_list_id(list_id)
		items_key = '%s-items' % list_base
		total_completed = 0
		items_raw = r.hgetall(items_key)
		for id, item_raw in items_raw.iteritems():
			i = TodoItem.loads(list_id, item_raw)
			if i.completed:
				total_completed += 1
		total_items = len(items_raw)
		return (total_items, total_completed)
