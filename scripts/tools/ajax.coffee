import $ from "jquery"

export default

    get: (action, args = {}) ->
        args.method      = "GET"
        args.data        = args.data || {}
        args.data.action = action
        args.url         = ajaxurl
        $.ajax args

    post: (action, args = {}) ->
        args.method      = "POST"
        args.data        = args.data || {}
        args.data.action = action
        args.url         = ajaxurl
        $.ajax args