import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './error-page';
import './index.css';
import Contact, { loader as contactLoader } from './routes/contact';
import EditContact, { action as editAction } from './routes/edit';
import Root, { loader as rootLoader, action as rootAction } from './routes/root';
import { action as deleteAction } from './routes/destroy';
import Index from './routes';

const router = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		errorElement: <ErrorPage />,
		loader: rootLoader,
		action: rootAction,
		shouldRevalidate: ({ currentUrl }) => {
			return currentUrl.pathname.includes('contacts');
		},
		children: [
			{ index: true, element: <Index /> },
			{
				path: 'contacts/:contactId',
				element: <Contact />,
				loader: contactLoader,
			},
			{
				path: 'contacts/:contactId/edit',
				element: <EditContact />,
				action: editAction,
				loader: contactLoader,
			},
			{
				path: 'contacts/:contactId/destroy',
				action: deleteAction,
				errorElement: <div>Oops! There was an error.</div>,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
