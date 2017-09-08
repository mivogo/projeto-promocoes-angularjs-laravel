'use strict';

app.factory('PDFFactory', function(AuthService) {

	var pdfFactory = {};

	pdfFactory.createProductListPDF = function (list, retailerName, totalCost) {
		var dd = {      
			pageSize: 'A4',

			content: 
			[
			{ text: "Lista de produtos do "+retailerName, style: 'firstLine'},
			{ text: '\n\n', style: 'secondLine' },                 
			table(list, ['name', 'brand', 'price','quantity','total']),
			{ text: '\n', style: 'secondLine' },
			{ text: 'Total '+(Math.round(totalCost * 100) / 100)+' €', style: 'totalLine'},    
			],

			styles: {
				firstLine: {
					fontSize: 30,
					bold: true,
					alignment: 'left'
				},
				secondLine: {
					fontSize: 15,
					bold: true,
					alignment: 'center'
				},
				table: {
					width: '100%',
				},
				totalLine: {
					fontSize: 18,
					bold: true,
					alignment: 'right',                   
				},
				tableHeader: {
					bold: true,
					fontSize: 13,
					color: 'black'
				}
			}

		};


		return dd;


		function buildTableBody(data, columns) {
			var body = [];

			body.push([{text: 'Nome (Peso)', style: 'tableHeader'}, {text: 'Marca', style: 'tableHeader'}, {text: 'Preço', style: 'tableHeader'}, {text: 'Qtd', style: 'tableHeader'},{text: 'Total', style: 'tableHeader'}]);

			data.forEach(function(row) {
				if(row['available'] == true){
					var dataRow = [];
					columns.forEach(function(column) {
						if(column=='price' || column == 'total'){
							dataRow.push((Math.round(row[column] * 100) / 100).toString()+' €');
						}else if(column=='name'){
							dataRow.push(row[column].toString()+' ('+row['data']['weight'].toString()+' '+row['data']['weight_type'].toString()+')');
						}else if(column=='brand'){
							dataRow.push(row['data']['brand'].toString());
						}else{
							dataRow.push(row[column].toString());
						}
					})

					body.push(dataRow);
				}
			});

			return body;
		}

		function table(data, columns) {
			return {
				table: {
					headerRows: 1,
					widths: [300, 50, '*', 25, '*'],
					body: buildTableBody(data, columns)

				},
				style: 'table'
			};
		}
	};

	pdfFactory.createSavedListPDF = function (list, products, retailerName, totalCost) {
		var dd = {      
			pageSize: 'A4',

			content: 
			[
			{ text: "Lista de produtos do "+retailerName, style: 'firstLine'},
			{ text: '\n\n', style: 'secondLine' },  
			{ text: list.name, style: 'secondLine'},
			{ text: list.description, style: 'description'},
			{ text: '\n', style: 'secondLine' },                 
			table(products, ['name', 'brand', 'price','quantity','total']),
			{ text: '\n', style: 'secondLine' },
			{ text: 'Total '+(Math.round(totalCost * 100) / 100)+' €', style: 'totalLine'},    
			],

			styles: {
				firstLine: {
					fontSize: 30,
					bold: true,
					alignment: 'left'
				},
				secondLine: {
					fontSize: 20,
					bold: true,
					alignment: 'left'
				},
				description: {
					fontSize: 14,
					bold: false,
					alignment: 'left'
				},
				table: {
					width: '100%',
				},
				totalLine: {
					fontSize: 18,
					bold: true,
					alignment: 'right',                   
				},
				tableHeader: {
					bold: true,
					fontSize: 13,
					color: 'black'
				}
			}

		};


		return dd;

		
		function buildTableBody(data, columns) {
			var body = [];

			body.push([{text: 'Nome (Peso)', style: 'tableHeader'}, {text: 'Marca', style: 'tableHeader'}, {text: 'Preço', style: 'tableHeader'}, {text: 'Qtd', style: 'tableHeader'},{text: 'Total', style: 'tableHeader'}]);

			data.forEach(function(row) {
				var dataRow = [];
				columns.forEach(function(column) {
					if(column=='price'){
						dataRow.push((Math.round(row[column] * 100) / 100).toString()+' €');
					}else if(column=='name'){
						dataRow.push(row[column].toString()+' ('+row['weight'].toString()+' '+row['weight_type'].toString()+')');
					}else if(column=='total'){
						dataRow.push(((Math.round(row['price'] * 100) / 100)*row['quantity']).toString()+' €');
					}else{
						dataRow.push(row[column].toString());
					}
					
				})
				body.push(dataRow);
				
			});

			return body;
		}

		function table(data, columns) {
			return {
				table: {
					headerRows: 1,
					widths: [300, 50, '*', 25, '*'],
					body: buildTableBody(data, columns)

				},
				style: 'table'
			};
		}
	};



	return pdfFactory;
});