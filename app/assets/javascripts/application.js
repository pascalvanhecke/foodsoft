//= require jquery
//= require jquery_ujs
//= require select2
//= require twitter/bootstrap
//= require jquery.tokeninput
//= require bootstrap-datepicker/core
//= require bootstrap-datepicker/locales/bootstrap-datepicker.de
//= require bootstrap-datepicker/locales/bootstrap-datepicker.nl
//= require bootstrap-datepicker/locales/bootstrap-datepicker.fr
//= require jquery.observe_field
//= require list
//= require list.unlist
//= require list.delay
//= require list.reset
//= require rails.validations
//= require rails.validations.simple_form
//= require i18n
//= require i18n/translations
//= require_self
//= require ordering
//= require stupidtable

// allow touch devices to work on click events
//   http://stackoverflow.com/a/16221066
$.fn.extend({ _on: (function(){ return $.fn.on; })() });
$.fn.extend({
    on: (function(){
        var isTouchSupported = 'ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch;
        return function( types, selector, data, fn, one ) {
            if (typeof types == 'string' && isTouchSupported && !(types.match(/touch/gi))) types = types.replace(/click/gi, 'touchstart');
            return this._on( types, selector, data, fn, one );
        };
    }()),
});

// Load following statements, when DOM is ready
$(function() {

    // Show/Hide a specific DOM element
    $(document).on('click', 'a[data-toggle-this]', function() {
        $($(this).data('toggle-this')).toggle();
        return false;
    });

    // Remove this item from DOM
    $(document).on('click', 'a[data-remove-this]', function() {
        $($(this).data('remove-this')).remove();
        return false;
    });

    // Check/Uncheck a single checkbox
    $(document).on('click', '[data-check-this]', function() {
        var checkbox = $($(this).data('check-this'));
        checkbox.attr('checked', !checkbox.is(':checked'));
        highlightRow(checkbox);
        return false;
    });

    // Check/Uncheck all checkboxes for a specific form
    $(document).on('click', 'input[data-check-all]', function() {
        var status = $(this).is(':checked');
        var context = $(this).data('check-all');
        var elms = $('input[type="checkbox"]', context);
        for(i=elms.length-1; i>=0; --i) { // performance can be an issue here, so use native loop
          var elm = elms[i];
          elm.checked = status;
          highlightRow($(elm));
        }
    });

    // Submit form when changing a select menu.
    $(document).on('change', 'form[data-submit-onchange] select', function() {
        var confirmMessage = $(this).children(':selected').data('confirm');
        if (confirmMessage) {
            if (confirm(confirmMessage)) {
                $(this).parents('form').submit();
            }
        } else {
            $(this).parents('form').submit();
        }
        return false;
    });

    // Submit form when changing text of an input field
    // Use jquery observe_field plugin
    $('form[data-submit-onchange] input[type=text]').each(function() {
        $(this).observe_field(1, function() {
            $(this).parents('form').submit();
        });
    });

    // Submit form when clicking on checkbox
    $('form[data-submit-onchange] input[type=checkbox]:not(input[data-ignore-onchange])').click(function() {
        $(this).parents('form').submit();
    });

    $('[data-redirect-to]').bind('change', function() {
        var newLocation = $(this).children(':selected').val();
        if (newLocation != "") {
            document.location.href = newLocation;
        }
    });

    // Remote paginations
    $(document).on('click', 'div.pagination[data-remote] a', function() {
        $.getScript($(this).attr('href'));
        return false;
    });

    // Show and hide loader on ajax callbacks
    $('*[data-remote]').bind('ajax:beforeSend', function() {
        $('#loader').show();
    });

    $('*[data-remote]').bind('ajax:complete', function() {
        $('#loader').hide();
    });

    // Disable submit button on ajax forms
    $('form[data-remote]').bind('ajax:beforeSend', function() {
        $(this).children('input[type="submit"]').attr('disabled', 'disabled');
    });

    // Use bootstrap datepicker for dateinput
    $('.datepicker').datepicker({format: 'yyyy-mm-dd', language: I18n.locale});

    // bootstrap tooltips (for price)
    //   Extra options don't work when using selector, so override defaults
    //   https://github.com/twbs/bootstrap/issues/3875 . These can still be
    //   overridden per tooltip using data-placement attributes and the like.
    $.extend($.fn.tooltip.defaults, {
      html: true,
      animation: false,
      placement: 'left',
      container: 'body'
    });
    $(document).tooltip({
      selector: '[data-toggle~="tooltip"]',
    });
    
    // See stupidtable.js for initialization of local table sorting
});

// retrigger last local table sorting
function updateSort(table) {
  $('.sorting-asc, .sorting-desc', table).toggleClass('.sorting-asc .sorting-desc')
    .removeData('sort-dir').trigger('click'); // CAUTION: removing data field of plugin
}

// gives the row an yellow background
function highlightRow(checkbox) {
    var row = checkbox.closest('tr');
    if (checkbox.is(':checked')) {
        row.addClass('selected');
    } else {
        row.removeClass('selected');
    }
}

// Use with auto_complete to set a unique id,
// e.g. when the user selects a (may not unique) name
// There must be a hidden field with the id 'hidden_field'
function setHiddenId(text, li) {
  $('hidden_id').value = li.id;
}


