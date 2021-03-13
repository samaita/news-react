
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

import './App.css';
import DataMockEnergy from './mock/sample.energy.json';
import DataMockSpace from './mock/sample.space.json';
import DataMockCybersecurity from './mock/sample.cybersecurity.json';
import DataMockAI from './mock/sample.ai.json';
import DataMockIoT from './mock/sample.iot.json';
import DataMockHealth from './mock/sample.health.json';

function App() {
	return (
		<Home />
	);
}

function Home() {
	const
		[mockData, setMockData] = useState(true),
		[keyAPI, setKeyAPI] = useState({
			"newsAPI": process.env.REACT_APP_NEWS_API_KEY /* please move it to a secure backend */
		}),
		[selectedCategory, setSelectedCategory] = useState({
			name: "All", slug: "all", title: "Latest", data: DataMockEnergy.articles
		}),
		[articleList, setArticleList] = useState([]),
		[categories, setCategories] = useState([
			{ name: "All", slug: "all", title: "Latest", data: DataMockEnergy.articles, },
			{ name: "Space", slug: "space", data: DataMockSpace.articles, keyword: "space OR nasa OR spacex OR perseverance OR mars OR lapan" },
			{ name: "Energy", slug: "energy", data: DataMockEnergy.articles, keyword: "solar panel OR wind turbine OR geothermal OR nuclear OR renewable OR energy" },
			{ name: "Health", slug: "health", data: DataMockHealth.articles, keyword: "health AND -biden" },
			{ name: "IoT", slug: "iot", data: DataMockIoT.articles, keyword: "arduino OR raspberry pi OR raspi OR IoT OR internet of things" },
			{ name: "Artificial Intelligence", slug: "artificial-intelligence", data: DataMockAI.articles, keyword: "artificial intelligence OR neural network OR auto pilot" },
			{ name: "Cybersecurity", slug: "cybersecurity", data: DataMockCybersecurity.articles, keyword: "hacker OR cyber security" },
		])

	const
		handleSelectCategory = e => {
			setSelectedCategory(e)

			if (mockData) {
				setArticleList(e.data)
			} else {
				// 	axios.get(`https://jsonplaceholder.typicode.com/users`)
				// 		.then(res => {
				// 			const persons = res.data;
				// 			this.setState({ persons });
				// 		})
				console.log("USE AXIOS")
				setArticleList(e.data)
			}

		},
		handleSetMockData = e => {
			setMockData(e)
		}


	useEffect(() => {
		if (articleList && articleList.length <= 0) {
			handleSelectCategory(selectedCategory)
		}
	})

	return (
		<div className="App bg-black pt-4">
			<CategoryMenu
				categories={categories}
				selectedCategory={selectedCategory}
				handleSelectCategory={handleSelectCategory} />
			<ArticleView
				articleList={articleList}
				selectedCategory={selectedCategory} />
			<FloatingMenu
				mockData={mockData}
				handleSetMockData={handleSetMockData} />
		</div>
	)
}

const FloatingMenu = ({ mockData, handleSetMockData }) => {
	return (
		<div className="fixed right-0 bottom-0 mb-3 mr-3">
			<div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
				<input defaultChecked={mockData} onClick={() => handleSetMockData(!mockData)} type="checkbox" name="toggle" id="toggle" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
				<label for="toggle" class="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer text-center"></label>
			</div>
		</div>
	)
}

const CategoryMenu = ({ categories, selectedCategory, handleSelectCategory }) => {
	return (
		<div className="overflow-hidden mb-4" >
			<ul className="flex flex-row overflow-x-scroll hide-scroll-bar">
				{categories.map(function (category, index) {
					let isFirst = index === 0;
					let isSelected = category.slug === selectedCategory.slug;
					return (
						<li className={`${isFirst ? "ml-5" : ""}`}>
							<a className={`border pl-4 pt-2 pb-2 pr-4 mr-1 rounded-3xl whitespace-nowrap border-gray-500 block ${isSelected ? "bg-gray-200 text-black" : "text-gray-200"}`} href="#" onClick={() => handleSelectCategory(category)}>
								{category.name}
							</a>
						</li>
					)
				}, this)}
			</ul>
		</div >
	)
}

const ArticleView = ({ articleList, selectedCategory }) => {
	let LayoutArticle = []

	articleList.map(function (el) {
		let hasDefaultImage = el.urlToImage && el.urlToImage.includes("default")

		LayoutArticle.push(
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
				{selectedCategory.title ? selectedCategory.title : selectedCategory.name}
			</h1>
			{LayoutArticle}
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
	selectedCategory: PropTypes.shape(
		{
			name: PropTypes.string,
			slug: PropTypes.string,
			title: PropTypes.string
		}
	),
	handleSelectCategory: PropTypes.func.isRequired
}

ArticleView.propTypes = {
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
	selectedCategory: PropTypes.shape(
		{
			name: PropTypes.string,
			slug: PropTypes.string,
			title: PropTypes.string
		}
	),
}

export default App;
