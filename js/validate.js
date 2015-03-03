(function($) {
  'use strict';

  var language = document.documentElement.lang,
    valid = [],
    validationRules,
    errorMessages,
    errorType,
    formId,
    elementSelector,
    type,
    ariaError,
    errorUrl;

  errorUrl = '/data/error-messages-'+ language +'.json';

  // prevent browser default html5 validation
  $('form').attr('novalidate', 'novalidate');

  // get translated error messages
  $.ajax({
    type: 'POST',
    url: errorUrl,
    dataType: 'json',
    cache: false,
    async: false,
    success: function(result) {
      errorMessages = result;
    }
  });

  // Regex validation rules
  var validate = {
    required: /./,
    name: /^[A-Za-z ,'-]{1,255}$/,
    email: /^[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+(\.[A-Za-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.([A-Za-z]{2,})$/,
    zipcode: /^\d{5}(?:[-\s]\d{4})?$/,
    postalcode: /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/,
    telephone: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/,
    password: /^[A-Za-z0-9!#$%&'()*+,.\/:;<=>?@^_`{|}~\\[\\]\\\\-]{6,64}/,
    url: /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/,
    date: /^([1-9]|0[1-9]|[12][0-9]|3[01])\D([1-9]|0[1-9]|1[012])\D(19[0-9][0-9]|20[0-9][0-9])$/, // dd mm yyyy, d/m/yyyy, etc.
    year: /^(19|20)[\d]{2,2}$/,
    number: /^[0-9]{1,45}$/,
    alphabet: /^[A-z]+$/,
    alphanumeric: /^[a-zA-Z0-9]*$/,
    ipaddress: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
    hexvalue: /^#?([a-f0-9]{6}|[a-f0-9]{3})$/
  };

  // Error messages after validation rules
  function errorMessage(type) {
    errorType = errorMessages[type];
    return errorType;
  }

  function validationRulesLoop(validationRules, fieldId) {

    for (var i = 0; i < validationRules.length; i++) {
      // add error messages to markup
      type = validationRules[i];
      type = type.replace(' ', '');

      ariaError = fieldId + '-' + type + '-error';

      //add ARIA role required if input is required
      if (type === 'required') {
        $('#' + fieldId).attr('aria-required', 'true');
      }

      //add aria described by
      $('#' + fieldId).attr('aria-describedby', ariaError);

      // add error message to field
      $('#' + fieldId).parent('.field-item').append('<span class="error-message ' + type + '" id="' + ariaError + '" role="alert">' + errorMessage(type) + '</span>');
    }

  }

  // find all form elements on page
  $('input, select, textarea').each(function() {
    var attr = $(this).attr('data-validate');
    var fieldId = $(this).attr('id');

    if (typeof attr !== 'undefined' && attr !== false) {

      validationRules = $(this).data('validate').split(',');

      // check data attribute for validation rules
      validationRulesLoop(validationRules, fieldId);

    }
  });

  // Validate form fields function
  function validation(value, id) {

    // hide any errors already showing
    $('#' + id).parent('.field-item').find('.error-message').hide();
    // remove existing border error class
    $('#' + id).parent('.field-item').removeClass('active-error');

    //trim blank space from value
    value = $.trim(value);

    // get validation rules from data attribute
    var attr = $('#' + id).attr('data-validate');
    if (typeof attr !== 'undefined' && attr !== false) {
      // use attr instead of .data('validate') to avoid data cache
      validationRules = attr.split(',');

      // check data attribute for validation rules
      for (var i = 0; i < validationRules.length; i++) {
        var type = validationRules[i];
        type = type.replace(' ', '');
        if ((value === '' || value === null) && type === 'required' && $('#' + id).is(':visible')) {
          // show required erorr
          $('#' + id).parent('.field-item').addClass('active-error');
          $('#' + id).parent('.field-item').find('.error-message.required').fadeIn().css('display', 'block');
          $('#' + id).addClass('error-border');
          valid.push('false');
        } else if (!validate[type].test($('#' + id).val()) && value !== '') {
          // fade in error message
          $('#' + id).parent('.field-item').addClass('active-error');
          $('#' + id).parent('.field-item').find('.error-message.' + type).fadeIn().css('display', 'block');
          // add border class to the input field
          $('#' + id).addClass('error-border');
          valid.push('false');
        } else {
          $('#' + id).parent('.field-item').removeClass('active-error');
          valid.push('true');
        }
      }

    }
  }

  // on blur validate fields
  $('input, select, textarea').on('blur', function() {

    // field value
    var value = $(this).val();
    var fieldId = $(this).attr('id');

    // pass value and field id to validation function
    if (value !== '') {
      validation(value, fieldId);
    }

  });

  $('form').submit(function(event) {
    formId = event.target.id;

    if (formId === '') {
      elementSelector = 'input, select, textarea';
    } else {
      elementSelector = '#' + formId + ' input, #' + formId + ' select, #' + formId + ' textarea';
    }

    //clear valid array
    valid = [];
    event.preventDefault();
    $(elementSelector).each(function() {
      var attr = $(this).attr('data-validate');
      var fieldId = $(this).attr('id');
      var value = $(this).val();

      if (typeof attr !== 'undefined' || attr !== false) {
        // pass field values and field ids to validation function
        validation(value, fieldId);
      }
    });
    if ($.inArray('false', valid) !== -1) {
      // prevent default form submit
      event.preventDefault();
      //return false;
    } else {
      if (formId !== '') {
        submitForm(formId);
      } else {
        submitForm();
      }
    }
  });

}(jQuery));
