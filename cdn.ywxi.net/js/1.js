if(!window.MfeSecure){window.MfeSecure={config:[],init:function(){this.log("init");if(navigator.userAgent.match(/; MSIE [6-9]/i)){return
}if(window.jQuery===undefined){var a=document.createElement("script");a.setAttribute("type","text/javascript");a.setAttribute("src","https://cdn.ywxi.net/static/jquery/1.12.4/jquery-1.12.4.min.js?2");
if(a.readyState){a.onreadystatechange=function(){if(this.readyState=="complete"||this.readyState=="loaded"){MfeSecure.jquery_ready()
}}}else{a.onload=MfeSecure.jquery_ready}(document.getElementsByTagName("head")[0]||document.documentElement).appendChild(a)
}else{jQueryMs=window.jQuery;MfeSecure.load_config()}},jquery_ready:function(){jQueryMs=window.jQuery.noConflict(true);MfeSecure.load_config()
},load_config:function(){MfeSecure.log("load_config");var a=new String(window.location.host).replace(/^www\./,"");var b="//s3-us-west-2.amazonaws.com/mfesecure-public/host/"+a+"/client.json";
jQueryMs.getJSON(b,function(c){MfeSecure.config=c;MfeSecure.log("mfesecure_load");MfeSecure.log(MfeSecure.config);if(MfeSecure.config.error){return
}if(MfeSecure.config.trustmark.enabled){if(MfeSecure.config.trustmark.survey){MfeSecure.load_trustmark_survey()}else{MfeSecure.load_trustmark()
}}if(MfeSecure.config.load_conversion){MfeSecure.load_conversion()}})},is_mobile:function(){return jQueryMs(window).height()<=400||jQueryMs(window).width()<=400
},load_trustmark_survey:function(){var a="https://www.mcafeesecure.com/meter/"+MfeSecure.config.host+"/?do=survey";jQueryMs.ajax({dataType:"json",xhrFields:{withCredentials:true},crossDomain:true,url:a,success:function(b){if(!b.hide){MfeSecure.load_trustmark()
}}})},load_trustmark:function(){if(MfeSecure.is_mobile()&&MfeSecure.config.trustmark.disable_on_mobile){return}var c=MfeSecure.yyyymmdd();
var l=MfeSecure.config.host;var j=MfeSecure.config.trustmark.position_x;var a=MfeSecure.config.trustmark.position_y;var f=MfeSecure.config.trustmark.offset_x;
var g="//cdn.ywxi.net/static/img/tm-float.png";var d=a=="bottom"?"top":"bottom";var k=j=="right"?"left":"right";var b=document.getElementById("mfesecure-ts-style");
if(!b){jQueryMs('<style id="mfesecure-ts-style" type="text/css">.mcafeesecure-body-noscroll{ overflow:hidden !important;}</style>').appendTo("head")
}var h=document.createElement("div");h.id="mfesecure-ts-image";h.title="McAfee SECURE";h.style.cssText=MfeSecure.cleanStyleCss()+"position:fixed;height:38px !important;width:92px !important;overflow:hidden !important;"+a+":0px !important;"+j+":"+f+"px !important;z-index:1000003 !important;cursor:pointer !important;";
h.oncontextmenu=function(){return false};h.onclick=function(){MfeSecure.toggleverify()};h.style.boxShadow="0 0 5px 0 rgba(0,0,0,0.20)";
h.style.backgroundColor="#fff";h.style.backgroundImage="url("+g+")";h.style.backgroundSize="92px 38px";h.style.backgroundRepeat="no-repeat";
h.style.backgroundPosition="center center";if(j=="right"){h.style.borderTopLeftRadius="2px";if(f>0){h.style.borderTopRightRadius="2px"
}}else{h.style.borderTopRightRadius="2px";if(f>0){h.style.borderTopLeftRadius="2px"}}document.body.appendChild(h);if(MfeSecure.is_iphone()){MfeSecure.setZoomLevel();
jQueryMs(window).scroll(function(){MfeSecure.setZoomLevel()})}jQueryMs(window).resize(function(){MfeSecure.hideverify()});
if(!MfeSecure.config.pro){var i=MfeSecure.cookie_get("mfesecure_visit");if(!i){MfeSecure.cookie_set("mfesecure_visit",1,24*60);
MfeSecure.load_js("https://www.mcafeesecure.com/rpc/ajax?do=tmjs-visit&host="+l+"&rand="+new Date().getTime())}}},toggleverify:function(){if(jQueryMs(window).height()<490||jQueryMs(window).width()<320||MfeSecure.config.trustmark.disable_modal){var d="https://www.mcafeesecure.com/verify?host="+MfeSecure.config.host+"&popup=1";
var b=window.open(d);if(!b){document.location=d}return}var d="https://www.mcafeesecure.com/verify-modal?host="+MfeSecure.config.host;
var j=document.getElementById("mfesecure-ts-verify");if(!j){j=document.createElement("div");j.id="mfesecure-ts-verify";MfeSecure.cleanStyle(j);
j.style.position="fixed";j.innerHTML='<iframe style="'+MfeSecure.cleanStyleCss()+'width:100%;height:100%;left:0;right:0;top:0;bottom:0;" frameborder="0" src="'+d+'"></iframe>';
j.style.background="#e6e7e8";j.style.margin="0";j.style.padding="0";j.style.zIndex="1000004";j.style.display="none";document.body.appendChild(j)
}var f=document.getElementById("mfesecure-ts-overlay");if(!f){f=document.createElement("div");f.id="mfesecure-ts-overlay";
MfeSecure.cleanStyle(f);f.style.position="fixed";f.style.top="0px";f.style.right="0px";f.style.left="0px";f.style.bottom="0px";
f.style.width="100%";f.style.height="100%";f.style.background="rgba(20, 20, 20, .95)";f.style.zIndex="1000003";f.style.display="none";
f.onclick=function(){MfeSecure.hideverify()};f.style.cursor="zoom-out";document.body.appendChild(f)}var c=document.getElementById("mfesecure-ts-close");
if(!c){c=document.createElement("div");MfeSecure.cleanStyle(c);c.id="mfesecure-ts-close";c.style.backgroundImage="url(https://cdn.ywxi.net/static/img/modal-close.png)";
c.style.backgroundSize="11px 11px";c.style.backgroundRepeat="no-repeat";c.style.backgroundPosition="center center";c.style.zIndex="1000005";
c.style.position="absolute";c.style.width="11px";c.style.height="11px";c.style.right="10px";c.style.top="-20px";c.style.cursor="zoom-out";
c.onclick=function(){MfeSecure.hideverify()};j.appendChild(c)}if(jQueryMs("#mfesecure-ts-verify").is(":visible")){MfeSecure.hideverify()
}else{var i=window.innerWidth||jQueryMs(window).width();var a=window.innerHeight||jQueryMs(window).height();var b=i;if(b>500){b=500
}var g=a-60;if(g>480){g=490}j.style.width=b+"px";j.style.height=g+"px";j.style.top=((a/2)-(g/2))+"px";j.style.left=((i/2)-(b/2))+"px";
jQueryMs("#mfesecure-ts-overlay").fadeIn(100);jQueryMs("#mfesecure-ts-verify").fadeIn(100);jQueryMs("html,body").addClass("mcafeesecure-body-noscroll")
}},hideverify:function(){jQueryMs("#mfesecure-ts-overlay").fadeOut(100);jQueryMs("#mfesecure-ts-verify").fadeOut(100);jQueryMs("html,body").removeClass("mcafeesecure-body-noscroll")
},load_conversion:function(){var a;if(MfeSecure.config.platform=="shopify"){if(location.pathname.endsWith("/thank_you")){a=Shopify.checkout.order_id
}}if(MfeSecure.config.platform=="bigcommerce"){}if(!a){return}var b=document.createElement("script");b.setAttribute("type","text/javascript");
b.setAttribute("class","mcafeesecure-track-conversion");b.setAttribute("data-orderid",a);b.setAttribute("src","//cdn.ywxi.net/js/conversion.js?h="+MfeSecure.config.host);
document.getElementsByTagName("head")[0].appendChild(b)},cleanStyle:function(a){try{a.style.maxWidth="none"}catch(b){}try{a.style.minWidth="none"
}catch(b){}try{a.style.maxHeight="none"}catch(b){}try{a.style.minHeight="none"}catch(b){}},cleanStyleCss:function(){return"margin:0;padding:0;border:0;background:none;max-width:none;max-height:none;"
},setZoomLevel:function(){if(!MfeSecure.is_iphone()){return}try{jQueryMs("#mfesecure-ts-image").css("zoom",((window.innerWidth)/(screen.width))*1)
}catch(a){}},cookie_set:function(b,f,g){if(g){var c=new Date();c.setTime(c.getTime()+(g*60*1000));var a="expires="+c.toGMTString();
document.cookie=b+"="+f+"; path=/;"+a}else{document.cookie=b+"="+f+"; path=/;"}},cookie_get:function(d){var b=d+"=";var a=document.cookie.split(";");
for(var f=0;f<a.length;f++){var g=a[f].trim();if(g.indexOf(b)==0){return g.substring(b.length,g.length)}}return""},is_iphone:function(){return navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPod/i)
},load_js:function(b){var a=document.createElement("script");a.setAttribute("type","text/javascript");a.setAttribute("src",b);
document.getElementsByTagName("head")[0].appendChild(a)},yyyymmdd:function(){var c=new Date();var b=c.getMonth()+1;var a=c.getDate();
return[c.getFullYear(),(b>9?"":"0")+b,(a>9?"":"0")+a].join("")},log:function(b,a){if(!a){return 0}console.log("mfesecure ",b);
return 0},}}if(!window.MfeSecure_done){window.MfeSecure_done=1;MfeSecure.init()}try{window.addEventListener("message",function(a){if(a.data&&new String(a.data).indexOf("mfesecure_verifyhover_hide")==0){MfeSecure.hideverify()
}})}catch(e){};