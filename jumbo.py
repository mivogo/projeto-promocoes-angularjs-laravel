# -*- coding: utf-8 -*-
import scrapy
import itertools    
import re

class JumboSpider(scrapy.Spider):
    name = "jumbospider"
    start_urls = [
            'https://www.jumbo.pt/Frontoffice/search/auchan/produtos_frescos#?ps=90&st=4&sd=1',
        ]

    def teste(self,str):
        return (str.isalpha() or str.isspace())

    def getQtdLqd(self,str):
        resto_nome = ""

        # Caso tenha unidades
        if "Un." in str:
            str = str.split('Un.',1)[1].split('#',1)[0]
            resto_nome = str.split('Un.',1)[0]

        elif "un." in str:
            str = str.split('un.',1)[1].split('#',1)[0]
            resto_nome = str.split('un.',1)[0]
        else:
            resto_nome = "".join(itertools.takewhile(self.teste, str))
            str = str.split(resto_nome,1)[1].split('#',1)[0]
            print("DEBUG STR "+str)

        # Identifica e guarda a unidade da quantidade
        if "gr" or "GR" or "G" in str:
            unidade = "gr"

        # Se tiver uma soma para qualquer a quantidade total faz a conta aqui e guarda no quantidade
        if "+" in str:
            num1 = float(str.split('+',1)[0])
            num2 = float(str.split('+',1)[1].split(' ',1)[0])
            quantidade = num1 + num2
        elif "X" in str:
            num1 = float(str.split('X',1)[0])
            num2 = float(str.split('X',1)[1].split(' ',1)[0])
            quantidade = num1 * num2
        elif any(char.isdigit() for char in str):
            quantidade = re.findall("\d+",str)[0]
            print("DEBUG QUANTIDADE "+quantidade)

        return;


    def parse(self, response):
        for produto in response.css('#divDataList .row'):
            print("Pedro 1")
            pedro = produto.css("h3::text").extract()[1]
            print "Debug Pedro - " + pedro.encode('utf-8');
            self.getQtdLqd(pedro)
            yield{
            'Nome': produto.css("h3::text").extract()[0],
            'Qtd-Lqd': produto.css("h3::text").extract()[1],
            }
        


