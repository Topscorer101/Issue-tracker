$(function() {
  $('#new_issue_form').submit(function(e) {
    $.ajax({
      url: '/api/issues/test',
      type: 'post',
      data: $('#new_issue_form').serialize(),
      success: function(data) {
        $('#jsonResult').text(JSON.stringify(data));
      }
    });
    e.preventDefault();
  });
  $('#update_issue_form').submit(function(e) {
    $.ajax({
      url: '/api/issues/test',
      type: 'put',
      data: $('#update_issue_form').serialize(),
      success: function(data) {
        $('#jsonResult').text(JSON.stringify(data));
      }
    });
    e.preventDefault();
  });
  $('#delete_issue_form').submit(function(e) {
    $.ajax({
      url: '/api/issues/test',
      type: 'delete',
      data: $('#delete_issue_form').serialize(),
      success: function(data) {
        $('#jsonResult').text(JSON.stringify(data));
      }
    });
    e.preventDefault();
  });
});
