
import React, { useState, useEffect } from 'react'
import axios from 'axios'

import ArticleView from './components/ArticleView'
import ArticleBookmarkedView from './components/ArticleBookmarkedView'
import CategoryMenu from './components/CategoryMenu'
import Header from './components/Header'
import Loader from './components/Loader'
import SideMenu from './components/SideMenu'
import Toast from './components/Toast'
import TrendingView from './components/TrendingView'

import './App.css'
import DataMockEnergy from './mock/sample.energy.json'
import DataMockSpace from './mock/sample.space.json'
import DataMockCybersecurity from './mock/sample.cybersecurity.json'
import DataMockAI from './mock/sample.ai.json'
import DataMockIoT from './mock/sample.iot.json'
import DataMockHealth from './mock/sample.health.json'

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
		if (topArticleList && topArticleList.length <= 0) {
			handleGetTopArticle()
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
			{isLoading && <Loader />}
			<SideMenu
				cache={cache}
				handleSetCache={handleSetCache}
			/>
		</div>
	)
}

export default App
