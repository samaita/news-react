import PropTypes from 'prop-types'

const Toast = (props) => {
    return (
        <div className="fixed left-0 p-2 w-full bottom-0 z-40" >
            {props.toast.map(function (data) {
                return (
                    <div key={data.id} className="flex items-center mt-1 bg-red-500 border-l-4 border-red-700 py-2 px-3 shadow-md z-40">
                        <div className="flex item-center text-white text-sm content-center w-full">
                            <div className="w-11/12">{data.message}</div><div onClick={() => props.handleRemoveToast(data.id)} className="w-1/12 text-center float-right block">OK</div>
                        </div>
                    </div>
                )
            }, this)}
        </div >
    )
}

Toast.propTypes = {
    toast: PropTypes.arrayOf(PropTypes.shape(
        {
            id: PropTypes.number,
            message: PropTypes.string,
            type: PropTypes.string
        }
    ).isRequired),
    handleRemoveToast: PropTypes.func.isRequired
}


export default Toast