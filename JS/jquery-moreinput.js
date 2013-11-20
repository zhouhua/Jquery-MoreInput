/*
 * jquery-moreinput.js
 *
 * Copyright 2013, Zhou Hua - http://zhouhua.github.io/
 * Released under the MIT Licence
 * http://opensource.org/licenses/MIT
 *
 * Github:  http://github.com/zhouhua/Jquery-MoreInput
 * Version: 1.0
 */

(function ($) {

    $.fn.moreinput = function (options) {
        var defaults = {
            url         : "",
            ajax        : true,
            list        : [],
            method      : "get",
            filter      : true,
            triggerEmpty: false,
            limit       : 0,
            onAjaxStart : function () {
            },
            onFinish    : function () {
            },
            onAjaxDone  : function (data) {
                return data;
            },
            onLabelClick: function () {
            },
            onClick     : function () {
            },
            onError     : function (msg) {
                console.error("Jquery-moreinput: " + msg);
            },
            bindData    : function () {
                return null;
            },
            layout      : "bottom"
        };


        var settings;
        if (options == false) {
            settings = defaults;
        } else {
            settings = $.extend(defaults, options);
        }


        return this.each(function () {
            var $this = $(this);
            $this.after($('<div class="moreinput-frame moreinput-out"></div>'));
            $this.click(settings.onclick);
            $this.change(run($this));
        });

        var run = function ($content) {
            var key = $content.val();
            if (settings.triggerEmpty || key) {
                if (settings.ajax) {
                    var ajaxOpt = {};
                    ajaxOpt.url = settings.url;
                    if (settings.method.toLowerCase() == "post") {
                        ajaxOpt.type = "post";
                    } else {
                        ajaxOpt.type = "get";
                    }
                    ajaxOpt.data = {"key": key};
                    var additional = settings.bindData();
                    if (additional != null) {
                        ajaxOpt.data.data = additional;
                    }
                    settings.onAjaxStart();
                    $.ajax(ajaxOpt)
                        .done(function (data) {
                            data = settings.onAjaxDone(data);
                            render(data, $content);
                        })
                        .fail(function () {
                            settings.onError(GetText("Oops, AJAX cannot get the correct response"));
                        });
                } else {
                    render(settings.list, $content);
                }
            }
        }

        var GetText = function (s) {
            return window.Localization.moreinput[s] ? window.Localization.moreinput[s] : s;
        }

        var render = function (data, $content) {
            if (typeof (settings.layout) == "function") {
                settings.layout(data, $content);
            } else {
                var left = $content.offset().left;
                var top = $content.offset().top;
                var width = $content.outerWidth();
                var height = $content.outerHeight();
                var $frame = $content.next(".moreinput-frame").addClass("moreinput-out");
                if ($frame.size() == 0) {
                    $frame = $('<div class="moreinput-frame moreinput-out"></div>');
                    $content.after($frame);
                }
                $frame.css("position", "static").left(left).top(top).width(width);
                var count = 0;
                for (var item in data) {
                    count++;
                    var text = "";
                    var c = "";
                    if (typeof (item) == "Object") {
                        text = item.word;
                        c = item.class;
                    } else {
                        text = item;
                    }
                    var $item = $('<div class="moreinput-label">' + text + '</div>');
                    if (c)$item.addClass(c);
                    $item.appendTo($frame);
                    if (count >= settings.limit && settings.limit > 0)break;
                }
                var marginL = 0, marginT = 0;
                var frameH = $frame.outerHeight();
                switch (settings.layout) {
                    case "top":
                    {
                        $frame.addClass("moreinput-layout-top").css("margin-top", "-" + $frame.outerHeight() + "px");
                        break;
                    }
                    case "left":
                    {
                        $frame.addClass("moreinput-layout-left").css({
                            "margin-left": "-" + $frame.outerWidth() + "px",
                            "margin-top" : (height - $frame.outerHeight()) / 2 + "px"
                        });
                        break;
                    }
                    case "right":
                    {
                        $frame.addClass("moreinput-layout-right").css({
                            "margin-left": width + "px",
                            "margin-top" : (height - $frame.outerHeight()) / 2 + "px"
                        });
                        break;
                    }
                    default:
                    {
                        $frame.addClass("moreinput-layout-bottom").css("margin-top", height + "px");
                        break;
                    }
                }
            }
        }
    };

})(jQuery);
