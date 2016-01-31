(function() {
    document.addEventListener("DOMContentLoaded", function() {

        var elements = {
            proxy_state: document.getElementById('proxy_state'),
            new_session: document.getElementById('new_session'),
            host: document.getElementById('host'),
            username: document.getElementById('username'),
            password: document.getElementById('password'),
            whitelist: document.getElementById('whitelist'),
            set_configuration: document.getElementById('set_configuration'),
        };

        var luminati = {
            initStorage: function() {
                if(!localStorage['luminati.enabled']) {
                    localStorage['luminati.enabled'] = '0';
                }
                if(!localStorage['luminati.host']) {
                    localStorage['luminati.host'] = [
                        'zproxy.luminati.io',
                        '22225'
                    ].join(':');
                }
                if(!localStorage['luminati.user']) {
                    localStorage['luminati.user'] = '';
                } 
                if(!localStorage['luminati.pass']) {
                    localStorage['luminati.pass'] = '';
                }
                if(!localStorage['luminati.whitelist']) {
                    localStorage['luminati.whitelist'] = '*';
                }
            },
            initFormState: function() {
                if(localStorage['luminati.enabled']) {
                    var state = localStorage['luminati.enabled'];
                    var el = elements.proxy_state;
                    el.value = (state == '1' ? 'Disable Proxy':'Enable Proxy');
                }
                if(localStorage['luminati.host']) {
                    var el = elements.host;
                    el.value = localStorage['luminati.host'];
                }
                if(localStorage['luminati.user']) {
                    var el = elements.username;
                    el.value = localStorage['luminati.user'];
                }
                if(localStorage['luminati.pass']) {
                    var el = elements.password;
                    el.value = localStorage['luminati.pass'];
                }
                if(localStorage['luminati.whitelist']) {
                    var el = elements.whitelist;
                    el.innerHTML = localStorage['luminati.whitelist'];
                }
            },
            registerListeners: function() {
                elements.proxy_state.addEventListener('click', function() {
                    var currentState = localStorage['luminati.enabled'];
                    if(currentState == '0'){
                        var host = localStorage['luminati.host'];
                        var whitelist = localStorage['luminati.whitelist'].split("\n");

                        var config = {
                            mode: 'pac_script',
                            pacScript: {
                                data: PAC.funcAsString(host, whitelist)
                            }
                        };
                        chrome.proxy.settings.set(
                            {value: config, scope: 'regular'},
                            function() {});

                        localStorage['luminati.enabled'] = '1';
                        elements.proxy_state.value = 'Disable Proxy';
                    }
                    else {
                        var config = {
                            mode: 'direct'
                        };

                        chrome.proxy.settings.set(
                            {value: config, scope: 'regular'},
                            function() {});

                        localStorage['luminati.enabled'] = '0';
                        elements.proxy_state.value = 'Enable Proxy';
                    }
                });

                elements.new_session.addEventListener('click', function() {
                    localStorage['luminati.session'] = Math.floor((Math.random() * 999999) + 10);
                });

                elements.set_configuration.addEventListener('click', function(){
                    localStorage['luminati.host'] = elements.host.value; 
                    localStorage['luminati.user'] = elements.username.value;
                    localStorage['luminati.pass'] = elements.password.value;
                    localStorage['luminati.whitelist'] = elements.whitelist.value;
                });
            }
        };

        luminati.initStorage();
        luminati.initFormState();
        luminati.registerListeners();
	});
})();
