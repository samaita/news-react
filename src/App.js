import './App.css';

function App() {
	return (
		<div className="App">
			<div>
				<div className="min-h-screen bg-gray-100 flex flex-col pr-3 pl-3 pt-10">
					<h1 className="text-3xl font-light text-gray-800 mb-3">Recent</h1>
					<div className="max-w-full bg-white border-2 border-gray-50 p-3 rounded-2xl tracking-wide shadow-md">
						<div id="header" className="flex">
							<div id="body" className="flex flex-col mr-8 h-full p-2">
								<h2 id="category" className="text-md font-light text-gray-400 mb-1 leading-5">TechCrunch</h2>
								<h1 id="title" className="text-xl font-semibold mb-1 leading-5">Lorem ipsum dolor sit amet, consectetur adipiscing elit</h1>
								<h6 id="category" className="text-xs font-light text-gray-400 object-left-bottom">February 23, 2021</h6>
							</div>
							<div className="w-screen h-full">
								<img alt="mountain" className="object-contain rounded-xl" src="https://picsum.photos/seed/picsum/200" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
