#!/bin/bash  
echo "Converting Json Files"
{ echo -n '{ "Retailer": "Continente", "Items": '; cat continente.json; } > continente.json.new
mv continente.json{.new,}
echo '}' >> continente.json
{ echo -n '{ "Retailer": "Jumbo", "Items": '; cat jumbo.json; } > jumbo.json.new
mv jumbo.json{.new,}
echo '}' >> jumbo.json
{ echo -n '{ "Retailer": "Intermarche", "Items": '; cat intermarche.json; } > intermarche.json.new
mv intermarche.json{.new,}
echo '}' >> intermarche.json