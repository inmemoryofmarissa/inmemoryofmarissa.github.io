//ver 2

var dateFormat = 'MMMM d, yyyy';

$(document).ready(function() {

  retrieveAndDisplayData();

  $('#privateComment').change(function () {
    if ($(this).prop('checked')) {
      $('#privateToggle').val("No")
    } else { $('#privateToggle').val("Yes") }
  });

  var $form = $('form#gravesideComments');
  var submitUrl = 'https://script.google.com/macros/s/AKfycbzLhmP3rffTHzdEgv0uX5G9bF7bZed1X88TPSy_-V0Gi6bQrmvW/exec';

  $('#submit-form').on('click', function(e) {
    e.preventDefault();

    var jqxhr = $.ajax({
      url: submitUrl,
      method: "GET",
      dataType: "json",
      data: $form.serializeObject()
    }).done(function (results) {
      $form.addClass('d-none');
      $('div#formThanks').removeClass('d-none');
      displayNewComment(results.data);
    });
  })
});

function displayNewComment(data)
{
  var commentContainer = $('#commentDisplay');
  var commentTemplate = commentContainer.find('#commentTemplate')
  var currentComment = commentTemplate.clone();

  var public = data[0];
  var name = data[1];
  var comment = data[2];
  var timestamp = data[3];

  //console.log(public + name + comment + timestamp);

  if (public == "Yes") {
    currentComment.find('.commentTimestamp').text($.format.date(timestamp, dateFormat));
    currentComment.find('.commenter').text(name);
    currentComment.find('.comment').text(comment);
    currentComment.removeClass('d-none');

    currentComment.attr("id","submittedComment");
    commentContainer.prepend(currentComment);

    $('#loadingComments').addClass("d-none")
  }
}

function retrieveAndDisplayData() {
  var retrieveUrl = 'https://script.google.com/macros/s/AKfycbzY1k26IqDpZd5cRvKikSz9pZLYturikpitDWb4qQZ4VjS54Nk/exec';

  var temp = $.ajax({
    url: retrieveUrl,
    method: "GET",
    dataType: "json"
  }).done(function (result) {
    //console.log(result)

    var data = result.data;

    console.log(data)

    if (data.length > 1) { 
      var exit = true;
      for (i = 1; i < data.length; i++) {
        if (data[i][0] == "Yes") { exit = false;}
      }

      if (exit) {
        $('#loadingComments').text("No comments yet...");
        return; 
      } else {
        $('#loadingComments').addClass("d-none");
      }
    } else
    {
      $('#loadingComments').text("No comments yet...");
      return; 
    }

    var commentContainer = $('#commentDisplay');
    var commentTemplate = commentContainer.find('#commentTemplate')

    for (i = 1; i < data.length; i++) {
      var currentComment = commentTemplate.clone();

      var public = data[i][0];
      var name = data[i][1];
      var comment = data[i][2];
      var timestamp = data[i][3];
      
      //console.log(public + name + comment + timestamp);

      if (public == "Yes") {
        currentComment.find('.commentTimestamp').text($.format.date(timestamp, dateFormat));
        currentComment.find('.commenter').text(name);
        currentComment.find('.comment').text(comment);
        currentComment.removeClass('d-none');

        currentComment.attr("id",i);
        commentContainer.prepend(currentComment);
      }
    }
  })
}
