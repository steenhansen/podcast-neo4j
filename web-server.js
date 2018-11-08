'use strict'


/*

 node web-server localDb-testData-every-type.config.js


 node web-server localDb-googleData.config.js


node web-server grapheneDb-testData-every-type.config.js


 node web-server grapheneDb-googleData.config.js

 */
































/*


 node web-server 


node web-server ./test-config-env.js

 http://localhost:5000/author/book/philip_k_dick/adjustment_team

 */





require('./sff-network/global-require');



const setCheckHerokuEnvVars = rootAppRequire('sff-network/heroku-config-vars');

if (process.argv[2]){
    var config_file = process.argv[2];
}else{
    var config_file = 'NO_CONFIG_FILE';

}

//let env_filename = process.argv[2];
setCheckHerokuEnvVars(config_file);


var media_constants = rootAppRequire('sff-network/media-constants');
var graph_db = rootAppRequire('sff-network/neo4j-graph-db')(media_constants.NEO4J_VERSION);


graph_db.checkDbAlive()
var misc_helper = rootAppRequire('sff-network/misc-helper')
var data_repository = rootAppRequire('sff-network/show-nodes/graph-dbs/data-repository')(graph_db);
var CachedBooksAuthors = rootAppRequire('sff-network/build-nodes/cached-lists/cached-books-authors');

/*

 > /podcast-neo4j/
 node web-server ../test-config-env       // start webserver
 node web-server ../local-config-env       // start webserver

 npm test

 C:\Users\admin\Documents\GitHub\_real_sffaudio_\sffaudio\test\call-tests.js

 */
 
 var misc_helper = rootAppRequire('sff-network/misc-helper')
 
var the_widget = rootAppRequire('sff-network/html-pages/jsloader-css')
var request = require('request');
var express = require('express');

var author_data = rootAppRequire('sff-network/show-nodes/media-types/author-show')(data_repository)
var book_data = rootAppRequire('sff-network/show-nodes/media-types/book-show')(data_repository)

var media_page = rootAppRequire('./sff-network/html-pages/web-page')
var ParseNeo = rootAppRequire('sff-network/show-nodes/parse-neo')(data_repository);

 const program_constants = rootAppRequire('sff-network/program-constants.js');


var app = express();
app.use(express.static('public', {maxAge: '1y'}))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});



app.get(program_constants.ROUTE_RESOLVE_PDF, function (req, res_express) {
  console.log('/ROUTE_RESOLVE_PDF-proxy')
    const start_pdf_url =  req.query[program_constants.SFF_START_PDF_URL];
    misc_helper.resolveRedirects(start_pdf_url)
        .then( (end_pdf_url)=>{
         res_express.send(end_pdf_url)
        } )
})


app.get('/post-proxy', function (req, res_express) {
   console.log('/post-proxy')
    const absolute_url =  req.query.absolute_url;
    const optionsStart = {
        uri: absolute_url,
        method: "GET",
        headers: {
          "Content-type": "application/text"
        }
      };
    request(optionsStart, (err, res_request, body) => {
        if (err) {
            return console.log(err);
        }
      var all_html =  body.split('<div id="contentleft">');
      var content_footer = all_html[1];
      var good_bad = content_footer.split('<h3>Similar Posts:</h3>');
      var the_post = good_bad[0];
            res_express.send(the_post)
    });
})


app.get('/mp3-proxy', function (req, res_express) {
   console.log('/mp3-proxy')
    const absolute_url =  req.query.absolute_url;
 // clog('mp3 proxy', absolute_url)
    const optionsStart = {
        uri: absolute_url,
        method: "GET",
        encoding: "binary",
        headers: {
            "Content-Disposition": "attachment; filename=rsd.mp3;",
          "Content-type": "audio/mpeg"
        }
      };
       //clog('before mp3 start')
    request(optionsStart, (err, res_request, body) => {
        if (err) {
            return console.log(err);
        }
         // clog('mp3 body', body)
       //res_express.send(body);
        res_express.type('audio/mpeg');
       res_express.end(body, 'binary');
    });

})


app.get('/pdf-proxies/pdf-proxy', function (req, res_express) {
   console.log('/pdf-proxies/pdf-proxy    PPPPPPPPPPPPPPPPPPPPPPPPPPPP' )
    const absolute_url =  req.query.absolute_url;
    const optionsStart = {
        uri: absolute_url,
        method: "GET",
        encoding: "binary",
        headers: {
          "Content-type": "application/pdf"
        }
      };
    request(optionsStart, (err, res_request, body) => {
        if (err) {
            return console.log(err);
        }
       // res_express.send(body);
        res_express.type('application/pdf');
       res_express.end(body, 'binary');
    });

})

app.get('/json-proxies/thru-proxy', function (req, res_express) {
   console.log('servering /json-proxies/thru-proxy  PPPPPPPPPPPPPPPPPP')
    const absolute_url = 'http://' + req.query.absolute_url;
    request(absolute_url, {json: true}, (err, res_request, body) => {
        if (err) {
            return console.log(err);
        }
        res_express.json(body);
    });

})


//  http://localhost:5000/?book=beyond_lies_the_wub&author=philip_k_dick&view=pdf
app.get('/author/book/:strip_author/:under_title', function (req, res) {
   console.log('servering /author/book/:strip_author/:under_title', req.params)
    let {strip_author, under_title}=req.params
    book_data.sendBooksOfAuthor(strip_author, under_title, ParseNeo)
        .then(function (nodes_and_edges) {
            let {nodes_object, edges_object} =nodes_and_edges
            var nodes_string = JSON.stringify(nodes_object);
            var edges_string = JSON.stringify(edges_object);

            if (nodes_object.length > 10) {
                var graph_physics = false;
            } else {
                var graph_physics = true;
            }
            var graph_info = {
                strip_author: strip_author,
                under_title: under_title,
                graph_type: 'book_page',
                graph_physics: graph_physics
            };
            var graph_string = JSON.stringify(graph_info);
            var author_json = {nodes_string, edges_string, graph_string}
            res.json(author_json);
        })
})

//   http://localhost:5000/book/philip_k_dick/upon_the_dull_earth


//   http://localhost:5000/author/philip_k_dick
//   http://localhost:5000/author/martin_caidin


//   http://localhost:5000/?author=philip_k_dick&view=post

// GET JSON!
//app.get('/author/:strip_author', function (req, res) {
app.get(program_constants.ROUTE_AUTHOR_JSON, function (req, res) {
   console.log('servering /author/:strip_author')
    const strip_author = req.params.strip_author
    //clog('ddddddddd333333333333', strip_author)
    author_data.sendAuthor(strip_author, ParseNeo)
        .then(function (nodes_and_edges) {
            let {nodes_object, edges_object} =nodes_and_edges
            if (nodes_object.length > 10) {
                var graph_physics = false;
            } else {
                var graph_physics = {"barnesHut": {"avoidOverlap": 1 }};
            }
            var graph_info = {strip_author: strip_author, graph_type: 'author_page', graph_physics: graph_physics};
            var nodes_string = JSON.stringify(nodes_object);
            var edges_string = JSON.stringify(edges_object);
            var graph_string = JSON.stringify(graph_info);
            var author_json = {nodes_string, edges_string, graph_string}
            res.json(author_json);
        })
})





app.get('/widget', function (req, res) {
    console.log('servering widget')
    authorOrBook(req).then(function (nodes_and_edges) {
        let {nodes_object, edges_object, graph_info} =nodes_and_edges
        the_widget(nodes_object, edges_object, graph_info)
            .then(
        //       (widget_html)=> console.log(widget_html)
            (widget_html)=> res.send(widget_html)
            
            );
    })
})

app.get('/load', function (req, res) {
    console.log('servering load')
    
     var url_update = rootAppRequire('sff-network/build-nodes/graph-dbs/reload-url-db.js');
    url_update()
            .then(
        //       (widget_html)=> console.log(widget_html)
            (new_db_version)=> res.send(new_db_version)
            
            );
})

function authorOrBook(req) {
   console.log('servering authorOrBook')
    if (CachedBooksAuthors.urlGetAuthorBook(req.query, 'book')) {
        var under_title = req.query.book;
             var strip_author = req.query.author;
    }else if (CachedBooksAuthors.urlGetAuthorBook(req.query, 'author')) {
        var strip_author = req.query.author;
    } else {
        var random_author = author_data.randomGoodAuthor();
        var strip_author = misc_helper.alphaUnderscore(random_author);
    }
    if (typeof under_title !== 'undefined') {
        return book_data.sendBooksOfAuthor(strip_author, under_title, ParseNeo);
    } else {
        console.log('authororBook ', strip_author, '__')
        return author_data.sendAuthor(strip_author, ParseNeo);
    }
}

// http://localhost:5000/
//   http://localhost:5000/?author=philip_k_dick&view=post
app.get('/', function (req, res) {
    console.log('servering / ==', req.query)
    authorOrBook(req).then(function (nodes_and_edges) {
        let {nodes_object, edges_object, graph_info} =nodes_and_edges;
                console.log('view', req.query.view)
        if (typeof req.query.view === 'undefined'){
            var query_view = '';
        }else{
            var query_view = req.query.view;
        }        
        media_page(nodes_object, edges_object, graph_info, query_view)
            .then((book_html)=> res.send(book_html));
    })

})

app.get('', function (req, res) {
    console.log('servering {}==', req.query)
    authorOrBook(req).then(function (nodes_and_edges) {
        let {nodes_object, edges_object, graph_info} =nodes_and_edges;
        media_page(nodes_object, edges_object, graph_info)
            .then((book_html)=> res.send(book_html));
    })

})


app.set('port', process.env.PORT)
var node_port = app.get('port')
app.listen(node_port).on('error', function (e) {
    console.log(e)
    process.exit()
})
