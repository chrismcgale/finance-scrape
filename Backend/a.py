import requests




res = requests.get(
    url="http://localhost:5000/finacial_data?key=78a36aa06207dfae148c073190ba2468f7bde241c1c3db313204d6f5e40d1888b46c01301809d8c3", 
    # params={"key" : "78a36aa06207dfae148c073190ba2468f7bde241c1c3db313204d6f5e40d1888b46c01301809d8c3"}
)
print(res.status_code)
print(res.text)


print("SDFSDFSDF")