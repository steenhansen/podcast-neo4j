
// colors-sizes

var media_sizes = {

    L_AUTHOR: {
        NODE_SIZES: {
            L_AUTHOR: 30, L_BOOK: 10, L_AUTHOR_POST: 30, L_AUTHOR_WIKI: 30
        },
        FONT_COLORS: {
            L_AUTHOR: 'black',
            L_BOOK: 'white',
            L_AUTHOR_POST: 'white',
            L_AUTHOR_WIKI: 'white'
        },
        FONT_SIZES: {
            L_AUTHOR: 32, L_BOOK: 16, L_AUTHOR_POST: 16, L_AUTHOR_WIKI: 16
        },
        ICON_COLORS: {
            L_AUTHOR: 'pink', L_BOOK: 'bla', L_AUTHOR_POST: '#0ff', L_AUTHOR_WIKI: '#f00'         // we 
        }
    },
    L_BOOK: {
        NODE_SIZES: {
           L_BOOK: 60, L_AUTHOR: 20,  L_BOOK_POST: 20, L_AUTHOR_WIKI: 20, L_RSD: 20, L_PDF:20
        },
        FONT_COLORS: {
          L_BOOK: 'black',
            L_AUTHOR: 'white',
          
            L_BOOK_POST: 'white',
            L_PODCAST: 'white',
             L_RSD: 'white',
            L_BOOK_WIKI: 'white',
            L_PDF: 'white',
            L_PAGE_PODCASTS: 'white',
            L_PAGE_PDFS: 'white',
            L_PAGE_RSDS: 'white'
        },
        FONT_SIZES: {
            L_BOOK: 32,L_AUTHOR: 12,  L_BOOK_POST: 12, L_AUTHOR_WIKI: 12, L_RSD: 12, L_PDF:12
        },
        ICON_COLORS: {
        // NB, inject these colors as the base color, so the L_PDF should be red, but we can make the swirl blue instead, as we gotta do the background anyways
            L_BOOK: 'black',L_AUTHOR: 'white',  L_BOOK_POST: 'white', L_AUTHOR_WIKI: 'white', L_RSD: 'white', L_PDF: 'white'
        }
    }

}
module.exports = media_sizes;
