import '@testing-library/jest-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import { act } from 'react';
import Page, { ApiClient } from './page';

class MockApiClient implements ApiClient {
	constructor(advocates) {
		this.advocates = advocates;
	}

	getAdvocates() {
		return Promise.resolve(this.advocates);
	}
}

const advocates = [
	{
		firstName: 'John',
		lastName: 'Doe',
		city: 'New York',
		degree: 'JD',
		specialties: ['Criminal Law', 'Family Law'],
		yearsOfExperience: 10,
		phoneNumber: '123-456-7890',
	},
	{
		firstName: 'Jane',
		lastName: 'Smith',
		city: 'Los Angeles',
		degree: 'LLM',
		specialties: ['Corporate Law', 'Intellectual Property'],
		yearsOfExperience: 8,
		phoneNumber: '987-654-3210',
	},
];

test('page shows the advocates provided', async () => {
	await act(async () => {
		render(<Page apiClient={new MockApiClient(advocates)}/>)
	});

	expect(screen.getByText('John')).toBeInTheDocument();
	expect(screen.getByText('Jane')).toBeInTheDocument();
});

test('page allows searching by name', async () => {
	await act(async () => {
		render(<Page apiClient={new MockApiClient(advocates)}/>)
	});

	await act(async () => {
		fireEvent.change(screen.getByLabelText('Search'), { target: { value: 'Jane' } });
	});

	expect(screen.getByText('Smith')).toBeInTheDocument();
	expect(screen.queryByText('John')).not.toBeInTheDocument();
});
