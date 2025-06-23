<template>
  <form @submit.prevent="submitReservation" class="max-w-md mx-auto p-6 space-y-4 bg-white rounded shadow">
    <input v-model="form.discordNickname" placeholder="STUDENT (Discord nick)" required class="input" />
    <input type="date" v-model="form.date" required class="input" />
    <input type="time" v-model="form.time" required class="input" />
    <textarea v-model="form.description" placeholder="KRATKI OPIS PROBLEMA" required class="input" />
    <button type="submit" class="btn">Pošalji zahtjev</button>
    <p v-if="error" class="text-red-500">{{ error }}</p>
    <p v-if="success" class="text-green-500">Uspješno rezervirano!</p>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const form = ref({
  discordNickname: '',
  date: '',
  time: '',
  description: '',
})

const error = ref('')
const success = ref(false)

async function submitReservation() {
  error.value = ''
  success.value = false
  try {
    await axios.post('https://demos-rezervacije-backend.onrender.com/api/reservations', form.value)
    success.value = true
    form.value = { discordNickname: '', date: '', time: '', description: '' }
  } catch (err) {
    error.value = err.response?.data?.message || 'Greška kod slanja.'
  }
}
</script>

<style scoped>
.input {
  @apply w-full p-2 border rounded border-gray-300;
}
.btn {
  @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700;
}
</style>
