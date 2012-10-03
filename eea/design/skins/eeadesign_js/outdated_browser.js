/*jslint browser: true,  */ /*global jQuery */
(function() {
    "use strict";
    var notSupportedBrowsers = [
        {browser : 'MSIE', version : 8, os: 'Any' },
        {browser: 'Chrome', version: 12, os: 'Any' },
        {browser: 'Firefox', version: 4, os: 'Any' }
    ];

    function getOutdatedBrowser(c_name) {
        var c_start, c_end;
        if (document.cookie.length > 0)
        {
        c_start=document.cookie.indexOf(c_name + "=");
        if (c_start !== -1)
            {
            c_start = c_start + c_name.length+1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end === -1) { c_end = document.cookie.length; }
            return window.escape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    }

    function setOutdatedBrowser(c_name, value, expiredays) {
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name+ "=" +window.escape(value) + ((expiredays === null) ? "" : ";expires=" + exdate.toGMTString());
    }

    var BrowserDetection = {
        init: function() {
            var i;
            this.detectBrowser();
            this.detectOS();

            if(this.browser === '' || this.browser === 'Unknown' || this.os === '' || 
            this.os === 'Unknown' || this.browserVersion === '' || this.browserVersion === 0)
            {
                return;
            }

            // Check if this is an outdated browser
            var outdatedBrowser = false;
            for(i = 0; i < notSupportedBrowsers.length; i+= 1){
                if(notSupportedBrowsers[i].os === 'Any' || notSupportedBrowsers[i].os === this.os){
                    if(notSupportedBrowsers[i].browser === 'Any' || notSupportedBrowsers[i].browser === this.browser){
                        if(notSupportedBrowsers[i].version === "Any" || this.browserVersion <= parseFloat(notSupportedBrowsers[i].version)){
                            outdatedBrowser = true;
                            break;
                        }
                    } 
                }
            }

            if(outdatedBrowser){
                jQuery.get('outdated_browsers', function(data) {
                    var outdated_wrap = jQuery(data), outdated_fade, timeout;
                    outdated_wrap.prependTo('body').fadeIn(1000);
                    outdated_fade = function() {
                        if(outdated_wrap.is(':visible')) {
                            setOutdatedBrowser('browserWarning','seen', 2);
                            outdated_wrap.fadeOut(1000);
                        }
                    };
                    timeout = window.setTimeout(outdated_fade, 10000);
                    outdated_wrap.hover(function() {
                        window.clearTimeout(timeout);
                    }, function() {
                        outdated_fade();
                    });
                });
            }
        },

        detectBrowser: function() {
            this.browser = '';
            this.browserVersion = 0;
            var userAgent = window.navigator.userAgent;

            if(/MSIE (\d+\.\d+);/.test(userAgent)){
                this.browser = 'MSIE';
            } else if(/Firefox[\/\s](\d+\.\d+)/.test(userAgent)){
                this.browser = 'Firefox';
            } else if(/Chrome[\/\s](\d+\.\d+)/.test(userAgent)){
                this.browser = 'Chrome';
            } else if(/Safari[\/\s](\d+\.\d+)/.test(userAgent)){
                this.browser = 'Safari';
                /Version[\/\s](\d+\.\d+)/.test(userAgent);
                this.browserVersion = Number(RegExp.$1);
            } else if(/Opera[\/\s](\d+\.\d+)/.test(userAgent)){
                this.browser = 'Opera';
            }

            if(this.browser === ''){
                this.browser = 'Unknown';
            } else if(this.browserVersion === 0) {
                this.browserVersion = parseFloat(Number(RegExp.$1));
            }
        },

         // Detect operation system
    detectOS: function() {
        var i, op_length = this.operatingSystems.length, cur_op;
        for(i = 0; i < op_length; i+= 1){
            if(this.operatingSystems[i].searchString.indexOf(this.operatingSystems[i].subStr) !== -1){
                this.os = this.operatingSystems[i].name;
                return;
            }
        }
        this.os = "Unknown";
    },
//  Variables
    browser: '',
    os: '',
    browserVersion: '',
    operatingSystems: [
        { 'searchString': navigator.platform, 'name': 'Windows', 'subStr': 'Win' },
        { 'searchString': navigator.platform, 'name': 'Mac', 'subStr': 'Mac' },
        { 'searchString': navigator.platform, 'name': 'Linux', 'subStr': 'Linux' }
    ]
    };

    if(getOutdatedBrowser('browserWarning') !== 'seen' ){
        jQuery(function() {
            BrowserDetection.init();
        });
    }
}());
