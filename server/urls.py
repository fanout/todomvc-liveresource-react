from django.conf.urls import patterns, url

urlpatterns = patterns('',
	url(r'^todos/$', 'server.views.todos', name='todos'),
	url(r'^todos/(?P<todo_id>[^/]+)/$', 'server.views.todos_item', name='todos_item'),
)
