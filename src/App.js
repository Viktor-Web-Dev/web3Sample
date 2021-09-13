import React, {memo} from 'react';

import MainComponent from './components/ToDoComponent/MainComponent';

import './App.css';

const App = () => (
	<div className="App">
		<MainComponent/>
	</div>
);

export default memo(App);
