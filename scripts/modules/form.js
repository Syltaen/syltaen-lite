/*
 * Make select, multiselect and file input so pretty
 * @package Syltaen
 * @author Stanley Lambot
 * @require jQuery
 */

(function ($) { $.fn.extend({

	form: {
		$selects: $('form .select-wrapper, form .multiselect-wrapper, form .list-dropdown-wrap, form .list-multi-wrap'),
		$multiselects: $('form .multiselect-wrapper, form .list-multi-wrap'),
		$ninja: $('.ninja-forms-form-wrap'),
		$options: null,
		$currentlyOpen: false,
		currentSearch: '',
		searchTimeout: null,

		closeAll: function () {
			form.$options.addClass('hidden');
			if (form.$currentlyOpen) form.$currentlyOpen.siblings('select').change();
			form.$currentlyOpen = false;
			form.currentSearch = '';
		},

		selectToggle: function (e) {
			e.preventDefault();
			if ($(this).hasClass('disabled')) return false;
			$(this).blur(); window.focus();
			var $s = $(this).find('.options');
			if ($s.hasClass('hidden')) {
				form.closeAll();
				$s.removeClass('hidden');
				form.$currentlyOpen = $s;
			} else {
				form.closeAll();
			}
			return false;
		},

		updateMultiselect: function ($track, vals) {
			var datatxt =
				(!vals || vals.length <=0)  ? "<span>Aucun élément sélectionné</span>"
				:(vals.length == 1)         ? "<strong>1</strong> <span>élément sélectionné</span>"
											: "<strong>"+vals.length+"</strong> <span>éléments sélectionnés</span>";
				;
			$track.html(datatxt);
		},

		changeValue: function (e) {
			e.stopPropagation();
			var $s = $(this).parent().siblings('select');
			if ($s.attr('multiple')) {
				$(this).toggleClass('selected');
				var values = [];
				$(this).parent().find('li').each(function () {
					if ($(this).hasClass('selected')) {
						values.push($(this).attr('data-value'));
					}
				});
				$s.val(values);
				form.updateMultiselect($s.siblings('.count-track'), values);
			} else {
				$s.val( $(this).attr('data-value') );
				$(this).siblings('li').removeClass('selected');
				$(this).addClass('selected');
				form.closeAll();
			}
		},

		setBaseValue: function ($opts) {
			$opts.each(function () {
				var $s = $(this).siblings('select');
				if ($s.attr('multiple')) {
					$(this).find('li').each(function () {
						if ( $s.val() && $s.val().indexOf($(this).attr('data-value')) >= 0 ) { $(this).addClass('selected'); }
					});
					form.updateMultiselect($s.siblings('.count-track'), $s.val());
				} else {
					$(this).find('li[data-value="'+$s.val()+'"]').addClass('selected');
				}
			});
		},

		changeForms: function () {
			form.$selects.each(function () {
				var $options = $("<ul class='hidden options'></ul>").attr('data-name', $(this).find('select').attr('name'));

				$(this).find('option').each(function (i, e) {
					$options.append('<li data-value="' + $(this).attr('value') + '">'+$(this).text().trim()+'</li>');
					$options.css('height', (i + 1) * 50);
					if (i>4) $options.addClass('scrollable');
				});
				$(this).append($options);
			});

			form.$multiselects.each(function () {
				$(this).find('select').css('opacity', 0);
				$(this).append('<span class="count-track"></span>');
			});

			form.$options = $('form .options');
			form.$options.find('li').mousedown(form.changeValue);
			form.setBaseValue(form.$options);
		},

		keySearch: function (e) {
			if (form.$currentlyOpen) {
				form.currentSearch += String.fromCharCode(e.which);
				var searchRegex = new RegExp("^("+form.currentSearch+").*", 'i'),
					found = false;
				form.$currentlyOpen.find('li').each(function () {
					if ($(this).text().trim().match(searchRegex) && !found && !$(this).hasClass('hidden')) {
						$(this).closest('.options').animate({
							scrollTop: $(this).offset().top - $(this).closest('.options').offset().top + $(this).closest('.options').scrollTop()
						}, 200);
						found = true;
					}
				});
				clearTimeout(form.searchTimeout);
				form.searchTimeout = setTimeout(function () { form.currentSearch = ""; }, 1000);
			}
		},

		uploadDisplayFilename: function () {
			$('input[type="file"]').each(function () {
				var $label = $(this).closest('.upload-wrap').find('label'),
					labelTxt = $label.text(),
					isMultiple = $(this).closest('.upload-wrap').find('.MultiFile-wrap').size();

				if ($(this).closest('ul').size()) {
					var fileName = $(this).parent('li').prev('li').find('a').text();
					$label.addClass('hasfile').text(fileName);
				}

				$(this).change(function (e) {
					var fileName;
					if( this.files && this.files.length > 1 ) fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
					else fileName = e.target ? e.target.value.split( '\\' ).pop() : false;

					if (fileName) $label.addClass('hasfile').text(fileName);
					else $label.removeClass('hasfile').text(labelTxt);
				});
			});
		},

		init: function () {
			form.changeForms();

			$(document).mousedown(form.closeAll);
			form.$selects.mousedown(form.selectToggle);

			$(window).keypress(form.keySearch);

			form.uploadDisplayFilename();
		}
	}

});



}) (jQuery);
