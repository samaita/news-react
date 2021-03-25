import PropTypes from 'prop-types'

const CategoryMenu = ({ categories, selectedCategory, handleSelectCategory }) => {
    return (
        <div className="overflow-hidden mb-4" >
            <ul className="flex flex-row overflow-x-scroll hide-scroll-bar">
                {categories.map(function (category, index) {
                    let isFirst = index === 0
                    let isSelected = category.slug === selectedCategory.slug || (isFirst && selectedCategory.slug === "init")
                    return (
                        <li key={category.slug} className={`${isFirst ? "ml-5" : ""}`}>
                            <a className={`border pl-4 pt-2 pb-2 pr-4 mr-1 rounded-3xl whitespace-nowrap border-gray-500 block ${isSelected ? "bg-gray-200 text-black" : "text-gray-200"}`} href={"#" + category.slug} onClick={() => handleSelectCategory(category)}>
                                {category.name}
                            </a>
                        </li>
                    )
                }, this)}
            </ul>
        </div >
    )
}

CategoryMenu.propTypes = {
    categories: PropTypes.arrayOf(PropTypes.shape(
        {
            name: PropTypes.string,
            slug: PropTypes.string
        }
    )),
    selectedCategory: PropTypes.shape(
        {
            name: PropTypes.string,
            slug: PropTypes.string,
            title: PropTypes.string
        }
    ),
    handleSelectCategory: PropTypes.func.isRequired
}

export default CategoryMenu