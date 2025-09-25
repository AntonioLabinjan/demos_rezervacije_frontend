<template>
  <div class="app">
    <div class="container">
      <!-- Header -->
       <header class="header">
        <div class="header-content">
          <h1 class="main-title">
            <span class="icon">🎓</span>
            FIPU demonstrature
          </h1>
          <p class="subtitle">powered by Šou Program</p>
        </div>
      </header>

      <!-- Main Grid -->
      <div class="grid">
        <!-- FORM: REZERVACIJA -->
        <div class="card">
          <div class="card-header">
            <div class="header-icon">📅</div>
            <h2>Rezervacija termina</h2>
          </div>
          <form @submit.prevent="submitReservation" class="form">
            <div class="input-group">
              <label>Discord korisničko ime</label>
              <input v-model="formReservation.discordNickname" placeholder="Unesite Discord nick" required class="input" />
            </div>
            <div class="input-row">
              <div class="input-group">
                <label>Datum</label>
                <input type="date" v-model="formReservation.date" required class="input" />
              </div>
              <div class="input-group">
                <label>Vrijeme</label>
                <input type="time" v-model="formReservation.time" required class="input" />
              </div>
            </div>
            <div class="input-group">
              <label>Kolegij</label>
              <input v-model="formReservation.course" placeholder="Naziv kolegija" required class="input" />
            </div>
            <div class="input-group">
              <label>Opis problema</label>
              <textarea v-model="formReservation.description" placeholder="Kratko opišite problem..." required class="input textarea" />
            </div>
            <button type="submit" class="btn btn-primary">
              <span>Rezerviraj termin</span>
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
              </svg>
            </button>
            <div v-if="errorReservation" class="alert alert-error">
              <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ errorReservation }}
            </div>
            <div v-if="successReservation" class="alert alert-success">
              <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Uspješno rezervirano!
            </div>
          </form>
        </div>

        <!-- OVERVIEW: REZERVACIJE -->
        <div class="card">
          <div class="card-header">
            <div class="header-icon">📋</div>
            <h2>Pregled rezervacija</h2>
          </div>
          <div class="card-content">
            <div v-if="reservations.length === 0" class="empty-state">
              <div class="empty-icon">📅</div>
              <p>Nema još rezervacija</p>
            </div>
            <div v-else class="reservation-list">
              <div v-for="(r, i) in reservations" :key="i" class="reservation-card">
                <div class="reservation-header">
                  <div class="user-info">
                    <div class="avatar">{{ r.discordNickname.charAt(0).toUpperCase() }}</div>
                    <div class="user-details">
                      <h3>{{ r.discordNickname }}</h3>
                      <span class="course-tag">{{ r.course }}</span>
                    </div>
                  </div>
                  <div class="datetime">
                    <div class="date">{{ r.date }}</div>
                    <div class="time">{{ r.time }}</div>
                  </div>
                </div>
                <p class="description">{{ r.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- FORM: PROBLEM -->
        <div class="card">
          <div class="card-header">
            <div class="header-icon">❓</div>
            <h2>Postavi problem</h2>
          </div>
          <form @submit.prevent="submitProblem" class="form">
            <div class="input-group">
              <label>Discord korisničko ime</label>
              <input v-model="formProblem.discordNickname" placeholder="Unesite Discord nick" required class="input" />
            </div>
            <div class="input-row">
              <div class="input-group">
                <label>Kolegij</label>
                <input v-model="formProblem.course" placeholder="Naziv kolegija" required class="input" />
              </div>
              <div class="input-group">
                <label>Programski jezik</label>
                <input v-model="formProblem.language" placeholder="JavaScript, Python..." required class="input" />
              </div>
            </div>
            <div class="input-group">
              <label>Opis problema</label>
              <textarea v-model="formProblem.description" placeholder="Detaljno opišite problem..." required class="input textarea" />
            </div>
            <div class="input-group">
              <label>Slike (opcionalno)</label>
              <input v-model="formProblem.images" placeholder="Linkovi slika odvojeni zarezom" class="input" />
            </div>
            <button type="submit" class="btn btn-secondary">
              <span>Objavi problem</span>
              <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 11l5-5m0 0l5 5m-5-5v12"/>
              </svg>
            </button>
            <div v-if="errorProblem" class="alert alert-error">
              <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {{ errorProblem }}
            </div>
            <div v-if="successProblem" class="alert alert-success">
              <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Problem uspješno objavljen!
            </div>
          </form>
        </div>

        <!-- OVERVIEW: PROBLEMI -->
        <div class="card">
          <div class="card-header">
            <div class="header-icon">🔧</div>
            <h2>Arhiva problema</h2>
          </div>
          <div class="card-content">
            <div v-if="problems.length === 0" class="empty-state">
              <div class="empty-icon">🔧</div>
              <p>Nema još postavljenih problema</p>
            </div>
            <div v-else class="problem-list">
              <div v-for="(p, i) in problems" :key="i" class="problem-card">
                <div class="problem-header">
                  <div class="user-info">
                    <div class="avatar">{{ p.discordNickname.charAt(0).toUpperCase() }}</div>
                    <div class="user-details">
                      <h3>{{ p.discordNickname }}</h3>
                      <div class="tags">
                        <span class="course-tag">{{ p.course }}</span>
                        <span class="language-tag">{{ p.language }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p class="description">{{ p.description }}</p>
                <div v-if="p.images && p.images.length" class="images">
                  <div v-for="(img, j) in p.images" :key="j" class="image-wrapper">
                    <img :src="img" :alt="`Problem image ${j + 1}`" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// REZERVACIJE
const formReservation = ref({
  discordNickname: '',
  course: '',
  date: '',
  time: '',
  description: '',
})
const errorReservation = ref('')
const successReservation = ref(false)
const reservations = ref([])

async function submitReservation() {
  errorReservation.value = ''
  successReservation.value = false
  try {
    await axios.post('http://localhost:3000/api/reservations', formReservation.value)
    successReservation.value = true
    formReservation.value = { discordNickname: '', date: '', time: '', description: '', course: '' }
    await fetchReservations()
  } catch (err) {
    errorReservation.value = err.response?.data?.message || 'Greška kod slanja.'
  }
}
async function fetchReservations() {
  try {
    const res = await axios.get('http://localhost:3000/api/reservations')
    reservations.value = res.data.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
  } catch (err) {
    console.error('Greška kod dohvaćanja rezervacija', err)
  }
}

// PROBLEMI
const formProblem = ref({
  discordNickname: '',
  course: '',
  language: '',
  description: '',
  images: ''
})
const errorProblem = ref('')
const successProblem = ref(false)
const problems = ref([])

async function submitProblem() {
  errorProblem.value = ''
  successProblem.value = false
  try {
    const payload = {
      ...formProblem.value,
      images: formProblem.value.images
        ? formProblem.value.images.split(',').map(i => i.trim())
        : []
    }
    await axios.post('http://localhost:3000/api/problems', payload)
    successProblem.value = true
    formProblem.value = { discordNickname: '', course: '', language: '', description: '', images: '' }
    await fetchProblems()
  } catch (err) {
    errorProblem.value = err.response?.data?.message || 'Greška kod slanja problema.'
  }
}
async function fetchProblems() {
  try {
    const res = await axios.get('http://localhost:3000/api/problems')
    problems.value = res.data
  } catch (err) {
    console.error('Greška kod dohvaćanja problema', err)
  }
}

onMounted(() => {
  fetchReservations()
  fetchProblems()
})
</script>

<style scoped>
/* CSS Reset & Base */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  min-height: 100vh;
  background: linear-gradient(135deg, #a3bffa 0%, #667eea 100%);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #e2e8f0;
  line-height: 1.6;
}

/* Container */
.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

/* Header */
.header {
  text-align: center;
  margin-bottom: 3rem;
}

.header-content {
  position: relative;
}

.main-title {
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.icon {
  font-size: 2.5rem;
}

.subtitle {
  font-size: 1.1rem;
  color: #94a3b8;
  font-weight: 500;
}

/* Grid Layout */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
}

/* Cards */
.card {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(51, 65, 85, 0.2) 100%);
  border: 1px solid rgba(71, 85, 105, 0.3);
  border-radius: 24px;
  overflow: hidden;
  backdrop-filter: blur(20px);
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 10px 10px -5px rgba(0, 0, 0, 0.2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(139, 92, 246, 0.3);
}

/* Card Headers */
.card-header {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);
  border-bottom: 1px solid rgba(71, 85, 105, 0.3);
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  font-size: 1.5rem;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
}

/* Card Content */
.card-content {
  padding: 2rem;
}

/* Forms */
.form {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Input Groups */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #cbd5e1;
  text-transform: uppercase;
  letter-spacing: 0.025em;
}

/* Inputs */
.input {
  padding: 16px 20px;
  background: rgba(30, 41, 59, 0.6);
  border: 2px solid rgba(71, 85, 105, 0.4);
  border-radius: 16px;
  color: #f1f5f9;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
}

.input::placeholder {
  color: #64748b;
}

.input:focus {
  outline: none;
  border-color: #667eea;
  background: rgba(30, 41, 59, 0.8);
  box-shadow: 
    0 0 0 4px rgba(102, 126, 234, 0.1),
    0 8px 16px -4px rgba(102, 126, 234, 0.2);
}

.textarea {
  min-height: 120px;
  resize: vertical;
}

/* Buttons */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 16px 32px;
  border-radius: 16px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
  transform: translateX(-100%);
  transition: transform 0.6s;
}

.btn:hover::before {
  transform: translateX(100%);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 8px 16px -4px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px -4px rgba(102, 126, 234, 0.5);
}

.btn-secondary {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: white;
  box-shadow: 0 8px 16px -4px rgba(34, 197, 94, 0.4);
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px -4px rgba(34, 197, 94, 0.5);
}

.btn-icon {
  width: 20px;
  height: 20px;
}

/* Alerts */
.alert {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 16px 20px;
  border-radius: 12px;
  font-weight: 500;
  margin-top: 0.5rem;
}

.alert-error {
  background: rgba(239, 68, 68, 0.1);
  color: #fca5a5;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.alert-success {
  background: rgba(34, 197, 94, 0.1);
  color: #86efac;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.alert-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

/* Empty States */
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #64748b;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* Reservation Cards */
.reservation-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.reservation-card {
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(71, 85, 105, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.reservation-card:hover {
  background: rgba(30, 41, 59, 0.6);
  border-color: rgba(139, 92, 246, 0.3);
}

.reservation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.avatar {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  color: white;
}

.user-details h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #f1f5f9;
  margin: 0 0 0.25rem 0;
}

.course-tag {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%);
  color: #c4b5fd;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.datetime {
  text-align: right;
}

.date {
  font-size: 0.875rem;
  font-weight: 600;
  color: #f1f5f9;
}

.time {
  font-size: 0.75rem;
  color: #94a3b8;
}

.description {
  color: #cbd5e1;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0;
}

/* Problem Cards */
.problem-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.problem-card {
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(71, 85, 105, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.problem-card:hover {
  background: rgba(30, 41, 59, 0.6);
  border-color: rgba(34, 197, 94, 0.3);
}

.problem-header {
  margin-bottom: 1rem;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.language-tag {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%);
  color: #86efac;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

/* Images */
.images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.image-wrapper {
  position: relative;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(30, 41, 59, 0.6);
  border: 1px solid rgba(71, 85, 105, 0.3);
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.image-wrapper:hover img {
  transform: scale(1.05);
}

/* Responsive Design */
@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .main-title {
    font-size: 2rem;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .input-row {
    grid-template-columns: 1fr;
  }
  
  .reservation-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .datetime {
    text-align: left;
  }
}

@media (max-width: 480px) {
  .form {
    padding: 1.5rem;
  }
  
  .card-content {
    padding: 1.5rem;
  }
  
  .card-header {
    padding: 1.25rem 1.5rem;
  }
}
</style>
