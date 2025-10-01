<template>
  <div class="container">
    <div class="form-box">
      <h2>{{ isLogin ? 'Login' : 'Sign Up' }}</h2>
      
      <form @submit.prevent="handleSubmit">
        <div v-if="!isLogin" class="form-group">
          <label>Name (optional)</label>
          <input v-model="form.name" type="text" placeholder="Your Name" />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" type="email" placeholder="example@mail.com" required />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input v-model="form.password" type="password" placeholder="********" required />
        </div>

        <div v-if="!isLogin" class="form-group">
          <label>Course</label>
          <select v-model="form.course" required>
            <option value="">Odaberite kolegij</option>
            <option value="Programsko inženjerstvo">Programsko inženjerstvo</option>
            <option value="Web aplikacije">Web aplikacije</option>
            <option value="Baze podataka">Baze podataka</option>
            <option value="Objektno orijentirano programiranje">Objektno orijentirano programiranje</option>
            <option value="Strukture podataka i algoritmi">Strukture podataka i algoritmi</option>
          </select>
        </div>

        <button type="submit" class="btn" :disabled="loading">
          {{ loading ? 'Učitavanje...' : (isLogin ? 'Login' : 'Sign Up') }}
        </button>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </form>

      <p class="switch">
        {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
        <button @click="toggleMode" class="link">
          {{ isLogin ? 'Sign Up' : 'Login' }}
        </button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isLogin = ref(true)
const loading = ref(false)
const error = ref('')

const form = reactive({
  name: '',
  email: '',
  password: '',
  course: ''
})

const API_BASE = "http://localhost:3000"

function toggleMode() {
  isLogin.value = !isLogin.value
  error.value = ''
}

const handleSubmit = async () => {
  loading.value = true
  error.value = ''

  try {
    const url = isLogin.value 
      ? `${API_BASE}/api/login` 
      : `${API_BASE}/api/signup`

    const payload = isLogin.value 
      ? { email: form.email, password: form.password }
      : { email: form.email, password: form.password, course: form.course }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })

    const data = await res.json()
    
    if (!res.ok) {
      error.value = data.message || 'Došlo je do greške.'
      loading.value = false
      return
    }

    if (isLogin.value) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      
      // Koristi Vue Router za navigaciju
      router.push('/reservations')
    } else {
      alert('Signup uspješan! Sada se možeš ulogirati.')
      isLogin.value = true
      form.email = ''
      form.password = ''
      form.course = ''
    }

  } catch (err) {
    console.error(err)
    error.value = 'Došlo je do greške kod komunikacije sa serverom.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f4f6f9;
}

.form-box {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 380px;
}

h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: .3rem;
  font-weight: 600;
}

input, select {
  width: 100%;
  padding: .6rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: .95rem;
}

input:focus, select:focus {
  border-color: #4a90e2;
  outline: none;
}

.btn {
  width: 100%;
  padding: .7rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background .2s;
}

.btn:hover:not(:disabled) {
  background: #357ab7;
}

.btn:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.error-message {
  margin-top: 1rem;
  padding: .7rem;
  background: #fee;
  color: #c33;
  border-radius: 8px;
  font-size: .9rem;
  text-align: center;
}

.switch {
  text-align: center;
  margin-top: 1rem;
  font-size: .9rem;
}

.link {
  background: none;
  border: none;
  color: #4a90e2;
  cursor: pointer;
  font-size: .9rem;
  margin-left: 4px;
}

.link:hover {
  text-decoration: underline;
}
</style>