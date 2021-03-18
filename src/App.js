
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
		[config, setConfig] = useState({
			newsAPIAuthKey: process.env.REACT_APP_NEWS_API_KEY, /* please move it to a secure backend */
			newsURLEverything: "https://newsapi.org/v2/everything",
			defaultErrorMessage: "Maaf, Silahkan coba kembali setelah beberapa saat.",
			timeout: 10000,
			maxToast: 3,
			pageSize: 10
		}),
		[cache, setCache] = useState({
			useMock: true,
			idToast: 0,
			pageNumber: 1,
			hasNext: false,
			isLoading: false
		}),
		[selectedCategory, setSelectedCategory] = useState({
			name: "All", slug: "all", title: "Latest", data: DataMockEnergy.articles, keyword: "space OR nasa OR spacex OR perseverance OR mars OR lapan OR solar panel OR wind turbine OR geothermal OR nuclear OR renewable OR energy OR arduino OR raspberry pi OR raspi OR IoT OR internet of things OR artificial intelligence OR neural network OR auto pilot OR hacker OR cyber security"
		}),
		[articleList, setArticleList] = useState([]),
		[categories, setCategories] = useState([
			{ name: "All", slug: "all", title: "Latest", data: DataMockEnergy.articles, keyword: "space OR nasa OR spacex OR perseverance OR mars OR lapan OR solar panel OR wind turbine OR geothermal OR nuclear OR renewable OR energy OR arduino OR raspberry pi OR raspi OR IoT OR internet of things OR artificial intelligence OR neural network OR auto pilot OR hacker OR cyber security" },
			{ name: "Space", slug: "space", data: DataMockSpace.articles, keyword: "space OR nasa OR spacex OR perseverance OR mars OR lapan" },
			{ name: "Energy", slug: "energy", data: DataMockEnergy.articles, keyword: "solar panel OR wind turbine OR geothermal OR nuclear OR renewable OR energy" },
			{ name: "Health", slug: "health", data: DataMockHealth.articles, keyword: "health AND -biden" },
			{ name: "IoT", slug: "iot", data: DataMockIoT.articles, keyword: "arduino OR raspberry pi OR raspi OR IoT OR internet of things" },
			{ name: "Artificial Intelligence", slug: "artificial-intelligence", data: DataMockAI.articles, keyword: "artificial intelligence OR neural network OR auto pilot" },
			{ name: "Cybersecurity", slug: "cybersecurity", data: DataMockCybersecurity.articles, keyword: "hacker OR cyber security" },
		]),
		[toast, setToast] = useState([])

	const
		handleSelectCategory = e => {
			if (selectedCategory.slug === e.slug) {
				return
			}
			setSelectedCategory(e)
			handleSetCache("pageNumber", 1)

			if (cache.useMock) {
				setArticleList(e.data)
			} else {
				handleGetArticle()
			}
		},
		handleLoadMore = () => {
			handleSetCache("pageNumber", cache.pageNumber + 1)
			handleGetArticle()
		},
		handleGetArticle = () => {
			handleSetCache("isLoading", !cache.isLoading)
			axios.get(config.newsURLEverything, {
				headers: {
					"X-API-KEY": config.newsAPIAuthKey
				},
				params: {
					q: selectedCategory.keyword,
					page: cache.pageNumber,
					pageSize: config.pageSize
				}
			}).then(res => {
				handleSetCache("isLoading", !cache.isLoading)
				setArticleList(res.data.articles)
				if (res.data.totalResults > config.pageSize * cache.pageNumber) {
					handleSetCache("hasNext", true)
				} else {
					handleSetCache("hasNext", false)
				}
			}).catch(err => {
				handleSetCache("isLoading", !cache.isLoading)
				if (err.response && err.response.status !== 200) {
					handlePushToast("error", err.response.message)
				}
			})
		},
		handleSetCache = (e, v) => {
			let newCache = cache;
			newCache[e] = v
			setCache(newCache)
		},
		handlePushToast = (type, message) => {
			let newToastID = cache.idToast + 1,
				newToast = {
					id: newToastID,
					type: type,
					message: (!message) ? config.defaultErrorMessage + newToastID : message,
				},
				currentToast = [...toast]

			handleSetCache("idToast", newToastID)

			if (currentToast.length >= config.maxToast) {
				currentToast.shift()
			}

			currentToast.push(newToast)
			setToast(currentToast)

		},
		handleRemoveToast = (idToRemove) => {
			let currentToast = [...toast],
				mark = 0

			for (let i = 0; i < currentToast.length; i++) {
				if (currentToast[i] && currentToast[i].id === idToRemove) {
					mark = i
					break
				}
			}
			currentToast.splice(mark, 1)
			setToast(currentToast)
		}

	useEffect(() => {
		if (articleList && articleList.length <= 0) {
			let initCategory = { ...selectedCategory }
			initCategory.slug = "init"
			handleSelectCategory(initCategory)
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
				cache={cache}
				handleSetCache={handleSetCache} />
			<Toast
				toast={toast}
				handleRemoveToast={handleRemoveToast} />
			<Loading
				show={cache.isLoading} />
		</div>
	)
}

const Loading = ({ show }) => {
	return (
		<div>
			{show && <div className="flex h-screen w-screen fixed top-0 bg-black bg-opacity-70">
				<div className="m-auto">
					<div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32">
					</div>
				</div>
			</div>}
		</div>
	)
}

const Toast = ({ toast, handleRemoveToast }) => {
	return (
		<div className="fixed left-0 p-2 w-full bottom-0" >
			{toast && toast.map(function (data) {
				return (
					<div className="flex items-center bg-red-500 border-l-4 border-red-700 py-2 px-3 shadow-md">
						<div className="flex item-center text-white text-sm content-cente">
							<div className="w-11/12">{data.message}</div><div onClick={() => handleRemoveToast(data.id)} className="w-1/12 text-center">OK</div>
						</div>
					</div>
				)
			}, this)}
		</div >
	)
}

const FloatingMenu = ({ cache, handleSetCache }) => {
	return (
		<div className="fixed right-0 bottom-0 mb-3 mr-3">
			<div class="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
				<input defaultChecked={cache} onClick={() => handleSetCache("useMock", !cache.useMock)} type="checkbox" name="toggle" id="toggle" class="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
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
					let isSelected = category.slug === selectedCategory.slug || (isFirst && selectedCategory.slug === "init");
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

FloatingMenu.propTypes = {
	cache: PropTypes.shape(
		{
			useMock: PropTypes.bool,
		}
	),
	handleSetCache: PropTypes.func.isRequired
}

Toast.propTypes = {
	toast: PropTypes.arrayOf(PropTypes.shape(
		{
			id: PropTypes.number,
			message: PropTypes.string,
			type: PropTypes.string
		}
	)),
	handleRemoveToast: PropTypes.func.isRequired
}

Loading.propTypes = {
	show: PropTypes.bool
}

export default App;
