const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');
const brandHeader = document.getElementById('brandHeader');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
	// Mover el título al lado derecho (Sign Up)
	if (brandHeader) {
		container.appendChild(brandHeader);
	}
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
	// Mover el título al lado izquierdo (Sign In)
	if (brandHeader) {
		container.appendChild(brandHeader);
	}
});

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
	// Crear elemento de notificación
	const notification = document.createElement('div');
	notification.className = `notification ${type}`;
	notification.style.cssText = `
		position: fixed;
		top: 20px;
		right: 20px;
		padding: 15px 20px;
		border-radius: 8px;
		color: white;
		font-weight: 500;
		z-index: 10000;
		transition: all 0.3s ease;
		max-width: 300px;
	`;
	
	// Estilos según el tipo
	if (type === 'success') {
		notification.style.backgroundColor = '#009087';
	} else if (type === 'error') {
		notification.style.backgroundColor = '#dc3545';
	} else {
		notification.style.backgroundColor = '#6c757d';
	}
	
	notification.textContent = message;
	document.body.appendChild(notification);
	
	// Remover después de 4 segundos
	setTimeout(() => {
		notification.remove();
	}, 4000);
}

// Función para manejar registro
async function handleRegister(event) {
	event.preventDefault();
	
	const form = event.target;
	const formData = new FormData(form);
	
	const userData = {
		name: formData.get('name'),
		email: formData.get('email'),
		pwd: formData.get('password')
	};
	
	// Validación básica
	if (!userData.name || !userData.email || !userData.pwd) {
		showNotification('Todos los campos son requeridos', 'error');
		return;
	}
	
	try {
		const response = await fetch('/register', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(userData)
		});
		
		if (response.ok) {
			const result = await response.json();
			showNotification('¡Usuario registrado exitosamente! Ahora puedes iniciar sesión.', 'success');
			
			// Cambiar al formulario de login después de 2 segundos
			setTimeout(() => {
				signInButton.click();
			}, 2000);
			
			// Limpiar formulario
			form.reset();
		} else {
			const error = await response.json();
			showNotification(error.message || 'Error al registrar usuario', 'error');
		}
	} catch (error) {
		console.error('Error:', error);
		showNotification('Error de conexión. Intenta de nuevo.', 'error');
	}
}

// Función para manejar login
async function handleLogin(event) {
	event.preventDefault();
	
	const form = event.target;
	const formData = new FormData(form);
	
	const loginData = {
		email: formData.get('email'),
		pwd: formData.get('password')
	};
	
	// Validación básica
	if (!loginData.email || !loginData.pwd) {
		showNotification('Email y contraseña son requeridos', 'error');
		return;
	}
	
	try {
		const response = await fetch('/auth', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(loginData),
			credentials: 'include' // Importante para las cookies
		});
		
		if (response.ok) {
			const result = await response.json();
			showNotification(`¡Bienvenido ${result.user.name}!`, 'success');
			
			// Guardar token en localStorage (opcional)
			localStorage.setItem('accessToken', result.accessToken);
			localStorage.setItem('user', JSON.stringify(result.user));
			
			// Redirigir al index.html después de 1 segundo
			setTimeout(() => {
				window.location.href = '/app';
			}, 1000);
		} else {
			const error = await response.json();
			showNotification(error.message || 'Credenciales incorrectas', 'error');
		}
	} catch (error) {
		console.error('Error:', error);
		showNotification('Error de conexión. Intenta de nuevo.', 'error');
	}
}

// Agregar event listeners cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
	// Formulario de registro
	const registerForm = document.querySelector('.sign-up-container form');
	if (registerForm) {
		registerForm.addEventListener('submit', handleRegister);
	}
	
	// Formulario de login
	const loginForm = document.querySelector('.sign-in-container form');
	if (loginForm) {
		loginForm.addEventListener('submit', handleLogin);
	}
});