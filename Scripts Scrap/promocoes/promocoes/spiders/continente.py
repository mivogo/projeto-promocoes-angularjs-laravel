# -*- coding: utf-8 -*-
from time import sleep
from scrapy import Spider
from scrapy.http import Request
from scrapy.selector import Selector
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
import csv


class ContinenteSpider(Spider):
    name = 'continente'
    allowed_domains = ['continente.pt']
    start_urls = (
        'https://www.continente.pt/stores/continente/pt-pt/public/Pages/subcategory.aspx?cat=Frescos-Carne-Talho(eCsf_WebProductCatalog_MegastoreContinenteOnline_Continente_EUR_Colombo_PT)',
    )
    with open('continente_sites.csv', 'rb') as f:
        reader = csv.reader(f)
        urls = list(reader)
    current_url = 0

    def __init__(self):
        self.driver = webdriver.Chrome('/home/pedro/Documents/chromedriver')

    def parse(self, response):

        # with this we get number 60, so we will iterate over 60 pages of
        # results
        try:
            last_page_number = response.xpath(
                '//*[@class="pagingInnerArea _asyncPaginationWrapper"]/ul/li/a/text()')[-1].extract()
        except:
            last_page_number = 1
            pass

        page_number = 0

        # print "Debug: "+last_page_number
        # Load page with selenium so we can see the real next pages
        self.driver.get(response.url)
        sleep(10)

        for page in range(int(last_page_number)):

            response = Selector(text=self.driver.page_source)
            page_number += 1

            self.driver.execute_script(
                "window.scrollTo(0, document.body.scrollHeight);")
            sleep(10)

            # Iterate over products found and parse them to parse_product function
            # product_urls = response.xpath('//*[@class="title"]/a/@href').extract()
            # for product_url in product_urls:
            #     product_url = product_url.replace('(eCsf_RetekProductCatalog_MegastoreContinenteOnline_Continente)', '')
            # yield Request(product_url, callbak=self.parse_product,
            # dont_filter=True)

            products = response.xpath('//div[@class="productItem"]')

            for product in products:

                link = product.xpath('.//div[@class="productBoxTop"]/div[@class="containerImage"]/div[@class="image"]/a/@href').extract_first()

                filter_start = 'ProductId='
                filter_end = '('
                id = link[link.find(filter_start)+len(filter_start):link.rfind(filter_end)]


                image = product.xpath('.//*[@class="containerImage"]/*[@class="image"]/a/img/@src').extract_first()
                if(image == "/Style%20Library/Themes/framework/images/grey.gif"):
                    image = "https://media.continente.pt/Sonae.eGlobal.Presentation.Web.Media/media.axd?resourceSearchType=2&resource=ProductId="+id+"(eCsf$RetekProductCatalog$MegastoreContinenteOnline$Continente)&siteId=1&channelId=1&width=150&height=150&defaultOptions=1"


                price_1 = product.xpath('.//*[@class="priceFirstRow"]/text()').extract_first().split(u"€")[1].replace(",", ".").strip()
                price_1_type = product.xpath('.//*[@class="priceFirstRow"]/span/text()').extract_first().split("/")[1]

                price_2 = product.xpath('.//*[@class="priceSecondRow"]/text()').extract_first(default='None')
                if price_2 is not 'None':
                    print(price_2)
                    price_2 = price_2.split(u"€")[1].replace(",", ".").strip()

                price_2_type = product.xpath('.//*[@class="priceSecondRow"]/span/text()').extract_first(default='None')
                if price_2_type is not 'None':
                    price_2_type = price_2_type.split("/")[1]

                price_per_weight = "None"
                type_of_weight = "None"
                price = "None"
                if "un" in price_1_type:
                    price = price_1
                    if price_2 is not 'None':
                        price_per_weight = price_2
                        type_of_weight = price_2_type
                if "un" in price_2_type:
                    price = price_2
                    price_per_weight = price_1
                    type_of_weight = price_1_type

                if price is "None":
                    price_per_weight = price_1
                    type_of_weight = price_1_type

                weight = self.parse_unit_type(product.xpath('.//*[@class="containerDescription"]/*[@class="subTitle"]/text()').extract_first())

                yield{

                    'Name': product.xpath('.//*[@class="containerDescription"]/*[@class="title"]/a/text()').extract_first().strip(),
                    'Image': image,
                    'Category': self.urls[self.current_url][0],
                    'Sub-Category': self.urls[self.current_url][1],
                    'Price': price,
                    'Price_per_weight': price_per_weight,
                    'Type_of_weight': type_of_weight,
                    'Weight':weight[0],
                    'Weight_Type': weight[1],
                    'Brand': product.xpath('.//*[@class="containerDescription"]/*[@class="type"]/text()').extract_first(),
                    'Link': link,
                    'ID': id

                }

            print "\nCurrent Url: %d\n" % self.current_url

            print "Page Number %d" % page_number
            print "Last Page Number %d" % int(last_page_number)

            try:
                self.driver.find_element_by_xpath(
                    u'//div[text()="Próxima"]').click()
                sleep(10)

            except NoSuchElementException:
                # If there are any urls left from the list of urls it proceeds
                # to the next one and changes the category
                if (self.current_url + 1) < len(self.urls) and (page_number == int(last_page_number)):
                    self.current_url += 1
                    next_url = self.urls[self.current_url][2]
                    yield Request(next_url)

    def parse_unit_type(self, str):
        f = open('result.txt', 'w')
        if "emb." in str:
            new_str = str.split('emb.')[1].split('#', 1)[0]
        elif "garrafa" in str:
            new_str = str.split('garrafa')[1].split('#', 1)[0]
        elif "pack" in str:
            new_str = str.split('pack')[1].split('#', 1)[0]
        elif "1 un =" in str:
            new_str = str.split('1 un =')[1].split('#', 1)[0]
        elif "1 un=" in str:
            new_str = str.split('1 un=')[1].split('#', 1)[0]
        elif "1 un  =" in str:
            new_str = str.split('1 un  =')[1].split('#', 1)[0]
        elif u"Quantidade Mínima =" in str:
            new_str = str.split(u'Quantidade Mínima =')[1].split('#', 1)[0]
        else:
            f.write('Teste 1: ' + str.encode('utf-8'))
            new_str = str
        f.close()

        print("\n New_Str")
        print(new_str)

        f = open('result.txt', 'w')
        if "gr" in new_str:
            return [float(new_str.split("gr")[0].replace(",", ".").strip()),"gr"]
        if "kg" in new_str:
            return [float(new_str.split("kg")[0].replace(",", ".").strip()), "kg"]
        elif "ml" in new_str:
            return [float(new_str.split("ml")[0].replace(",", ".").strip()), "ml"]
        elif "lt" in new_str:
            return [float(new_str.split("lt")[0].replace(",", ".").strip()), "l"]
        elif "cl" in new_str:
            return [float(new_str.split("cl")[0].replace(",", ".").strip()), "cl"]
        else:
            f.write('Teste 2: ' + new_str.encode('utf-8'))

        f.close()

        return 'none'

    def close(self, reason):
        # closing driver instance once finished with scraping
        self.driver.quit()
