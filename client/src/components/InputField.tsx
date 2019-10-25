import * as React from 'react';
import forms from '../forms.module.scss';

export const InputField = ({ id, label }: { id: string; label: string }) => (
	<div className={forms.field}>
		<label htmlFor={id}>{label}</label>
		<input id={id} type="text" />
	</div>
);
