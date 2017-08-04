# encoding: utf-8
import os
import requests

files = ["intermarche.json","continente.json","jumbo.json"]



def file_len(fname):
    with open(fname) as f:
        for i, l in enumerate(f):
            pass
    return i + 1


def divide_files():
    i = 0
    for file in files:
        try:
            if os.path.exists(file):
                input = open(file, 'r').read().split('\n')
                number_of_lines = file_len(file)
                number_of_division = (number_of_lines / 4)
                it = 1
                for lines in range(0, len(input), number_of_division):
                    outputData = input[lines:lines + number_of_division]
                    output = open(file + str(it) + '.json','wb')
                    if i is 0:
                        output.write('{ "Retailer": "Intermarche", "Items": ')
                    if i is 1:
                        output.write('{ "Retailer": "Continente", "Items": ')
                    if i is 2:
                        output.write('{ "Retailer": "Jumbo", "Items": ')
                    if (it-1) is not 0:
                        output.write('[')
                    output.write('\n'.join(outputData))
                    if (it-1) is not int(number_of_lines/number_of_division):
                        output.seek(-1, os.SEEK_END)
                        output.truncate()
                        output.write(']')
                    output.write('}')
                    output.close()
                    it += 1
            i+=1
        except:
            i+=1
            pass

def send_files_to_api():
    url = "http://vps415122.ovh.net/api/products"
    headers = {'Content-Type': 'application/json'}




divide_files()
