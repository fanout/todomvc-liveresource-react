from django.conf.urls import patterns, url

urlpatterns = patterns('',
    url(r'^$', 'server.views.home', name='home'),
)
