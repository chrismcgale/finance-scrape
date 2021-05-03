import os
import sys
from database.company_financials_model import CompanyFinancialsModel

class Migration:

    def _run(self):

        model = CompanyFinancialsModel(migration=True)
        model._insert_table_if_not_exists()
        


Migration()._run()