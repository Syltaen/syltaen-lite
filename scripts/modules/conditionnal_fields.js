/*
 * Show a field under conditions
 * @package Syltaen
 * @author Stanley Lambot
 * @require jQuery
 */


(function ($) {

	function _compare(fieldValue, compareValue) {

		if (!compareValue) return fieldValue;

		if (Array.isArray(compareValue)) {
			return compareValue.indexOf(fieldValue) > -1;
		}

		if (Array.isArray(fieldValue)) {
			return fieldValue.indexOf(compareValue) > -1;
		}

		return fieldValue == compareValue;
	}

	function _check($field, $target, value, classToAdd) {

		// ========== GET FIELD VALUE ========== //
		switch ($field.attr("type")) {
			case "radio":
				currentVal = $field.filter(":checked").val();
				break;
			case "checkbox":
				currentVal = [];
				$field.filter(":checked").each(function () {
					currentVal.push( $(this).val() );
				});
				break;
			default:
				currentVal = $field.val();
				break;
		}

		// ========== DO ACTION ========== //
		if (_compare(currentVal, value)) {
			if (classToAdd)
				$target.addClass( classToAdd );
			else
				$target.show();
		} else {
			if (classToAdd)
				$target.removeClass( classToAdd );
			else
				$target.hide();
		}

	}

	$.fn.showif = function (field_selector, value, classToAdd) {
		var $field = $(field_selector),
			$target = $(this);

		if ($field.length > 0) {

			_check($field, $target, value, classToAdd);

			$field.change(function () {
				_check($field, $target, value, classToAdd);
			});

		}

	};

}) (jQuery);
