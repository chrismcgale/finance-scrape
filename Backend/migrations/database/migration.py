import os
import sys
from database.server_model import Server
from database.historical_server_data_model import HistoricalServerData

class Migration:

    def _run(self):
        # server = Server(migration=True)
        # server._insert_table_if_not_exists()

        # historical_server_data = HistoricalServerData(migration=True)
        # historical_server_data._insert_table_if_not_exists()