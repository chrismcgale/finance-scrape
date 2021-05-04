import os
import json
from flask import jsonify, Response, request, has_request_context, make_response, Flask
from os.path import join, dirname
from controller import Controller
from dotenv import load_dotenv
from flask_cors import CORS, cross_origin
from waitress import serve
load_dotenv(join(dirname(__file__), '.env'))


controller = Controller()
app = Flask(__name__)
CORS(app, support_credentials=True)


@app.route("/")
@cross_origin(supports_credentials=True)
@Controller.require_appkey
def welcome_text():
    return "This is authenticated server :)"


@app.route("/finacial_data", methods=['GET'])
@cross_origin(supports_credentials=True)
@Controller.require_appkey
def get_data():
    
    data = controller.get_data()
    response = app.response_class(
        response=json.dumps(data),
        status=200,
        mimetype='application/json'
    )


    return response


if __name__ == '__main__':
    print('Server is ready on localhost:5000 !!')
    app.run(port=5000)
    # serve(app, host="0.0.0.0", port=5000)
