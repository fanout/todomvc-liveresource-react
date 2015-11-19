"""
WSGI config for server project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/1.6/howto/deployment/wsgi/
"""

import os
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "server.settings")

from django.core.wsgi import get_wsgi_application
from dj_static import Cling

vars = (
	'DJANGO_SECRET_KEY',
	'DJANGO_DEBUG',
	'GRIP_URL'
)

#application = Cling(get_wsgi_application())
def application(environ, start_response):
	for var in vars:
		if var in environ:
			os.environ[var] = environ[var]
	return Cling(get_wsgi_application()(environ, start_response))
