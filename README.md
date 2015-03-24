jQuery Form Validation Script
======================

A jQuery form validation plugin that makes it easy to add validation to existing forms. Error messages are fully customizable and translated in 22 languages. This plugin also dyncamically adds [WAI-ARIA](http://www.w3.org/WAI/intro/aria) roles to help make your form more accessibile.

![jQuery form validation example](https://raw.github.com/evernote/jquery-form-validation/master/screenshot.png)

### Supported Languages
English, Dutch, French, Spanish, German, Russian, Korean, Simplified Chinese, Traditional Chinese, Japanese, Arabic, Danish, Finnish, Indonesian, Italian, Malay, Norwegian, Portuguese, Swedish, Thai, Turkish, and Vietnamese.

## Integration
Add JavaScript reference for validate.js in your HTML.

    <script src="js/validate.min.js" type="text/javascript"></script>

Add CSS reference in your HTML.

    <link rel="stylesheet" href="css/form.css" type="text/css" media="screen">

Then use the submitForm funciton for whatever you'd like to happen after the form validates.

    <script type="text/javascript">
        window.submitForm = function(){
            // after form validation is good then
        }
    </script>

In order for the error messages to work for each of the supported languages add a lang attribute to the HTML tag. (English(en), German(de), Spanish(es))

    <html lang="en">

For each of the form fields you'd like to validate use the attribute "data-validate" and contain the field and label in a div with the class "field-item".

Examples:

    <div class="field-item">
        <label for="name">Name</label>
        <input type="text" id="name" data-validate="required">
    </div>
     <div class="field-item">
        <label for="email">Email</label>
        <input type="email" id="email" data-validate="required, email">
    </div>

## Validation options

required, name, email, zipcode, postalcode, telephone, password, url, date, year, number, alphabet, alphanumeric, ipaddress and hexvalue


## Release History
* 1.0.1: Add JSHint / clean up JS.
* 1.0.0: Initial release.

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
