# encoding: utf-8
import os
import requests

files = ["intermarche.json","continente.json","jumbo.json"]
exported_files = []



def file_len(fname):
    with open(fname) as f:
        for i, l in enumerate(f):
            pass
    return i + 1


def divide_files():
    i = 0
    for file in files:
        if os.path.exists(file):
            input = open(file, 'r').read().split('\n')
            number_of_lines = file_len(file)
            number_of_division = (number_of_lines / 4)+1
            it = 0
            for lines in range(0, len(input), number_of_division):
                outputData = input[lines:lines + number_of_division]
                file_name = file + str(it) + '.json'
                exported_files.append(file_name)
                output = open(file_name,'wb')
                if i is 0:
                    output.write('{ "Retailer": "Intermarche", "Items": ')
                if i is 1:
                    output.write('{ "Retailer": "Continente", "Items": ')
                if i is 2:
                    output.write('{ "Retailer": "Jumbo", "Items": ')
                if (it) is not 0:
                    output.write('[')
                output.write('\n'.join(outputData))
                if (it) is not int(number_of_lines/number_of_division):
                    output.seek(-1, os.SEEK_END)
                    output.truncate()
                    output.write(']')
                output.write('}')
                output.close()
                it += 1
        i += 1

def send_files_to_api():
    url = "http://vps415122.ovh.net/api/products"
    headers = {'Content-Type': 'application/json'}
    for exported_file in exported_files:
        r = requests.post(url, data=open(exported_file, 'rb'), headers=headers, timeout=900)
        print(exported_file+" has finished")
        print(r.ok)
        print(r.raise_for_status())


divide_files()
print(exported_files)
send_files_to_api()