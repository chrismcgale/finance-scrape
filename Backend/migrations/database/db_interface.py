import json 
import mysql.connector


class DBInterface: 
    def __init__(self):
        self._start_db_engine()

    def _start_db_engine(self):
        print("Initializing DB interface ... ")
        with open("database/db_credentials.json") as f:
            data = json.load(f)
        
        self.cnx = mysql.connector.connect(user=data['user'], password=data['password'],
                    host=data['host'],
                    database=data['database'])
        self.cursor =self.cnx.cursor()

    def _change_and_commit(self, query, query_data=None): # i.e. inser, update drop statements
        if query_data is not None:
            self.cursor.execute(query, query_data)
        else:
            print(query)
            self.cursor.execute(query)
        self.cnx.commit()
    
    def _select_query(self, query):
        self.cursor.execute(query)
        return self.cursor.fetchall()
        
    def _cleanup(self): # cleanup, closes all open connections 
        try:
            self.cursor.close()
            self.cnx.close()
        except:
            print(f"Error: No valid connection to close")