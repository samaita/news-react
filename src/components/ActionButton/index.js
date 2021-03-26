import PropTypes from 'prop-types'
import { RWebShare } from 'react-web-share'

const ActionButton = (props) => {
    let fillValue = props.selected ? "#10B981" : "none"
    let strokeValue = props.selected ? "#10B981" : "currentColor"
    let useShare = props.type === "share" ? true : false
    let useBookmark = props.type === "bookmark" ? true : false

    let defaultButton = <button className="w-14 h-14" onClick={() => useBookmark && props.handleArticleBookmark(props.articleData)}>
        <span className="block bg-black text-gray-200 block rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill={fillValue} viewBox={props.viewBox} stroke={strokeValue}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d={props.data} />
            </svg>
        </span>
    </button>

    return (
        <div className="-mb-9 mr-2 z-10">
            {useShare && <RWebShare
                data={{
                    text: props.articleData.title,
                    url: props.articleData.url,
                    title: props.articleData.title,
                }}>
                {defaultButton}
            </RWebShare>
            }
            {!useShare && defaultButton}
        </div>
    )
}

ActionButton.propTypes = {
    type: PropTypes.string.isRequired,
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
    viewBox: PropTypes.string.isRequired,
    data: PropTypes.string.isRequired,
    handleArticleBookmark: PropTypes.func
}

export default ActionButton