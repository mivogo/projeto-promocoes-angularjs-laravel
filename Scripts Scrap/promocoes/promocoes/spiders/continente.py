# encoding: utf-8
import csv
from time import sleep
from scrapy import Spider
from scrapy.http import Request
from scrapy.selector import Selector
from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from pyvirtualdisplay import Display

def unicode_csv_reader(utf8_data, dialect=csv.excel, **kwargs):
    csv_reader = csv.reader(utf8_data, dialect=dialect, **kwargs)
    for row in csv_reader:
        yield [unicode(cell, 'utf-8') for cell in row]

class ContinenteSpider(Spider):
    name = 'continente'
    allowed_domains = ['continente.pt']
    start_urls = (
        'https://www.continente.pt/stores/continente/pt-pt/public/Pages/subcategory.aspx?cat=Frescos-Carne-Talho(eCsf_WebProductCatalog_MegastoreContinenteOnline_Continente_EUR_Colombo_PT)',
    )

    reader = unicode_csv_reader(open("continente_sites.csv"))
    urls = list(reader)
    current_url = 0

    list_of_terms = [
        "emb.",
        "garrafa",
        "pack",
        "1 un =",
        "1 un=",
        "1 un  =",
        "emb,",
        u"Quantidade Mínima =",
        u"Quantidade mínima =",
        u"1 porção =",
        u"1 porção =",
        "1 Bola =",
        "1 bola ="
    ]

    list_of_units = [
        ["un", "un"],
        ["Un", "un"],
        ["gr", "g"],
        ["kg", "kg"],
        ["ml", "ml"],
        ["lt", "l"],
        ["cl", "cl"]
    ]

    def __init__(self):
        self.display = Display(visible=0, size=(1920, 1080))
        self.display.start()
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument('--no-sandbox')
        self.driver = webdriver.Chrome('/usr/local/bin/chromedriver', chrome_options=chrome_options)

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

        # Load page with selenium so we can see the real next pages
        self.driver.get(response.url)
        sleep(5)

        for page in range(int(last_page_number)):

            response = Selector(text=self.driver.page_source)
            page_number += 1

            self.driver.execute_script(
                "window.scrollTo(0, document.body.scrollHeight);")
            sleep(5)

            # Iterate over products found and parse them to parse_product function
            # product_urls = response.xpath('//*[@class="title"]/a/@href').extract()
            # for product_url in product_urls:
            #     product_url = product_url.replace('(eCsf_RetekProductCatalog_MegastoreContinenteOnline_Continente)', '')
            # yield Request(product_url, callbak=self.parse_product,
            # dont_filter=True)

            products = response.xpath('//div[@class="productItem"]')

            for product in products:

                link = product.xpath(
                    './/div[@class="productBoxTop"]/div[@class="containerImage"]/div[@class="image"]/a/@href').extract_first()

                filter_start = 'ProductId='
                filter_end = '('
                id = link[link.find(filter_start) + len(filter_start):link.rfind(filter_end)]

                image = product.xpath('.//*[@class="containerImage"]/*[@class="image"]/a/img/@src').extract_first()
                if (image == "/Style%20Library/Themes/framework/images/grey.gif"):
                    image = "https://media.continente.pt/Sonae.eGlobal.Presentation.Web.Media/media.axd?resourceSearchType=2&resource=ProductId=" + id + "(eCsf$RetekProductCatalog$MegastoreContinenteOnline$Continente)&siteId=1&channelId=1&width=150&height=150&defaultOptions=1"

                price_1 = product.xpath('.//*[@class="priceFirstRow"]/text()').extract_first().split(u"€")[1].replace(
                    ",", ".").strip()
                price_1_type = product.xpath('.//*[@class="priceFirstRow"]/span/text()').extract_first().split("/")[1]

                price_2 = product.xpath('.//*[@class="priceSecondRow"]/text()').extract_first(default='None')
                if price_2 is not 'None':
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

                weight = self.parse_unit_type(
                    product.xpath('.//*[@class="containerDescription"]/*[@class="subTitle"]/text()').extract_first())
                if(weight[0]=="None" and price is not "None" and price_per_weight is not "None" and type_of_weight is not "None"):
                    weight = self.calculate_quantity(price,price_per_weight,type_of_weight)

                yield {
                    'Name': product.xpath(
                        './/*[@class="containerDescription"]/*[@class="title"]/a/text()').extract_first().strip(),
                    'Image': image,
                    'Category': self.urls[self.current_url][0],
                    'Sub-Category': self.urls[self.current_url][1],
                    'Price': price,
                    'Price_per_weight': price_per_weight,
                    'Type_of_weight': type_of_weight,
                    'Weight': weight[0],
                    'Weight_Type': weight[1],
                    'Brand': product.xpath(
                        './/*[@class="containerDescription"]/*[@class="type"]/text()').extract_first(),
                    'Link': link,
                    'ID': id

                }

            if (self.current_url + 1) < len(self.urls) and (page_number == int(last_page_number)):
                self.current_url += 1
                next_url = self.urls[self.current_url][2]
                yield Request(next_url)

            try:
                self.driver.find_element_by_xpath('//div[@class="next"]').click()
                sleep(5)

            except NoSuchElementException:
                pass

    def calculate_quantity(self, Price, Price_per_weight, Type_of_weight):
        result = float(float(Price) / float(Price_per_weight))
        try:
            if result >= 1.0:
                if Type_of_weight == "Un" or Type_of_weight == "un":
                    return [round(result, 0), self.transform_unit(Type_of_weight)]
                return [round(result, 1), self.transform_unit(Type_of_weight)]
            if result < 1.0:
                if Type_of_weight == "kg":
                    return [round((result * 1000), 0), "g"]
                if Type_of_weight == "l":
                    return [round((result * 100), 0), "cl"]
            return ["None", "None"]
        except:
            return ["None", "None"]

    def cut_first_part(self, str_to_cut):
        result_string = str_to_cut
        try:
            for term in self.list_of_terms:
                if term in str_to_cut:
                    result_string = str_to_cut.split(term)[1].split('#', 1)[0]
                    return result_string
            return result_string
        except:
            return result_string

    def transform_unit(self,input_unit):
        for unit in self.list_of_units:
            if unit[0] in input_unit:
                return unit[1]
        return input_unit


    def get_weight_type_weight_first(self, str_to_extract):
        weight = ["None", "None"]
        try:
            split_str = str_to_extract.split();
            if "(aprox.)" in str_to_extract:
                if (split_str[-3].isdigit() and split_str[-2].isalpha()):
                    return [float(split_str[-3]), self.transform_unit(split_str[-2])]
            else:
                if (split_str[-2].isdigit() and split_str[-1].isalpha()):
                    return [float(split_str[-2]), self.transform_unit(split_str[-1])]
            return weight
        except:
            return weight

    def get_weight_type_weight_second(self, str_to_extract):
        weight = ["None", "None"]
        try:
            for unit in self.list_of_units:
                if unit[0] in str_to_extract:
                    number_aux = str_to_extract.split(unit[0])[0].replace(",", ".").strip()
                    if "x" in number_aux:
                        number_1 = float(number_aux.split("x")[0])
                        number_2 = float(number_aux.split("x")[1])
                        number = number_1 * number_2
                        return [float(number), unit[1]]
                    if "X" in number_aux:
                        number_1 = float(number_aux.split("X")[0])
                        number_2 = float(number_aux.split("X")[1])
                        number = number_1 * number_2
                        return [float(number), unit[1]]
                    else:
                        number = float(number_aux)
                        return [float(number), unit[1]]
            return weight
        except:
            return weight

    def parse_unit_type(self, str):
        weight = self.get_weight_type_weight_first(str)
        if (weight[0] == "None"):
            new_str = self.cut_first_part(str)
            return self.get_weight_type_weight_second(new_str)
        return weight

    def close(self, reason):
        # closing driver instance once finished with scraping
        self.driver.quit()
        self.display.stop()
