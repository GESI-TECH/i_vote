import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as authService from '../services/authService'

export function useAuthViewModel() {
	const navigate = useNavigate()
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)

	async function submitLogin(event) {
		event.preventDefault()
		setError('')
		setIsSubmitting(true)

		try {
			authService.login(username, password)
			navigate('/dashboard', { replace: true })
		} catch (loginError) {
			setError(loginError.message)
		} finally {
			setIsSubmitting(false)
		}
	}

	return {
		username,
		password,
		error,
		isSubmitting,
		setUsername,
		setPassword,
		submitLogin,
	}
}
