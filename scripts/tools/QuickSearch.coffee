###
# Filter items base on a searched term
###

export default class QuickSearch
    constructor: (@$field, @$items) ->

        @indexTexts()

        @$field.keyup => @search @$field.val()

    ###
    # Filter items based on the serach
    ###
    search: (s) ->
        @$items.each ->
            $(@).toggle $(@).data("text").indexOf(s.toLowerCase()) > -1



    ###
    # Index normalized text content for each item
    ###
    indexTexts: ->
        @$items.each ->
            $(@).data "text", $(@).text().toLowerCase().replace(/\s+/g, "").trim()
