const SESSION_KEY = 'i-vote-admin-session'

const temporaryAdmin = {
	username: 'admin',
	password: 'admin123',
	name: 'Administrateur',
	role: 'admin',
}

export function login(username, password) {
	if (username !== temporaryAdmin.username || password !== temporaryAdmin.password) {
		throw new Error('Nom d’utilisateur ou mot de passe incorrect.')
	}

	const session = {
		username: temporaryAdmin.username,
		name: temporaryAdmin.name,
		role: temporaryAdmin.role,
	}

	localStorage.setItem(SESSION_KEY, JSON.stringify(session))
	return session
}

export function getSession() {
	const session = localStorage.getItem(SESSION_KEY)

	return session ? JSON.parse(session) : null
}

export function logout() {
	localStorage.removeItem(SESSION_KEY)
}
