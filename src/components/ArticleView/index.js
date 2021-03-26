
import InfiniteScroll from 'react-infinite-scroll-component'
import PropTypes from 'prop-types'

import ActionButton from '../ActionButton'
import Loader from '../Loader'

const ArticleView = ({ useMock, articleList, selectedMenu, articleBookmarked, selectedCategory, maxCharDescription, handleGetArticle, handleTimeFormat, handleArticleBookmark, hasMore }) => {
    let LayoutArticle = []

    articleList.map(function (el, index) {
        let hasDefaultImage = el.urlToImage ? true : false
        let DefaultImage = "https://images.unsplash.com/photo-1606639386377-aa1a3ed390ea?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"

        LayoutArticle.push(
            <div key={index} className="max-w-full bg-black rounded-2xl tracking-wide shadow mt-4 mb-2 pl-6 pr-6">
                <div id="header" className="flex flex-col">
                    <div className="bg-gray-100 w-full h-48 rounded-md max-h-96 bg-cover flex items-end justify-end" style={{ backgroundImage: `url(${hasDefaultImage ? el.urlToImage : DefaultImage})` }}>
                        <ActionButton
                            type="share"
                            articleData={el}
                            viewBox="-7 -7 40 40"
                            data="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                        <ActionButton
                            type="bookmark"
                            articleData={el}
                            viewBox="-7 -7 40 40"
                            data="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            selected={articleBookmarked[el.url]}
                            handleArticleBookmark={handleArticleBookmark}
                        />
                    </div>
                    <div id="body" className="flex flex-col w-full h-full p-3">
                        <h2 id="site" className="font-light text-green-500 leading-5 text-sm"><a href={el.url}>{el.source.name}</a></h2>
                        <h1 id="title" className="mb-1 text-2xl leading-7 text-gray-100">{el.title}</h1>
                        <h6 id="timestamp" className="text-sm font-light text-gray-400 object-left-bottom">{handleTimeFormat(Date.parse(el.publishedAt))}{el.author ? " | " + el.author : ""}</h6>
                        <p className="text-white text-base font-light mt-1 mb-2">{el.description && el.description.length > maxCharDescription ? el.description.substring(0, maxCharDescription) + "..." : el.description}</p>
                        <a className="text-green-500 block w-full border rounded-md p-2 text-center border-green-500" href={el.url}>Go To Website</a>
                    </div>
                </div>
            </div >)

        return LayoutArticle
    })

    return (
        <div>
            < div className="min-h-screen flex flex-col">
                <h1 className="text-2xl font-light font-bold text-gray-200 pl-6 pr-6">
                    {selectedCategory.title ? selectedCategory.title : selectedCategory.name}
                </h1>

                {!useMock && articleList.length > 0 && < InfiniteScroll
                    dataLength={articleList.length}
                    next={handleGetArticle}
                    hasMore={true}
                    loader={Loader}
                    refreshFunction={handleGetArticle}
                    pullDownToRefresh
                    pullDownToRefreshThreshold={50}
                    pullDownToRefreshContent={
                        <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
                    }
                    releaseToRefreshContent={
                        <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
                    }>
                    {LayoutArticle}
                </InfiniteScroll>}
                {useMock && LayoutArticle}
            </div >
        </div >
    )
}

ArticleView.propTypes = {
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
            publishedAt: PropTypes.string
        }
    )).isRequired,
    selectedMenu: PropTypes.string,
    selectedCategory: PropTypes.shape(
        {
            name: PropTypes.string,
            slug: PropTypes.string,
            title: PropTypes.string
        }
    ),
    hasMore: PropTypes.bool,
    handleGetArticle: PropTypes.func.isRequired,
    handleTimeFormat: PropTypes.func.isRequired,
    handleArticleBookmark: PropTypes.func.isRequired
}

export default ArticleView