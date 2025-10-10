<template>
  <div class="home-page">
    <div class="grid">
      <!-- FORM: REZERVACIJA -->
      <div class="card">
        <div class="card-header">
          <div class="header-icon">📅</div>
          <h2>Rezervacija termina - test</h2>
        </div>
        <form @submit.prevent="submitReservation" class="form">
          <div class="input-group">
            <label>Unipu email</label>
            <input v-model="formReservation.email" placeholder="Unesite unipu email" required class="input" />
          </div>

          <!-- TJEDAN OD - DO -->
          <div class="input-row">
            <div class="input-group">
              <label>Tjedan od</label>
              <input type="date" v-model="formReservation.startDate" required class="input" />
            </div>
            <div class="input-group">
              <label>Tjedan do</label>
              <input type="date" v-model="formReservation.endDate" required class="input" />
            </div>
          </div>

          <div class="input-group">
            <label>Vrijeme</label>
            <input type="time" v-model="formReservation.time" required class="input" />
          </div>

          <div class="input-group">
            <label>Kolegij</label>
            <select v-model="formReservation.course" required class="select" @change="onReservationCourseChange">
              <option value="">Odaberite kolegij</option>
              <option v-for="course in courses" :key="course" :value="course">{{ course }}</option>
            </select>
          </div>

          <div class="input-group" v-if="availableReservationTags.length > 0">
            <label>Tagovi</label>
            <div class="tags-container">
              <div 
                v-for="tag in availableReservationTags" 
                :key="tag" 
                :class="['tag', { selected: formReservation.tags.includes(tag) }]"
                @click="toggleReservationTag(tag)"
              >
                {{ tag }}
              </div>
            </div>
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

      <!-- FORM: PROBLEM -->
      <div class="card">
        <div class="card-header">
          <div class="header-icon">❓</div>
          <h2>Postavi problem</h2>
        </div>
        <form @submit.prevent="submitProblem" class="form">
          <div class="input-group">
            <label>Discord korisničko ime</label>
            <input v-model="formProblem.discordNickname" placeholder="Unesite unipu email" required class="input" />
          </div>

          <div class="input-group">
            <label>Kolegij</label>
            <select v-model="formProblem.course" required class="select" @change="onCourseChange">
              <option value="">Odaberite kolegij</option>
              <option v-for="course in courses" :key="course" :value="course">{{ course }}</option>
            </select>
          </div>

          <div class="input-group">
            <label>Programski jezik (opcionalno)</label>
            <input v-model="formProblem.language" placeholder="JavaScript, Python..." class="input" />
          </div>

          <div class="input-group" v-if="availableTags.length > 0">
            <label>Tagovi</label>
            <div class="tags-container">
              <div 
                v-for="tag in availableTags" 
                :key="tag" 
                :class="['tag', { selected: formProblem.tags.includes(tag) }]"
                @click="toggleTag(tag)"
              >
                {{ tag }}
              </div>
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
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const courses = [
  'Programsko inženjerstvo',
  'Web aplikacije',
  'Baze podataka',
  'Objektno orijentirano programiranje',
  'Strukture podataka i algoritmi'
]

const courseTags = {
  'Programsko inženjerstvo': ['VueJS', 'Firebase', 'Pinia', 'Auth', 'Dizajn', 'UML dijagrami', 'Dokumentacija'],
  'Web aplikacije': ['HTML', 'CSS', 'JavaScript', 'React', 'NodeJS', 'REST API', 'MongoDB'],
  'Baze podataka': ['SQL', 'MySQL', 'MongoDB', 'Normalizacija', 'ER dijagrami', 'Upiti', 'Indeksi'],
  'Objektno orijentirano programiranje': ['Java', 'C++', 'Python', 'Klase', 'Nasljeđivanje', 'Polimorfizam', 'Enkapsulacija'],
  'Strukture podataka i algoritmi': ['Liste', 'Stabla', 'Grafovi', 'Sortiranje', 'Pretraživanje', 'Složenost', 'Rekurzija']
}

const formReservation = ref({
  email: '',
  course: '',
  startDate: '',
  endDate: '',
  time: '',
  description: '',
  tags: []
})

const availableReservationTags = ref([])
const errorReservation = ref('')
const successReservation = ref(false)

async function submitReservation() {
  errorReservation.value = ''
  successReservation.value = false
  try {
    await axios.post('http://localhost:3000/api/reservations', formReservation.value)
    successReservation.value = true
    formReservation.value = { 
      email: '', 
      startDate: '', 
      endDate: '', 
      time: '', 
      description: '', 
      course: '',
      tags: [] 
    }
    availableReservationTags.value = []
    setTimeout(() => successReservation.value = false, 3000)
  } catch (err) {
    errorReservation.value = err.response?.data?.message || 'Greška kod slanja.'
  }
}

// PROBLEMI
const formProblem = ref({
  email: '',
  course: '',
  language: '',
  description: '',
  images: '',
  tags: []
})
const availableTags = ref([])
const errorProblem = ref('')
const successProblem = ref(false)

function onCourseChange() {
  formProblem.value.tags = []
  availableTags.value = courseTags[formProblem.value.course] || []
}

function toggleTag(tag) {
  const index = formProblem.value.tags.indexOf(tag)
  if (index > -1) formProblem.value.tags.splice(index, 1)
  else formProblem.value.tags.push(tag)
}

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
    formProblem.value = { email: '', course: '', language: '', description: '', images: '', tags: [] }
    availableTags.value = []
    setTimeout(() => successProblem.value = false, 3000)
  } catch (err) {
    errorProblem.value = err.response?.data?.message || 'Greška kod slanja problema.'
  }
}

function onReservationCourseChange() {
  formReservation.value.tags = []
  availableReservationTags.value = courseTags[formReservation.value.course] || []
}

function toggleReservationTag(tag) {
  const index = formReservation.value.tags.indexOf(tag)
  if (index > -1) formReservation.value.tags.splice(index, 1)
  else formReservation.value.tags.push(tag)
}
</script>


<style scoped>
.home-page {
  width: 100%;
}

</style>
