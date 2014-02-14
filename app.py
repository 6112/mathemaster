import os
from flask import Flask

app = Flask (__name__)

@app.route ('/<path:path>')
def serve ():
  return app.send_static_file (os.path.join ('./', path));