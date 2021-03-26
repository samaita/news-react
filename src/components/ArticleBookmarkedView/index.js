import PropTypes from 'prop-types'

import ArticleView from '../ArticleView'

const ArticleBookmarkedView = ({ useMock, selectedMenu, articleList, articleBookmarked, selectedCategory, maxCharDescription, handleGetArticle, handleTimeFormat, handleArticleBookmark, hasMore }) => {
    return (
        <div>
            {selectedMenu === "bookmark" && <div className="mt-14 pt-4 bg-black">
                <ArticleView
                    useMock={useMock}
                    articleList={articleList}
                    articleBookmarked={articleBookmarked}
                    selectedCategory={selectedCategory}
                    maxCharDescription={maxCharDescription}
                    handleGetArticle={handleGetArticle}
                    handleTimeFormat={handleTimeFormat}
                    handleArticleBookmark={handleArticleBookmark}
                    hasMore={hasMore} />
            </div>}
        </div>
    )
}

ArticleBookmarkedView.propTypes = {
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

export default ArticleBookmarkedView