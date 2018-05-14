(function ($) {
   $.fn.serializeFormJSON = function () {

       var o = {};
       var a = this.serializeArray();
       $.each(a, function () {
           if (o[this.name]) {
               if (!o[this.name].push) {
                   o[this.name] = [o[this.name]];
               }
               o[this.name].push(this.value || '');
           } else {
               o[this.name] = this.value || '';
           }
       });
       return o;
   };
})(jQuery);

// var placeholders = ['ignorance','moral','paranoia','unity','equality'];

// (function cycle() {

//     var placeholder = placeholders.shift();
//     $('input').attr('placeholder',placeholder);
//     placeholders.push(placeholder);
//     setTimeout(cycle,1000);

// })();

var typed = new Typed('#typed', {
  strings: ['ignorance','moral','paranoia','unity','equality'],
    typeSpeed: 60,
    backSpeed: 60,
    attr: 'placeholder',
    bindInputFocusEvents: true,
    loop: true
});

var shiftLabel = ["structure", "meaning", "value", "patterns", "perspective"]
var w = 0
var interval

var container_shift = document.querySelector(".shift")
var word_shift = container_shift.querySelector("span")

container_shift.addEventListener("mouseover", function() {
  interval_shift = setInterval(function() {
    word_shift.textContent = shiftLabel[w = (w + 1) % shiftLabel.length]
  }, 500)
});
container_shift.addEventListener("mouseout", () => {
  clearInterval(interval_shift)
  word_shift.textContent = ""
});

var questionLabel = ["ideology", "symbolism", "division", "yourself"]
var w = 0
var interval

var container_question = document.querySelector(".question")
var word_question = container_question.querySelector("span")

container_question.addEventListener("mouseover", function() {
  interval_question = setInterval(function() {
    word_question.textContent = questionLabel[w = (w + 1) % questionLabel.length]
  }, 500)
});
container_question.addEventListener("mouseout", () => {
  clearInterval(interval_question)
  word_question.textContent = ""
});

// click the link to add a new class: see CSS
$('.trigger').click(function(e){
  e.preventDefault();
  $('.info-tab').toggleClass('scroll-into-view');
});

var positonCard = function(){

  var claimedWidth = 0;
  var claimedHeight = 0;
  var containerXLimit = $('.container').width() - 200;
  var containerYLimit = $('.container').height() - 200;
  var limitX = (containerXLimit);
  var limitY = (containerYLimit);
  var randomPosition = {
    'x': Math.floor(Math.random() * (limitX+1)),
    'y': Math.floor(Math.random() * (limitY+1))
  }

  //   cardPositionData.push(randomPosition);

  return randomPosition
};

jQuery(document).ready(function($) {

  var $twitterIndexEl = $("#tweetIndex");

  // Settings for the twitter api. These settings will get updated based on what the web user requests.
  var appSettings = {
    twitter: {
      // url: 'http://localhost:5000/search?',
      url: 'https://wb-thesis-twitter-api.herokuapp.com/search?',
      keyword: '',
      count: 10,
    },
    news: {
      url: 'https://newsapi.org/v2/everything?',
      keyword: '',
      count: 8,
      sources: 'cnn,bbc-news,abc-news,business-insider,fox-news,nbc-news,the-economist,the-huffington-post,the-new-york-times,the-washington-poster,time,usa-today',
      from: '2017-01-01',
      sortBy: 'relevance'
    }
  }

  var twitterCards = [];

  var draggableTwitterCards = function(){
    // postion the starting twitter cards
    $.each($('.draggable'), function(i, el) {
      this.data = positonCard();

      console.log('randomPosition: ', this.data);

      $(el).css({        
        'top': this.data.y,
        'left': this.data.x      
      });    
    });

    // target elements with the "draggable" class
    interact('.draggable')
      .draggable({
        inertia: true,
        restrict: {
          restriction: "parent",
          endOnly: true,
          elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        // enable autoScroll
        autoScroll: true,
        onmove: dragMoveListener,
        onend: function (event) {

          console.log("card dropped");
        }
      });

      function dragMoveListener (event) {
        var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.webkitTransform =
        target.style.transform =
          'translate(' + x + 'px, ' + y + 'px)';

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);

        console.log("card picked up");
      }

      window.dragMoveListener = dragMoveListener;
  };

  var clickableArticles = function($newsIndexEl){

    // the number of twitter cards to reveal with each click
    var revealAmount = 1;
    var zIndex=1;

    // when you click on a article....
    $newsIndexEl.find('li').click(function(e){

      // dont' do anything if there's no more cards to show
      if (twitterCards.length < 1) {
        twitterCardsComplete()
        return
      }

      // scan through the list of twitter cards...
      for (var i = twitterCards.length - 1; i >= 0; i--) {

        // show the card
        $(twitterCards[i].el).removeClass('invisible').addClass('visible').css('z-index',zIndex);
          zIndex++;
        // if we've reached the limit to show...
        if (i === (twitterCards.length - revealAmount)) {

          // remove those from the list
          twitterCards = twitterCards.slice(0, -revealAmount);

          // and leave this loop
          return
        }
      }
    });
  };

  var newsAPP = function(){
    var $newsIndexEl = $("#articles");

    window.newsAPIRequest = function() {
      var url = appSettings.news.url+'q='+appSettings.news.keyword+'&sources='+appSettings.news.sources+'&from='+appSettings.news.from+'&sortBy='+appSettings.news.sortBy+'&pageSize='+appSettings.news.count+'&apiKey=2fb8d69a2bfd432995f5a06a37a9d273';

      var jqxhr = $.getJSON(url, function(data) {
        console.log("news data", data);

        // empty any existing results
        $newsIndexEl.empty();

        $.each(data.articles, function( index, obj ) {
          console.log( obj );
          $newsIndexEl.append("<li class='col-sm-12 col-md-3'><h5>"+obj.source.name+"</h5><h2>"+obj.title+"</h2><p>"+obj.description+"</p</li>");
        });

        clickableArticles($newsIndexEl);

        // now get the tweets
        window.tweetSearch();

      }).done(function() {
        console.log("second success");
      }).fail(function() {
        console.log("error");
      }).always(function() {
      });
    };
  };

  var twitterApp = function(){
    // assign our html elements to variables here
    // var $twitterSearchFormEL = $("#twitterSearch")

    // render the results from the Node App to our html
    var renderTweetSearch = function(data){

      // clear any pre-existing tweets
      $('#tweetIndex').find('.draggable').not( '.introComment').remove()

      // loop through twitter cards and render them....
      $.each(data.statuses, function(index, obj) {
        this.id = "card-"+index;
        $twitterIndexEl.append("<li class='draggable "+this.id+" invisible'><a class = 'twitterQuote'>"+obj.full_text+"</a><h4>Twitter User "+obj.user.screen_name+"</h4</li>");

        twitterCards.push({
          'el': $twitterIndexEl.find('.'+this.id)
        });
      });

      // initiate the twitter card draggable feature
      draggableTwitterCards();
    };

    // make an API request to the Node App
    window.tweetSearch = function(){

      // create the url using the node api app and our search paramters from the html form
      this.requestUrl = appSettings.twitter.url+appSettings.twitter.keyword+"&count="+appSettings.twitter.count

      // make the request!
      $.getJSON(this.requestUrl, null, function(data) {
        console.log(data)

        // we got the data - now its time to render the results into html
        renderTweetSearch(data);
        scrollDown();
      });
    };
  };

  var reloadTwitterAppWithComments = function(commentData){
    var twitterCards = [];
    var zIndex = 1;
    $twitterIndexEl.empty();

    // loop through twitter cards and render them....
    $.each(commentData, function(index, object) {
      this.id = "card-"+index;

      if (object.comment) {
        $twitterIndexEl.append("<li class='draggable "+this.id+" invisible'><a>"+object.comment+"</a></li>");

        twitterCards.push({
          'el': $twitterIndexEl.find('.'+this.id)
        });
      }
    });

    // initiate the twitter card draggable feature
    $.when(draggableTwitterCards()).then(()=> {

      // scan through the list of twitter cards...
      for (var i = twitterCards.length - 1; i >= 0; i--) {

        // show the card
        $(twitterCards[i].el).removeClass('invisible').addClass('visible').css('z-index', zIndex);

        zIndex++;

        // remove those from the list
        twitterCards = twitterCards.slice(0, -1);
      }
    });
    return
  }

  var scrollDown = function(){
    $('html, body').animate({
        scrollTop: $("#articles").offset().top-100
    },1000);
    $('.container').addClass('commentReady');
  }

  var formWatcher = function(){
    var $appSearchFormEL = $("#appSearch");

    // when the twitter search form element submits...
    $appSearchFormEL.submit(function(event) {
      event.preventDefault();
      formData = $(this).serializeFormJSON();
      $("body").addClass("activeSearch");

      // serialize the form input values and pass them to the appSettings obj
      appSettings.twitter.keyword = $(this).serialize();
      appSettings.news.keyword = formData.keyword;
      window.newsAPIRequest();
    });
  };

  function twitterCardsComplete(){
    $(".submitComment").addClass("submitCommentActive")
  }

  function commentSubmitted(){

    // hide the form...
    $(".submitComment").removeClass("submitCommentActive");

    // get all the comments from firebase
    firebase.database().ref('/comments').once('value').then(function(snapshot) {
      var data = snapshot.val();

      // reload the twitter comments with the data
      reloadTwitterAppWithComments(data);

      // hide the articles
      $('#articles').addClass("articlesInactive");
    });
  }

  function writeUserData(id, newComment) {

    let ref = firebase.database().ref('comments/' + id);
    ref.set({comment: newComment}).then(() => {
      console.log("done!");
      commentSubmitted();
    });
  }

  $('#submission').submit(function(event) {
      event.preventDefault()
      console.log("submit...");

      var comment = $("#submission :input").serializeArray();
      var id = Math.round(new Date().getTime()/1000);

      writeUserData(id, comment[0].value);

      return false
  });

  // init
  newsAPP();
  twitterApp();
  formWatcher();
});




