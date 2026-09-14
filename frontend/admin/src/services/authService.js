import * as authRepository from '../repositories/authRepository'

export function login(username, password) {
	return authRepository.login(username.trim(), password)
}

export function getCurrentSession() {
	return authRepository.getSession()
}

export function isAuthenticated() {
	return Boolean(getCurrentSession())
}

export function logout() {
	authRepository.logout()
}
