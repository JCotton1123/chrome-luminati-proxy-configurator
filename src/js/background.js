var requestFilter = {
	urls: [
		"<all_urls>"
	]
};

chrome.webRequest.onBeforeSendHeaders.addListener(function(details) {
    var headers = details.requestHeaders;
    var url = details.url;
    var host = PAC.parseUrl(url).host;

    var isRequestProxied = false;

    var user = "";
    var pass = "";
    var whitelist = "";

    if(  !localStorage['luminati.enabled'] ||
         localStorage['luminati.enabled'] == '0'
      ) {
        return;
    }

    whitelist = localStorage['luminati.whitelist'].split("\n");
    for(var i = whitelist.length; i--;){
        if(PAC.shExpMatch(host, whitelist[i])) {
            isRequestProxied = true;
            break;
        }
    }
    if(!isRequestProxied) {
        return;
    }

    user = localStorage['luminati.user'];
    pass = localStorage['luminati.pass'];
    if(localStorage['luminati.session']) {
        user = user + "-session-rand" + localStorage['luminati.session'];
    }

    headers.push({
        name: 'Proxy-Authorization',
        value: "Basic " + Base64.encode(user + ':' + pass)
    });

	return {requestHeaders: headers};
}, requestFilter, ['requestHeaders','blocking']);
