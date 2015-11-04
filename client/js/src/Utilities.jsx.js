class Utilities {
}

Utilities.ajax = function(params) {
    var { method, endpoint, data, beforeSend, success, error } = params;

    var request = new XMLHttpRequest();
    request.open(method, endpoint, true);

    request.onload = function() {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            if (success != null) {
                success(request.responseText);
            }
        } else {
            // We reached our target server, but it returned an error
            if (error != null) {
                error();
            }
        }
    };

    request.onerror = function() {
        if (error != null) {
            error();
        }
    };

    if (beforeSend != null) {
        beforeSend(request);
    }
    request.send(data);
};
