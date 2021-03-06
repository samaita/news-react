import './App.css';
import DataMockEnergy from './mock/sample.energy.json'

function App() {

	const RecentArticles = []
	const CategoryMenu = []
	const ListCategory = ["All", "Space", "Energy", "Health", "IoT", "Artificial Intelligence", "Cybersecurity",]

	ListCategory.map(function (el, index) {
		CategoryMenu.push(
			<li className={`${index === 0 ? "ml-5" : ""}`}>
				<a className="border pl-4 pt-2 pb-2 pr-4 mr-1 rounded-3xl whitespace-nowrap border-gray-500 block hover:bg-gray-200 text-gray-200 hover:text-black" href="#">{el}</a>
			</li>)
	})

	DataMockEnergy.articles.map(function (el) {
		let hasDefaultImage = el.urlToImage.includes("default")

		RecentArticles.push(
			<div className="max-w-full bg-black rounded-2xl tracking-wide shadow mt-4 mb-4">
				<div id="header" className="flex flex-col">
					<div class="bg-gray-100 w-full h-48 max-h-96 block rounded-md bg-cover" style={{ backgroundImage: `url(${hasDefaultImage ? el.urlToImage : el.urlToImage})` }}></div>
					<div id="body" className="flex flex-col w-full h-full p-3">
						<h2 id="category" className="font-light text-green-500 leading-5 text-sm">{el.source.name}</h2>
						<h1 id="title" className="mb-1 text-lg leading-5 text-gray-200">{el.title}</h1>
						<h6 id="timestamp" className="text-xs font-light text-gray-400 object-left-bottom">{el.publishedAt}</h6>
					</div>
				</div>
			</div >)
	})

	return (
		<div className="App bg-black pt-4">
			<div className="overflow-hidden mb-4">
				<ul className="flex flex-row overflow-x-scroll hide-scroll-bar">
					{CategoryMenu}
				</ul>
			</div>
			<div className="min-h-screen flex flex-col pl-6 pr-6">
				<h1 className="text-2xl font-light font-bold text-gray-200">
					Latest
				</h1>
				{RecentArticles}
			</div>
		</div>
	);
}

export default App;
