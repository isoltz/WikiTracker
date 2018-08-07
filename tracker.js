//Some guidance for how to use the history.search function and for how to build the popup DOM came from 
//the Chromium Authors. See https://chromium.googlesource.com/chromium/src/+/master/chrome/common/extensions/docs/examples/api/history/showHistory/typedUrls.js

function onAnchorClick(event) {
	chrome.tabs.create({
		selected: true,
		url: event.srcElement.href
	});
	return false;
}
function buildTypedUrlList(divName) {
	urlArray = [];
	var now = new Date();
	var milliseconds = (now.getHours() * 3600000) + (now.getMinutes() * 60000) + (now.getSeconds() * 1000);
	var sixAM = 6 * 3600000;
	var sinceSix = milliseconds - sixAM;
	chrome.history.search({
		'text': 'wikipedia.org',
		'startTime': sinceSix  
	},
	function(historyItems) {
		for (var i = 0; i < historyItems.length; ++i) {
			var flag = true;
			//ensure no duplicates, even if they have different URLs
			for (var j = 0; j < urlArray.length; j++){
				if (urlArray[j].url == historyItems[i].url || urlArray[j].title == historyItems[i].title){			
					flag = false;
					break;
				}
			}
			if (flag){
				urlArray.push(historyItems[i]);
			}
		}
		var popupDiv = document.getElementById(divName);
		var ul = document.createElement('ul');
		popupDiv.appendChild(ul);
		//Remove any image or other media files, and other, unwanted occurences of 'wikipedia' (e.g. searches within Wikipedia)
		for (var i = 0, ie = urlArray.length; i < ie; ++i) {
			if (urlArray[i].url.endsWith(".jpg") || urlArray[i].url.endsWith(".svg") || urlArray[i].url.endsWith(".JPG")
			|| urlArray[i].url.includes("#") || urlArray[i].url.endsWith(".ogg") || urlArray[i].url.includes("search=") || 
			urlArray[i].title == ""){
				continue;
			}
			var a = document.createElement('a');
			//create hyperlink
			if (urlArray[i].url.startsWith("https")){
				a.href = urlArray[i].url;
			}
			a.appendChild(document.createTextNode(urlArray[i].title));
			a.addEventListener('click', onAnchorClick);
			var li = document.createElement('li');
			li.appendChild(a);
			ul.appendChild(li);
		}
	});   
	console.log(urlArray);
}
document.addEventListener('DOMContentLoaded', function () {
	buildTypedUrlList("clicked");
});