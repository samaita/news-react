import './App.css';

function App() {
	return (
		<div className="App">
			<div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
				<div class="flex-shrink-0">
					<img class="h-12 w-12" src="/img/logo.svg" alt="ChitChat Logo"></img>
				</div>
				<div>
					<div class="text-xl font-medium text-black">ChitChat</div>
					<p class="text-gray-500">You have a new message!</p>
				</div>
			</div>
		</div>
	);
}

export default App;