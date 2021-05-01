from Backend.migrations.database.BaseModel import BaseModel

class CompanyFinacialsModel(BaseModel):
    
    table_name = "COMAPANY_FINANCIALS"
    create_schema = (
        "CREATE TABLE `COMAPANY_FINANCIALS` ("
        "  `Name` varchar(200),"
        "  `Market-Cap` varchar(50),"
        "  `Price-to-Earnings` FLOAT4,"
        "  `Price-to-Book` FLOAT4,"
        "  `Current-Ratio` FLOAT4,"
        "  `Financial-Position` BOOLEAN,"
        "  `Ten-year-growth` BOOLEAN,"
        "  `No-Earnings-Deficit-in-the-Past-Ten-Years` BOOLEAN,"
        "  PRIMARY KEY (`Name`)"
        ")"
    )
    columns = {}
    
    def __init__(self, date=None, data=None, migration=False):

        super().__init__() # call db_interface constructor
        if not migration and date is not None and data is not None:
            self.columns['DATE'] = date
            self.columns['DATA'] = data

            try:
                self._create_instance(self.columns)
            except Exception as e:
                print(f"Insert failed {e}")


        