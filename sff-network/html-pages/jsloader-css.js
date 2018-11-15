var server_to_browser = rootAppRequire('sff-network/show-nodes/media-nodes/server-to-browser')
const CachedAuthors = rootAppRequire('sff-network/build-nodes/cached-lists/cached-authors');
const cached_authors = new CachedAuthors('author_linksss');
const CachedBooks = rootAppRequire('sff-network/build-nodes/cached-lists/cached-books');
const cached_books = new CachedBooks('books_linksss');
var media_constants = rootAppRequire('sff-network/media-constants');
const graph_container_id = media_constants.GRAPH_CONTAINER_ID;

var popup_blur = rootAppRequire('sff-network/html-pages/popup-blur.css.js');
var load_css_external = rootAppRequire('sff-network/html-pages/load-css-external')(media_constants.GRAPH_BACKGROUND, graph_container_id);
var load_scripts = rootAppRequire('sff-network/html-pages/load-scripts')('mainStart');  // mainJsStart // ie_load_second_chance


const readFilePromise = require('fs-readfile-promise');

const filter_names = rootAppRequire('sff-network/show-nodes/media-nodes/filter-names')('5535345');
const browser_code = rootAppRequire('sff-network/show-nodes/media-nodes/browser-graph');
const history_state = rootAppRequire('sff-network/html-pages/history-state');
const history_generate = rootAppRequire('sff-network/html-pages/history-generate');
const vars_events = rootAppRequire('sff-network/html-pages/vars-events');
const program_constants = fromAppRoot('sff-network/program-constants.js');
const popup_pdf = rootAppRequire('sff-network/show-nodes/media-nodes/popup-pdf')();
const popup_podcast = rootAppRequire('sff-network/show-nodes/media-nodes/popup-podcast')('3466666');
const popup_rsd = rootAppRequire('sff-network/show-nodes/media-nodes/popup-rsd')('23423423')
const popup_post = rootAppRequire('sff-network/show-nodes/media-nodes/popup-post')('9998988');
const popup_book_post = rootAppRequire('sff-network/show-nodes/media-nodes/popup-book-post')('9998988');
const sff_helpers_js = rootAppRequire('sff-network/html-pages/helper-functions');


module.exports = function the_widget(nodes_object, edges_object, graph_object, req_query_view) {
    if (graph_object.under_title) {
        var under_title = graph_object.under_title;
    } else {
        var under_title = '';
    }
    var strip_author = graph_object.strip_author;
    const js_constants = readFilePromise(program_constants, 'utf8')
    var widget_vars = server_to_browser.widgetVars(graph_container_id, nodes_object, edges_object, graph_object);
    const author_links = cached_authors.getCache(graph_object.db_version);
    const book_links = cached_books.getCache(graph_object.db_version);
    return Promise.all([js_constants, author_links, book_links])
        .then(([js_constants,  author_links, book_links])=> {

                /*
                 style=" -ms-box-orient: horizontal;
                 display: -webkit-box;
                 display: -moz-box;
                 display: -ms-flexbox;
                 display: -moz-flex;
                 display: -webkit-flex;
                 display: flex;
                 -webkit-flex-wrap: wrap;
                 flex-wrap: wrap;
                 "
                 */
                var widget_html = server_to_browser.widgetHtml(graph_container_id, author_links, book_links);
                var build_page = `

<script>
    ${vars_events}

    sff_vars.vars_events.initVars();
    ${js_constants}
    ${sff_helpers_js}
    ${history_state}
    ${history_generate}
</script>   
    
    ${load_css_external}
    ${widget_vars} 
    
<script>
    ${popup_pdf}
    ${popup_podcast}
    ${popup_rsd}
    ${popup_post}
    ${popup_book_post}
    ${filter_names}
    ${browser_code}
</script>

    ${widget_html}

<style>
   ${popup_blur.popup_blur_css}
</style>
   
   ${popup_blur.popup_blur_html}

<script>
    ${popup_blur.popup_blur_js}
    ${load_scripts}
    sff_vars.graph_procs.doGraph();
    function mainStart(polyfill_error){
        sff_vars.vars_events.initEvents();
        sff_vars.history_generate.startHistoryView('${req_query_view}', '${strip_author}', '${under_title}')
    }

</script>`;
                return build_page;

            }
        )

}

