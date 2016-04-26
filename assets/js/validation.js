$(document).ready(function() {
  $('input[verify-target]').on('input', function() {
    var targetID = $(this).attr('verify-target');
    if ( $(this).val()!=$('input#'+targetID).val() ) {
      $(this).removeAttr('valid').attr('invalid', true);
      $('input#'+targetID).removeAttr('valid').attr('invalid', true);
    } else {
      $(this).removeAttr('invalid').attr('valid', true);
      $('input#'+targetID).removeAttr('invalid').attr('valid', true);
    }
  });
});
