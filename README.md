# Live Todo List

Todo list with live updates, based on [TodoMVC](http://todomvc.com/).

Server is a Django app. Frontend uses React and LiveResource. Updates are sent over Fanout Cloud or Pushpin.

There is a public instance available here: [http://todo.fanoutapp.com](http://todo.fanoutapp.com).

## Server setup

Install dependencies:

```sh
virtualenv venv
. venv/bin/activate
pip install -r requirements.txt
```

Redis is used for storage. Either install a Redis server locally, or set `REDIS_HOST` and `REDIS_PORT` environment variables to use an external server.

### Running with Fanout Cloud

Create a `.env` file containing `GRIP_URL`:

```sh
GRIP_URL=https://api.fanout.io/realm/{realm-id}?iss={realm-id}&key=base64:{realm-key}
```

Be sure to replace `{realm-id}` and `{realm-key}` with the values from the Fanout control panel.

In a separate shell, run ngrok for local tunneling:

```sh
ngrok http 8000
```

In the Fanout control panel, set the ngrok host/port as the Origin Server.

Run a local instance of the project:

```sh
python manage.py runserver
```

Requests made to Fanout Cloud should be routed through ngrok to the local instance. Try a test call with curl:

```sh
curl https://{realm-id}.fanoutcdn.com/todos/default/items/
```

Next you need to set up the frontend. See [Frontend setup](#frontend-setup).

### Running with Pushpin

Create a `.env` file containing `GRIP_URL`:

```sh
GRIP_URL=http://localhost:5561
```

Run Pushpin:

```sh
pushpin --route="* localhost:8000"
```

Run the server:

```sh
python manage.py runserver
```

Next you need to set up the frontend. See [Frontend setup](#frontend-setup).

## Frontend setup

Build the frontend code:

```sh
cd client
npm install
```

Edit `js/src/Constants.js` and change the `API_ENDPOINT_BASE` to point to the location of the server. For Fanout Cloud, that would be something like https://{realm-id}.fanoutcdn.com/ . For Pushpin that would be something like http://localhost:7999 .

Use a webserver such as Apache or Nginx to serve the `client` directory.

Then open up two browser windows to the served client location. This will load the website and frontend JavaScript code which will then connect to the Django server to read/write todo items.
