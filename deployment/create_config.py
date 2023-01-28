import json
import os
import sys
f = open(sys.argv[1], "w")
f.write("window.APP_CONFIG = " + json.dumps({
    "api": os.environ.get('PUNYSHORT_FRONTEND_API', "https://api.punyshort.ga"),
    "client_id": os.environ.get('PUNYSHORT_FRONTEND_CLIENT_ID', "'uk73m9t0odzewt2'")
}))
f.close()
print("Created config at " + sys.argv[1])