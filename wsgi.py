from server.app import app
import os
 
if __name__ == "__main__":
    port = int(os.environ.get('PORT', 5000))
    app.run(use_reloader=True, port=port, threaded=True)