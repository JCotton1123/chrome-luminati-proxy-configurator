var PAC = {
    parseUrl: function(url) {
        var parser = document.createElement('a'),
            searchObject = {},
            queries, split, i;
        // Let the browser do the work
        parser.href = url;
        // Convert query string to object
        queries = parser.search.replace(/^\?/, '').split('&');
        for( i = 0; i < queries.length; i++ ) {
            split = queries[i].split('=');
            searchObject[split[0]] = split[1];
        }
        return {
            protocol: parser.protocol,
            host: parser.host,
            hostname: parser.hostname,
            port: parser.port,
            pathname: parser.pathname,
            search: parser.search,
            searchObject: searchObject,
            hash: parser.hash
        };
    },
    shExpMatch: function(url, pattern) {
        pattern = pattern.replace(/\./g, '\\.');
        pattern = pattern.replace(/\*/g, '.*');
        pattern = pattern.replace(/\?/g, '.');
        var newRe = new RegExp('^' + pattern + '$');
        return newRe.test(url);
    },
    funcAsString: function(host, whitelist) {
        whitelist = whitelist.map(function(host){
            return "shExpMatch(host, \"" + host + "\")";
        });
        return [
            "function FindProxyForURL(url, host) {",
            "if(",
            whitelist.join(" ||\n"),
            ") {",
            "  return \"PROXY " + host + "\";",
            "}",
            "return \"DIRECT\";",
            "}"
        ].join("\n");
    }
}
