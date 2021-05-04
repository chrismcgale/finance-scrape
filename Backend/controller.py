import csv
from flask import Flask, request, abort
from functools import wraps
import os
from os.path import join, dirname


class Controller:

    def get_data(self):
        col_names = []
        rows = []
        with open('data.csv') as csv_file:
            csv_reader = csv.reader(csv_file, delimiter=',')
            beginning_line = True

            for row in csv_reader:
                if beginning_line:
                    col_names = row
                    beginning_line = False
                else:
                    rows.append(row)

        assert len(col_names) > 0 and len(rows) > 0

        return {
            "col_names" : col_names, 
            "rows" : rows
        }

    ''' API route decorator '''
    @staticmethod
    def require_appkey(view_function):
        @wraps(view_function)
        def decorated_function(*args, **kwargs):
            if request.args.get('key') and request.args.get('key') == os.environ['API_KEY']:
                return view_function(*args, **kwargs)
            else:
                abort(401)
        return decorated_function
