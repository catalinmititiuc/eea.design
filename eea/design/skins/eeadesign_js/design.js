/*global jQuery window anchors document ga setTimeout*/
jQuery(document).ready(function($) {
    'use strict';
    var $viewlet_below_content = $("#viewlet-below-content");
    var $content = $("#content");
    var $column_area = $(".column-area");

    // #71710 move related and socialmedia inside
    // faceted center area
    var $center_bottom_area = $("#center-bottom-area");
    var $related_items = $("#relatedItems");
    var $socialmedia = $("#socialmedia-viewlet");
    $related_items.appendTo($column_area);
    $socialmedia.appendTo($column_area);
    var appendTo = function(context, target) {
        if (context.length) {
            context.appendTo(target);
        }
    };

    appendTo($related_items, $column_area);
    appendTo($socialmedia, $column_area);
    if ($column_area.length) {
        appendTo($viewlet_below_content, $column_area);
    }
    else {
        appendTo($viewlet_below_content, $content);
    }
    appendTo($related_items, $center_bottom_area);
    appendTo($socialmedia, $center_bottom_area);

    // hide element if empty or has less than on equal to given
    // child length
    var hide_empty_container = function($el, child_count, $checked_el) {
        var count = child_count || 0;
        var $elem = $checked_el || $el;
        var $children = $elem.children();
        if ($children.length <= count) {
            $el.hide();
        }
    };
    hide_empty_container($("#plone-document-byline"), 1);
    hide_empty_container($viewlet_below_content, 0);
    var $whatsnew_listing = $(".whatsnew-listing");
    var $body_content = $(".body-content");
    hide_empty_container($whatsnew_listing, 0, $whatsnew_listing.find('.eea-tabs-panels'));
    hide_empty_container($body_content, 1, $body_content.find('p'));

    var url_path_name = window.location.pathname;
    var $body = $("body");
    var $code_diff = $("#diffstylecode");
    if ($body.hasClass("portaltype-sparql") && $code_diff) {
        $code_diff.click();
    }

    var $popup_login = $("#popup_login_form").click(function(e){e.stopPropagation();});

    // // 72862 mini header
    var $mini_header = $(".mini-header");
    if ($mini_header.length) {
        (function(){
            var $portal_header = $("#portal-header");
            var $cross_site_top = $("#cross-site-top");
            var $ptools = $("#portal-personaltools-wrapper");
            var $search = $("#portal-searchbox");
            var $parent = $("#secondary-globanav-tips");

            $body.on('eea-miniheader-toggled', function(ev) {
                // hide globalnav current triangle when we have the
                // network section open
                $(".eea-nav-current").toggleClass('eea-nav-inactive');
            });
            // add any cross_site_top panels as siteaction panels
            var make_siteaction_panel = function($content, $parent, panel_id, use_only_children) {
                var $panel = $("<div class='panel' id='" + panel_id + "'>" +
                    "<div class='panel-top'></div>" +
                    "<div class='panel-content shadow'>" +
                    "</div>");
                var $clone = $content.clone();
                if (use_only_children) {
                    $clone = $clone.children();
                }
                $clone.appendTo($panel.find('.panel-content'));
                $panel.appendTo($parent);
            };
            make_siteaction_panel($search, $parent, 'tip-siteaction-search-menu');
            make_siteaction_panel($popup_login, $parent, 'tip-siteaction-login-menu', true);
            make_siteaction_panel($("#portal-personaltools"), $parent, 'tip-siteaction-user-menu', true);

            $portal_header.addClass("eea-miniheader-element");
            $ptools.addClass("eea-miniheader-element");
            $("#portaltab-europe").css('display', 'none');
            $("#secondary-portaltabs").find('> li > a').click(function(ev) {
                $('.eea-navsiteactions-active').removeClass('eea-navsiteactions-active');
                $(ev.target).closest('li').addClass('eea-navsiteactions-active');
                ev.preventDefault();
            });
            $body.on('eea-miniheader-hide', function(ev, el){
                $cross_site_top.hide();
                $(".portal-logo").hide();
                $search.hide();
                $ptools.hide();
                if (!$portal_header.find('.networkSites').length) {
                    $(".networkSites").eq(0).clone().prependTo($portal_header);
                }
            });
            $("#siteaction-networks-menu").find("a").addClass("mini-header-expander");
        }());
    }

    // custom requirement to swap placement of the table and fiche-summary
    // for briefings found within the airs section
    var air_fiches = $(".template-fiche_view.section-airs");
    if (air_fiches.length) {
        (function() {
            var $fiche_body = $(".fiche-body");
            var $table = $fiche_body.find('table').eq(0);
            var $fiche_summary = $(".fiche-summary");
            if ($table.length) {
                $table.insertBefore($fiche_summary);
            }
        }());
    }

    // #69065 move google chart button within externalActions
    var $charts_buttons = $(".google_buttons_bar").find('a');
    var $document_actions = $(".documentExportActions");
    var $document_actions_ul = $document_actions.find('ul');
    if ($document_actions_ul.length) {
        $charts_buttons.each(function(idx, el) {
            var $el = $(el);
            var $wrapped = $el.addClass('pull-left').wrap('<li />').parent();
            $wrapped.prependTo($document_actions_ul);
        });
    }

    $("[for=__ac_name]").click(function(evt) {
        evt.preventDefault();
        var input = $(this).parent().find("#__ac_name");
        input.focus();
    });

    $("[for=__ac_password]").click(function(evt) {
        evt.preventDefault();
        var input = $(this).parent().find("#__ac_password");
        input.focus();
    });

    $body.click(function() {
        $('#popup_login_form').slideUp()
    });

    /* #28278 prevent figures from printing charts without the figure title on the same line
     * data-and-maps/indicators/eea32-persistent-organic-pollutant-pop-emissions-1/assessment-4/pdf.body
     * data-and-maps/indicators/direct-losses-from-weather-disasters-2/assessment/pdf.body
     * */
    $(".policy_question").each(function(idx, el) {
        var $el = $(el);
        var $next_el = $el.next();
        if ($next_el.hasClass('indicator-figure-plus-container')) {
            $el.addClass("page-break-before");
            $next_el.find('.figure-title').addClass('no-page-break-before');
        }
    });

    /* 27220 moved showing and hiding of the older versions from eea.versions to design.js
     *  this is an eea specific design decision
     *  eg: http://eea.europa.eu/data-and-maps/daviz/real-price-indices-of-passenger-transport-1
     *  */
    (function($el){
        if (!$el.length) {
            return;
        }
        var $previous_versions = $("#previous-versions");
        $previous_versions.css('display', 'none');
        $el.click(function(e) {
            $previous_versions.slideToggle();
            e.preventDefault();
        });
    }($(".showOlderVersions")));

    /* 27537; insert a link for iframes that contain video since whkthmltopdf doesn't support
     * the video tag and there is no image placeholder */
    var $video_iframe = $("iframe").filter('[src*="video"]'), $video_iframe_src;
    if ($video_iframe) {
        $video_iframe_src = $video_iframe.attr('src');
        $("<a />", {
            'class': 'video_iframe_for_print visible-print',
            href: $video_iframe_src,
            html: "Video link: [" + $video_iframe_src + "]"
        }).insertBefore($video_iframe);
    }

    // 13830 add last-child class since ie < 9 doesn't know about this css3 selector
    $('.eea-tabs').find('li:last-child').addClass('last-child');

    // #9485; login form as popup
    $("#anon-personalbar, #siteaction-login").click(function(e) {
        $popup_login.slideToggle("slow", function() {
            $('#__ac_name').focus();
        });
        e.preventDefault();
        e.stopPropagation();
    });


    // #19536; hide navigation submenus if there are less than 2 of them
    var $navigation_submenus = $(".portletSubMenuHeader");
    if ($navigation_submenus && $navigation_submenus.length < 2) {
        $navigation_submenus.hide();
    }
    // #19536; adopt height of given data target; keep declaration after the
    // hiding of the navigation submenu from above
    $('.js-adoptHeight').each(function() {
        var $el = $(arguments[1]);
        var $target_el = $($el.data('target-element'));
        $el.css('height', $target_el.outerHeight());

    });
    // #17633 add eea-icon class to the plone message classes
    $(".attention, .caution, .danger, .error, .hint, .important, .note, .tip, .warning").addClass('eea-icon');

    // #20389 - time counter to remind editors save their work
    // Delay can be overriten like this (value in miliseconds): $.timeoutDialog({delay: 900000});

    $(document).ajaxComplete(function(event, xhr, settings) {
        var url = settings.url.split('/');
        var method = url[url.length-1];
        var reset_methods = ['@@googlechart.googledashboard.edit',
            '@@googlechart.googledashboards.edit',
            '@@googlechart.savepngchart',
            '@@googlechart.setthumb',
            '@@daviz.properties.edit'];
        if (reset_methods.indexOf(method) > -1) {
            $.timeoutDialog.reset();
        }
    });

    try {
        $.timeoutDialog({delay: 900000}); // set to be triggered after 15 minutes
    }
    catch(err) {
        // console.log(err);
    }

    // #5454 remove background for required fields that have the red square
    $(".required:contains('■')").addClass('no-bg');

    // removed portal-column-two from @@usergroup-userprefs #4817
    if ($("#portlet-prefs").length) {
        $("#portal-column-two").remove();
        $("#portal-column-content").removeClass('width-3:4').addClass('width-full');
    }
    // View in fullscreen for urls: /data-and-maps/figure and /data-and-maps/data
    var r = /data-and-maps\/(figures|data)\/?$/;
    if (r.test(url_path_name)) {
        $body.addClass('fullscreen');
        $('#icon-full_screen').parent().remove();
    }

    // 5267 display form fields for translated items
    var edit_bar = $("#edit-bar");
    var edit_translate = function() {
        var translating = $content.find('form').find('.hiddenStructure').text().indexOf('Translating');
        if (translating !== -1) {
            edit_bar.closest('#portal-column-content')[0].className = "cell width-full position-0";
        }
    };
    if (edit_bar) {
        edit_translate();
    }

    // #4157 move the non embedded links out of the enumeration of the embedded
    // links in order to preserve the design
    var $auto_related = $("#auto-related"),
        $prev = $auto_related.prev(),
        $dls = $auto_related.find('dl');
    if ($dls.length) {
        $auto_related.detach();
        $dls.each(function(idx, item) {
            var $item = $(item),
                $dt = $item.find('dt');
            $item.find('.portletItem').each(function(idx, item) {
                if (item.className.indexOf('embedded') === -1) {
                    $(item).insertAfter($dt);
                }
            });
        });
        $auto_related.insertAfter($prev);
    }

    function themePromotionPortlets(top_news) {
        var top_news_width = top_news.width();
        var margin = top_news_width * 0.012,
            w = Math.floor((top_news_width - 5 * margin) / 5);
        var promotions = top_news.find('.portlet-promotions');
        promotions.width(w);
        var last = promotions.last();
        promotions.not(last).css('marginRight', (Math.floor(margin) + 3) + 'px');
        last.css({'marginRight': '0px'});
    }

    // Layout of top promotions. It's safer to do this in JS as there was some rounding issues
    // with IE in window sizes that wasn't dividible by 5.
    var top_news = $('#top-news-area');
    if (top_news.length) {
        themePromotionPortlets(top_news);
    }

    /**
     * Function to avoid multiple clicks on document actions (Download as PDF, etc.)
     */
    jQuery.fn.avoidMultipleClicks = function(options){
        var settings = {
            timeout: 3000,
            linkSelector: 'a',
            linkCSS: 'downloading',
            lockCSS: 'downloading-lock'
        };

        if(options){
            jQuery.extend(settings, options);
        }

        var self = this;
        return this.each(function(){
            self.find(settings.linkSelector).click(function(){
                var context = $(this);
                var oldCSS = context.attr('class');
                settings.linkCSS = oldCSS.split(' ').slice(0,2).join(' ') + settings.linkCSS;
                context.removeClass();
                context.addClass(settings.linkCSS);

                self.addClass(settings.lockCSS);

                setTimeout(function(){
                    self.removeClass(settings.lockCSS);
                    context.removeClass(settings.linkCSS);
                    context.addClass(oldCSS);
                }, settings.timeout);

            });
        });
    };

    $('.documentActions .action-items').avoidMultipleClicks();
    $document_actions.avoidMultipleClicks({
        linkSelector: '.eea-icon',
        linkCSS: ' eea-icon-download eea-icon-anim-burst animated'
    });


    // #23277 track download of PDF and EPUBS #18753 as well as other downloads
    var file_types = ['pdf', 'gif', 'tif', 'png', 'zip', 'xls', 'eps', 'csv',
        'tsv', 'exhibit', 'txt', 'doc', 'docx', 'xlsx', 'table'];

    function check_file_type(tokens) {
        var tokens_length = tokens.length;
        var rought_ext = tokens[tokens_length - 1];
        var guess = rought_ext.split('/')[0];
        // return file extension in case we can't figure out the correct file type
        return file_types.indexOf(guess) === -1 ? 'file' : guess;
    }

    function extract_file_type(url, txt_contents) {
        var url_tokens = url.split('.');
        //data-and-maps/data/eea-coastline-for-analysis/gis-data/europe-coastline-shapefile/at_download/file
        // or synthesis/report/action-download-pdf/at_download/file have the file type as txt content of link
        // we might have a rought extension in case we have at_download links such as
        // landcoverflows_060701.pdf/at_download/file
        // check first the extension from the link text content and fallback to the url if we can't find
        // it in the text content otherwise return a generic file extension
        var txt_tokens = txt_contents.trim().toLowerCase().split('.');
        var txt_tokes_outcome = check_file_type(txt_tokens);
        if (txt_tokes_outcome === 'file') {
            return check_file_type(url_tokens);
        }
        return txt_tokes_outcome;

    }
    var links = document.getElementsByTagName('a');
    function match_download_links(links) {
        var list = [];
        var links_length = links.length;
        var link, link_href;
        for (var i = 0; i < links_length; i++) {
            link = links[i];
            link_href = link.href;
            // match only links that are comming from the eea site
            if (!link_href.match('eea.europa')) {
                continue;
            }
            if (
                link_href.match("/download[.a-zA-Z]*") ||
                link_href.match("at_download") ||
                link_href.match("/download$") ||
                link_href.match("ftp.eea.europa")) {
                list.push(link);
            }
        }
        return list;
    }

    var downloads_list = match_download_links(links);
    function add_downloads_tracking_code(idx, el) {
        el.onclick = function() {
            var text = el.textContent || el.innerText;
            var ftype = extract_file_type(el.href, text);
            var link = el.href;
            if (ga) {
                ga('send', 'event', 'Downloads', link, ftype);
            }
        };
        return el;
    }
    $.each(downloads_list, add_downloads_tracking_code);

    /* #26746 do now show the survey message for 1 year as we no longer need to show it */
    if (window.readCookie && !window.readCookie('survey_message')) {
        window.createCookie('survey_message', 'never', 365);
    }

    /* #27214 generic panel slider functionality */
    var $right_section_container = $(".eea-right-section");
    if ($right_section_container.length) {
        (function insert_section(){
            $right_section_container.each(function(idx, el){
                // insert the slider button in case we are missing it if we want
                // to keep the needed markup as small as possible
                var $el = $(el), $right_section_slider = $el.prev();
                if (!$right_section_slider.hasClass('eea-right-section-slider')) {
                    $right_section_slider = $('<div class="eea-section eea-right-section-slider eea-scrolling-toggle-visibility"><span class="eea-icon eea-icon-5x eea-icon-caret-left eea-icon-anim-horizontal animated"></span></div>');
                    $right_section_slider.insertBefore($el);
                }
                $right_section_slider.click(function(){
                    var $this = $(this);
                    $this.toggleClass("eea-right-section-slider-active")
                        .next().toggleClass("eea-right-section-active eea-scrolling-keep-visible");

                    $this.removeClass("is-eea-hidden");

                    if ($this.hasClass("eea-right-section-slider-active")) {
                        // set overflow hidden when object is in view in order to
                        // avoid scrolling of body
                        document.body.style.overflow='hidden';
                        document.body.style.position='fixed';
                    }
                    else {
                        if (document.body.style.overflow === "hidden") {
                            document.body.style.overflow='auto';
                            document.body.style.position='relative';
                        }
                    }

                });

            });
        })();

    }
    if ($('#eea-above-columns #portal-breadcrumbs').length){
        $('#header-holder .navbar').addClass('hideShadow');
    }
});



