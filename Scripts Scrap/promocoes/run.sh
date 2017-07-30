#!/bin/bash  
echo "Fetching for Products"
scrapy crawl jumbo -o jumbo.json
scrapy crawl continente -o continente.json
scrapy crawl intermarche -o intermarche.json
echo "Jsons created"