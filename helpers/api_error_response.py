import json

def errorResponse(message):
    return json.loads('{"error": "' + message + '"}')