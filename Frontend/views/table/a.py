from pprint import pprint 
class Solution:
    def maxProfit(self, prices) -> int:
        lst = []
        for i in range(0, len(prices)):
            lst.append({})

        if len(prices) < 2:
            return 0
        lst[0]['min'] = prices[0]
        lst[0]['max'] = -1

        for i in range(1, len(prices)):
            
            if prices[i] == prices[i-1]:

                lst[i]['max'] = lst[i-1]['max']
                lst[i]['min'] = lst[i-1]['min']

                lst[i]['cpy'] = True

                                
                print(prices[i])
                pprint(lst)
                continue


            if (prices[i] > lst[i-1]['max'] and lst[i-1]['max'] != -1):
                lst[i]['min'] = lst[i-1]['min']
                lst[i]['max'] = prices[i]
                lst[i-1]['max'] = -1

            elif lst[i-1]['max'] == -1 and prices[i] > lst[i-1]['min']: 
                lst[i]['min'] = lst[i-1]['min']
                lst[i]['max'] = prices[i]
                
            elif prices[i] < lst[i-1]['max'] and prices[i] >  lst[i-1]['min'] :
                print(prices[i], "SDFSDf")
                print(lst[i-1])
                if 'cpy' in lst[i-1]:
                    print("ppppp")
                    if prices[i] > lst[i-1]['max']:
                        lst[i]['min']  = lst[i-1]['min']
                        lst[i]['max'] = prices[i]
                    else:
                        lst[i]['min']  = lst[i-1]['min']
                        lst[i]['max'] = -1
                else: 
                    lst[i]['min']  = prices[i]
                    lst[i]['max'] = -1
            elif prices[i] < lst[i-1]['min']:
                # if 'cpy' in lst[i-1]:
                #     lst[i]['min']  = lst[i-1]['min']
                #     lst[i]['max'] = prices[i]
                # else: 
                lst[i]['min']  = prices[i]
                lst[i]['max'] = -1
            else:
                
                lst[i]['max'] = -1
                lst[i]['min'] = lst[i-1]['min']
                
            print(prices[i])
            pprint(lst)
    

        last = -123
        for i in range(len(lst)-1, -1, -1 ):
            if lst[i]['min'] in s:
                lst[i]['max'] = -1 
            else: 
                s.add(lst['min'])
            


        profit =0
        last = None
        _min = lst[0]['min']
        for d in lst: 

            if d['max']  > -1  and d['min']  > -1 and "cpy" not in d:
                # print("min", "max", d['min'], d['max'] )
                profit += d['max'] - d['min']
        
            last = d
        pprint(profit)
        pprint(lst)
        return profit
            
                

Solution().maxProfit(
# [1,4,1,4,3,1]
# [8,3,6,2,8,8,8,4,2,0,7,2,9,4,9]
[0,5,5,6,2,1,1,3]
)