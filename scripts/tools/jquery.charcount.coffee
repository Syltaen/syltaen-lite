###
  * Show a the current number of characters or lines in an input/textarea
  * @package Syltaen
  * @author Stanley Lambot
  * @require jQuery

  Usage :
  data-charcount="%s/10 caractères restants"
  data-linecount="%s/10 lignes spécifiées"
###

import $ from "jquery"
import AttributeWatcher from "./AttributeWatcher.coffee"

# ==================================================
# > JQUERY METHOD
# ==================================================
$.fn.charcount = (text) -> new Count $(@), text, "char"
$.fn.linecount = (text) -> new Count $(@), text, "line"

# ==================================================
# > CLASS
# ==================================================
class Count
    constructor: (@$el, @text, @type) ->
        @$text = $("<p class='text-small text-align-right'></p>")
        @$el.after @$text

        @update()
        @$el.on "keyup", (e) => @update()


    update: ->
        @$text.text @text.replace("%s", @getCount())

    ###
    # Get the count
    ###
    getCount: ->
        switch @type
            when "line"
                return @$el.val().split("\n").filter((a) -> a).length

            # when "char"
            else
                return @$el.val().length