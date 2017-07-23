
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var streetStr = $('#street').val();
    var cityStr = $('#city').val();
    var address = streetStr + ', ' + cityStr;
    var streetviewUrl = 'http://maps.googleapis.com/maps/api/streetview?size=600x400&location=' + address;
    $greeting.text('So, you want to live at '+ address + '?');
    $body.append('<img class="bgimg" src="' + streetviewUrl + '">');

    //load nytimes articles
    var apiKey = '2e155f2912fa4a80993452ef428640cf';
    var nytimeUrl = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + cityStr + '&sort=newest&api-key=' + apiKey;
    $.getJSON(nytimeUrl, function(data){
       // console.log(data);
        $nytHeaderElem.text('New York Times Articles About ' + cityStr);
        var articles = data.response.docs;
        for(var i = 0; i < articles.length; i++) {
            var article = articles[i];
            $nytElem.append('<li class="article">'+ '<a href="'+article.web_url+'">' + article.headline.main + '</a>' + '<p>' + article.snippet + '</p>'
                +'</li>');
        };
    }).error(function(e){
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded');
    });

    //load wokipedia articles
    var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + cityStr + '&format=json&callback=wikiCallback';
    var wikiRequestTimeout = setTimeout = setTimeout(function(){
        $wikiElem.text("failed to get wikipedia resources");
    }, 8000);
    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: function(response) {
            console.log(response);
            var articleList = response[1];
            for(var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = 'http://en.wikipedia.org/wiki/' + articleStr;
                $wikiElem.append('<li><a href="' + url + '">' + articleStr + '</a></li>');
            };
            clearTimeout(wikiRequestTimeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);
