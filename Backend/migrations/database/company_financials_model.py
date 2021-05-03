from .BaseModel import BaseModel

class CompanyFinancialsModel(BaseModel):
    
    table_name = "COMAPANY_FINANCIALS"
    create_schema = (
        "CREATE TABLE `COMAPANY_FINANCIALS` ("
        "  `Name` varchar(200),"
        "  `Market_Cap` varchar(50),"
        "  `Price_to_Earnings` FLOAT(10,4),"
        "  `Price_to_Book` FLOAT(10,4),"
        "  `Current_Ratio` FLOAT(10,4),"
        "  `Financial_Position` BOOLEAN,"
        "  `Uninterupted_Divs` BOOLEAN,"
        "  `Ten_year_growth` BOOLEAN,"
        "  `No_Earnings_Deficit_in_the_Past_Ten_Years` BOOLEAN,"
        "  PRIMARY KEY (`Name`)"
        ")"
    )
    columns = {}
    
    def __init__(self, Name=None, Market_Cap=None, Price_to_Earnings=None, Price_to_Book=None, Current_Ratio=None,
    Financial_Position=None, Ten_year_growth=None, No_Earnings_Deficit_in_the_Past_Ten_Years=None, migration=False):

        super().__init__() # call db_interface constructor
        if not migration and date is not None and data is not None:
            self.columns['Name'] = Name
            self.columns['Market_Cap'] = Price_to_Earnings
            self.columns['Price_to_Book'] = Price_to_Book
            self.columns['Current_Ratio'] = Current_Ratio
            self.columns['Financial_Position'] = Financial_Position
            self.columns['Univterupted_Divs'] = Univterupted_Divs
            self.columns['Ten_year_growth'] = Ten_year_growth
            self.columns['No_Earnings_Deficit_in_the_Past_Ten_Years'] = No_Earnings_Deficit_in_the_Past_Ten_Years

            try:
                self._create_instance(self.columns)
            except Exception as e:
                print(f"Insert failed {e}")


        
