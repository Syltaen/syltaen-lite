###
  * Repeat a specific HTML element by clicking a button
  * Auto-update fields names and values
  * @package Syltaen
  * @author Stanley Lambot
  * @require jQuery

  Usage :
  data-repeat="repeat_unique_id"
###

import $ from "jquery"
import SelectField from "./../tools/SelectField.coffee"
import AttributeWatcher from "./AttributeWatcher.coffee"
import "./../tools/jquery.if.coffee"
import "./../tools/jquery.collapsable.coffee"

# ==================================================
# > JQUERY METHOD
# ==================================================
$.fn.repeater = (config) -> new Repeater $(@), config


# ==================================================
# > CLASS
# ==================================================
class Repeater
    constructor: (@$wrap, customConfig = {}, @parent = false) ->
        @$wrap.repeater = @
        @config    = @getConfig(customConfig)
        @$template = @getTemplate()
        @items     = @getItems()
        @deepness  = @getDeepnessLevel()
        @setupHTML()
        @resetAllIndexes()


    ###
    # Generate a config based on attributes and argumetns
    ###
    getConfig: (customConfig) ->
        return $.extend
            button: @$wrap.data("repeater") || false
            deleteConfirmation: @$wrap.data("repeater-delete-confirmation") || false
            updatedAttributes: ["name", "data-if"]
            allowEmpty: @$wrap.data("allow-empty") || false
        , customConfig

    ###
    # Get a template of the fields that need to be duplicated
    ###
    getTemplate: ->
        # Get clone of first item
        $template = @$wrap.find("[data-repeater-item]").first().clone().show()

        # Reset its fields
        $template.find("[name]").val("").attr("value", false).removeAttr("data-options").change()
        $template.find(".form__error").remove()
        $template.find(".has-error").removeClass("has-error")


        # Reset internal repeaters
        $template.find("[data-repeater-item]").not(":first-child").remove()

        return $template

    ###
    # Create starting RepeatedItem
    ###
    getItems: ->
        # Clear empty hidden children when allow empty
        if @config.allowEmpty && !@$wrap.children("[data-repeater-item]").is(":visible")
            @$wrap.children("[data-repeater-item]").remove()

        return @$wrap.children("[data-repeater-item]")
            .map (i, el) => (new RepeatedItem $(el), i, @).setup()
            .toArray()

    ###
    # Get the deepness level
    ###
    getDeepnessLevel: ->
        deepness = 0
        item = @
        while item.parent
            deepness++
            item = item.parent.repeater
        return deepness

    ###
    # Add HTML classes and nodes
    ###
    setupHTML: ->
        @$wrap.addClass "repeater"
        @$wrap.attr "data-repeater-count", @items.length

        # Add "add" button
        if @config.button
            @$add = $("<span class='button button--reversed repeater__add'><i class='fa fa-plus-circle'></i> #{@config.button}</span>")
            @$add.click => @addNewItem()

            if @$wrap.is("tbody")
                @$wrap.closest("table").after @$add
            else
                @$wrap.append @$add

    ###
    # Clone the last item without keeping fields
    ###
    addNewItem: () ->
        item = new RepeatedItem @$template.clone(), 0, @
        # item.setIndex @items.length

        # Add at the end of the list
        @items.push item

        if @$wrap.is("tbody")
            @$wrap.append item.$el
        else
            @$add.before item.$el

        @resetAllIndexes()

        # Setup its inner fields
        item.setup()
        return item

    ###
    # Reset all indexes
    ###
    resetAllIndexes: ->
        for item, i in @items then item.setIndex i
        @$wrap.attr "data-repeater-count", @items.length


###
# A repeater item
###
class RepeatedItem
    constructor: (@$el, @index, @repeater) ->
        @$el.addClass("repeater__item")

        @$delete  = $("<span class='repeater__delete' data-repeater-delete></span>").click => @delete()
        @$el.append @$delete

        @children = []

    ###
    # Get an element by its selector, but ignore elements matched in children repeaters
    ###
    getElement: (selector) ->
        return @$el.find(selector).filter (i, el) =>
            return $(el).closest("[data-repeater-item]")[0] == @$el[0]

    ###
    # Update the index, reset all fields names
    ###
    setIndex: (newIndex) ->
        # Update all attributes
        for attr in @repeater.config.updatedAttributes
            @$el.find("[#{attr}]").each (i, el) =>
                deepness = 0
                $(el).attr attr, $(el).attr(attr).replaceAll new RegExp("\[[0-9]+\]", "g"), (match, content) =>
                    if @repeater.deepness == deepness then return "[#{newIndex}]"
                    deepness++
                    return match

        # Update displayed index
        @$el.find("[data-repeater-index]").text newIndex + 1

        # Reset children indexes
        for child in @children
            child.resetAllIndexes()

        # Set the new index
        @index = newIndex


    ###
    # Clone this element
    ###
    clone: ->
        # Clone item and place it after this one
        $clone = @$el.clone()
        @$el.after $clone

        # Crete a new instance
        repeatedClone = new RepeatedItem $clone, @index, @repeater
        # repeatedClone.setup()

        # Add it to the list at the right index
        @repeater.items.splice @index + 1, 0, repeatedClone

        # Reset all the indexes
        @repeater.resetAllIndexes()


        return repeatedClone

    ###
    # Setup the inner fields for new created items
    ###
    setup: ->
        @$el.find("select").each -> new SelectField $(@)

        # Setup conditionnal display
        @$el.find("[data-if]").each -> $(@).if $(@).data("if"), $(@).data("if-action")

        # Open if collapsable
        if @$el.hasClass("collapsable") then @$el.collapsable().trigger("open")

        # Field suffix
        @getElement("input[data-suffix]").each ->
            $(@).wrap("<div class='input-suffix__wrap'></div>")
            $(@).after("<span class='input-suffix'>" + $(@).data("suffix") + "</span>")

        # Setup inner repeater(s)
        @getElement("[data-repeater]").each (i, el) =>
            @children.push new Repeater $(el), {}, @

        return @


    ###
    # Delete this item, reset all indexes
    ###
    delete: ->
        @$el.remove()
        @repeater.items.splice @index, 1
        @repeater.resetAllIndexes()