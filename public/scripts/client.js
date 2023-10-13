/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

$(document).ready(function () {

  // prevent xss with escape function
  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  // loop through tweets database of array of objects and prepend to html section
  const renderTweets = function (tweetObjArray) {
    for (let tweet of tweetObjArray) {
      let layout = createTweetElement(tweet);
      $(".main-tweets-container").prepend(layout);
    }
  };

  // take values from tweets database and dynamically create a new tweet
  const createTweetElement = function (tweetData) {

    const $tweet = `
  <article class="tweets">
    <header class="tweet-item">
      <div><img src=${escape(tweetData.user.avatars)}></div>
      <p>${escape(tweetData.user.name)}</p>
      <p>${escape(tweetData.user.handle)}</p>
    </header>
    <div class="tweet-item">
      <p>${escape(tweetData.content.text)}</p>
    </div>
    <footer class="tweet-item">
      <div>
          ${timeago.format(escape(tweetData.created_at))}
      </div>
      <div>
      <i class="fa-solid fa-flag"></i>
      <i class="fa-solid fa-retweet"></i>
      <i class="fa-solid fa-heart"></i>
      </div>
  </footer>
</article>`

    return $tweet;
  };

  // on submit post request, check if tweet is blank or >140 characters
  $("form").on("submit", function (event) {
    event.preventDefault();
    const tweetText = $("#tweet-text").val();
    const errorBox = $(".error-box");
    const errorMsg = $(".error-msg");

    if (tweetText.length > 140) {
      errorBox.css("display", "flex");
      errorMsg.text("Your tweet cannot be more than 140 characters");
    } else if (!tweetText) {
      errorBox.css("display", "flex");
      errorMsg.text("The tweet cannot be left blank");
    } else {
      errorBox.css("display", "none");
      let serializedData = $(this).serialize();
      $.ajax({
        type: "POST",
        url: "/tweets",
        data: serializedData,
      })
        .then(() => {
          $("form")[0].reset();
          $("output").text("140");
          loadTweets();
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  });

  // fetches the tweet data from the url
  const loadTweets = function () {
    $.ajax("http://localhost:8080/tweets", { method: "GET" })
      .then(function (data) {
        $(".main-tweets-container").empty();
        renderTweets(data);
      });
  };

  loadTweets();
});