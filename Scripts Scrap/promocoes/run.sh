#!/bin/bash  
echo "Fetching for Products"
./clean.sh
scrapy crawl jumbo -o jumbo.json
scrapy crawl continente -o continente.json
scrapy crawl intermarche -o intermarche.json
./convert.sh
echo "Jsons created"