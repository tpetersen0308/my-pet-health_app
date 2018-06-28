function cancel() {
  $(".js-cancel").on("click", function(event) {
    event.preventDefault();
    $("#js-content").html("");
  })
}