import PropTypes from 'prop-types'

import Loader from '../Loader'

const Header = (props) => {
    let fillValue = props.cache.selectedMenu === "bookmark" ? "#10B981" : "none"
    let strokeValue = props.cache.selectedMenu === "bookmark" ? "#10B981" : "currentColor"
    let toggleBookmark = props.cache.selectedMenu === "bookmark" ? "home" : "bookmark"

    return (
        <div>
            <div className="w-screen top-0 fixed bg-black h-16 z-30 border-b border-white">
                <div className="h-16 w-16 text-gray-200 float-left" onClick={() => props.handleSetCache("isDisplayMenu", !props.cache.isDisplayMenu)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-12 -12 48 48" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </div>
                <div className="float-left text-white py-2 font-bold" onClick={() => props.handleSetCache("selectedMenu", "home")}>
                    <h1 className="text-xl text-green-500">LAMPU NEON</h1>
                    <p className="text-xs font-light">Berita Teknologi Apa Adanya</p>
                </div>
                <div className="h-16 w-16 text-gray-200 float-right" onClick={() => props.handleSetCache("selectedMenu", toggleBookmark)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill={fillValue} viewBox="-12 -12 48 48" stroke={strokeValue}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            </div >
            <Loader
                isLoading={props.isLoading}
            />
        </div >
    )
}

Header.propTypes = {
    cache: PropTypes.shape({
        selectedMenu: PropTypes.string,
        isDisplayMenu: PropTypes.bool
    }),
    isLoading: PropTypes.bool,
    handleSetCache: PropTypes.func.isRequired
}


export default Header