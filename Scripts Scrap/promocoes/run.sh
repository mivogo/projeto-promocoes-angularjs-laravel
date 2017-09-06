#!/bin/bash  
PATH=/root/.composer/vendor/bin:/root/.composer/vendor/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin:/snap/bin
echo "Fetching for Products"
./clean.sh
echo "Scrapping Jumbo"
scrapy crawl jumbo -o jumbo.json &> log.jumbo.txt
echo "Scrapping Continente"
scrapy crawl continente -o continente.json &> log.continente.txt
echo "Scrapping Intermarche"
scrapy crawl intermarche -o intermarche.json &> log.intermarche.txt
echo "Converting and sending files to API"
python divide_files.py &> log.divideFiles.txt
echo "Jsons created"