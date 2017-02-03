var Nightmare = require('nightmare');	
var nightmare = Nightmare({ show: false });
var fs = require('fs')

go2Url('http://search.sunbiz.org/Inquiry/CorporationSearch/SearchResults?inquiryType=EntityName&searchTerm=*')

function go2Url(url){
	nightmare
		.goto(url)
		.then(function(){
			add2csv();
		})
}

function add2csv(){
	nightmare
		.evaluate(function(){

		var companyArray = [];

		$('tr').each(function(){
			var companyName = $(this).children(0).eq(0).text()
			var companyStatus = $(this).children(0).eq(2).text()
			var companyUrl = 'http://search.sunbiz.org/' + $(this).children(0).children(0).eq(0).attr('href')
			if (companyName !== " " && companyStatus !== "INACT" || companyStatus !== "INACT/UA"){
				companyArray.push('\n"' + companyName + '"', '"' + companyStatus + '"', '"' + companyUrl + '"')
			}
		});

		var nextPageUrl = $('.navigationBarPaging').children().children().eq(1).attr('href')

		companyArray.push(nextPageUrl)
		
		return companyArray

	}).run(function(err, data){
		var nextPageUrl = data.pop()
		fs.appendFile("masterData.csv",data)
		fs.writeFile('url.txt', nextPageUrl)
		console.log(nextPageUrl)
		go2Url('http://search.sunbiz.org' + nextPageUrl)
	})
}






