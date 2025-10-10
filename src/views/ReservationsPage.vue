<template>
  <div class="reservations-page">
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
        <div v-for="r in reservations" :key="r._id" 
     class="reservation-card" 
     :class="{ done: r.done }">
  
  <div class="reservation-header">
    <div class="user-info">
      <div class="avatar">{{ r.email.charAt(0).toUpperCase() }}</div>
      <div class="user-details">
        <h3>{{ r.email }}</h3>
        <span class="course-tag">{{ r.course }}</span>
      </div>
    </div>
    <div class="datetime">
      <div class="week">{{ formatWeek(r.startDate, r.endDate) }}</div>
      <div class="time">{{ r.time }}</div>
    </div>
  </div>

  <p class="description">{{ r.description }}</p>

  <div v-if="r.tags && r.tags.length > 0" class="tags-container">
    <span v-for="tag in r.tags" :key="tag" class="tag">{{ tag }}</span>
  </div>

  <div class="action-buttons">
    <label class="done-label">
      <input type="checkbox" v-model="r.done" />
      Mark as done
    </label>
    <button @click="startEdit(r)" class="btn btn-small btn-primary">Uredi</button>
    <button @click="deleteReservation(r._id)" class="btn btn-small btn-danger">Obriši</button>
  </div>
</div>

        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div v-if="editingReservation" class="modal-overlay" @click="cancelEdit">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Uredi rezervaciju</h2>
          <button @click="cancelEdit" class="close-btn">&times;</button>
        </div>
        <form @submit.prevent="saveEdit" class="form">
          <div class="input-group">
            <label>Unipu email</label>
            <input v-model="editForm.email" required class="input" />
          </div>

          <div class="input-row">
            <div class="input-group">
              <label>Tjedan (od)</label>
              <input type="date" v-model="editForm.startDate" required class="input" />
            </div>
            <div class="input-group">
              <label>Tjedan (do)</label>
              <input type="date" v-model="editForm.endDate" required class="input" />
            </div>
            <div class="input-group">
              <label>Vrijeme</label>
              <input type="time" v-model="editForm.time" required class="input" />
            </div>
          </div>

          <div class="input-group">
            <label>Kolegij</label>
            <select v-model="editForm.course" required class="select" @change="onCourseChange">
              <option value="">Odaberite kolegij</option>
              <option v-for="course in courses" :key="course" :value="course">{{ course }}</option>
            </select>
          </div>

          <div class="input-group" v-if="availableTags.length > 0">
            <label>Tagovi</label>
            <div class="tags-container">
              <div
                v-for="tag in availableTags"
                :key="tag"
                :class="['tag', 'clickable', { selected: editForm.tags.includes(tag) }]"
                @click="toggleTag(tag)"
              >
                {{ tag }}
              </div>
            </div>
          </div>

          <div class="input-group">
            <label>Opis problema</label>
            <textarea v-model="editForm.description" required class="input textarea" />
          </div>

          <div class="modal-actions">
            <button type="button" @click="cancelEdit" class="btn btn-secondary">Odustani</button>
            <button type="submit" class="btn btn-primary">Spremi promjene</button>
          </div>

          <div v-if="editError" class="alert alert-error">{{ editError }}</div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const courses = [
  'Programsko inženjerstvo',
  'Web aplikacije',
  'Baze podataka',
  'Objektno orijentirano programiranje',
  'Strukture podataka i algoritmi'
]

const courseTags = {
  'Programsko inženjerstvo': ['VueJS', 'Firebase', 'Pinia', 'Auth', 'UML', 'Dokumentacija'],
  'Web aplikacije': ['HTML', 'CSS', 'JS', 'React', 'NodeJS', 'MongoDB'],
  'Baze podataka': ['SQL', 'MySQL', 'ERD', 'Upiti', 'Indeksi'],
  'Objektno orijentirano programiranje': ['Java', 'C++', 'Python', 'Klase', 'Polimorfizam'],
  'Strukture podataka i algoritmi': ['Liste', 'Stabla', 'Grafovi', 'Sortiranje']
}

const reservations = ref([])
const editingReservation = ref(null)
const editForm = ref({
  email: '',
  startDate: '',
  endDate: '',
  time: '',
  description: '',
  course: '',
  tags: []
})
const availableTags = ref([])
const editError = ref('')

// Fetch from backend
async function fetchReservations() {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get('http://localhost:3000/api/reservations', {
      headers: { Authorization: `Bearer ${token}` }
    })

    // Učitajmo done status iz localStorage
    const doneMap = JSON.parse(localStorage.getItem('doneReservations') || '{}')

    // Dodaj done property svakoj rezervaciji
    reservations.value = res.data.map(r => ({
      ...r,
      done: !!doneMap[r._id]
    }))
  } catch (err) {
    console.error('Greška kod dohvaćanja rezervacija', err)
  }
}


// Format week range
function formatWeek(start, end) {
  if (!start || !end) return ''
  const fmt = d => new Date(d).toLocaleDateString('hr-HR', { day: '2-digit', month: '2-digit' })
  return `${fmt(start)} – ${fmt(end)}`
}

function startEdit(r) {
  editingReservation.value = r
  editForm.value = { ...r }
  availableTags.value = courseTags[r.course] || []
  editError.value = ''
}

function cancelEdit() {
  editingReservation.value = null
  editForm.value = { email: '', startDate: '', endDate: '', time: '', description: '', course: '', tags: [] }
  availableTags.value = []
  editError.value = ''
}

function onCourseChange() {
  editForm.value.tags = []
  availableTags.value = courseTags[editForm.value.course] || []
}

function toggleTag(tag) {
  const index = editForm.value.tags.indexOf(tag)
  if (index > -1) editForm.value.tags.splice(index, 1)
  else editForm.value.tags.push(tag)
}

async function saveEdit() {
  editError.value = ''
  try {
    const token = localStorage.getItem('token')
    await axios.put(
      `http://localhost:3000/api/reservations/${editingReservation.value._id}`,
      editForm.value,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    await fetchReservations()
    cancelEdit()
  } catch (err) {
    editError.value = err.response?.data?.message || 'Greška kod ažuriranja.'
  }
}

async function deleteReservation(id) {
  if (!confirm('Jeste li sigurni da želite obrisati ovu rezervaciju?')) return
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`http://localhost:3000/api/reservations/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    await fetchReservations()
  } catch (err) {
    console.error('Greška kod brisanja', err)
    alert('Greška kod brisanja rezervacije.')
  }
}

import { watch } from 'vue'

// Čuvamo promjene "done" statusa
watch(reservations, (newVal) => {
  const doneMap = {}
  newVal.forEach(r => {
    doneMap[r._id] = r.done
  })
  localStorage.setItem('doneReservations', JSON.stringify(doneMap))
}, { deep: true })

onMounted(fetchReservations)
</script>


<style scoped>
.week {
  font-size: 0.875rem;
  font-weight: 700;
  color: #a5b4fc;
  background: rgba(139, 92, 246, 0.1);
  padding: 4px 8px;
  border-radius: 8px;
  display: inline-block;
}

.reservations-page { width: 100%; }
.reservation-list { display: flex; flex-direction: column; gap: 1rem; }
.reservation-card {
  background: rgba(30, 41, 59, 0.4);
  border: 1px solid rgba(71, 85, 105, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s;
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
.user-info { display: flex; align-items: center; gap: 1rem; }
.avatar {
  width: 48px; height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px; display: flex; align-items: center; justify-content: center;
  font-weight: 700; font-size: 1.1rem; color: white;
}
.user-details h3 { font-size: 1rem; font-weight: 600; color: #f1f5f9; margin: 0 0 0.25rem 0; }
.course-tag {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%);
  color: #c4b5fd; padding: 4px 12px; border-radius: 20px;
  font-size: 0.75rem; font-weight: 600;
  border: 1px solid rgba(139, 92, 246, 0.3);
}
.datetime { text-align: right; }
.time { font-size: 0.75rem; color: #94a3b8; }

.description {
  color: #cbd5e1; font-size: 0.875rem; line-height: 1.5; margin: 0 0 1rem 0;
}
.action-buttons { display: flex; gap: 0.5rem; flex-wrap: wrap; }
.tag.clickable { cursor: pointer; }

/* Modal */
.modal-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000; backdrop-filter: blur(4px);
}
.modal {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%);
  border: 1px solid rgba(71, 85, 105, 0.3);
  border-radius: 24px; max-width: 600px; width: 90%;
  max-height: 90vh; overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}
.modal-header {
  display: flex; justify-content: space-between; align-items: center;
  padding: 1.5rem 2rem; border-bottom: 1px solid rgba(71, 85, 105, 0.3);
}
.modal-header h2 { font-size: 1.5rem; font-weight: 700; color: #f1f5f9; margin: 0; }
.close-btn {
  background: none; border: none; color: #94a3b8; font-size: 2rem;
  cursor: pointer; line-height: 1; padding: 0; width: 32px; height: 32px;
  display: flex; align-items: center; justify-content: center; border-radius: 8px;
  transition: all 0.2s;
}
.close-btn:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
.modal-actions { display: flex; gap: 1rem; justify-content: flex-end; }

@media (max-width: 768px) {
  .reservation-header { flex-direction: column; align-items: flex-start; gap: 1rem; }
  .datetime { text-align: left; }
  .modal { width: 95%; }
  .modal-actions { flex-direction: column-reverse; }
  .modal-actions .btn { width: 100%; }
}

.reservation-card.done {
  background: rgba(34, 197, 94, 0.3);
  border-color: rgba(34, 197, 94, 0.5);
}

</style>
