<template>
  <div class="max-w-2xl mx-auto p-6 space-y-8">
    <!-- FORM -->
    <form @submit.prevent="submitReservation" class="space-y-4 bg-white rounded shadow p-6">
      <input v-model="form.discordNickname" placeholder="STUDENT (Discord nick)" required class="input" />
      <input type="date" v-model="form.date" required class="input" />
      <input type="time" v-model="form.time" required class="input" />
      <input v-model="form.course" placeholder="KOLEGIJ" required class="input" />
      <textarea v-model="form.description" placeholder="KRATKI OPIS PROBLEMA" required class="input" />
      <button type="submit" class="btn">Pošalji zahtjev</button>
      <p v-if="error" class="text-red-500">{{ error }}</p>
      <p v-if="success" class="text-green-500">Uspješno rezervirano!</p>
    </form>

    <!-- OVERVIEW -->
    <div class="bg-white rounded shadow p-6">
      <h2 class="text-xl font-bold mb-4">📅 Pregled svih rezervacija</h2>
      <div v-if="reservations.length === 0" class="text-gray-500">Nema još rezervacija.</div>
      <ul v-else class="divide-y">
        <li v-for="(r, i) in reservations" :key="i" class="py-2">
          <p><strong>👤 {{ r.discordNickname }}</strong></p>
          <p><strong> {{ r.course }}</strong></p>
          <p>📅 {{ r.date }} 🕒 {{ r.time }}</p>
          <p class="text-gray-600">📝 {{ r.description }}</p>

        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const form = ref({
  discordNickname: '',
  course: '',
  date: '',
  time: '',
  description: '',
})


const error = ref('')
const success = ref(false)
const reservations = ref([])

async function submitReservation() {
  error.value = ''
  success.value = false
  try {
    await axios.post('http://localhost:3000/api/reservations', form.value)
    success.value = true
    form.value = { discordNickname: '', date: '', time: '', description: '' }
    await fetchReservations() // refresha overview odmah
  } catch (err) {
    error.value = err.response?.data?.message || 'Greška kod slanja.'
  }
}

async function fetchReservations() {
  try {
    const res = await axios.get('http://localhost:3000/api/reservations')
    // sort po datumu + vremenu (opcionalno)
    reservations.value = res.data.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
  } catch (err) {
    console.error('Greška kod dohvaćanja rezervacija', err)
  }
}

onMounted(fetchReservations)
</script>

<style scoped>
.input {
  @apply w-full p-2 border rounded border-gray-300;
}
.btn {
  @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700;
}
</style>
