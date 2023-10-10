$(document).ready(function () {

  const tweet = $("#tweet-text")

  tweet.on("input", function () {
    let counter = 140;
    const userInput = $(this).val();
    const charactersLeft = counter - userInput.length
    $(".counter").html(charactersLeft)
    if (charactersLeft < 0) {
      $(".counter").addClass("over-limit")
    } else {
      $(".counter").removeClass("over-limit")
    }
  });

});