(function (a) {
    a.googlePlaces = function (e, i) {
        var d = {
            placeId: "ChIJN1t_tDeuEmsRUsoyG83frY4",
            render: ["reviews"],
            min_rating: 0,
            max_rows: 0,
            rotateTime: false
        };
        var j = this;
        j.settings = {};
        var b = a(e), e = e;
        j.init = function () {
            j.settings = a.extend({}, d, i);
            b.html("<div id='map-plug'></div>");
            g(function (n) {
                j.place_data = n;
                if (j.settings.render.indexOf("reviews") > -1) {
                    k(j.place_data.reviews);
                    if (!!j.settings.rotateTime) {
                        h()
                    }
                }
            })
        };
        var g = function (n) {
            var o = new google.maps.Map(document.getElementById("map-plug"));
            var p = {placeId: j.settings.placeId};
            var q = new google.maps.places.PlacesService(o);
            q.getDetails(p, function (r, s) {
                if (s == google.maps.places.PlacesServiceStatus.OK) {
                    n(r)
                }
            })
        };
        var m = function (n) {
            n.sort(function (o, p) {
                var q = new Date(o.time), r = new Date(p.time);
                if (q < r) {
                    return -1
                }
                if (q > r) {
                    return 1
                }
                return 0
            });
            return n
        };
        var f = function (o) {
            for (var n = o.length - 1; n >= 0; n--) {
                if (o[n].rating < j.settings.min_rating) {
                    o.splice(n, 1)
                }
            }
            return o
        };
        var k = function (q) {
            q = m(q);
            q = f(q);
            var o = "";
            var r = (j.settings.max_rows > 0) ? j.settings.max_rows - 1 : q.length - 1;
            r = (r > q.length - 1) ? q.length - 1 : r;
            for (var p = r; p >= 0; p--) {
                var s = l(q[p].rating);
                var n = c(q[p].time);
                o = o + "<div class='review-item'><div class='review-meta'><span class='review-author'>" + q[p].author_name + "</span><span class='review-sep'>, </span><span class='review-date'>" + n + "</span></div>" + s + "<p class='review-text'>" + q[p].text + "</p></div>"
            }
            b.append(o)
        };
        var h = function () {
            var n = b.children(".review-item");
            var o = n.length > 0 ? 0 : false;
            n.hide();
            if (o !== false) {
                a(n[o]).show();
                setInterval(function () {
                    if (++o >= n.length) {
                        o = 0
                    }
                    n.hide();
                    a(n[o]).fadeIn("slow")
                }, j.settings.rotateTime)
            }
        };
        var l = function (o) {
            var p = "<div class='review-stars'><ul>";
            for (var n = 0; n < o; n++) {
                p = p + "<li><i class='star'></i></li>"
            }
            if (o < 5) {
                for (var n = 0; n < (5 - o); n++) {
                    p = p + "<li><i class='star inactive'></i></li>"
                }
            }
            p = p + "</ul></div>";
            return p
        };
        var c = function (q) {
            var n = new Date(q * 1000);
            var o = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var p = o[n.getMonth()] + " " + n.getDate() + ", " + n.getFullYear();
            return p
        };
        j.init()
    };
    a.fn.googlePlaces = function (b) {
        return this.each(function () {
            if (undefined == a(this).data("googlePlaces")) {
                var c = new a.googlePlaces(this, b);
                a(this).data("googlePlaces", c)
            }
        })
    }
})(jQuery);