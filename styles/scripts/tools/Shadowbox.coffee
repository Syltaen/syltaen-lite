###
  * Create a Google Map and add filterable pins to it
  * @package Syltaen
  * @author Stanley Lambot
  * @requires jQuery
###

import $ from "jquery"

export default class Shadowbox

    constructor: ->
        @$html = $("html")
        @$body = $("body")
        @addNew()
        @$sb.on "click", "[data-action='close']", (e) =>
            if $(e.target).data("action") == "close" # no bubling
                @hide()

    addNew: ->
        @$sb      = $("<div class='shadowbox'></div>")
        @$close   = $("<span class='shadowbox__close' data-action='close'>Fermer</span>")
        @$content = $("<div class='shadowbox__content' data-action='close'></div>")

        @$body.append @$sb.append(@$close).append(@$content)

        return @$sb


    # ==================================================
    # > CONTENTS
    # ==================================================
    empty: () ->
        @$content.html ""
        return @

    video: (url, attrs = "loop autoplay controls") ->
        @$content.append "<video #{attrs}><source src='#{url}'></source></video>"
        return @

    iframe: (url, attrs = "frameborder='0' webkitallowfullscreen mozallowfullscreen allowfullscreen") ->
        @$content.append "<iframe src='#{url}' #{attrs}></iframe>"
        return @

    image: (url) ->
        @$content.append "<img src='" + url + "'>"
        return @

    html: (html) ->
        @$content.html html
        return @


    # ==================================================
    # > ACTIONS
    # ==================================================
    show: (speed = 350) ->
        @$sb.fadeIn speed
        @$sb.addClass "is-shown"
        @$html.addClass "is-scroll-locked"
        return this

    hide: (speed = 350) ->
        @$sb.fadeOut speed
        @$sb.removeClass "is-shown"
        @$html.removeClass "is-scroll-locked"
        return this

    # ==================================================
    # > CHECKERS
    # ==================================================
    isShown: () ->
        return @$sb.is(":visible")