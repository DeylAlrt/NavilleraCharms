$('.nav-logo').each(function() {
  var link = $(this).html();
  $(this).contents().wrap('<a href="https://navilleracharms.vercel.app/"></a>');
});