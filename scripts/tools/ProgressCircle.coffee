import $ from "jquery"
import "jquery.transit"

export default class ProgressCircle

    constructor: (@progress = 0) ->
        @averages = []
        @setupElements()
        @setProgress(@progress)


    ###
    # Create the different HTML nodes
    ###
    setupElements: ->
        @$el     = $("<div class='progress-circle'></div>")

        @$title  = $("<h2 class='h3 text-align-center'>Uploading file(s)...</h2>")
        @$subtitle = $("<p class='progress-circle__subtitle text-align-center'></p>")

        @$wrap  =  $("<div class='progress-circle__wrap'></div>")
        @$left   = $("<div class='progress-circle__half progress-circle__half--left'><div class='progress-circle__progress'></div></div>")
        @$leftp  = @$left.find(".progress-circle__progress")
        @$right  = $("<div class='progress-circle__half progress-circle__half--right'><div class='progress-circle__progress'></div></div>")
        @$rightp = @$right.find(".progress-circle__progress")
        @$digit  = $("<div class='progress-circle__digit'>#{@digit}%</div>")

        @$wrap.append @$left, @$right, @$digit
        @$el.append @$title, @$wrap, @$cancel, @$subtitle


    ###
    # Add the element in a specific place
    ###
    addTo: ($parent) ->
        $parent.append @$el
        $parent.addClass "progress-circle__parent"

    ###
    # Reset the progress
    ###
    reset: ->
        @setProgress 0

    ###
    # Set the progression value
    # Allow for an average of several progress bar
    ###
    setProgress: (progress) ->
        @progress = @clean(progress)

        # Display digit
        @$digit.text @progress + "%"

        # Set right part
        rotation_right = if @progress >= 50 then 0 else (@progress * 3.6) - 180
        @$rightp.css "rotate", rotation_right + "deg"

        # Set left part
        rotation_left = if @progress <= 50 then -180 else ((@progress - 50) * 3.6) - 180
        @$leftp.css "rotate", rotation_left + "deg"

    ###
    # Clean a number to be between 0 and 100
    ###
    clean: (value) ->
        value = Math.round(value)
        value = if value < 0 then 0 else value
        value = if value > 100 then 100 else value
        return value

    ###
    # Set the progress as an average of several values
    ###
    setProgressAverage: (progress, id) ->
        @averages[id] = @clean(progress)
        total = 0
        count = 0
        for id, value of @averages
            total += value
            count += 1

        @setProgress total / count

    ###
    # Set the title of the progress circle
    ###
    setSubtitle: (text) ->
        @$subtitle.text text