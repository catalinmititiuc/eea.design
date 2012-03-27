jQuery(document).ready(function($) {
    // accordion implementation 
    var $folder_panels = $('.eea-accordion-panels');
    if($folder_panels.length) {
     $($folder_panels).tabs(
        ".eea-accordion-panels div.pane",
        {tabs: '.eea-accordion-title, h2', effect: 'slide', initialIndex: 0}
      );
    }

    if ($('#smart-view-switch').length) {
       var markSelectedButton = function () {
            var smartTemplate = $.bbq.getState('smartTemplate');
            $('#smart-view-switch .selected').removeClass('selected');
            $('#smart-view-switch li').each(function(i) {
                var templateID = $.trim($(this).text());
                if (templateID == smartTemplate) {
                    $(this).addClass('selected');
                }
            });
        };

      var loadCookieSetttings =  function() {
            if ($.bbq.getState('smartTemplate') === undefined && readCookie('smartTemplate')) {
                $.bbq.pushState({
                    'smartTemplate': readCookie('smartTemplate')
                });
            }
        };

     var loadContent = function() {
            $('#smart-view-content').html('<img src="++resource++faceted_images/ajax-loader.gif" />');
            var url = $.param.querystring($.bbq.getState('smartTemplate'), $.param.querystring());
            $.get(url, function(data) {
                $('#smart-view-content').html(data);
                if(url.indexOf('tabs') !== -1 ) {
                    // run logic for tabs in eea-tabs.js
                    window.EEA.eea_tabs();
                }

                $('.listingBar a').each(function(i) {
                    var batchQueryString = $.param.querystring($(this).attr('href'));
                    var newUrl = $.param.querystring(location.href, batchQueryString);
                    $(this).attr('href', newUrl);
                });
            }, 'html');
        };

        $('#smart-view-switch li').live('click', function(e) {
            var smartTemplate = $(this).find('.template-id').text();
            $.bbq.pushState({
                'smartTemplate': smartTemplate
            });
            // #3370 - IE7 does not pick up on hash changes
            var ie6or7 = $.browser.msie && (parseInt($.browser.version, 10) <= 7);
            if (window.Faceted) {
                if (Faceted.Window.width && ie6or7) {
                    Faceted.Query = Faceted.URLHandler.hash2query(location.hash);
                    $(Faceted.Events).trigger(Faceted.Events.QUERY_CHANGED);
                    Faceted.Form.do_form_query();
                }
            }
            createCookie('smartTemplate', smartTemplate);
        });

        loadCookieSetttings();

        $(window).bind('hashchange', function(e) {
            // If faceted navigation is enabled, we don't have to make our own
            // AJAX request.
            if (window.Faceted) {
                if (!Faceted.Window.width && ($.bbq.getState('smartTemplate') !== undefined)) {
                    markSelectedButton();
                    loadContent();
                }
            }
        }).trigger('hashchange');
    }
});
