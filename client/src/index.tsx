import * as ReactDOM from 'react-dom';
import * as React from 'react';
import style from './style.module.scss';
import $ from 'jquery';

const root = document.getElementsByClassName('root')[0];
if (!root) {
	throw 'no root';
}

class App extends React.Component<{}, { message: string }> {
	state = { message: '' };

	componentDidMount() {
		$.getJSON('/api').then(data => {
			this.setState({
				message: data.message,
			});
		});
	}

	render() {
		return (
			<div
				className={style.red}
				style={{
					width: style.size,
					height: style.size,
				}}
			>
				{this.state.message}
			</div>
		);
	}
}

ReactDOM.render(<App />, root);
