import PropTypes from 'prop-types'

import ArticleView from '../ArticleView'

const ArticleBookmarkedView = (props) => {
    return (
        <div>
            {props.selectedMenu === "bookmark" && <div className="mt-14 pt-4 bg-black">
                <ArticleView
                    useMock={props.useMock}
                    articleList={props.articleList}
                    articleBookmarked={props.articleBookmarked}
                    selectedCategory={props.selectedCategory}
                    maxCharDescription={props.maxCharDescription}
                    handleGetArticle={props.handleGetArticle}
                    handleTimeFormat={props.handleTimeFormat}
                    handleArticleBookmark={props.handleArticleBookmark}
                    hasMore={props.hasMore} />
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
    articleBookmarked: PropTypes.shape({}),
    selectedMenu: PropTypes.string,
    selectedCategory: PropTypes.shape(
        {
            name: PropTypes.string,
            slug: PropTypes.string,
            title: PropTypes.string
        }
    ),
    hasMore: PropTypes.bool,
    maxCharDescription: PropTypes.number,
    handleGetArticle: PropTypes.func.isRequired,
    handleTimeFormat: PropTypes.func.isRequired,
    handleArticleBookmark: PropTypes.func.isRequired
}

export default ArticleBookmarkedView