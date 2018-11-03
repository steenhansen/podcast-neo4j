var LabelPositions = rootAppRequire('sff-network/show-nodes/label-positions')
var MediaShow = rootAppRequire('sff-network/show-nodes/media-nodes/media-show')
var media_constants = rootAppRequire('sff-network/media-constants');
const {BOTTOM_COLUMNS_Y_OFFSET, HORIZONTAL_COLUMNS, X_NODE_SEPARATION, Y_NODE_SEPARATION, VERTICAL_STAGGER}=LabelPositions
var build_page = rootAppRequire('./sff-network/html-pages/web-page')
var misc_helper = rootAppRequire('sff-network/misc-helper')

module.exports = function (data_repository) {

    class BookData extends MediaShow {

// maybe BooksData - plural like symfony class
        static bookPositions2(sorted_nodes, vertical_center, number_columns) {
            var book_count = BookData.arrayObjectCount(sorted_nodes)
            if (book_count) {
                var book_space = {
                    start_x: 0,
                    start_y: vertical_center + BOTTOM_COLUMNS_Y_OFFSET,
                    x_step: X_NODE_SEPARATION,
                    y_step: Y_NODE_SEPARATION,
                    num_columns: number_columns,
                    node_count: book_count
                };

                var book_positions = LabelPositions.downRightRowColumnPositions(book_space, VERTICAL_STAGGER);
                var sorted_labels = Object.keys(sorted_nodes)
                for (let sorted_label of sorted_labels) {
                    var a_node = sorted_nodes[sorted_label];
                    if (a_node.node_type == 'L_BOOK') {            //  if not static then ==this.node_type
                        var x_y = book_positions.shift();
                        a_node.setPosition2(x_y);
                    }
                }
            }
            return sorted_nodes;
        }

        static randomQualityBook() {
            var ParseNeo = rootAppRequire('sff-network/show-nodes/parse-neo')(data_repository);
            var rand_index = Math.floor((Math.random() * media_constants.QUALITY_BOOKS.length));
            var [random_title,random_author] = media_constants.QUALITY_BOOKS[rand_index];
            var under_title = misc_helper.alphaUnderscore(random_title);
            var strip_author = misc_helper.alphaUnderscore(random_author);
            return data_repository.getBookNodes(under_title)
                .then(function (graph_collection) {
                    var parse_neo = new ParseNeo(graph_collection);

                    return parse_neo.getBookGraph(strip_author)
                        .then((nodes_object)=> {
                            clog('randomQualityBook')
                            var edges_object = parse_neo.getEdges()
                            var graph_object = {
                                under_title: under_title,
                                strip_author: strip_author,
                                graph_type: 'random_book'
                            };
                            var book_html = build_page(nodes_object, edges_object, graph_object);
                            return book_html;
                        })
                })
        }

        constructor(node_id, db_version, book_title, sorted_label, under_title, strip_1_author, strip_2_author) {

            super(node_id, db_version, book_title, sorted_label);
            this.under_title = under_title;
            this.strip_1_author = strip_1_author;
            this.strip_2_author = strip_2_author;
            this.node_type = 'L_BOOK';
        }

        static arrayObjectCount(object_array) {
            return super.arrayObjectCount(object_array, 'BookData')

        }

        bookUrl(strip_author) {
            this.goto_url = `/author/book/${strip_author}/` + this.under_title;
        }

        setSizesColor(page_type) {     //L_AUTHOR
            super.setSizesColor(page_type, 'L_BOOK')
        }

        static sendBooksOfAuthor(strip_author, under_title, ParseNeo) {
            return data_repository.getBookNodes(under_title)
                .then(function (graph_collection) {

                    var parse_neo = new ParseNeo(graph_collection, 'book');

                    return parse_neo.getBookGraph(strip_author)
                        .then((nodes_object)=> {
                            clog('sendBook NOW')
                            const db_version = nodes_object[0].db_version
                            var edges_object = parse_neo.getEdges()

                            var graph_info = {
                                graph_type: 'book_page',
                                strip_author: strip_author,
                                under_title: under_title,
                                db_version: db_version
                            };
                            var nodes_and_edges = {graph_collection, nodes_object, edges_object, graph_info};   /// graph_collection for tests
                            return nodes_and_edges;
                        })
                })
        }


        static  showBook(strip_author, nodes_string) {
            var my_promises = [];
            var positioned_nodes = {};
            var sorted_labels = Object.keys(nodes_string);
            for (let sorted_label of sorted_labels) {
                var a_node = nodes_string[sorted_label];
                a_node.setGroupColor();
                a_node.bookUrl(strip_author);
                a_node.setSizesColor('L_BOOK');
                var positioned_node = Object.assign({}, a_node);
                positioned_nodes[a_node.id] = a_node;
                if (a_node.node_type === 'L_PDF') {
                    var pdf_promise = misc_helper.getRedirects(a_node, 'goto_url');
                    my_promises.push(pdf_promise)
                } else if (a_node.node_type === 'L_RSD') {
                    var rsd_promise = misc_helper.getRedirects(a_node, 'rsd_pdf_link');
                    my_promises.push(rsd_promise)
                }
            }
            return Promise.all(my_promises)
                .then((redirected_nodes)=> {
                    for (let end_url of redirected_nodes) {
                        let {end_redirect_url, node_id, field_name}=end_url;
                        positioned_nodes[node_id][field_name] = end_redirect_url;
                    }
                    var positioned_fixed = Object.values(positioned_nodes);
                    return positioned_fixed;
                })
        }


    }

    return BookData;
}




