const Loader = ({ isLoading }) => {
    return (
        <div>
            {isLoading && <div className="flex h-screen w-screen fixed top-0 bg-black bg-opacity-70 z-50">
                <div className="m-auto">
                    <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32">
                    </div>
                </div>
            </div>}
        </div>
    )
}

export default Loader