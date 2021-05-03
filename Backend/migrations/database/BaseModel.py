import mysql.connector
from  .db_interface import DBInterface
from mysql.connector import errorcode

class BaseModel(DBInterface): 
    
    table_name = None
    create_schema = None 

    def _create_instance(self, data):
        query = f"INSERT INTO {self.table_name} ("
        first = True
        for key in data.keys():
            if not first:
                query += ", "
            query += key 
            first = False

        query += ")"

        first = True
        query += " VALUES ("
        for key in data.keys():
            if not first:
                query += ", "
            if not (isinstance(data[key], int) or isinstance(data[key], float)):
                query += "'"
                query += data[key]
                query += "'"
            else:
                query += data[key]
            first = False

        query += ")"

        print(query)
        self._change_and_commit(query)

    def _insert_table_if_not_exists(self): 
        table_description = self.create_schema
        try:
            print("Creating table {}: ".format(self.table_name), end='')
            self._change_and_commit(table_description)
        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
                print("already exists.")
            else:
                print(err.msg)
        else:
            print("OK")

    def _force_insert_table(self): 
        table_description = self.create_schema
        print("self.create_schema")
        print(self.create_schema)
        try:
            print("Creating table {}: ".format(self.table_name), end='')
            self._change_and_commit(table_description)
        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:

                print("FAILED\nAlready exists, dropping and recreating table")
                
                self._change_and_commit(f"DROP TABLE {self.table_name}")
                self._change_and_commit(table_description)
            else:
                print(err.msg)
        else:
            print("OK")

