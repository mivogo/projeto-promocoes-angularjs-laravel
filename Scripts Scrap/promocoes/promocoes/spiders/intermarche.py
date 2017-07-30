# -*- coding: utf-8 -*-
import csv
from time import sleep

from scrapy import Spider
from scrapy.http import Request
from scrapy.selector import Selector
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException


class JumboSpider(Spider):
    name = 'jumbo'
    allowed_domains = ['jumbo.pt']
    start_urls = (
        'https://www.jumbo.pt/Frontoffice/produtos_frescos/talho#pn=1',
    )

    with open('jumbo_sites.csv', 'rb') as f:
        reader = csv.reader(f)
        urls = list(reader)
    current_url = 0

    def __init__(self):
        self.driver = webdriver.Chrome('/home/pedro/Documents/chromedriver')

    def parse(self, response):

        self.driver.get(response.url)
        response = Selector(text=self.driver.page_source)
        # with this we get number 60, so we will iterate over 60 pages of
        # results
        try:
            last_page_number = response.xpath(
                '//li[@class="page"]/a/text()')[-1].extract()
        except:
            last_page_number = 1
            pass

        page_number = 0

        # print "Debug: "+last_page_number
        # Load page with selenium so we can see the real next pages

        sleep(10)

        for page in range(int(last_page_number)):

            response = Selector(text=self.driver.page_source)
            page_number += 1
            sleep(10)

            # Iterate over products found and parse them to parse_product function
            # product_urls = response.xpath('//*[@class="title"]/a/@href').extract()
            # for product_url in product_urls:
            #     product_url = product_url.replace('(eCsf_RetekProductCatalog_MegastoreContinenteOnline_Continente)', '')
            # yield Request(product_url, callbak=self.parse_product,
            # dont_filter=True)

            products = response.xpath('//div[@class="product-item-border"]')

            for product in products:
                price_per_weight = product.xpath(
                    './/*[contains(concat( " ", @class, " " ), concat( " ", "product-item-quantity-price", " " ))]/text()').extract_first().split(
                    u"€")[1].split("/")[0].replace(",", ".")
                type_of_weight = product.xpath(
                    './/*[contains(concat( " ", @class, " " ), concat( " ", "product-item-quantity-price", " " ))]/text()').extract_first().split(
                    u"€")[1].split("/")[1]
                price = product.xpath(
                    './/*[contains(concat( " ", @class, " " ), concat( " ", "product-item-price", " " ))]/text()').extract()[
                    0].strip().split(u"€")[1].replace(",", ".")
                link = "https://www.jumbo.pt" + \
                       product.xpath(
                           './/div[@class="product-item-header"]/a/@href').extract_first()
                weight = self.extract_quantity(product.xpath(
                    "(./div[@class='row']/div[@class='product-item-header-column col-xs-8 col-sm-12']/div[@class='product-item-header']/a/h3/text())[2]").extract_first())
                if weight[0] == "None":
                    weight = self.extract_quantity(product.xpath(
                        "(./div[@class='row']/div[@class='product-item-header-column col-xs-8 col-sm-12']/div[@class='product-item-header']/a/h3/text())[1]").extract_first())
                if weight[0] == "None":
                    weight = self.calculate_quantity(
                        price, price_per_weight, type_of_weight)
                yield {
                    'Name': product.xpath(
                        "(./div[@class='row']/div[@class='product-item-header-column col-xs-8 col-sm-12']/div[@class='product-item-header']/a/h3/text())[1]").extract_first(),
                    'Price': price,
                    'Image': product.xpath(".//img[@class='product-item-image visible-print']/@src").extract_first(),
                    'Link': link,
                    'Brand': product.xpath(
                        './/*[contains(concat( " ", @class, " " ), concat( " ", "product-item-brand", " " ))]/text()').extract_first(
                        default='Jumbo'),
                    'Category': self.urls[self.current_url][0],
                    'Sub-Category': self.urls[self.current_url][1],
                    'Weight': weight[0],
                    'Weight_Type': weight[1],
                    'Price_per_weight': price_per_weight,
                    'Type_of_weight': type_of_weight,
                    'ID': product.xpath('.//input[@name="Id"]/@value').extract_first()
                }

            print "\nCurrent Url: %d\n" % self.current_url

            print "Page Number %d" % page_number
            print "Last Page Number %d" % int(last_page_number)

            if (self.current_url + 1) < len(self.urls) and (page_number == int(last_page_number)):
                self.current_url += 1
                next_url = self.urls[self.current_url][2]
                yield Request(next_url)

            try:
                self.driver.find_element_by_xpath(
                    '//li[@class="next"]/a').click()
                sleep(10)

            except NoSuchElementException:
                pass

    def only_numerics(self, seq):
        return filter(type(seq).isdigit, seq)

    def teste(self, str):
        return (not (str.isdigit()))

    def hasNumbers(self, inputString):
        return any(char.isdigit() for char in inputString)

    def extract_quantity(self, str):
        try:
            split_input = str.split()
            print("STR")
            print(split_input)
            print(split_input[-1])
            print(self.hasNumbers(split_input[-1]))
            if split_input[-2].isdigit():
                if "Kg" in split_input[-1] or "kg" in split_input[-1] or "KG" in split_input[-1]:
                    return [split_input[-2], "kg"]
                if "g" in split_input[-1] or "G" in split_input[-1] or "Gr" in split_input[-1] or "gr" in \
                        split_input[-1] or "GR" in split_input[-1]:
                    return [split_input[-2], "g"]
                if "cl" in split_input[-1] or "CL" in split_input[-1] or "Cl" in split_input[-1]:
                    return [split_input[-2], "cl"]
                if "l" in split_input[-1] or "L" in split_input[-1] or "LT" in split_input[-1] or "lt" in \
                        split_input[-1] or "Lt" in split_input[-1]:
                    return [split_input[-2], "l"]
            if self.hasNumbers(split_input[-1]):
                print("ENTREI")
                weight = self.only_numerics(split_input[-1])
                print(weight)
                type_weight = split_input[-1].split(weight)
                print(type_weight)
                if "Kg" in type_weight or "kg" in type_weight or "KG" in type_weight:
                    return [weight, "kg"]
                if "g" in type_weight or "G" in type_weight or "Gr" in type_weight or "gr" in type_weight or "GR" in type_weight:
                    return [weight, "g"]
                if "cl" in type_weight or "CL" in type_weight or "Cl" in type_weight:
                    return [weight, "cl"]
                if "l" in type_weight or "L" in type_weight or "LT" in type_weight or "lt" in type_weight or "Lt" in type_weight:
                    return [weight, "l"]
            if "#" in str:
                print("ENTREI")
                weight = self.only_numerics(split_input[-2])
                print(weight)
                type_weight = split_input[-2].split(weight)
                print(type_weight)
                if "Kg" in type_weight or "kg" in type_weight or "KG" in type_weight:
                    return [weight, "kg"]
                if "g" in type_weight or "G" in type_weight or "Gr" in type_weight or "gr" in type_weight or "GR" in type_weight:
                    return [weight, "g"]
                if "cl" in type_weight or "CL" in type_weight or "Cl" in type_weight:
                    return [weight, "cl"]
                if "l" in type_weight or "L" in type_weight or "LT" in type_weight or "lt" in type_weight or "Lt" in type_weight:
                    return [weight, "l"]
                return ["None", "None"]
        except:
            return ["None", "None"]
        return ["None", "None"]

    def calculate_quantity(self, Price, Price_per_weight, Type_of_weight):
        result = float(float(Price) / float(Price_per_weight))
        if result >= 1.0:
            if Type_of_weight == "Un" or Type_of_weight == "un":
                return [round(result, 0), Type_of_weight]
            return [round(result, 1), Type_of_weight]
        if result < 1.0:
            if Type_of_weight == "kg":
                return [round((result * 1000), 0), "g"]
            if Type_of_weight == "l":
                return [round((result * 100), 0), "cl"]
        return ["None", "None"]

    def close(self, reason):
        # closing driver instance once finished with scraping
        self.driver.quit()