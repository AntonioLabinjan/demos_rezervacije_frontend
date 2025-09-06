<template>
  <div class="max-w-3xl mx-auto p-6 space-y-8">
    <!-- FORM: REZERVACIJA -->
    <form @submit.prevent="submitReservation" class="space-y-4 bg-white rounded shadow p-6">
      <h2 class="text-lg font-bold mb-2">📅 Rezervacija termina</h2>
      <input v-model="formReservation.discordNickname" placeholder="STUDENT (Discord nick)" required class="input" />
      <input type="date" v-model="formReservation.date" required class="input" />
      <input type="time" v-model="formReservation.time" required class="input" />
      <input v-model="formReservation.course" placeholder="KOLEGIJ" required class="input" />
      <textarea v-model="formReservation.description" placeholder="KRATKI OPIS PROBLEMA" required class="input" />
      <button type="submit" class="btn">Pošalji zahtjev</button>
      <p v-if="errorReservation" class="text-red-500">{{ errorReservation }}</p>
      <p v-if="successReservation" class="text-green-500">Uspješno rezervirano!</p>
    </form>

    <!-- OVERVIEW: REZERVACIJE -->
    <div class="bg-white rounded shadow p-6">
      <h2 class="text-xl font-bold mb-4">📅 Pregled svih rezervacija</h2>
      <div v-if="reservations.length === 0" class="text-gray-500">Nema još rezervacija.</div>
      <ul v-else class="divide-y">
        <li v-for="(r, i) in reservations" :key="i" class="py-2">
          <p><strong>👤 {{ r.discordNickname }}</strong></p>
          <p><strong>{{ r.course }}</strong></p>
          <p>📅 {{ r.date }} 🕒 {{ r.time }}</p>
          <p class="text-gray-600">📝 {{ r.description }}</p>
        </li>
      </ul>
    </div>

    <!-- FORM: PROBLEM -->
    <form @submit.prevent="submitProblem" class="space-y-4 bg-white rounded shadow p-6">
      <h2 class="text-lg font-bold mb-2">❓ Postavi konkretan problem</h2>
      <input v-model="formProblem.discordNickname" placeholder="STUDENT (Discord nick)" required class="input" />
      <input v-model="formProblem.course" placeholder="KOLEGIJ" required class="input" />
      <input v-model="formProblem.language" placeholder="PROGRAMSKI JEZIK" required class="input" />
      <textarea v-model="formProblem.description" placeholder="OPIS PROBLEMA" required class="input" />
      <input v-model="formProblem.images" placeholder="Linkovi slika (odvojeni zarezom)" class="input" />
      <button type="submit" class="btn">Objavi problem</button>
      <p v-if="errorProblem" class="text-red-500">{{ errorProblem }}</p>
      <p v-if="successProblem" class="text-green-500">Problem uspješno objavljen!</p>
    </form>

    <!-- OVERVIEW: PROBLEMI -->
    <div class="bg-white rounded shadow p-6">
      <h2 class="text-xl font-bold mb-4">📖 Arhiva problema</h2>
      <div v-if="problems.length === 0" class="text-gray-500">Nema još postavljenih problema.</div>
      <ul v-else class="divide-y">
        <li v-for="(p, i) in problems" :key="i" class="py-2">
          <p><strong>👤 {{ p.discordNickname }}</strong></p>
          <p><strong>{{ p.course }}</strong> ({{ p.language }})</p>
          <p class="text-gray-600">📝 {{ p.description }}</p>
          <div v-if="p.images && p.images.length" class="flex flex-wrap gap-2 mt-2">
            <img v-for="(img, j) in p.images" :key="j" :src="img" class="w-32 h-32 object-cover rounded" />
          </div>
        </li>
      </ul>
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
    await axios.post('https://demos-rezervacije-backend-2.onrender.com/api/reservations', formReservation.value)
    successReservation.value = true
    formReservation.value = { discordNickname: '', date: '', time: '', description: '', course: '' }
    await fetchReservations()
  } catch (err) {
    errorReservation.value = err.response?.data?.message || 'Greška kod slanja.'
  }
}
async function fetchReservations() {
  try {
    const res = await axios.get('https://demos-rezervacije-backend-2.onrender.com/api/reservations')
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
    const res = await axios.get('https://demos-rezervacije-backend-2.onrender.com/api/problems')
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
.input {
  @apply w-full p-2 border rounded border-gray-300;
}
.btn {
  @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700;
}
</style>

