import './App.css';
import DataMockEnergy from './mock/sample.energy.json'

function App() {

	const RecentArticles = []

	DataMockEnergy.articles.map(function (el) {
		RecentArticles.push(
			<div className="max-w-full bg-white border-2 border-gray-50 p-3 rounded-2xl tracking-wide shadow mb-3">
				<div id="header" className="flex">
					<div id="body" className="flex flex-col mr-8 w-7/12 h-full p-2">
						<h2 id="category" className="font-light text-green-500 mb-1 leading-5">{el.source.name}</h2>
						<h1 id="title" className=" font-semibold mb-1 leading-5">{el.title}</h1>
						<h6 id="timestamp" className="text-xs font-light text-gray-400 object-left-bottom">{el.publishedAt}</h6>
					</div>
					<div class="bg-gray-100 w-5/12 h-32 max-h-96 block rounded-2xl bg-cover" style={{ backgroundImage: `url(${el.urlToImage})` }}></div>
				</div>
			</div >)
	})

	return (
		<div className="App">
			<div className="min-h-screen bg-gray-100 flex flex-col pr-3 pl-3 pt-10">
				<h1 className="text-3xl font-light text-gray-800 mb-3">Recent</h1>
				{RecentArticles}
			</div>
		</div>
	);
}

export default App;
