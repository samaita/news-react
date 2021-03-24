
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'

import './App.css'
import DataMockEnergy from './mock/sample.energy.json'
import DataMockSpace from './mock/sample.space.json'
import DataMockCybersecurity from './mock/sample.cybersecurity.json'
import DataMockAI from './mock/sample.ai.json'
import DataMockIoT from './mock/sample.iot.json'
import DataMockHealth from './mock/sample.health.json'
import InfiniteScroll from 'react-infinite-scroll-component'
import { RWebShare } from 'react-web-share'

function App() {
	return (
		<Home />
	)
}

function Home() {
	const
		[config] = useState({
			newsAPIAuthKey: process.env.REACT_APP_NEWS_API_KEY, /* please move it to a secure backend */
			newsURLEverything: "https://newsapi.org/v2/everything",
			defaultErrorMessage: "Maaf, Silahkan coba kembali setelah beberapa saat.",
			timeout: 10000,
			maxToast: 3,
			pageSize: 10,
			sortByDate: "publishedAt",
			sortByPopularity: "popularity",
			language: "en",
			maxCharDescription: 150,
			intervalDay: 14
		}),
		[cache, setCache] = useState({
			useMock: true,
			idToast: 0,
			isInitArticleLoaded: false,
			selectedMenu: "home",
			isDisplayMenu: false
		}),
		[page, setPage] = useState({
			number: 1,
			hasNext: false,
		}),
		[isLoading, setIsLoading] = useState(false),
		[selectedCategory, setSelectedCategory] = useState({
			name: "All", slug: "all", title: "Latest", keyword: "space OR nasa OR spacex OR perseverance OR mars OR lapan OR solar panel OR wind turbine OR geothermal OR nuclear OR renewable OR energy OR arduino OR raspberry pi OR raspi OR IoT OR internet of things OR artificial intelligence OR neural network OR auto pilot OR hacker OR cyber security"
		}),
		[articleBookmarkedCategory] = useState({
			name: "All", slug: "all", title: "Bookmark"
		}),
		[topCategory] = useState({
			name: "Popular", slug: "popular", title: "Popular", keyword: "space OR nasa OR spacex OR perseverance OR mars OR lapan OR solar panel OR wind turbine OR geothermal OR nuclear OR renewable OR energy OR arduino OR raspberry pi OR raspi OR IoT OR internet of things OR artificial intelligence OR neural network OR auto pilot OR hacker"
		}),
		[articleList, setArticleList] = useState([]),
		[articleBookmarkedList, setArticleBookmarkedList] = useLocalStorage("articleBookmarkedList", []),
		[articleBookmarked, setArticleBookmarked] = useLocalStorage("articleBookmarked", {}),
		[topArticleLoaded, setTopArticleLoaded] = useState(false),
		[topArticleList, setTopArticleList] = useState([]),
		[categories] = useState([
			{ name: "All", slug: "all", title: "Latest", keyword: "space OR nasa OR spacex OR perseverance OR mars OR lapan OR solar panel OR wind turbine OR geothermal OR nuclear OR renewable OR energy OR arduino OR raspberry pi OR raspi OR IoT OR internet of things OR artificial intelligence OR neural network OR auto pilot OR hacker OR cyber security" },
			{ name: "Space", slug: "space", keyword: "nasa OR spacex OR perseverance OR mars OR lapan" },
			{ name: "Energy", slug: "energy", keyword: "solar panel OR wind turbine OR geothermal OR nuclear OR renewable OR energy" },
			{ name: "Health", slug: "health", keyword: "health AND -biden" },
			{ name: "IoT", slug: "iot", keyword: "arduino OR raspberry pi OR raspi OR IoT OR internet of things" },
			{ name: "Artificial Intelligence", slug: "ai", keyword: "artificial intelligence OR neural network OR auto pilot" },
			{ name: "Cybersecurity", slug: "cybersecurity", keyword: "hacker OR cyber security" },
		]),
		[mockArticle] = useState({
			all: DataMockEnergy.articles,
			space: DataMockSpace.articles,
			energy: DataMockEnergy.articles,
			health: DataMockHealth.articles,
			iot: DataMockIoT.articles,
			ai: DataMockAI.articles,
			cybersecurity: DataMockCybersecurity.articles,
			popular: DataMockSpace.articles,
		}),
		[toast, setToast] = useState([])

	const
		handleSelectCategory = category => {
			if (selectedCategory.slug === category.slug && cache.isInitArticleLoaded) {
				return
			}

			setSelectedCategory(category)

			if (cache.useMock) {
				setArticleList(mockArticle[category.slug])
			} else {
				setIsLoading(true)
				handleGetArticle(category, 1)
			}

			if (!cache.useMock && !topArticleLoaded) {
				handleGetTopArticle()
				setTopArticleLoaded(true)
			}

			if (!cache.isInitArticleLoaded) {
				handleSetCache("isInitArticleLoaded", !cache.isInitArticleLoaded)
			}
		},
		handleGetArticle = (category, pageNumber) => {
			if (cache.useMock) {
				return
			}
			if (!category) {
				category = selectedCategory
			}
			if (!pageNumber) {
				pageNumber = page.Number
			}

			axios.get(config.newsURLEverything, {
				headers: {
					"X-API-KEY": config.newsAPIAuthKey
				},
				params: {
					qInTitle: category.keyword,
					page: pageNumber,
					pageSize: config.pageSize,
					sortBy: config.sortByDate,
					language: config.language
				}
			}).then(res => {
				setIsLoading(false)

				if (pageNumber > 1) {
					setArticleList([...articleList, ...res.data.articles])
				} else {
					setArticleList(res.data.articles)
				}

				if (res.data.totalResults > config.pageSize * pageNumber) {
					handleSetPage(true, pageNumber + 1)
				} else {
					handleSetPage(false, pageNumber)
				}
			}).catch(err => {
				setIsLoading(false)

				if (err.response && err.response.status !== 200) {
					handlePushToast("error", err.response.message)
				} else if (err.name === 'Error') {
					handlePushToast("error", "There was an error, " + err)
				}
			})
		},
		handleSetPage = (hasNext, pageNumber) => {
			let newPage = { ...page }
			newPage.hasNext = hasNext
			newPage.Number = pageNumber
			setPage(newPage)
		},
		handleGetTopArticle = () => {
			if (cache.useMock) {
				setTopArticleList(mockArticle["popular"])
				return
			}

			let paramFrom = handleGetPastDate(config.intervalDay)

			axios.get(config.newsURLEverything, {
				headers: {
					"X-API-KEY": config.newsAPIAuthKey
				},
				params: {
					qInTitle: topCategory.keyword,
					page: 1,
					pageSize: 1,
					sortBy: config.sortByPopularity,
					language: config.language,
					from: paramFrom
				}
			}).then(res => {
				setTopArticleList(res.data.articles)
			}).catch(err => {
				if (err.response && err.response.status !== 200) {
					handlePushToast("error", err.response.message)
				}
			})
		},
		handleSetCache = (e, v) => {
			let newCache = { ...cache }
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
		},
		handleArticleBookmark = (bookmarkData) => {
			let newArticleList = []
			let newArticleBookmarked = { ...articleBookmarked }
			let newArticleBookmarkedList = [...articleBookmarkedList]

			articleList.map(function (el) {
				if (el.url === bookmarkData.url) {
					el.bookmarked = !newArticleBookmarked[bookmarkData.url]
				}
				return newArticleList.push(el)
			})
			setArticleList(newArticleList)

			if (!newArticleBookmarked[bookmarkData.url]) {
				setArticleBookmarkedList([...newArticleBookmarkedList, bookmarkData])
			} else {
				let updateNewArticleBookmarkedList = []
				newArticleBookmarkedList.map(function (el) {
					if (el.url !== bookmarkData.url) {
						return updateNewArticleBookmarkedList.push(el)
					}
					return updateNewArticleBookmarkedList
				})
				setArticleBookmarkedList(updateNewArticleBookmarkedList)

			}

			newArticleBookmarked[bookmarkData.url] = !newArticleBookmarked[bookmarkData.url]
			setArticleBookmarked(newArticleBookmarked)
		},
		handleGetArticleBookmarked = () => {
			return
		},
		handleTimeFormat = (unix) => {
			let t = new Date(unix)
			let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
			let year = t.getFullYear()
			let month = months[t.getMonth()]
			let date = t.getDate()
			let hour = t.getHours() < 10 ? "0" + t.getHours() : t.getHours()
			let min = t.getMinutes() < 10 ? "0" + t.getMinutes() : t.getMinutes()
			let time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min
			return time
		},
		handleGetPastDate = (day) => {
			let ot = Date.now()
			let t = new Date(ot - (day * 24 * 60 * 60 * 1000))
			let year = t.getFullYear()
			let month = (t.getMonth() + 1) < 10 ? "0" + (t.getMonth() + 1) : t.getMonth()
			let date = t.getDate()
			let time = year + '-' + month + '-' + date
			return time
		}

	useEffect(() => {
		if (articleList && articleList.length <= 0) {
			handleSelectCategory(selectedCategory)
		}
	})

	function useLocalStorage(key, initialValue) {
		const [storedValue, setStoredValue] = useState(() => {
			try {
				const item = window.localStorage.getItem(key);
				return item ? JSON.parse(item) : initialValue;
			} catch (error) {
				console.log(error);
				return initialValue;
			}
		});

		const setValue = value => {
			try {
				const valueToStore =
					value instanceof Function ? value(storedValue) : value;
				setStoredValue(valueToStore);
				window.localStorage.setItem(key, JSON.stringify(valueToStore));
			} catch (error) {
				console.log(error);
			}
		};

		return [storedValue, setValue];
	}

	return (
		<div className="App bg-black">
			<Header
				cache={cache}
				handleSetCache={handleSetCache}
			/>
			{cache.selectedMenu === "home" && <div>
				<TrendingView
					useMock={cache.useMock}
					articleList={topArticleList}
					selectedCategory={selectedCategory}
					maxCharDescription={config.maxCharDescription}
					handleGetArticle={handleGetArticle}
					handleTimeFormat={handleTimeFormat} />
				<CategoryMenu
					categories={categories}
					selectedCategory={selectedCategory}
					handleSelectCategory={handleSelectCategory} />
				<ArticleView
					useMock={cache.useMock}
					articleList={articleList}
					articleBookmarked={articleBookmarked}
					selectedCategory={selectedCategory}
					maxCharDescription={config.maxCharDescription}
					hasMore={page.hasNext}
					handleGetArticle={handleGetArticle}
					handleTimeFormat={handleTimeFormat}
					handleArticleBookmark={handleArticleBookmark} />
			</div>}
			{cache.selectedMenu === "bookmark" && <ArticleBookmarkedView
				useMock={true}
				articleList={articleBookmarkedList}
				articleBookmarked={articleBookmarked}
				selectedCategory={articleBookmarkedCategory}
				maxCharDescription={config.maxCharDescription}
				handleGetArticle={handleGetArticleBookmarked}
				handleTimeFormat={handleTimeFormat}
				handleArticleBookmark={handleArticleBookmark} />}
			<Toast
				toast={toast}
				handleRemoveToast={handleRemoveToast} />
			<Loading
				isLoading={isLoading} />
			<SideMenu
				cache={cache}
				handleSetCache={handleSetCache}
			/>
		</div>
	)
}

const Loading = ({ isLoading }) => {
	return (
		<div>
			{isLoading && Loader}
		</div>
	)
}

const Toast = ({ toast, handleRemoveToast }) => {
	return (
		<div className="fixed left-0 p-2 w-full bottom-0" >
			{true && toast.map(function (data) {
				return (
					<div className="flex items-center mt-1 bg-red-500 border-l-4 border-red-700 py-2 px-3 shadow-md">
						<div className="flex item-center text-white text-sm content-center w-full">
							<div className="w-11/12">{data.message}</div><div onClick={() => handleRemoveToast(data.id)} className="w-1/12 text-center float-right block">OK</div>
						</div>
					</div>
				)
			}, this)}
		</div >
	)
}

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

const Loader = (
	<div className="flex h-screen w-screen fixed top-0 bg-black bg-opacity-70 z-50">
		<div className="m-auto">
			<div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-32 w-32">
			</div>
		</div>
	</div>
)

const ArticleBookmarkedView = ({ useMock, articleList, articleBookmarked, selectedCategory, maxCharDescription, handleGetArticle, handleTimeFormat, handleArticleBookmark, hasMore }) => {
	return (
		<div className="mt-14 pt-4 bg-black">
			<ArticleView
				useMock={useMock}
				articleList={articleList}
				articleBookmarked={articleBookmarked}
				selectedCategory={selectedCategory}
				maxCharDescription={maxCharDescription}
				handleGetArticle={handleGetArticle}
				handleTimeFormat={handleTimeFormat}
				handleArticleBookmark={handleArticleBookmark}
				hasMore={hasMore} />
		</div>
	)
}

const ArticleView = ({ useMock, articleList, articleBookmarked, selectedCategory, maxCharDescription, handleGetArticle, handleTimeFormat, handleArticleBookmark, hasMore }) => {
	let LayoutArticle = []

	articleList.map(function (el, index) {
		let hasDefaultImage = el.urlToImage ? true : false
		let DefaultImage = "https://images.unsplash.com/photo-1606639386377-aa1a3ed390ea?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"

		LayoutArticle.push(
			<div key={index} className="max-w-full bg-black rounded-2xl tracking-wide shadow mt-4 mb-2 pl-6 pr-6">
				<div id="header" className="flex flex-col">
					<div className="bg-gray-100 w-full h-48 rounded-md max-h-96 bg-cover flex items-end justify-end" style={{ backgroundImage: `url(${hasDefaultImage ? el.urlToImage : DefaultImage})` }}>
						<ActionButton
							type="share"
							articleData={el}
							viewBox="-7 -7 40 40"
							data="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
						/>
						<ActionButton
							type="bookmark"
							articleData={el}
							viewBox="-7 -7 40 40"
							data="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
							selected={articleBookmarked[el.url]}
							handleArticleBookmark={handleArticleBookmark}
						/>
					</div>
					<div id="body" className="flex flex-col w-full h-full p-3">
						<h2 id="site" className="font-light text-green-500 leading-5 text-sm"><a href={el.url}>{el.source.name}</a></h2>
						<h1 id="title" className="mb-1 text-2xl leading-7 text-gray-100">{el.title}</h1>
						<h6 id="timestamp" className="text-sm font-light text-gray-400 object-left-bottom">{handleTimeFormat(Date.parse(el.publishedAt))}{el.author ? " | " + el.author : ""}</h6>
						<p className="text-white text-base font-light mt-1 mb-2">{el.description && el.description.length > maxCharDescription ? el.description.substring(0, maxCharDescription) + "..." : el.description}</p>
						<a className="text-green-500 block w-full border rounded-md p-2 text-center border-green-500" href={el.url}>Go To Website</a>
					</div>
				</div>
			</div >)

		return LayoutArticle
	})

	return (
		<div className="min-h-screen flex flex-col">
			<h1 className="text-2xl font-light font-bold text-gray-200 pl-6 pr-6">
				{selectedCategory.title ? selectedCategory.title : selectedCategory.name}
			</h1>

			{!useMock && articleList.length > 0 && < InfiniteScroll
				dataLength={articleList.length}
				next={handleGetArticle}
				hasMore={true}
				loader={Loader}
				refreshFunction={handleGetArticle}
				pullDownToRefresh
				pullDownToRefreshThreshold={50}
				pullDownToRefreshContent={
					<h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
				}
				releaseToRefreshContent={
					<h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
				}>
				{LayoutArticle}
			</InfiniteScroll>}
			{ useMock && LayoutArticle}

		</div >
	)
}

const Header = ({ cache, handleSetCache }) => {
	let fillValue = cache.selectedMenu === "bookmark" ? "#10B981" : "none"
	let strokeValue = cache.selectedMenu === "bookmark" ? "#10B981" : "currentColor"
	let toggleBookmark = cache.selectedMenu === "bookmark" ? "home" : "bookmark"

	return (
		<div className="w-screen top-0 fixed bg-black h-16 z-30 border-b border-white">
			<div className="h-16 w-16 text-gray-200 float-left" onClick={() => handleSetCache("isDisplayMenu", !cache.isDisplayMenu)}>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="-12 -12 48 48" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M4 6h16M4 12h16M4 18h16" />
				</svg>
			</div>
			<div className="float-left text-white py-4 font-bold text-green-500 text-2xl" onClick={() => handleSetCache("selectedMenu", "home")}>LAMPU NEON</div>
			<div className="h-16 w-16 text-gray-200 float-right" onClick={() => handleSetCache("selectedMenu", toggleBookmark)}>
				<svg xmlns="http://www.w3.org/2000/svg" fill={fillValue} viewBox="-12 -12 48 48" stroke={strokeValue}>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
				</svg>
			</div>
		</div>
	)
}

const SideMenu = ({ cache, handleSetCache }) => {
	return (
		<div>
			{cache.isDisplayMenu && <div className="h-screen fixed bg-black shadow-lg w-80 top-0 z-40">
				<ul>
					<li className={`border-b border-gray-200 p-4 text-gray-200`} onClick={() => handleSetCache("useMock", !cache.useMock)}>Mock Data Source
						<div className="mb-3 mr-3 float-right">
							<div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
								<input checked={cache.useMock} type="checkbox" name="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" readOnly={true} />
								<label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer text-center"></label>
							</div>
						</div>
					</li>
					<li className={`border-b border-gray-200 p-4 text-gray-200`} onClick={() => handleSetCache("isDisplayMenu", !cache.isDisplayMenu)}>Close</li>
				</ul>
			</div>}
			{cache.isDisplayMenu && <div className="fixed bg-black bg-opacity-70 h-screen w-screen top-0 z-30" onClick={() => handleSetCache("isDisplayMenu", !cache.isDisplayMenu)}></div>}
		</div>
	)
}

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

const TrendingView = ({ useMock, articleList, selectedCategory, maxCharDescription, handleGetArticle, handleTimeFormat }) => {
	let LayoutArticle = []

	articleList.map(function (el, index) {
		let hasDefaultImage = el.urlToImage && el.urlToImage.includes("default")
		let isFirst = index === 0 ? true : false

		if (!isFirst) {
			return LayoutArticle
		}

		LayoutArticle.push(
			<div key={index} className="w-screen bg-black tracking-wide shadow mr-3 ">
				<div id="header" className="flex flex-col relative" onClick={() => window.location.href = el.url}>
					<div className="bg-gray-100 w-screen h-96 block bg-cover bg-center" style={{ backgroundImage: `url(${hasDefaultImage ? el.urlToImage : el.urlToImage})` }}></div>
					<div id="body" className="absolute flex flex-wrap content-end p-3 block w-screen h-64 bottom-0" style={{ backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,1))` }}>
						<div className="p-2">
							<h2 id="site" className="font-light text-green-500 mb-3 text-md"><a className="border pl-3 pt-2 pb-2 pr-3 rounded-xs whitespace-nowrap border-green-500 bg-green-500 text-gray-100" href={el.url}>{el.source.name}</a></h2>
							<h1 id="title" className="font-semibold mb-1 text-3xl leading-7 text-gray-100">{el.title}</h1>
							<h6 id="timestamp" className="text-sm font-light text-gray-400 object-left-bottom">{handleTimeFormat(Date.parse(el.publishedAt))}{el.author ? " | " + el.author : ""}</h6>
						</div>
					</div>
				</div>
			</div >)

		return LayoutArticle
	})

	return (
		<div className="mt-16 block min-w-screen flex flex-row overflow-x-scroll hide-scroll-bar mb-5">
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
	useMock: PropTypes.bool,
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
	handleGetArticle: PropTypes.func.isRequired,
	handleTimeFormat: PropTypes.func.isRequired,
	handleArticleBookmark: PropTypes.func.isRequired
}


TrendingView.propTypes = {
	useMock: PropTypes.bool,
	articleList: PropTypes.arrayOf(PropTypes.shape(
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
	)).isRequired,
	selectedCategory: PropTypes.shape(
		{
			name: PropTypes.string,
			slug: PropTypes.string,
			title: PropTypes.string
		}
	),
	handleGetArticle: PropTypes.func.isRequired,
	handleTimeFormat: PropTypes.func.isRequired
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

SideMenu.propTypes = {
	cache: PropTypes.shape({
		useMock: PropTypes.bool,
		isDisplayMenu: PropTypes.bool,
		selectedMenu: PropTypes.string
	}),
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

export default App
