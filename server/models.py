import uuid
#import redis

class TodoItem(object):
	class DoesNotExist(Exception):
		pass

	def __init__(self, id=None, text='', completed=False):
		self.id = id
		self.deleted = False
		self.text = text
		self.completed = completed

	# return (cursor, prev cursor) after write
	def save(self, fields=None):
		# TODO: append
		if not self.id:
			self.id = str(uuid.uuid4())
		return ('', '')

	# return (cursor, prev cursor) after write
	def delete(self):
		# TODO: delete
		return ('', '')

	def to_data(self):
		out = { 'id': self.id }
		if not self.deleted:
			out['text'] = self.text
			out['completed'] = self.completed
		else:
			out['deleted'] = True
		return out

	@staticmethod
	def get(id):
		i = TodoItem()
		i.id = id
		i.text = 'eat apples'
		return i

	@staticmethod
	def get_last_cursor():
		# TODO
		return 'fakecursor'

	# return (items, last cursor)
	@staticmethod
	def get_all():
		# TODO
		items = []
		for text in ('chop apples', 'peel bananas', 'pit cherries'):
			i = TodoItem()
			i.id = str(uuid.uuid4())
			i.text = text
			items.append(i)
		items[0].completed = True
		return (items, 'fakecursor')

	# return (items, last cursor)
	@staticmethod
	def get_after(cursor):
		# TODO
		return ([], 'fakecursor')

	@staticmethod
	def trim():
		# TODO
		pass
