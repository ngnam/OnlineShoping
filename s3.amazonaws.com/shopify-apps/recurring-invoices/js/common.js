if(typeof(Spurit) === 'undefined'){
    var Spurit = {};
}
if(typeof(Spurit.recurringInvoices) === 'undefined'){
    Spurit.recurringInvoices = {};
}
if(typeof(Spurit.recurringInvoices.snippet) === 'undefined'){
    Spurit.recurringInvoices.snippet = {
        shopHash: '',
        folderStore: '',
        folderCss: '',
        product: {
            variants: []
        },
        cart: {}
    };
}

/**
 * Loader and wrapper for shop settings and data (from dynamic JS file)
 */
Spurit.recurringInvoices.appConfig = {
    selectorPickerUrl: 'https://s3.amazonaws.com/shopify-apps/Plugins/SelectorPicker/selector-picker.js',
    selectorPickerCmd: 'selector-picker=',

    spuritJqueryApi: 'https://s3.amazonaws.com/all-apps/js/jquery.spurit.api.js',
    spuritLibPrice: 'https://s3.amazonaws.com/all-apps/js/spurit.prices.min.js',
    spuritLibCheckout: 'https://s3.amazonaws.com/all-apps/js/spurit.checkout.min.js',

    amazonCssStatic: Spurit.recurringInvoices.snippet.folderCss + 'common.css',
    amazonCssDynamic: Spurit.recurringInvoices.snippet.folderStore + Spurit.recurringInvoices.snippet.shopHash + '.css?' + Math.random(),
    amazonJsDynamic: Spurit.recurringInvoices.snippet.folderStore + Spurit.recurringInvoices.snippet.shopHash + '.js?' + Math.random()
};;

if(typeof(Spurit) === 'undefined'){
    var Spurit = {};
}
if(typeof(Spurit.recurringInvoices) === 'undefined'){
    Spurit.recurringInvoices = {};
}

/**
 *
 */
Spurit.recurringInvoices.constants = new function(){
    /**
     * It will be applied to any order with recurring products
     * @type {string}
     */
    this.SIGN_ORDER_TAG = 'Recurring Invoice';

    /**
     * Discount types in our DB and in Shopify API
     */
    this.DISCOUNT_PERCENT = 'percentage';
    this.DISCOUNT_FIXED = 'fixed_amount';

    /**
     * @type {string}
     */
    this.POSITION_BEFORE = 'before';
    this.POSITION_INSIDE = 'inside';
    this.POSITION_AFTER = 'after';

    /**
     * @type {string}
     */
    this.PERIOD_WEEKS  = 'weeks';
    this.PERIOD_MONTHS = 'months';

    /**
     * Subscription periodicity
     * @type {string}
     */
    this.SCHEDULE_TYPE_FIXED  = 'fixed';    // fixed and defined by shop administrator
    this.SCHEDULE_TYPE_CUSTOM = 'custom';   // configured by customer

    /**
     * @type {string}
     */
    this.PLACEMENT_DISCOUNT = ':discount';

    /**
     * @type {string}
     */
    this.LINE_ITEM_PROP_PERIODICITY = 'Recurring';
};;

if(typeof(Spurit) === 'undefined'){
    var Spurit = {};
}
if(typeof(Spurit.recurringInvoices) === 'undefined'){
    Spurit.recurringInvoices = {};
}

if(typeof(Spurit.recurringInvoices.translation) === 'undefined'){
    /**
     * @type {{select_periodicity: string, weeks: string, months: string, weekly: string, monthly: string, custom: string}}
     */
    Spurit.recurringInvoices.translation = {
        select_periodicity: 'Select frequency:',
        weeks: 'Weeks',
        months: 'Months',
        weekly: 'Weekly',
        monthly: 'Monthly',
        custom: 'Custom'
    };
}

// To translate line-item properties in the cart page its better to add liquid-code to theme, for example:
// {% for p in item.properties %}
//     {% unless p.last == blank %}
//         <br />
//         {% if p.first == 'Recurring' %}
//             Subscripción:
//             {{ p.last | replace: 'months', 'meses' }}
//         {% else %}
//             {{p.first}}: {{ p.last }}
//         {% endif %}
//     {% endunless %}
// {% endfor %};

if(typeof(Spurit) === 'undefined'){
    var Spurit = {};
}
if(typeof(Spurit.recurringInvoices) === 'undefined'){
    Spurit.recurringInvoices = {};
}

/**
 * Plugin library
 */
Spurit.recurringInvoices.lib = new function(){
    /**
     *
     */
    var lib = this;

    /**
     * @type {*}
     */
    var _GET = window.location.search.replace('?','').split('&').reduce(
        function(p, e){
            var a = e.split('=');
            p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
            return p;
        },
        {}
    );

    /**
     * @returns {*}
     */
    this._GET = function () {
        return _GET;
    };

    /**
     * @returns {{left: number, top: number}}
     */
    this.scrollPos = function(){
        var html = document.documentElement;
        var body = document.body;
        return {
            left:	(html && html.scrollLeft || body && body.scrollLeft || 0) - (html.clientLeft || 0),
            top:	(html && html.scrollTop || body && body.scrollTop || 0) - (html.clientTop || 0)
        };
    };

    /**
     * @param {Array|NodeList|HTMLCollection} list
     * @returns {{forEach: function()}}
     */
    this.wrList = function(list) {
        return new (function(list){
            /**
             * @param {function(*, Number, Object)} callback
             * @param {Object} [thisArg]
             */
            this.forEach = function(callback, thisArg){
                if(list == null){
                    console.error('Argument is null or not defined');
                    return;
                }
                var O = Object(list);
                if(typeof(O.length) === 'undefined'){
                    console.error(O+' don\'t have length attribute');
                    return;
                }
                var len = O.length >>> 0;

                if(typeof(callback) !== 'function'){
                    console.error('"' + callback + '" is not a function');
                    return;
                }
                var T;
                if(arguments.length > 1) T = thisArg;
                var k = 0;
                while(k < len){
                    var kValue;
                    if(k in O){
                        kValue = O[k];
                        if(callback.call(T, kValue, k, O) === false) break;
                    }
                    k++;
                }
            };
        })(list);
    };

    /**
     * @param {Window|Node} element
     * @returns {{addHandler: function(), onChangeContents: function(), size: function(), pos: function(), getSelector: function()}}
     */
    this.wrElement = function(element) {
        return new (function(element){
            var wrElement = this;

            /**
             * @param	{string}	event
             * @param	{function}	handler
             * @param	{boolean}	useCapture
             */
            this.addHandler = function (event, handler, useCapture) {
                if(event === ''){
                    return;
                }
                if(event.indexOf(',') !== -1){
                    lib.wrList(event.split(',')).forEach(function(ev){
                        wrElement.addHandler(ev, handler, useCapture);
                    });
                    return;
                }
                if(event.indexOf(' ') !== -1){
                    lib.wrList(event.split(' ')).forEach(function(ev){
                        wrElement.addHandler(ev, handler, useCapture);
                    });
                    return;
                }
                if(element.addEventListener){
                    element.addEventListener(event, handler, useCapture ? useCapture : false);
                }else if(element.attachEvent){
                    element.attachEvent('on' + event, handler);
                }else{
                    element['on' + event] = handler;
                }
            };

            /**
             * @param {function(<MutationRecord>[])} handler
             */
            this.onChangeContents = function(handler){
                if(element === window || element === document){
                    lib.onLoad(function(){
                        lib.wrElement(document.body).onChangeContents(handler);
                    });
                    return;
                }
                new MutationObserver(
                    function(mutations){
                        handler(mutations);
                    }
                ).observe(
                    element,
                    {childList: true, subtree: true}
                );
            };

            /**
             * @returns {{w: Number, h: Number}}
             */
            this.size = function() {
                if(element === window){
                    return {
                        w: window.innerWidth ? window.innerWidth : (document.documentElement.clientWidth ? document.documentElement.clientWidth : document.body.offsetWidth),
                        h: window.innerHeight ? window.innerHeight : (document.documentElement.clientHeight ? document.documentElement.clientHeight : document.body.offsetHeight)
                    };
                }else if(typeof(element.offsetWidth) !== 'undefined'){
                    return {w: element.offsetWidth, h: element.offsetHeight};
                }else{
                    return {w: 0, h: 0};
                }

            };

            /**
             * @returns {{x: Number, y: Number}}
             */
            this.pos = function () {
                /**
                 * @param {Node} element
                 * @returns {{x: number, y: number}}
                 */
                function getOffsetRect(element){
                    // Вычисление координат объекта "правильным методом"

                    // Получить ограничивающий прямоугольник для элемента
                    var box = element.getBoundingClientRect();

                    // Задать две переменных для удобства
                    var body = document.body;
                    var docElem = document.documentElement;

                    // Вычислить прокрутку документа
                    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
                    var scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft;

                    // Документ(html или body) бывает сдвинут относительно окна (IE). Получаем этот сдвиг.
                    var clientTop = docElem.clientTop || body.clientTop || 0;
                    var clientLeft = docElem.clientLeft || body.clientLeft || 0;

                    // Прибавляем к координатам относительно окна прокрутку и вычитаем сдвиг html/body, чтобы получить координаты относительно документа
                    var top = box.top + scrollTop - clientTop;
                    var left = box.left + scrollLeft - clientLeft;

                    return {x:Math.round(left), y:Math.round(top)};
                }

                /**
                 * @param {Node} element
                 * @returns {{x: number, y: number}}
                 */
                function getOffsetSum(element){
                    // Вычисление координат объекта суммированием offset'ов
                    if(typeof(element.offsetTop) === 'undefined'){
                        return {x: 0, y: 0};
                    }
                    var top = 0, left = 0;
                    while (element) {
                        top = top + parseFloat(element.offsetTop);
                        left = left + parseFloat(element.offsetLeft);
                        element = element.offsetParent;
                    }
                    return {x:Math.round(left), y:Math.round(top)};
                }

                // Вычисляем результат подходящим способом
                if(element.getBoundingClientRect){
                    // "правильный" вариант
                    return getOffsetRect(element);
                }else{
                    // пусть работает хоть как-то
                    return getOffsetSum(element);
                }
            };
        })(element);
    };

    /**
     * @param {Event} event
     * @returns {{cancelDefault: function(), mouseCoords: function()}}
     */
    this.wrEvent = function(event) {
        return new (function(event){
            /**
             *
             */
            this.cancelDefault = function () {
                event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
                event.preventDefault ? event.preventDefault() : event.returnValue = false;
            };

            /**
             * Определение координат мыши в документе
             * @returns {{x: Number, y: Number}}
             */
            this.mouseCoords = function () {
                if(!(event instanceof MouseEvent)){
                    return {x: 0, y: 0};
                }
                if(event.pageX === null && event.clientX !== null){
                    var scroll = lib.scrollPos();
                    event.pageX = event.clientX + scroll.left;
                    event.pageY = event.clientY + scroll.top;
                }
                return {x: event.pageX, y: event.pageY};
            };
        })(event);
    };

    /**
     * @param	{function}	callback
     */
    this.onLoad = function(callback){
        if(
            document.readyState === 'complete' ||
            ( document.readyState === 'interactive' && !/MSIE *\d+\.\w+/i.test(window.navigator.userAgent) ) ||	// в IE в этом режиме работа с DOM возможна, только если все скрипты разместить в футере
            document.readyState === 'loaded'	// Вариант для некоторых старых браузеров
        ){
            callback();
        }else{
            lib.wrElement(document).addHandler('DOMContentLoaded', function(){callback()});
        }
    };

    /**
     * @type {{}}
     * @private
     */
    var __loadStatic_cache = {};

    /**
     * @param {string|[string]} url one or more
     * @param {function()} callback
     * @param {string} type 'js' or 'css'
     */
    this.loadStatic = function(url, callback, type) {
        if (typeof(callback) !== 'function') {
            callback = function () {};
        }
        if(Array.isArray(url)) {
            var loadedCnt = 0;
            lib.wrList(url).forEach(function (u) {
                lib.loadStatic(
                    u,
                    function () {
                        loadedCnt++;
                        if (loadedCnt === url.length) {
                            callback();
                        }
                    },
                    type
                );
            });

        }else if(typeof(__loadStatic_cache[url]) !== 'undefined'){
            callback();

        }else {
            if (type !== 'js' && type !== 'css') {
                type = url.toLowerCase().split('?')[0].split('#')[0].split('.').pop();
            }
            if (type !== 'js' && type !== 'css') {
                console.error('Undefined type of static file "' + url + '"');
                __loadStatic_cache[url] = 1;
                callback();
            }
            var tag;
            if (type === 'js') {
                tag = document.createElement('script');
                tag.type = 'text/javascript';
            } else {
                tag = document.createElement('link');
                tag.type = 'text/css';
                tag.rel = 'stylesheet';
            }
            if (tag.readyState) {// If the browser is Internet Explorer.
                tag.onreadystatechange = function () {
                    if (tag.readyState === 'loaded' || tag.readyState === 'complete') {
                        tag.onreadystatechange = null;
                        __loadStatic_cache[url] = 1;
                        callback();
                    }
                };
            } else { // For any other browser.
                tag.onload = function () {
                    __loadStatic_cache[url] = 1;
                    callback();
                };
            }
            if (type === 'js') {
                tag.src = url;
            } else {
                tag.href = url;
            }
            document.getElementsByTagName('head')[0].appendChild(tag);
        }
    };

    /**
     * @param {string} method
     * @param {string} url
     * @param {*} [data=null]
     * @param {function()} [callback=function(responseText,status,statusText){}]
     * @returns {boolean}
     */
    this.ajax = function(method, url, data, callback){
        /**
         * @returns {XMLHttpRequest|null}
         */
        function getXmlHttpObject() {
            if (typeof XMLHttpRequest !== 'undefined') {
                return new XMLHttpRequest();
            } else {
                console.warn('XMLHttpRequest is not supported');
                return null;
            }
        }

        if(typeof(method) !== 'string'){
            method = 'GET';
        }
        url += (url.indexOf('?')==-1?'?':'&') + 'hash='+Math.random();

        if(typeof(data) === 'undefined'){
            data = null;
        }
        if(data !== null && typeof(data) !== 'string'){
            data = JSON.stringify(data);
        }

        // Получаем объект XMLHTTPRequest
        var XmlHttpObject = getXmlHttpObject();
        if(!XmlHttpObject){
            console.error('Ajax is not supports');
            return false;
        }

        // Запрос
        XmlHttpObject.open(method, url, true);
        if(typeof(callback) == 'function'){
            XmlHttpObject.onreadystatechange = function(){
                if(XmlHttpObject.readyState === 4){
                    callback(
                        XmlHttpObject.responseText,
                        XmlHttpObject.status,
                        XmlHttpObject.statusText
                    );
                }
            };
        }
        if(method === 'POST'){
            XmlHttpObject.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }
        XmlHttpObject.setRequestHeader('X-Requested-With', 'xmlhttprequest');	// HTTP_X_REQUESTED_WITH
        XmlHttpObject.send(data);
        return true;
    };

    /**
     * @param {*} data
     * @returns {string}
     */
    this.http_build_query = function (data) {
        var value;
        var key;
        var tmp = [];
        var _httpBuildQueryHelper = function (key, val) {
            var k;
            var tmp = [];
            if (val === true) {
                val = '1';
            } else if (val === false) {
                val = '0';
            }
            if (val !== null) {
                if (typeof val === 'object') {
                    for (k in val) {
                        if (typeof(val[k]) !== 'undefined' && val[k] !== null) {
                            tmp.push(_httpBuildQueryHelper(key + '[' + k + ']', val[k]));
                        }
                    }
                    return tmp.join('&');
                } else if (typeof val !== 'function') {
                    return encodeURIComponent(key) + '=' + encodeURIComponent(val);
                } else {
                    throw new Error('There was an error processing for http_build_query().');
                }
            } else {
                return '';
            }
        };
        for (key in data) {
            value = data[key];
            var query = _httpBuildQueryHelper(key, value);
            if (query !== '') {
                tmp.push(query);
            }
        }
        return tmp.join('&');
    };
};;

if(typeof(Spurit) === 'undefined'){
    var Spurit = {};
}
if(typeof(Spurit.recurringInvoices) === 'undefined'){
    Spurit.recurringInvoices = {};
}

/**
 * SelectorPicker controller
 */
Spurit.recurringInvoices.selectorPicker = new function(){

    /**
     * @type {string}
     */
    var libraryUrl = 'https://s3.amazonaws.com/shopify-apps/Plugins/SelectorPicker/selector-picker-2.x.js';

    /**
     * @type {string}
     */
    var queryMarker = 'sign=recurring-invoices';

    /**
     *
     */
    var lib = Spurit.recurringInvoices.lib;

    /**
     * @returns {boolean}
     */
    this.needToDisplay = function () {
        return document.location.search.indexOf(queryMarker) !== -1;
    };

    /**
     *
     */
    this.display = function () {
        if(typeof(Spurit.recurringInvoices.snippet) === 'object' && typeof(Spurit.recurringInvoices.snippet.cart) === 'object' && Spurit.recurringInvoices.snippet.cart.items.length !== 1){
            // todo: Use cartPageApp.checkPage() and make cartPageApp.getCartQty() instead of using ...snippet.cart.items.length
            // On cart page its required exactly one product in cart before running selector picker
            // Product VID should be set via get-param &vid={int}
            if(typeof(lib._GET().vid) !== 'undefined'){
                lib.ajax('POST', '/cart/clear.js', null, function(){
                    lib.ajax('POST', '/cart/add.js', 'quantity=1&id='+lib._GET().vid, function(){
                        document.location.reload();
                    });
                });
                return;
            }
        }
        lib.loadStatic(libraryUrl);
    };
};;

if(typeof(Spurit) === 'undefined'){
    var Spurit = {};
}
if(typeof(Spurit.recurringInvoices) === 'undefined'){
    Spurit.recurringInvoices = {};
}

/**
 * Loader and wrapper for shop settings and data (from dynamic JS file)
 */
Spurit.recurringInvoices.shopConfig = new function(){
    /**
     *
     */
    var appConfig = Spurit.recurringInvoices.appConfig;

    /**
     *
     */
    var C = Spurit.recurringInvoices.constants;

    /**
     *
     */
    var lib = Spurit.recurringInvoices.lib;

    /**
     * @type {{}}
     */
    var sourceConfig = {offers: [], setting: {}};

    /**
     * @type {{}}
     */
    var pid2offer = {}, offers = {};

    /**
     * @param {function} callback
     */
    this.load = function (callback) {
        lib.loadStatic(appConfig.amazonJsDynamic, function () {
            if(typeof(Spurit.recurringInvoices.config) === 'undefined'){
                console.error('Error while loading dynamic JS-file "' + appConfig.amazonJsDynamic + '" with shop config. Property "Spurit.recurringInvoices.config" is undefined');
                return;
            }

            sourceConfig = Spurit.recurringInvoices.config;

            lib.wrList(sourceConfig.offers).forEach(function (offer) {
                offers[offer.id] = offer;        // Indexing Offers by its ID

                offer.schedule.customOptions = {
                    weekly:  offer.schedule.custom_option_weekly,
                    monthly: offer.schedule.custom_option_monthly,
                    any:     offer.schedule.custom_option_any,
                    length:  parseInt(offer.schedule.custom_option_weekly) + parseInt(offer.schedule.custom_option_monthly) + parseInt(offer.schedule.custom_option_any)
                };
                if(offer.schedule.customOptions.length === 0){
                    offer.schedule.customOptions.any = true;
                    offer.schedule.customOptions.length = 1;
                }

                // Make hash "product_id"=>"scheme_id"
                lib.wrList(offer.products).forEach(function (product) {
                    pid2offer[product] = offer.id;
                });
            });
            if(typeof(callback) === 'function'){
                callback();
            }
        });
    };

    /**
     * @param {int} pid
     * @returns {{} | null}
     */
    this.offerByPid = function (pid) {
        return typeof(pid2offer[pid]) !== 'undefined' ? offers[pid2offer[pid]] : null;
    };

    /**
     * @returns {{widget: {position: string, selector: string}, button: {selector: string}}}
     */
    this.productPageSelectors = function () {
        var widgetSelector = {
            position: sourceConfig.setting.product_page_position,
            selector: sourceConfig.setting.product_page_selector
        };
        if(parseInt(sourceConfig.setting.product_page_auto) === 1){
            widgetSelector.selector = '';
        }

        var buttonSelector = {
            selector: sourceConfig.setting.product_addtocart_selector
        };
        if(parseInt(sourceConfig.setting.product_addtocart_auto) === 1){
            buttonSelector.selector = '';
        }

        return {
            widget: widgetSelector,
            button: buttonSelector
        };
    };

    /**
     * @param {{discount_on: boolean, discount_value: number, discount_type: string}} offer
     * @returns {{optionBuyDefault: string, optionBuyWithSubscription: string, optionBuyWithSubscriptionComment: string}}
     * @returns {{optionBuyDefault: string, optionBuyWithSubscription: *, optionBuyWithSubscriptionComment: string, enabled: boolean}}
     */
    this.productPageWidget = function (offer) {
        var optionBuyWithSubscription;
        if(offer.discount_on){
            var discountStr;
            if(offer.discount_type === C.DISCOUNT_PERCENT){
                discountStr = offer.discount_value.replace('.00', '') + '%';
            }else{
                var convertedAmount = Spurit.prices.convertFromShopCurrencyToCart(offer.discount_value);
                discountStr = SpurShopify.formatMoney(convertedAmount * 100, Spurit.recurringInvoices.snippet.moneyFormat);
            }

            optionBuyWithSubscription = sourceConfig.setting.widget_text_option2.replace(
                C.PLACEMENT_DISCOUNT,
                this.getWidgetText(discountStr)
            );
        }else{
            optionBuyWithSubscription = sourceConfig.setting.widget_text_option2_no_discount;
        }

        // If config field is not exists, widget are enabled
        var widgetEnabled = !(typeof(sourceConfig.setting.widget_default_enabled) !== 'undefined' && parseInt(sourceConfig.setting.widget_default_enabled) === 0);
        return {
            optionBuyDefault: sourceConfig.setting.widget_text_option1,
            optionBuyWithSubscription: optionBuyWithSubscription,
            optionBuyWithSubscriptionComment: sourceConfig.setting.widget_text_option2_comment,
            enabled: widgetEnabled
        };
    };

    /**
     * @param {string} discountStr
     * @return {string}
     */
    this.getWidgetText = function (discountStr) {
        return '<span class="SRI-widget-discount">' + discountStr + '</span>';
    };

    /**
     * @returns {{subtotal: string}}
     */
    this.cartPageSelectors = function () {
        var selectors = {
            subtotal: sourceConfig.setting.cart_selector_subtotal
        };
        if(parseInt(sourceConfig.setting.cart_selector_auto) === 1){
            selectors.subtotal = '';
        }
        return selectors;
    };

    /**
     * @returns {{subtotal: string}}
     */
    this.cartAjaxSelectors = function () {
        var selectors = {
            subtotal: sourceConfig.setting.cart_ajax_selector_subtotal,
            checkout: typeof(sourceConfig.setting.cart_ajax_selector_checkout) !== 'undefined' ? sourceConfig.setting.cart_ajax_selector_checkout : ''
        };

        /**
         * Integration with new one-click checkout
         */
        if (typeof(window.Spurit.recurringInvoices.snippet.selectors) !== 'undefined') {
            var additional = window.Spurit.recurringInvoices.snippet.selectors;

            if (typeof(additional.cart_ajax_selector_subtotal) === 'string') {
              selectors.subtotal += (selectors.subtotal ? ', ' : '') + additional.cart_ajax_selector_subtotal;
            }
            if (typeof(additional.cart_ajax_selector_checkout) === 'string') {
              selectors.checkout += (selectors.checkout ? ', ' : '') + additional.cart_ajax_selector_checkout;
            }
        }

        if(parseInt(sourceConfig.setting.cart_ajax_selector_auto) === 1){
            selectors.subtotal = '';
        }
        return selectors;
    };

    /**
     * @returns {string}
     */
    this.orderTag = function () {
        return typeof(sourceConfig.setting.order_tag_name) !== 'undefined' ?
            sourceConfig.setting.order_tag_name :
            '';
    };

    /**
     * @returns {string}
     */
    this.buttonsLoadingText = function () {
        return typeof(sourceConfig.setting.buttons_loading_text) !== 'undefined' ?
            sourceConfig.setting.buttons_loading_text :
            'Loading...';
    };

    /**
     * @returns {boolean}
     */
    this.ajaxCartEnabled = function () {
        return typeof(sourceConfig.setting.cart_ajax_enabled) !== 'undefined' ?
            !!parseInt(sourceConfig.setting.cart_ajax_enabled) :
            false;
    }
};;

if(typeof(Spurit) === 'undefined'){
    var Spurit = {};
}
if(typeof(Spurit.recurringInvoices) === 'undefined'){
    Spurit.recurringInvoices = {};
}

/**
 * todo: write a comment
 */
Spurit.recurringInvoices.htmlMarkers = new function(){
    /**
     * @type {string}
     */
    var originalElementMarker = 'data-recurring-ivoices-original',
        createdElementMarker = 'data-recurring-ivoices-created';

    /**
     * @param {HTMLElement} element
     */
    this.markAsOriginal = function (element) {
        element.setAttribute(originalElementMarker, '1');
    };

    /**
     * @param {HTMLElement} element
     * @returns {boolean}
     */
    this.markedAsOriginal = function (element) {
        return element.hasAttribute(originalElementMarker);
    };

    /**
     * @param {HTMLElement} element
     */
    this.markAsCreated = function (element) {
        element.setAttribute(createdElementMarker, '1');
    };

    /**
     * @param {HTMLElement} element
     * @returns {boolean}
     */
    this.markedAsCreated = function (element) {
        return element.hasAttribute(createdElementMarker);
    };

    /**
     * @param {string} [baseSelector]
     * @returns {string}
     */
    this.selectorOriginal = function (baseSelector) {
        if(typeof(baseSelector) === 'undefined'){
            baseSelector = '*';
        }
        return baseSelector + '[' + originalElementMarker + ']';
    };

    /**
     * @param {string} [baseSelector]
     * @returns {string}
     */
    this.selectorNotOriginal = function (baseSelector) {
        if(typeof(baseSelector) === 'undefined'){
            baseSelector = '*';
        }
        return baseSelector + ':not([' + originalElementMarker + '])';
    };

    /**
     * @param {string} [baseSelector]
     * @returns {string}
     */
    this.selectorCreated = function (baseSelector) {
        if(typeof(baseSelector) === 'undefined'){
            baseSelector = '*';
        }
        return baseSelector + '[' + createdElementMarker + ']';
    };

    /**
     * @param {string} [baseSelector]
     * @returns {string}
     */
    this.selectorNotCreated = function (baseSelector) {
        if(typeof(baseSelector) === 'undefined'){
            baseSelector = '*';
        }
        return baseSelector + ':not([' + createdElementMarker + '])';
    };

    /**
     * @param {string} [baseSelector]
     * @returns {string}
     */
    this.selectorNotOriginalOrCreated = function (baseSelector) {
        return this.selectorNotOriginal(this.selectorNotCreated(baseSelector));
    };
};;

if (typeof(Spurit) === 'undefined') {
    var Spurit = {};
}
if (typeof(Spurit.recurringInvoices) === 'undefined') {
    Spurit.recurringInvoices = {};
}

/**
 * Display and Control the Widget in the Product page
 */
Spurit.recurringInvoices.productPageApp = new function () {
    /**
     *
     */
    var appConfig = Spurit.recurringInvoices.appConfig;

    /**
     *
     */
    var lib = Spurit.recurringInvoices.lib;

    /**
     *
     */
    var C = Spurit.recurringInvoices.constants;

    /**
     *
     */
    var shopConfig = Spurit.recurringInvoices.shopConfig;

    /**
     *
     */
    var htmlMarkers = Spurit.recurringInvoices.htmlMarkers;

    /**
     * @type {*}
     */
    var offer;

    /**
     * @type {HTMLElement}
     */
    var refElement, widgetElement;

    /**
     * Check is current page is product page
     * @returns {boolean}
     */
    this.checkPage = function () {
        return typeof(Spurit.recurringInvoices.snippet) === 'object' && typeof(Spurit.recurringInvoices.snippet.product) === 'object';
    };

    /**
     * Static files that needs to be preload before executing the current module of the plugin logic
     * @returns {[string]}
     */
    this.staticFiles = function () {
        return [
            appConfig.amazonCssStatic,
            appConfig.amazonCssDynamic,
            appConfig.spuritJqueryApi,
            appConfig.spuritLibPrice
        ];
    };

    /**
     *
     */
    this.run = function () {
        offer = shopConfig.offerByPid(Spurit.recurringInvoices.snippet.product.id);
        if (offer === null) {
            return;
        }
        lib.onLoad(function () {
            refElement = document.querySelector(shopConfig.productPageSelectors().widget.selector);
            if (!refElement) {
                return;
            }
            displayWidget(refElement, shopConfig.productPageSelectors().widget.position);
            fillWidget();
            //setInterval(function () { fillWidget() }, 1000);

            cloneAddToCartButton(
                shopConfig.productPageSelectors().button.selector
            );
        });
    };

    /**
     * @param {HTMLElement} refElement
     * @param {string} refPosition
     */
    function displayWidget(refElement, refPosition) {
        if (!widgetElement) {
            widgetElement = document.createElement('div');
        }
        if (refPosition === C.POSITION_BEFORE) {
            refElement.parentNode.insertBefore(widgetElement, refElement);
        } else if (refPosition === C.POSITION_INSIDE) {
            refElement.appendChild(widgetElement);
        } else if (refPosition === C.POSITION_AFTER) {
            if (refElement.nextElementSibling) {
                displayWidget(refElement.nextElementSibling, C.POSITION_BEFORE);
            } else {
                displayWidget(refElement.parentNode, C.POSITION_INSIDE);
            }
        }
    }

    /**
     *
     */
    function fillWidget() {
        var isWidgetInFormTag = false;
        var parent = widgetElement.parentNode;
        while (parent.tagName && parent.tagName !== 'BODY') {
            if (parent.tagName === 'FORM') {
                isWidgetInFormTag = true;
                break;
            }
            parent = parent.parentNode;
        }

        var widgetConfig = shopConfig.productPageWidget(offer);
        widgetElement.innerHTML =
            '<div class="SRI-widget">' +
            '<div>' +
            '<label>' +
            '<input type="radio" name="sri-option" value="0" ' + (!widgetConfig.enabled ? 'checked' : '') + '> ' +
            widgetConfig.optionBuyDefault +
            '</label>' +
            '</div>' +
            '<div>' +
            '<label>' +
            '<input type="radio" name="sri-option" value="1" ' + ( widgetConfig.enabled ? 'checked' : '') + '> ' +
            widgetConfig.optionBuyWithSubscription +
            '</label>' +
            '<' + (isWidgetInFormTag ? 'div' : 'form') + ' class="SRI-widget-form" id="sri-subscribe-form">' +
            '<div class="SRI-widget-comment">' + widgetConfig.optionBuyWithSubscriptionComment + '</div>' +
            (function () {
                if (offer.schedule.type === C.SCHEDULE_TYPE_FIXED) {
                    return '' +
                        '<input type="hidden" id="sri-period-type" value="' + offer.schedule.fixed_period_type + '">' +
                        '<input type="hidden" id="sri-period-value" value="' + offer.schedule.fixed_period_value + '">';
                }
                if (offer.schedule.type === C.SCHEDULE_TYPE_CUSTOM) {
                    /**
                     * offer.schedule.customOptions.length can't be === 0 because see:
                     * @see Spurit.recurringInvoices.shopConfig.load
                     */
                    if (offer.schedule.customOptions.length === 1 && (offer.schedule.customOptions.weekly || offer.schedule.customOptions.monthly)) {
                        // Only 1 option available ("weekly" or "monthly")
                        return '' +
                            '<input type="hidden" id="sri-period-type" value="' + (offer.schedule.customOptions.weekly ? C.PERIOD_WEEKS : C.PERIOD_MONTHS) + '">' +
                            '<input type="hidden" id="sri-period-value" value="1">';
                    } else if (offer.schedule.customOptions.length === 1 && offer.schedule.customOptions.any) {
                        // Only 1 option available ("any")
                        return '' +
                            '<div>' +
                            '<div>' + Spurit.recurringInvoices.translation.select_periodicity + '</div>' +
                            '<div>' +
                            '<input type="number" id="sri-period-value" value="1" min="1" max="100">' +
                            '<select id="sri-period-type">' +
                            '<option value="' + C.PERIOD_WEEKS + '">' + Spurit.recurringInvoices.translation.weeks + '</option>' +
                            '<option value="' + C.PERIOD_MONTHS + '">' + Spurit.recurringInvoices.translation.months + '</option>' +
                            '</select>' +
                            '</div>' +
                            '</div>';
                    } else {
                        var html = '';
                        if (offer.schedule.customOptions.weekly) {
                            html +=
                                '<div>' +
                                '<label>' +
                                '<input type="radio" name="sri-period-option" value="weekly"> ' +
                                Spurit.recurringInvoices.translation.weekly +
                                '</label>' +
                                '</div>';
                        }
                        if (offer.schedule.customOptions.monthly) {
                            html +=
                                '<div>' +
                                '<label>' +
                                '<input type="radio" name="sri-period-option" value="monthly"> ' +
                                Spurit.recurringInvoices.translation.monthly +
                                '</label>' +
                                '</div>';
                        }
                        if (offer.schedule.customOptions.any) {
                            html +=
                                '<div>' +
                                '<label>' +
                                '<input type="radio" name="sri-period-option" value="any"> ' +
                                Spurit.recurringInvoices.translation.custom +
                                '</label>' +
                                '<div id="sri-period-custom-container">' +
                                '<input type="number" id="sri-period-value" value="1" min="1" max="100">' +
                                '<select id="sri-period-type">' +
                                '<option value="' + C.PERIOD_WEEKS + '">' + Spurit.recurringInvoices.translation.weeks + '</option>' +
                                '<option value="' + C.PERIOD_MONTHS + '">' + Spurit.recurringInvoices.translation.months + '</option>' +
                                '</select>' +
                                '</div>' +
                                '</div>';
                        } else {
                            html +=
                                '<input type="hidden" id="sri-period-type" value="' + (offer.schedule.customOptions.weekly ? C.PERIOD_WEEKS : C.PERIOD_MONTHS) + '">' +
                                '<input type="hidden" id="sri-period-value" value="1">';
                        }
                        return '' +
                            '<div>' +
                            '<div>' + Spurit.recurringInvoices.translation.select_periodicity + '</div>' +
                            '<div>' + html + '</div>' +
                            '</div>';
                    }
                }
            })() +
            '</' + (isWidgetInFormTag ? 'div' : 'form') + '>' +
            '</div>' +
            '</div>';
        lib.onLoad(function () {
            var elForm = document.querySelector('#sri-subscribe-form');
            if (!elForm) {
                return;
            }
            elForm.style.display = document.querySelector('input[name="sri-option"][value="1"]').checked ? '' : 'none';
            lib.wrList(document.querySelectorAll('input[name="sri-option"]')).forEach(function (elOption) {
                lib.wrElement(elOption).addHandler(
                    'change click keyup',
                    function () {
                        if (!elOption.checked) {
                            return;
                        }
                        if (elOption.value === '1') {
                            elForm.style.display = '';
                        } else {
                            elForm.style.display = 'none';
                        }
                    }
                );
            });

            var inputPeriodType = document.querySelector('#sri-period-type'),
                inputPeriodValue = document.querySelector('#sri-period-value'),
                customContainer = document.querySelector('#sri-period-custom-container');
            if (inputPeriodType && inputPeriodValue) {
                function periodOptionHandler(elOption) {
                    if (!elOption.checked) {
                        return;
                    }
                    if (elOption.value === 'weekly') {
                        if (customContainer) {
                            customContainer.style.display = 'none';
                        }
                        inputPeriodType.value = C.PERIOD_WEEKS;
                        inputPeriodValue.value = '1';

                    } else if (elOption.value === 'monthly') {
                        if (customContainer) {
                            customContainer.style.display = 'none';
                        }
                        inputPeriodType.value = C.PERIOD_MONTHS;
                        inputPeriodValue.value = '1';

                    } else if (elOption.value === 'any') {
                        if (customContainer) {
                            customContainer.style.display = '';
                        }
                    }
                }

                var firstOptionChecked = false;
                lib.wrList(document.querySelectorAll('input[name="sri-period-option"]')).forEach(function (elOption) {
                    if (!firstOptionChecked) {
                        firstOptionChecked = true;
                        elOption.checked = true;
                    }
                    lib.wrElement(elOption).addHandler(
                        'change click keyup',
                        function () {
                            periodOptionHandler(elOption);
                        }
                    );
                    periodOptionHandler(elOption);
                });
            }
        });
    }

    /**
     * @returns {{valid: boolean, subscription: boolean, periodType: string, periodValue: number}}
     */
    function getWidgetResult() {
        var result = {
            valid: true,
            subscription: false,
            periodType: C.PERIOD_WEEKS,
            periodValue: 1
        };

        var elForm = document.querySelector('#sri-subscribe-form');
        if (!elForm) {
            return result;
        }

        var optionSubscribe = document.querySelector('input[name="sri-option"][value="1"]');
        if (!optionSubscribe || !optionSubscribe.checked) {
            return result;
        }

        var elPeriodType = elForm.querySelector('input#sri-period-type, select#sri-period-type');
        if (!elPeriodType) {
            return result;
        }
        result.periodType = elPeriodType.value;
        if (result.periodType !== C.PERIOD_WEEKS && result.periodType !== C.PERIOD_MONTHS) {
            result.periodType = C.PERIOD_WEEKS;
        }

        var elPeriodValue = elForm.querySelector('input#sri-period-value, select#sri-period-value');
        if (!elPeriodValue) {
            return result;
        }
        result.periodValue = Math.abs(parseInt(elPeriodValue.value));
        if (!result.periodValue || isNaN(result.periodValue)) {
            result.periodValue = 1;
        }

        result.subscription = true;
        return result;
    }

    /**
     * @param {string} buttonSelector
     */
    function cloneAddToCartButton(buttonSelector) {
        if (!buttonSelector) {
            return;
        }
        var btnOrig = document.querySelector(
            htmlMarkers.selectorNotOriginalOrCreated(buttonSelector)
        );
        if (!btnOrig) {
            return;
        }
        htmlMarkers.markAsOriginal(btnOrig);

        // Clone tag and properties
        var btnNew = document.createElement(btnOrig.tagName);
        btnNew.setAttribute('data-recurring-invoices-addtocart-button', '1');
        htmlMarkers.markAsCreated(btnNew);
        lib.wrList(['id', 'className', 'cssText', 'innerHTML', 'type', 'value', 'href']).forEach(function (property) {
            if (typeof(btnOrig[property]) !== 'undefined') {
                btnNew[property] = btnOrig[property];
            }
        });

        // Display new button
        btnOrig.parentNode.insertBefore(btnNew, btnOrig);

        // Hide original button and Prevent submitting form by clicking it
        btnOrig.style.display = 'none';
        lib.wrElement(btnOrig).addHandler('click', function (e) {
            lib.wrEvent(e).cancelDefault();
        });

        // Check if new button are hidden
        if (window.getComputedStyle(btnNew).display === 'none') {
            btnNew.style.display = 'inline-block';
        }

        var clickedOnce = false;
        lib.wrElement(btnNew).addHandler('click', function (e) {
            lib.wrEvent(e).cancelDefault();
            if (clickedOnce) {
                // Prevent handling this event twice
                return;
            }
            var widgetResult = getWidgetResult();
            if (!widgetResult.valid) {
                return;
            }
            clickedOnce = true;
            //simulateButtonClick(btnOrig);   // Simulate click on orig button
            displayLoadingStatus(btnNew);     // Loading text on button
            if (!addToCart(widgetResult, btnNew)) {
                hideLoadingStatus(btnNew);
                clickedOnce = false;
            }
        });
    }

    /**
     * @param {HTMLElement} button
     */
    function simulateButtonClick(button) {
        var event = new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        });
        button.dispatchEvent(event);
    }

    /**
     * @param {HTMLElement} button
     */
    function displayLoadingStatus(button) {
        if (typeof(button.innerHTML) !== 'undefined' && button.innerHTML) {
            button.setAttribute('data-sri-text-original', encodeURIComponent(button.innerHTML));
            button.innerHTML = shopConfig.buttonsLoadingText();
        } else if (typeof(button.value) !== 'undefined' && button.value) {
            button.setAttribute('data-sri-text-original', encodeURIComponent(button.value));
            button.value = shopConfig.buttonsLoadingText();
        }
    }

    /**
     * @param {HTMLElement} button
     */
    function hideLoadingStatus(button) {
        if (!button.hasAttribute('data-sri-text-original')) {
            return;
        }
        if (typeof(button.innerHTML) !== 'undefined' && button.innerHTML) {
            button.innerHTML = decodeURIComponent(button.getAttribute('data-sri-text-original'));
        } else if (typeof(button.value) !== 'undefined' && button.value) {
            button.value = decodeURIComponent(button.getAttribute('data-sri-text-original'));
        }
    }

    /**
     * @param {{valid: boolean, subscription: boolean, periodType: string, periodValue: number}} widgetResult
     * @param {HTMLElement} elButton
     */
    function addToCart(widgetResult, elButton) {
        var vid = getCurrentProductVariant().id;

        var qtyFormElement = document.querySelector('form[action="/cart/add"] [name="quantity"]');
        var quantity = qtyFormElement ? Math.abs(parseInt(qtyFormElement.value)) : 1;
        if (!quantity || isNaN(quantity)) {
            quantity = 1;
        }
        var itemProperties = {};
        if (widgetResult.valid && widgetResult.subscription) {
            itemProperties[C.LINE_ITEM_PROP_PERIODICITY] = widgetResult.periodValue + ' ' + widgetResult.periodType;
        }

        // Find add-to-cart form and collect other line-item-properties if exists
        var elForm = elButton.parentNode;
        while (elForm.tagName !== 'FORM' && elForm.tagName !== 'BODY') {
            elForm = elForm.parentNode;
        }
        if (elForm.tagName === 'FORM') {
            if (!elForm.checkValidity()) {
                if (elForm.reportValidity) {
                    elForm.reportValidity();
                }
                return false;
            }
            var propertiesInputs = elForm.querySelectorAll('input[name^="properties["], textarea[name^="properties["], select[name^="properties["]');
            lib.wrList(propertiesInputs).forEach(function (input) {
                if (!input.value) {
                    return;
                }
                var propName = input.name.replace('properties[', '').replace(']', '');
                itemProperties[propName] = input.value;
            });
        }

        var lineItem = {
            quantity: quantity,
            id: vid,
            properties: itemProperties
        };
        lib.ajax(
            'POST',
            '/cart/add.js',
            lib.http_build_query(lineItem),
            function (respond) {
                respond = JSON.parse(respond);
                if (typeof(respond.id) === 'undefined') {
                    console.error('Error while adding item to cart');
                    console.error('Line item:', lineItem);
                    console.error('Respond:', respond);
                    return;
                }
                if (typeof(window.Spurit.recurringInvoices.onAddToCart) === 'function') {
                    window.Spurit.recurringInvoices.onAddToCart();
                } else {
                    redirectToCart();
                }
            }
        );
        if (typeof(window.Spurit.recurringInvoices.onAddToCart) === 'function') {
            return false;
        } else {
            return true;
        }
    }

    /**
     *
     */
    function redirectToCart() {
        document.location.href = '/cart';
    }

    /**
     * @returns {{}}
     */
    function getCurrentProductVariant() {
        function getFromForm() {
            var vidFormElement = document.querySelector('form[action="/cart/add"] [name="id"]');
            return vidFormElement ? parseInt(vidFormElement.value) : 0;
        }

        function getFromUrl() {
            return typeof(lib._GET().variant) !== 'undefined' ? parseInt(lib._GET().variant) : 0;
        }

        var vid;
        if (typeof(Spurit.getCurrentProductVid) === 'function') {
            vid = Spurit.getCurrentProductVid();
        } else {
            vid = getFromForm();
            if (!vid) {
                vid = getFromUrl();
            }
        }
        var currentVariant;
        lib.wrList(Spurit.recurringInvoices.snippet.product.variants).forEach(function (variant) {
            if (variant.id == vid) {
                currentVariant = variant;
                return false;
            }
            return true;
        });
        if (!currentVariant) {
            currentVariant = Spurit.recurringInvoices.snippet.product.variants[0];
        }
        return currentVariant;
    }
};;

if(typeof(Spurit) === 'undefined'){
    var Spurit = {};
}
if(typeof(Spurit.recurringInvoices) === 'undefined'){
    Spurit.recurringInvoices = {};
}

/**
 * ...
 */
Spurit.recurringInvoices.cartPageApp = new function(){
    this.lastRefreshTime = null;
    this.cartTimer = null;
    var MIN_REFRESH_INTERVAL = 1000;
    var self = this;

    /**
     *
     */
    var appConfig = Spurit.recurringInvoices.appConfig;

    /**
     *
     */
    var lib = Spurit.recurringInvoices.lib;

    /**
     *
     */
    var C = Spurit.recurringInvoices.constants;

    /**
     *
     */
    var shopConfig = Spurit.recurringInvoices.shopConfig;

    /**
     *
     */
    var htmlMarkers = Spurit.recurringInvoices.htmlMarkers;

    /**
     * @type {boolean}
     */
    var ajaxCartEnabled = false;

    /**
     * Check is current page is cart page
     * @returns {boolean}
     */
    this.checkPage = function () {
        return typeof(Spurit.recurringInvoices.snippet) === 'object' && typeof(Spurit.recurringInvoices.snippet.cart) === 'object' && Spurit.recurringInvoices.snippet.cart.items.length;
    };

    /**
     * Static files that needs to be preload before executing the current module of the plugin logic
     * @returns {[string]}
     */
    this.staticFiles = function () {
        return [
            appConfig.spuritJqueryApi,
            appConfig.spuritLibPrice,
            appConfig.spuritLibCheckout
        ];
    };

    /**
     *
     */
    var subtotalPriceLib = new function () {
        /**
         *
         * @type {boolean}
         */
        var inited = false;

        /**
         * @type {number}
         */
        var initalSubtotal = 0;

        /**
         * @type {[]}
         */
        var cartItems = [];

        /**
         *
         */
        this.init = function () {
            if(inited){
                return;
            }
            inited = true;
            Spurit.prices.setOptions({
                format: Spurit.recurringInvoices.snippet.moneyFormat
            });
            Spurit.prices.onChange(
                'subtotal',
                function (value, nextCallback) {
                    lib.wrList(cartItems).forEach(function (item) {
                        if(typeof(item.applied_discount) !== 'undefined'){
                            value -= item.applied_discount.amount * 100;
                        }
                    });
                    if(typeof(nextCallback) === 'function'){
                        nextCallback(value);
                    }
                }
            );
        };

        /**
         * @param value
         */
        this.setInitalSubtotal = function (value) {
            initalSubtotal = value;
        };

        /**
         * @param {[]} itemsWithDiscounts
         */
        this.setItems = function (itemsWithDiscounts) {
            cartItems = itemsWithDiscounts;
        };

        /**
         * @param {string} selector
         */
        this.addElement = function (selector) {
            if(selector){
                lib.wrList(document.querySelectorAll(selector)).forEach(function (element) {
                    Spurit.prices.addElements('subtotal', element);
                });
            }
        };

        /**
         *
         */
        this.display = function () {
            Spurit.prices.recalculate('subtotal', initalSubtotal);
        };

    };

    /**
     *
     */
    this.run = function () {
        var itemsForDraftOrder = getItemsForDraftOrder(Spurit.recurringInvoices.snippet.cart.items);
        if(!itemsForDraftOrder.length){
            return;
        }

        subtotalPriceLib.init();
        subtotalPriceLib.setInitalSubtotal(Spurit.recurringInvoices.snippet.cart.total_price);
        subtotalPriceLib.setItems(itemsForDraftOrder);

        Spurit.checkout.setOptions({
            "app_id": Spurit.recurringInvoices.snippet.appId,
            "hash": Spurit.recurringInvoices.snippet.shopHash
        });

        lib.onLoad(function () {
            subtotalPriceLib.addElement(shopConfig.cartPageSelectors().subtotal);
            subtotalPriceLib.display();

            Spurit.checkout.addHandler(function(cart, next){
                if(ajaxCartEnabled && getAjaxCartSubtotalElement() || typeof Spurit.recurringInvoices.preventMainCheckout !== 'undefined'){
                    next(cart);
                    return;
                }

                applyDiscount(itemsForDraftOrder, cart, next);
            });
        });
    };

    /**
     * Collect products and its discounts for draft order
     * Returns an empty Array if there is no items with discounts (this order will be processed by Shopify native checkout)
     * @param {[]} cartItems
     * @returns {[]}
     */
    function getItemsForDraftOrder(cartItems) {
        var itemsForDraftOrder = [];
        var anyItemWithDiscount = false;
        lib.wrList(cartItems).forEach(function (item) {
            item.price = item.price / 100;
            var draftOrderItem = {
                key: item.key,
                variant_id: item.variant_id,
                price: item.price,
                quantity: item.quantity
            };
            if(typeof(item.properties) !== 'undefined' && item.properties !== null){
                draftOrderItem.properties = item.properties;
            }
            if(item.properties && typeof(item.properties[C.LINE_ITEM_PROP_PERIODICITY]) !== 'undefined'){
                var offer = shopConfig.offerByPid(item.product_id);
                if(offer !== null){
                    if(offer.discount_on){
                        anyItemWithDiscount = true;
                        var discountAmount = getCartDiscount(offer, item);

                        draftOrderItem.applied_discount = {
                            value: offer.discount_value,
                            value_type: offer.discount_type,
                            amount: discountAmount
                        };
                    }
                }
            }
            itemsForDraftOrder.push(draftOrderItem);
        });
        return anyItemWithDiscount ? itemsForDraftOrder : [];
    }

    function getCartDiscount(offer, item) {
        if (offer.discount_type === C.DISCOUNT_FIXED) {
            return Spurit.prices.convertFromShopCurrencyToCart(item.quantity * offer.discount_value);
        }

        return Math.floor(item.price * item.quantity * offer.discount_value) / 100;
    }

    function applyDiscount(itemsForDraftOrder, cart, next) {
        var draftOrderItemsHash = {};

        lib.wrList(itemsForDraftOrder).forEach(function (item) {
            draftOrderItemsHash[item.key] = item;
        });

        cart.getLineItems().forEach(function (lineItem) {
            if (typeof (draftOrderItemsHash[lineItem.key]) === 'undefined') {
                return;
            }

            var draftOrderItem = draftOrderItemsHash[lineItem.key];
            if (typeof (draftOrderItem.applied_discount) === 'undefined') {
                return;
            }

            lineItem.quantity = draftOrderItem.quantity;

            var cartItem = Spurit.global.cart.itemsCollection.getItemByKey(lineItem.key);

            var discount = getDiscountForCheckout(draftOrderItem, cartItem);

            lineItem.discounted_price -= discount;
            // cart.updateLineItem(lineItem);
        });

        // todo: не вешать тег, если рекаринг-товаров в корзине нет

        var tags = cart.getOrderTags();
        tags.push(C.SIGN_ORDER_TAG);

        if (shopConfig.orderTag()) {
            tags.push(shopConfig.orderTag());
        }

        cart.setOrderTags(tags);

        next(cart);
    }

    function getDiscountForCheckout(draftOrderItem, cartItem) {
        if (draftOrderItem.applied_discount.value_type === C.DISCOUNT_FIXED) {
            return draftOrderItem.applied_discount.value * 100;
        }

        return discount = Math.floor(draftOrderItem.applied_discount.value / 100 * cartItem.price_orig);
    }

    /**
     *
     */
    this.runAjax = function () {
        ajaxCartEnabled = true;
        subtotalPriceLib.init();

        var checkoutOptions = {
            "app_id": Spurit.recurringInvoices.snippet.appId,
            "hash": Spurit.recurringInvoices.snippet.shopHash
        };
        if (shopConfig.cartAjaxSelectors().checkout) {
            checkoutOptions["event"] = 'click';
        }
        Spurit.checkout.setOptions(checkoutOptions);

        var itemsForDraftOrder;

        function processAjaxCart() {
            if(!isAjaxCartChanged()){
                return;
            }
            Spurit.checkout.findElements();
            loadItemsAjax(function (cartItems, subtotal) {
                itemsForDraftOrder = getItemsForDraftOrder(cartItems);
                subtotalPriceLib.setInitalSubtotal(subtotal);
                subtotalPriceLib.setItems(itemsForDraftOrder);
                subtotalPriceLib.addElement(shopConfig.cartAjaxSelectors().subtotal);
                subtotalPriceLib.display();
            });

            if (shopConfig.cartAjaxSelectors().checkout) {
                var buttons = document.querySelectorAll(shopConfig.cartAjaxSelectors().checkout);
                if (buttons && buttons.length) {
                  lib.wrList(buttons).forEach(function (button) {
                    button.onclick = function () {};
                  });
                  Spurit.checkout.addElements(buttons);
                }
            }
        }
        lib.onLoad(function () {
            Spurit.checkout.addHandler(function(cart, next){
                console.warn('checkout');
                if(typeof(itemsForDraftOrder) === 'undefined'){
                    // Do nothing if processAjaxCart() can't fill itemsForDraftOrder
                    next(cart);
                    return;
                }

                applyDiscount(itemsForDraftOrder, cart, next);
            });
            processAjaxCart();
            lib.wrElement(window).onChangeContents(function () {
                processAjaxCart();
            });
        });
    };

    /**
     * @param {function(items:[])} callback
     */
    function loadItemsAjax(callback) {
        if (!isRefreshTime() && self.cartTimer) {
            return;
        }

        if (!isRefreshTime()) {
            self.cartTimer = setTimeout(function () {
                self.cartTimer = null;
                loadItemsAjax(callback);
            }, MIN_REFRESH_INTERVAL);

            return;
        }

        self.lastRefreshTime = new Date().getTime();

        lib.ajax('GET', '/cart.js', null, function (cart) {
            var cartItems = [], subtotal = 0;
            cart = JSON.parse(cart);
            if(cart){
                cartItems = cart.items;
                subtotal = cart.total_price;
            }
            if(typeof(callback) === 'function'){
                callback(cartItems, subtotal);
            }
        });
    }

    function isRefreshTime() {
        if (!self.lastRefreshTime) {
            return true;
        }

        var currentTime = new Date().getTime();

        return currentTime - MIN_REFRESH_INTERVAL >= self.lastRefreshTime;
    }

    /**
     * @type {string}
     */
    var ajaxSubtotalPrev = '';

    /**
     * @returns {HTMLElement|null}
     */
    function getAjaxCartSubtotalElement() {
        var ajaxSubtotalSelector = shopConfig.cartAjaxSelectors().subtotal;
        if(!ajaxSubtotalSelector){
            return null;
        }
        var ajaxSubtotal = document.querySelector(htmlMarkers.selectorNotCreated(ajaxSubtotalSelector));
        if(!ajaxSubtotal){
            return null;   // Error in selector OR ajax-popup is closed
        }
        return ajaxSubtotal;
    }

    /**
     * Detect if ajax-container with cart was changed (by comparing contents of cart subtotal-element)
     * @returns {boolean}
     */
    function isAjaxCartChanged() {
        var ajaxSubtotal = getAjaxCartSubtotalElement();
        if(!ajaxSubtotal){
            return false;
        }

        if(!htmlMarkers.markedAsOriginal(ajaxSubtotal)){
            // Subtotal element is NOT marked, so it is new element, which is possible only if cart was updated
            return true;
        }
        if(ajaxSubtotal.innerHTML !== ajaxSubtotalPrev){
            ajaxSubtotalPrev = ajaxSubtotal.innerHTML;
            return true;
        }
        return false;
    }
};;

if(typeof(Spurit) === 'undefined'){
    var Spurit = {};
}
if(typeof(Spurit.recurringInvoices) === 'undefined'){
    Spurit.recurringInvoices = {};
}


(function () {
    function init(){
        // Display selector picker if necessary
        if(Spurit.recurringInvoices.selectorPicker.needToDisplay()){
            Spurit.recurringInvoices.selectorPicker.display();
            return;
        }

        /**
         * Plugin library
         */
        var lib = Spurit.recurringInvoices.lib;

        /**
         * Loader and wrapper for shop settings and data (from dynamic JS file)
         */
        var shopConfig = Spurit.recurringInvoices.shopConfig;

        /**
         * Display and Control the Widget in the Product page
         */
        var productPageApp = Spurit.recurringInvoices.productPageApp;

        /**
         * ...
         */
        var cartPageApp = Spurit.recurringInvoices.cartPageApp;

        /**
         * Integration with new one-click checkout
         */
        Spurit.recurringInvoices.cartPageApp.runAjaxCart = function () {
            lib.loadStatic(cartPageApp.staticFiles(), function () {
              cartPageApp.runAjax();
            })
        };

        // Run plugin logic
        shopConfig.load(function () {
            if(productPageApp.checkPage()){
                // PRODUCT PAGE
                lib.loadStatic(productPageApp.staticFiles(), function () {
                    productPageApp.run();
                });

            }else if(cartPageApp.checkPage()){
                // CART PAGE
                lib.loadStatic(cartPageApp.staticFiles(), function () {
                    cartPageApp.run();
                });
            }
            if(shopConfig.ajaxCartEnabled()){
                // Processing ajax-popup with cart
                lib.loadStatic(cartPageApp.staticFiles(), function () {
                    cartPageApp.runAjax();
                });
            }
        });
    }

    Spurit.recurringInvoices.lib.loadStatic('https://s3.amazonaws.com/all-apps/js/spurit.global-1.x.min.js', function () {
        Spurit.global.cart.onReady(init);
    }, 'js');
})();
;

