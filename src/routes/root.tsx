import { ContactSchema, createContact } from './../contacts';
import {
	Form,
	Link,
	LoaderFunctionArgs,
	NavLink,
	Outlet,
	redirect,
	useLoaderData,
	useNavigation,
} from 'react-router-dom';
import { getContacts } from '../contacts';
import { z, ZodType } from 'zod';
import { useEffect, useRef } from 'react';

export async function action() {
	const contact = await createContact();
	return redirect(`/contacts/${contact.id}/edit`);
}

export async function loader({ request }: LoaderFunctionArgs) {
	const url = new URL(request.url);
	const q = url.searchParams.get('q');
	const contacts = await getContacts(q);
	return { contacts, q };
}

const responseSchema: ZodType<Awaited<ReturnType<typeof loader>>> = z.object({
	contacts: z.array(ContactSchema),
	q: z.string().nullable(),
});

export default function Root() {
	const { contacts, q } = responseSchema.parse(useLoaderData());
	const navigation = useNavigation();
	const qRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		qRef.current!.value = q ?? '';
	}, [q]);

	return (
		<>
			<div id="sidebar">
				<h1>React Router Contacts</h1>
				<div>
					<Form id="search-form" role="search">
						<input
							id="q"
							aria-label="Search contacts"
							placeholder="Search"
							type="search"
							name="q"
							defaultValue={q ?? ''}
							ref={qRef}
						/>
						<div id="search-spinner" aria-hidden hidden={true} />
						<div className="sr-only" aria-live="polite"></div>
					</Form>
					<Form method="post">
						<button type="submit">New</button>
					</Form>
				</div>
				<nav>
					{contacts.length ? (
						<ul>
							{contacts.map((contact) => (
								<li key={contact.id}>
									<NavLink
										to={`contacts/${contact.id}`}
										className={({ isActive, isPending }) =>
											isActive ? 'active' : isPending ? 'pending' : ''
										}
									>
										{contact.first || contact.last ? (
											<>
												{contact.first} {contact.last}
											</>
										) : (
											<i>No Name</i>
										)}{' '}
										{contact.favorite && <span>★</span>}
									</NavLink>
								</li>
							))}
						</ul>
					) : (
						<p>
							<i>No contacts</i>
						</p>
					)}
				</nav>
			</div>
			<div id="detail" className={navigation.state === 'loading' ? 'loading' : ''}>
				<Outlet />
			</div>
		</>
	);
}
