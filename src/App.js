import './App.css';
import DataMockEnergy from './mock/sample.energy.json';
import axios from 'axios';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

function App() {
	return (
		<Home />
	);
}

function Home() {
	const [selectedCategory, setSelectedCategory] = useState("all")
	const [articleList, setArticleList] = useState([
		{}
	])
	const [categories, setCategories] = useState([
		{ name: "All", slug: "all" },
		{ name: "Space", slug: "space" },
		{ name: "Energy", slug: "energy" },
		{ name: "Health", slug: "health" },
		{ name: "IoT", slug: "iot" },
		{ name: "Artificial Intelligence", slug: "artificial-intelligence" },
		{ name: "Cybersecurity", slug: "cybersecurity" },
	])

	const handleSelectCategory = e => {
		setSelectedCategory(e)
		// 	axios.get(`https://jsonplaceholder.typicode.com/users`)
		// 		.then(res => {
		// 			const persons = res.data;
		// 			this.setState({ persons });
		// 		})
	}

	return (
		<div className="App bg-black pt-4">
			<CategoryMenu
				categories={categories}
				selectedCategory={selectedCategory}
				handleSelectCategory={handleSelectCategory} />
			<ArticleView />
		</div>
	)
}

const CategoryMenu = ({ categories, selectedCategory, handleSelectCategory }) => {
	return (
		<div className="overflow-hidden mb-4" >
			<ul className="flex flex-row overflow-x-scroll hide-scroll-bar">
				{categories.map(function (category, index) {
					let isFirst = index === 0;
					let isSelected = category.slug === selectedCategory;
					return (
						<li className={`${isFirst ? "ml-5" : ""}`}>
							<a className={`border pl-4 pt-2 pb-2 pr-4 mr-1 rounded-3xl whitespace-nowrap border-gray-500 block ${isSelected ? "bg-gray-200 text-black" : "text-gray-200"}`} href="#" onClick={() => handleSelectCategory(category.slug)}>
								{category.name}
							</a>
						</li>
					)
				}, this)}
			</ul>
		</div >
	)
}

const ArticleView = ({ articleList }) => {
	let BufferArticle = []

	DataMockEnergy.articles.map(function (el) {
		let hasDefaultImage = el.urlToImage.includes("default")

		BufferArticle.push(
			<div className="max-w-full bg-black rounded-2xl tracking-wide shadow mt-4 mb-4">
				<div id="header" className="flex flex-col">
					<div className="bg-gray-100 w-full h-48 max-h-96 block rounded-md bg-cover" style={{ backgroundImage: `url(${hasDefaultImage ? el.urlToImage : el.urlToImage})` }}></div>
					<div id="body" className="flex flex-col w-full h-full p-3">
						<h2 id="category" className="font-light text-green-500 leading-5 text-sm">{el.source.name}</h2>
						<h1 id="title" className="mb-1 text-lg leading-5 text-gray-200">{el.title}</h1>
						<h6 id="timestamp" className="text-xs font-light text-gray-400 object-left-bottom">{el.publishedAt}</h6>
					</div>
				</div>
			</div >)
	})

	return (
		<div className="min-h-screen flex flex-col pl-6 pr-6">
			<h1 className="text-2xl font-light font-bold text-gray-200">
				Latest
			</h1>
			{BufferArticle}
		</div>
	)
}

CategoryMenu.propTypes = {
	categories: PropTypes.arrayOf(PropTypes.shape(
		{
			name: PropTypes.string,
			slug: PropTypes.string
		}
	)),
	selectedCategory: PropTypes.string,
	handleSelectCategory: PropTypes.func.isRequired
}

ArticleView.propTypes = {
	articleList: PropTypes.arrayOf(PropTypes.shape(
		{
			name: PropTypes.string,
			slug: PropTypes.string
		}
	)),
	selectedCategory: PropTypes.string,
}

export default App;
