import PropTypes from 'prop-types'
import { RWebShare } from 'react-web-share'


const ActionButton = ({ type, articleData, selected, viewBox, data, handleArticleBookmark }) => {
    let fillValue = selected ? "#10B981" : "none"
    let strokeValue = selected ? "#10B981" : "currentColor"
    let useShare = type === "share" ? true : false
    let useBookmark = type === "bookmark" ? true : false

    let defaultButton = <button className="w-14 h-14" onClick={() => useBookmark && handleArticleBookmark(articleData)}>
        <span className="block bg-black text-gray-200 block rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill={fillValue} viewBox={viewBox} stroke={strokeValue}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d={data} />
            </svg>
        </span>
    </button>

    return (
        <div className="-mb-9 mr-2 z-10">
            {useShare && <RWebShare
                data={{
                    text: articleData.title,
                    url: articleData.url,
                    title: articleData.title,
                }}>
                {defaultButton}
            </RWebShare>
            }
            {!useShare && defaultButton}
        </div>
    )
}

ActionButton.propTypes = {
    type: PropTypes.string,
    articleList: PropTypes.shape(
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
    ),
    selected: PropTypes.bool,
    viewBox: PropTypes.string,
    data: PropTypes.string,
    handleArticleBookmark: PropTypes.func
}

export default ActionButton