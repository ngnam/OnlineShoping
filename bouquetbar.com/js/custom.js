var Shopify = Shopify || {};
Shopify.shop = "bouquetbar.myshopify.com";
Shopify.currency = {"active": "USD", "rate": "1.0"};
Shopify.theme = {
    "name": "theme-export-specials-bouquetbar-com-theme-exp",
    "id": 184133583,
    "theme_store_id": null,
    "role": "main"
};
Shopify.theme.handle = "null";
Shopify.theme.style = {"id": null, "handle": null};


window.ShopifyPay = window.ShopifyPay || {};
window.ShopifyPay.apiHost = "pay.shopify.com";

(function () {
    function asyncLoad() {
        var urls = ["\/\/social-login.oxiapps.com\/api\/init?shop=bouquetbar.myshopify.com", "index.html\/\/app.dropahint.us\/front\/js?account=469\u0026shop=bouquetbar.myshopify.com", "#\/\/shopify.privy.com\/widget.js?shop=bouquetbar.myshopify.com", "index.html\/\/s3.amazonaws.com\/lastsecondcoupon\/js\/quickannouncementbar.js?shop=bouquetbar.myshopify.com", "index.html\/\/chimpstatic.com\/mcjs-connected\/js\/users\/c536e1ef98a1af028bc9cc3f3\/380f8cea7a4a765edd50aceb6.js?shop=bouquetbar.myshopify.com", "index.html\/\/sdk.beeketing.com\/js\/beeketing.js?shop=bouquetbar.myshopify.com", "index.html\/\/instafeed.nfcube.com\/cdn\/c988585e3f5a2e541f284a09266e3e62.js?shop=bouquetbar.myshopify.com", "index.html\/\/app.targetbay.com\/js\/tb-shopify-sub.js?shop=bouquetbar.myshopify.com", "#\/\/productreviews.shopifycdn.com\/assets\/v4\/spr.js?shop=bouquetbar.myshopify.com", "index.html\/\/s3.amazonaws.com\/lastsecondcoupon\/js\/eventpromotionbar.js?shop=bouquetbar.myshopify.com", "https:\/\/cdn.retentionrock.com\/scripts\/rocket-71-1550872869.js?shop=bouquetbar.myshopify.com"];
        for (var i = 0; i < urls.length; i++) {
            var s = document.createElement('script');
            s.type = 'text/javascript';
            s.async = true;
            s.src = urls[i];
            var x = document.getElementsByTagName('script')[0];
            x.parentNode.insertBefore(s, x);
        }
    };
    if (window.attachEvent) {
        window.attachEvent('onload', asyncLoad);
    } else {
        window.addEventListener('load', asyncLoad, false);
    }
})();


var __st = {
    "a": 15040434,
    "offset": -28800,
    "reqid": "96df743f-a62c-4ee9-aa67-81c8c7120933",
    "pageurl": "bouquetbar.com\/",
    "u": "8f04855bce59",
    "p": "home"
};

window.ShopifyPaypalV4VisibilityTracking = true;
window.Shopify = window.Shopify || {};
window.Shopify.Checkout = window.Shopify.Checkout || {};
window.Shopify.Checkout.apiHost = "bouquetbar.myshopify.com";


window.ShopifyAnalytics = window.ShopifyAnalytics || {};
window.ShopifyAnalytics.meta = window.ShopifyAnalytics.meta || {};
window.ShopifyAnalytics.meta.currency = 'USD';
var meta = {"page": {"pageType": "home"}};
for (var attr in meta) {
    window.ShopifyAnalytics.meta[attr] = meta[attr];
}


window.ShopifyAnalytics.merchantGoogleAnalytics = function () {
    if (typeof Checkout === 'object') {
        if (typeof Checkout.$ === 'function') {
            (function (src) {
                var tagName = 'script', script = document.createElement(tagName);
                script.src = src;
                var head = document.getElementsByTagName('head')[0];
                head.insertBefore(script, head.childNodes[0]);
            })('../conversionpirate.com/pirate-trust.js');
        }
    }
};


(window.gaDevIds = window.gaDevIds || []).push('BwiEti');


(function () {
    var customDocumentWrite = function (content) {
        var jquery = null;

        if (window.jQuery) {
            jquery = window.jQuery;
        } else if (window.Checkout && window.Checkout.$) {
            jquery = window.Checkout.$;
        }

        if (jquery) {
            jquery('body').append(content);
        }
    };

    var isDuplicatedThankYouPageView = function () {
        return document.cookie.indexOf('loggedConversion=' + window.location.pathname) !== -1;
    }

    var setCookieIfThankYouPage = function () {
        if (window.location.pathname.indexOf('/checkouts') !== -1 &&
            window.location.pathname.indexOf('/thank_you') !== -1) {

            var twoMonthsFromNow = new Date(Date.now())
            twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);

            document.cookie = 'loggedConversion=' + window.location.pathname + '; expires=' + twoMonthsFromNow;
        }
    }

    var trekkie = window.ShopifyAnalytics.lib = window.trekkie = window.trekkie || [];
    if (trekkie.integrations) {
        return;
    }
    trekkie.methods = [
        'identify',
        'page',
        'ready',
        'track',
        'trackForm',
        'trackLink'
    ];
    trekkie.factory = function (method) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            args.unshift(method);
            trekkie.push(args);
            return trekkie;
        };
    };
    for (var i = 0; i < trekkie.methods.length; i++) {
        var key = trekkie.methods[i];
        trekkie[key] = trekkie.factory(key);
    }
    trekkie.load = function (config) {
        trekkie.config = config;
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onerror = function (e) {
            (new Image()).src = 'http://v.shopify.com/internal_errors/track?error=trekkie_load';
        };
        script.async = true;
        script.src = '../cdn.shopify.com/s/javascripts/tricorder/trekkie.storefront.min97e4.js?v=2017.09.05.1';
        var first = document.getElementsByTagName('script')[0];
        first.parentNode.insertBefore(script, first);
    };
    trekkie.load(
        {
            "Trekkie": {
                "appName": "storefront",
                "development": false,
                "defaultAttributes": {
                    "shopId": 15040434,
                    "isMerchantRequest": null,
                    "themeId": 184133583,
                    "themeCityHash": 14632911851322537760
                }
            },
            "Performance": {
                "navigationTimingApiMeasurementsEnabled": true,
                "navigationTimingApiMeasurementsSampleRate": 0.01
            },
            "Google Analytics": {
                "trackingId": "UA-85220802-1",
                "domain": "auto",
                "siteSpeedSampleRate": "10",
                "enhancedEcommerce": true,
                "doubleClick": true,
                "includeSearch": true
            },
            "Facebook Pixel": {"pixelIds": ["1833474366886168"], "agent": "plshopify1.2"},
            "Session Attribution": {}
        }
    );

    var loaded = false;
    trekkie.ready(function () {
        if (loaded) return;
        loaded = true;

        window.ShopifyAnalytics.lib = window.trekkie;

        ga('require', 'linker');

        function addListener(element, type, callback) {
            if (element.addEventListener) {
                element.addEventListener(type, callback);
            } else if (element.attachEvent) {
                element.attachEvent('on' + type, callback);
            }
        }

        function decorate(event) {
            event = event || window.event;
            var target = event.target || event.srcElement;
            if (target && (target.getAttribute('action') || target.getAttribute('href'))) {
                ga(function (tracker) {
                    var linkerParam = tracker.get('linkerParam');
                    document.cookie = '_shopify_ga=' + linkerParam + '; ' + 'path=/';
                });
            }
        }

        addListener(window, 'load', function () {
            for (var i = 0; i < document.forms.length; i++) {
                var action = document.forms[i].getAttribute('action');
                if (action && action.indexOf('/cart') >= 0) {
                    addListener(document.forms[i], 'submit', decorate);
                }
            }
            for (var i = 0; i < document.links.length; i++) {
                var href = document.links[i].getAttribute('href');
                if (href && href.indexOf('/checkout') >= 0) {
                    addListener(document.links[i], 'click', decorate);
                }
            }
        });


        var originalDocumentWrite = document.write;
        document.write = customDocumentWrite;
        try {
            window.ShopifyAnalytics.merchantGoogleAnalytics.call(this);
        } catch (error) {
        }
        ;
        document.write = originalDocumentWrite;

        if (!isDuplicatedThankYouPageView()) {
            setCookieIfThankYouPage();

            window.ShopifyAnalytics.lib.page(
                null,
                {"pageType": "home"}
            );


        }
    });


    var eventsListenerScript = document.createElement('script');
    eventsListenerScript.async = true;
    eventsListenerScript.src = "../cdn.shopify.com/s/assets/shop_events_listener-acf771159f9849ef6e5265782c99efe8b99406214c96a4373224ecafe285d7bb.js";
    document.getElementsByTagName('head')[0].appendChild(eventsListenerScript);

})();
