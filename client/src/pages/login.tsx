import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { InputField } from '../components/InputField';

const root = document.getElementsByClassName('root')[0];
if (!root) {
	throw 'no root';
}

class App extends React.Component<{}, { message: string }> {
	state = { message: '' };

	componentDidMount() {}

	render() {
		return (
			<div>
				{this.state.message}
				<InputField label="Username" id="username" />
			</div>
		);
	}
}

ReactDOM.render(<App />, root);
