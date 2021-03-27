import PropTypes from 'prop-types'

const SideMenu = (props) => {
    return (
        <div>
            {props.cache.isDisplayMenu && <div className="h-screen fixed bg-black shadow-lg w-80 top-0 z-40">
                <ul>
                    <li className={`border-b border-gray-200 p-4 text-gray-200`} onClick={() => props.handleSetCache("useMock", !props.cache.useMock)}>Mock Data Source
						<div className="mb-3 mr-3 float-right">
                            <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
                                <input checked={props.cache.useMock} type="checkbox" name="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" readOnly={true} />
                                <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer text-center"></label>
                            </div>
                        </div>
                    </li>
                    <li className={`border-b border-gray-200 p-4 text-gray-200`} onClick={() => props.handleSetCache("isDisplayMenu", !props.cache.isDisplayMenu)}>Close</li>
                </ul>
            </div>}
            {props.cache.isDisplayMenu && <div className="fixed bg-black bg-opacity-70 h-screen w-screen top-0 z-30" onClick={() => props.handleSetCache("isDisplayMenu", !props.cache.isDisplayMenu)}></div>}
        </div>
    )
}

SideMenu.propTypes = {
    cache: PropTypes.shape({
        useMock: PropTypes.bool,
        isDisplayMenu: PropTypes.bool,
        selectedMenu: PropTypes.string
    }),
    handleSetCache: PropTypes.func.isRequired
}

export default SideMenu