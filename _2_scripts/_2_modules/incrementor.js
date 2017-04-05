/*
 * Make a number increment from 0 to its value
 * @package Syltaen
 * @author Stanley Lambot
 * @require jQuery
 */


(function ($) {

	var items = [];

	var _formatNumber = function(nStr, decimals) {
		nStr += '';
		x = nStr.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? ',' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + '&nbsp;' + '$2');
		}
		x2 = decimals ? x2.substr(0,decimals+1) : "";
		return x1 + x2;
	}


	var _update = function () {
		var s = $(window).scrollTop();

		$.each(items, function() {

			if (s >= this.top && !this.started ) {
				var digit = this;

				digit.started = true;
				digit.incrementation = digit.goal / (digit.speed / 100);
				digit.decimals = digit.goal % 1 ? 2 : 0;

				digit.interval = setInterval(function () {

					digit.value += digit.incrementation;
					digit.$el.html( digit.prefix + (digit.timeFormat ? dateFormat(digit.value, digit.timeFormat, true) : _formatNumber(digit.value, digit.decimals)) + digit.suffix );

					if (digit.value >= digit.goal) {
						clearInterval(digit.interval);
						digit.$el.html( digit.prefix + (digit.timeFormat ? dateFormat(digit.goal, digit.timeFormat, true) : _formatNumber(digit.goal, digit.decimals)) + digit.suffix );
					}
				}, 100);
			}
		});
	}

	$.fn.incrementor = function (speed) {

		if ($(this).length) {

			var toAdd = $('#wpadminbar').length ? $('#wpadminbar').innerHeight() : 0,
				scrollTop = $(this).offset().top,
				decimals = decimals || 0;

			items.push({
				$el: $(this),
				top: parseFloat(scrollTop, 10) + toAdd - ($(window).innerHeight() ),
				goal: parseFloat($(this).text(), 10),
				value: 0,
				speed: speed,
				started: false,
				prefix: $(this).data("prefix") || "",
				suffix: $(this).data("suffix") || "",
				timeFormat: $(this).data("time") || false
			});
			$(this).text(0);

			_update();

		}
	};

	$(window).scroll(_update);



}) (jQuery);