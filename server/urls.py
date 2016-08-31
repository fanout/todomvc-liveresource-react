from django.conf.urls import patterns, url

urlpatterns = patterns('',
	url(r'^todos/(?P<list_id>[^/]+)/items/$', 'server.views.todos', name='todos'),
	url(r'^todos/(?P<list_id>[^/]+)/items/(?P<item_id>[^/]+)/$', 'server.views.todos_item', name='todos-item'),
)
