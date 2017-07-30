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

class IntermarcheSpider(Spider):
    name = 'intermarche'
    allowed_domains = ['intermarche.pt']
    start_urls = (
        'https://lojaonline.intermarche.pt/24-guimaraes/rayon/frescos/talho/10152-porco',
    )

    reader = unicode_csv_reader(open("intermarche_sites.csv"))
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
        "1 Bola ="
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
        self.driver = webdriver.Chrome('./chromedriver')

    def parse(self, response):

        # Load page with selenium so we can see the real next pages
        self.driver.get(response.url)
        sleep(5)

        response = Selector(text=self.driver.page_source)

        self.driver.execute_script(
            "window.scrollTo(0, document.body.scrollHeight);")
        sleep(5)

        # Iterate over products found and parse them to parse_product function
        # product_urls = response.xpath('//*[@class="title"]/a/@href').extract()
        # for product_url in product_urls:
        #     product_url = product_url.replace('(eCsf_RetekProductCatalog_MegastoreContinenteOnline_Continente)', '')
        # yield Request(product_url, callbak=self.parse_product,
        # dont_filter=True)


        products = response.xpath('//*[contains(concat( " ", @class, " " ), concat( " ", "border", " " ))]')
        for product in products:

            weight = ["None","None"]
            price_per_weight = "None"
            type_of_weight = 'None'
            try:
                price = product.xpath('./div[@class="vignette_picto_prix"]/div[@class="vignette_prix inline"]//p[1]/text()').extract_first(default="None")
                if price is not "None":
                    price = price.split(u"€")[0].strip().replace(",", ".")

                price_aux = product.xpath('./div[@class="vignette_picto_prix"]/div[@class="vignette_prix inline"]//p[2]/text()').extract_first(default="None")
                if price_aux is not "None":
                    price_per_weight = price_aux.split(u"€")[0].strip().replace(",", ".")
                    type_of_weight =  price_aux.split("/")[1].strip().lower()

                if price is not "None" or price_aux is not "None":
                    weight = self.calculate_quantity(price,price_per_weight,type_of_weight)
                    yield {
                        'Name': product.xpath('./div[@class="vignette_info"]/p[2]/text()').extract_first().strip(),
                        'Image': product.xpath('./div[@class="vignette_img transition js-ouvrir_fiche "]/img/@src').extract_first(),
                        'Category': self.urls[self.current_url][0],
                        'Sub-Category': self.urls[self.current_url][1],
                        'Price': price,
                        'Price_per_weight': price_per_weight,
                        'Type_of_weight': type_of_weight,
                        'Weight': weight[0],
                        'Weight_Type': weight[1],
                        'Brand': product.xpath('./div[@class="vignette_info"]/p[@class="js-marque"]/text()').extract_first(),
                        'Link': self.urls[self.current_url][2],
                        'ID': product.xpath('./div[@class="vignette_footer js-vignette_footer js-vignette_produit_info"]/@idproduit').extract_first()
                    }
            except:
                pass

        if ((self.current_url + 1) < len(self.urls)):
            self.current_url += 1
            next_url = self.urls[self.current_url][2]
            yield Request(next_url)

    def transform_unit(self,input_unit):
        for unit in self.list_of_units:
            if unit[0] in input_unit:
                return unit[1]
        return input_unit

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

    def close(self, reason):
        # closing driver instance once finished with scraping
        self.driver.quit()
        self.display.stop()
