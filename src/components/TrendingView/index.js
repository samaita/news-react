import PropTypes from 'prop-types'

const TrendingView = ({ useMock, articleList, selectedCategory, maxCharDescription, handleGetArticle, handleTimeFormat }) => {
    let LayoutArticle = []

    articleList.map(function (el, index) {
        let hasDefaultImage = el.urlToImage && el.urlToImage.includes("default")
        let isFirst = index === 0 ? true : false

        if (!isFirst) {
            return LayoutArticle
        }

        LayoutArticle.push(
            <div key={index} className="w-screen bg-black tracking-wide shadow mr-3 ">
                <div id="header" className="flex flex-col relative" onClick={() => window.location.href = el.url}>
                    <div className="bg-gray-100 w-screen h-96 block bg-cover bg-center" style={{ backgroundImage: `url(${hasDefaultImage ? el.urlToImage : el.urlToImage})` }}></div>
                    <div id="body" className="absolute flex flex-wrap content-end p-3 block w-screen h-64 bottom-0" style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1))` }}>
                        <div className="p-2">
                            <h2 id="site" className="font-light text-green-500 mb-3 text-md"><a className="border pl-3 pt-2 pb-2 pr-3 rounded-xs whitespace-nowrap border-green-500 bg-green-500 text-gray-100" href={el.url}>{el.source.name}</a></h2>
                            <h1 id="title" className="font-semibold mb-1 text-3xl leading-7 text-gray-100">{el.title}</h1>
                            <h6 id="timestamp" className="text-sm font-light text-gray-400 object-left-bottom">{handleTimeFormat(Date.parse(el.publishedAt))}{el.author ? " | " + el.author : ""}</h6>
                        </div>
                    </div>
                </div>
            </div >)

        return LayoutArticle
    })

    return (
        <div className="mt-16 block min-w-screen flex flex-row overflow-x-scroll hide-scroll-bar mb-5">
            {LayoutArticle}
        </div>
    )
}

TrendingView.propTypes = {
    useMock: PropTypes.bool,
    articleList: PropTypes.arrayOf(PropTypes.shape(
        {
            title: PropTypes.string,
            urlToImage: PropTypes.string,
            source: PropTypes.shape(
                {
                    name: PropTypes.string
                }
            ),
            publishedAt: PropTypes.string,
            bookmarked: PropTypes.bool
        }
    )).isRequired,
    selectedCategory: PropTypes.shape(
        {
            name: PropTypes.string,
            slug: PropTypes.string,
            title: PropTypes.string
        }
    ),
    handleGetArticle: PropTypes.func.isRequired,
    handleTimeFormat: PropTypes.func.isRequired
}

export default TrendingView