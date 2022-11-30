###
  * Allow a table to be scroll horizontally, with optional fixed columns.
  * @package Syltaen
  * @author Stanley Lambot
  * @requires jQuery
###

# ==================================================
# > JQUERY METHOD
# ==================================================
$.fn.tableScroll = -> $(@).each -> new TableScroll $(@)

# ==================================================
# > CLASS
# ==================================================
class TableScroll
    constructor: (@$table) ->

        # Add class
        @$table.addClass "table-scroll__table"

        # Inner wrap
        @$inner = @$table.wrap("<div class='table-scroll__wrap'></div>").closest(".table-scroll__wrap")

        # Outer wrap
        @$outer = @$inner.wrap("<div class='table-scroll'></div>").closest(".table-scroll")
        @$outer.wrap "<div class='row flex-justify-center no-gutters'></div>"

        # Prepare fixed columns
        if @$table.find("[data-fixed='start']")
            @addClone "start"

        if @$table.find("[data-fixed='end']")
            @addClone "end"

        $(window).resize => @checkActive()
        @checkActive()

    ###
    # Create a clone overlay of the table
    ###
    addClone: (side) ->
        # Clone table in the outer wrap
        $clone = @$table.clone(true).addClass "table-scroll__clone table-scroll__clone--#{side}"
        @$outer.append $clone

    ###
    # Check if the table should scroll
    ###
    checkActive: ->
        @$outer.removeClass "is-inactive"

        if @$inner.width() < @$outer.parent().width()
            @$outer.addClass "is-inactive"