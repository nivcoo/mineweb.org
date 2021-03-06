function initForms() {

  $('form[data-ajax]').unbind('submit')

  $('form[data-ajax]').on('submit', function(e) {

    // On empêche la redirection
      e.preventDefault()

    // On set quelques variables
      var form = $(this)
      var submit_btn = $(this).find('button[type="submit"]')
      var submit_btn_content = submit_btn.html() // On récupère le contenu du bouton pour le remettre plus tard

    if (form.attr('data-no-alert') === undefined) {
      // On met en place la div de message si elle existe pas encore
        if ($(form).find('div.ajax-msg').length == 0) {
          $(form).prepend('<div class="ajax-msg"></div>')
        }
        var msg = $(form).find('div.ajax-msg')

      // On met le message de chargement
        msg.hide().html('<div class="alert alert-info">'+locals.LOADING_MSG+'</div>').fadeIn(200)
    }

    // On désactive le bouton de submit
      submit_btn.addClass('disabled').attr('disabled', true).html(locals.LOADING_MSG)

    // On vire les éventuelles classes d'erreurs
      form.find('.has-danger').each(function() {
        $(this).removeClass('has-danger')
      })
      form.find('.form-control-danger').each(function() {
        $(this).removeClass('form-control-danger')
      })
      form.find('.form-control-feedback').remove()

    // On récupère les données
      if (form.attr('data-custom-data-formatter') === undefined)
        var inputs = (window.FormData) ? new FormData(form[0]) : null
      else
        var inputs = window[form.attr('data-custom-data-formatter')](form)

      var captcha = (typeof grecaptcha !== 'undefined')


    // On effectue la requête
      $.ajax ({
        url: form.attr('action'),
        data: inputs,
        method: form.attr('method'),
        dataType: 'json',
        contentType: (!form.attr('data-contentType')) ? false : form.attr('data-contentType'),
        processData: (!form.attr('data-processData')) ? false : form.attr('data-processData'),
        success: function (json) {

          if (json.status === true) {

            if ((form.attr('data-success-msg') === undefined || form.attr('data-success-msg') == "true") && form.attr('data-no-alert') === undefined) {
              msg.html('<div class="alert alert-success"><b>'+locals.SUCCESS_MSG+' :</b> '+json.msg+'</div>').fadeIn(200)
            }
            if (form.attr('data-custom-callback') !== undefined) {
              var func = window[form.attr('data-custom-callback')](inputs, json)
              if (!func)
                return submit_btn.html(submit_btn_content).removeClass('disabled').attr('disabled', false)
            }
            if (form.attr('data-redirect-url') !== undefined && QueryString.from === undefined) {
              document.location.href=form.attr('data-redirect-url')+'?'+ (new Date()).getTime()
            }  else if (QueryString.from !== undefined && form.attr('data-no-redirect-from') === undefined) {
              return document.location.href=QueryString.from+'?'+ (new Date()).getTime()
            }

            if(captcha) {
              grecaptcha.reset();
            }

            submit_btn.html(submit_btn_content).removeClass('disabled').attr('disabled', false)

          } else if (json.status === false) {


            // On met des erreurs HTML directement si il y a une erreur
              if (json.inputs !== undefined && typeof json.inputs === 'object' && form.attr('data-no-alert') === undefined) {
                for (var input_name in json.inputs) {

                  // On set les variables
                  if (input_name.indexOf('[') === -1)
                    var input = form.find('[name='+input_name+']');
                  else
                    var input = form.find('[name="'+input_name+'"]');

                  if (typeof input === 'object')
                    input = input[0]

                  if ($(input).attr('data-form-no-display-error') === undefined) {
                    var form_group = $(input).parent();

                    // On met l'HTML
                    form_group.addClass('has-danger');
                    $(input).addClass('form-control-danger');
                    $('<div class="form-control-feedback">'+json.inputs[input_name]+'</div>').insertAfter(input);
                  }
                }
              }

            if(captcha) {
              grecaptcha.reset();
            }

            if (form.attr('data-no-alert') === undefined)
              msg.html('<div class="alert alert-danger"><b>'+locals.ERROR_MSG+' :</b> '+json.msg+'</div>').fadeIn(200)
            submit_btn.html(submit_btn_content).removeClass('disabled').attr('disabled', false)

          } else {

            if (form.attr('data-no-alert') === undefined)
              msg.html('<div class="alert alert-danger"><b>'+locals.ERROR_MSG+' :</b> '+locals.INTERNAL_ERROR_MSG+'</div>')
            submit_btn.html(submit_btn_content).removeClass('disabled').attr('disabled', false)

          }
        },
        error : function (xhr, textStatus, errorThrown) {

          if (form.attr('data-no-alert') === undefined) {
            if (xhr.status == "403") {
              if (xhr.responseJSON === undefined || xhr.responseJSON.msg === undefined) {
                msg.html('<div class="alert alert-danger"><b>'+locals.ERROR_MSG+' :</b> '+locals.FORBIDDEN_ERROR_MSG+'</div>')
              } else {
                msg.html('<div class="alert alert-danger"><b>'+locals.ERROR_MSG+' :</b> '+xhr.responseJSON.msg+'</div>')
              }
            } else {
              if (xhr.responseJSON === undefined || xhr.responseJSON.msg === undefined) {
                msg.html('<div class="alert alert-danger"><b>'+locals.ERROR_MSG+' :</b> '+locals.INTERNAL_ERROR_MSG+'</div>')
              } else {
                msg.html('<div class="alert alert-danger"><b>'+locals.ERROR_MSG+' :</b> '+xhr.responseJSON.msg+'</div>')
              }
            }
          }

          if(captcha) {
            grecaptcha.reset();
          }

          submit_btn.html(submit_btn_content).removeClass('disabled').attr('disabled', false)
        }
      })


  })

}

initForms()
