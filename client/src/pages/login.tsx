import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { InputField } from '../components/InputField';
import $ from 'jquery';

const root = document.getElementsByClassName('root')[0];
if (!root) {
	throw 'no root';
}

class App extends React.Component<{}, { message: string }> {
	state = { message: '' };
	form = React.createRef<HTMLFormElement>();

	componentDidMount() {
		const form = this.form.current;
		if (form) {
			$(form).on('submit', e => {
				this.setState({
					...this.state,
					message: '',
				});

				e.preventDefault();
				$.ajax({
					url: form.action,
					type: form.method,
					dataType: 'json',
					contentType: 'application/json; charset=utf-8',
					data: JSON.stringify({
						username: form.username.value,
						password: form.password.value,
					}),
				}).then(data => {
					this.setState({
						...this.state,
						message: data.message,
					});
				});
			});
		}
	}

	render() {
		return (
			<div>
				<form ref={this.form} action="/api/v1/login" method="post">
					<InputField label="Username" id="username" />
					<InputField label="Password" id="password" />
					<button type="submit">submit</button>
				</form>

				<p>{this.state.message}</p>
			</div>
		);
	}
}

ReactDOM.render(<App />, root);
