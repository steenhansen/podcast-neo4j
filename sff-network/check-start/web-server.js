'use strict'


var media_constants = rootAppRequire('sff-network/media-constants');
var graph_db = rootAppRequire('sff-network/neo4j-graph-db')(media_constants.NEO4J_VERSION);


graph_db.checkDbAlive()
var misc_helper = rootAppRequire('sff-network/misc-helper')
var data_repository = rootAppRequire('sff-network/show-nodes/graph-dbs/show-repository')(graph_db);
var CachedBase = rootAppRequire('sff-network/build-nodes/cached-lists/cached-base');


var misc_helper = rootAppRequire('sff-network/misc-helper')

var the_widget = rootAppRequire('sff-network/html-pages/jsloader-css')
var request = require('request');
var express = require('express');

var author_data = rootAppRequire('sff-network/show-nodes/media-types/author-show')(data_repository)
var book_data = rootAppRequire('sff-network/show-nodes/media-types/book-show')(data_repository)

var media_page = rootAppRequire('./sff-network/html-pages/web-page')
var ParseNeo = rootAppRequire('sff-network/show-nodes/parse-neo')(data_repository);

const program_constants = rootAppRequire('sff-network/program-constants.js');

//var CachedDefaults = rootAppRequire('sff-network/build-nodes/cached-lists/cached-default');

var app = express();
app.use(express.static('public', {maxAge: '1y'}))

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


app.get(program_constants.ROUTE_RESOLVE_PDF, function (req, res_express) {
    const start_pdf_url = req.query[program_constants.SFF_START_PDF_URL];
    misc_helper.resolveRedirects(start_pdf_url)
        .then((end_pdf_url)=> {
            var secure_pdf_url = end_pdf_url.replace('http://', 'https://');

            res_express.send(secure_pdf_url)
        })
})

app.get(media_constants.ROUTE_POST_PROXY, function (req, res_express) {
    const absolute_url = req.query.absolute_url;
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
        var all_html = body.split('<div id="contentleft">');
        var content_footer = all_html[1];
        var good_bad = content_footer.split('<h3>Similar Posts:</h3>');
        var the_post = good_bad[0];
        res_express.send(the_post)
    });
})


//  http://localhost:5000/?book=beyond_lies_the_wub&author=philip_k_dick&view=pdf
//app.get('/author/book/:strip_author/:under_title', function (req, res) {
app.get(program_constants.ROUTE_BOOK_JSON, function (req, res) {
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
    const strip_author = req.params.strip_author
    author_data.sendAuthor(strip_author, ParseNeo, 0)
        .then((nodes_and_edges) => {
            var author_json = author_data.authorJson(strip_author, nodes_and_edges);
            res.json(author_json);
        })
})


app.get('/widget', function (req, res) {
    authorOrBook(req).then(function (nodes_and_edges) {
        let {nodes_object, edges_object, graph_info} =nodes_and_edges
        the_widget(nodes_object, edges_object, graph_info)
            .then(
                (widget_html)=> res.send(widget_html)
            );
    })
})

// app.get('/load', function (req, res) {
//    
//      var url_update = rootAppRequire('sff-network/build-nodes/graph-dbs/reload-url-db.js');
//     url_update()
//             .then(
//             (new_db_version)=> res.send(new_db_version)
//            
//             );
// })

function authorOrBook(req) {
    if (CachedBase.urlGetAuthorBook(req.query, 'book')) {
        var under_title = req.query.book;
        var strip_author = req.query.author;
        return book_data.sendBooksOfAuthor(strip_author, under_title, ParseNeo);
    } else if (CachedBase.urlGetAuthorBook(req.query, 'author')) {
        var strip_author = req.query.author;
        return author_data.sendAuthor(strip_author, ParseNeo, 0);
    } else {
        return author_data.randomGoodAuthor()
            .then((random_author)=> {
                strip_author = misc_helper.alphaUnderscore(random_author);
                return author_data.sendAuthor(strip_author, ParseNeo, 0);
            })

    }
    // if (typeof under_title !== 'undefined') {
    //     return book_data.sendBooksOfAuthor(strip_author, under_title, ParseNeo);
    // } else {
    //     return author_data.sendAuthor(strip_author, ParseNeo,0);
    // }
}

// http://localhost:5000/
//   http://localhost:5000/?author=philip_k_dick&view=post
app.get('/', function (req, res) {
    if (typeof req.query['author'] === 'undefined' && typeof req.query['book'] === 'undefined') {
        var CachedDefaults = rootAppRequire('sff-network/build-nodes/cached-lists/cached-default');
        var cached_defaults = new CachedDefaults();
        var default_string_or_promise = cached_defaults.getCache();
        Promise.all([default_string_or_promise])
            .then((nodes_and_edges_arr)=> {
                    var nodes_and_edges_str = nodes_and_edges_arr[0];
                    return nodes_and_edges_str;
                }
            )
            .then(function (nodes_and_edges_str) {
                if (typeof req.query.view === 'undefined') {
                    var query_view = '';
                } else {
                    var query_view = req.query.view;
                }
                media_page({}, {}, {}, query_view, nodes_and_edges_str)
                    .then((book_html)=> res.send(book_html));
            })
    } else {
        authorOrBook(req)
              .then(function (nodes_and_edges) {
                let {nodes_object, edges_object, graph_info} =nodes_and_edges;
                if (typeof req.query.view === 'undefined') {
                    var query_view = '';
                } else {
                    var query_view = req.query.view;
                }
                media_page(nodes_object, edges_object, graph_info, query_view, '{}')
                    .then((book_html)=> res.send(book_html));
            })
    }

})

app.get('*', function (req, res) {

    res.status(204);
})


app.set('port', process.env.PORT)
var node_port = app.get('port')
app.listen(node_port).on('error', function (e) {
    console.log(e)
    process.exit()
})
