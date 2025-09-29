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
          <div v-for="r in reservations" :key="r._id" class="reservation-card">
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
            
            <div v-if="r.tags && r.tags.length > 0" class="tags-container">
              <span v-for="tag in r.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            
            <p class="description">{{ r.description }}</p>
            
            <div class="action-buttons">
              <button @click="startEdit(r)" class="btn btn-small btn-primary">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Uredi
              </button>
              <button @click="deleteReservation(r._id)" class="btn btn-small btn-danger">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
                Obriši
              </button>
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
            <label>Discord korisničko ime</label>
            <input v-model="editForm.discordNickname" required class="input" />
          </div>
          <div class="input-row">
            <div class="input-group">
              <label>Datum</label>
              <input type="date" v-model="editForm.date" required class="input" />
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
          <div v-if="editError" class="alert alert-error">
            <svg class="alert-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ editError }}
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

// Kolegiji i tagovi
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

const reservations = ref([])
const editingReservation = ref(null)
const editForm = ref({
  discordNickname: '',
  date: '',
  time: '',
  description: '',
  course: '',
  tags: []
})
const availableTags = ref([])
const editError = ref('')

async function fetchReservations() {
  try {
    const res = await axios.get('http://localhost:3000/api/reservations')
    reservations.value = res.data.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
  } catch (err) {
    console.error('Greška kod dohvaćanja rezervacija', err)
  }
}

function startEdit(reservation) {
  editingReservation.value = reservation
  editForm.value = {
    discordNickname: reservation.discordNickname,
    date: reservation.date,
    time: reservation.time,
    description: reservation.description,
    course: reservation.course,
    tags: reservation.tags || []
  }
  availableTags.value = courseTags[reservation.course] || []
  editError.value = ''
}

function cancelEdit() {
  editingReservation.value = null
  editForm.value = {
    discordNickname: '',
    date: '',
    time: '',
    description: '',
    course: '',
    tags: []
  }
  availableTags.value = []
  editError.value = ''
}

function onCourseChange() {
  editForm.value.tags = []
  availableTags.value = courseTags[editForm.value.course] || []
}

function toggleTag(tag) {
  const index = editForm.value.tags.indexOf(tag)
  if (index > -1) {
    editForm.value.tags.splice(index, 1)
  } else {
    editForm.value.tags.push(tag)
  }
}

async function saveEdit() {
  editError.value = ''
  try {
    await axios.put(`http://localhost:3000/api/reservations/${editingReservation.value._id}`, editForm.value)
    await fetchReservations()
    cancelEdit()
  } catch (err) {
    editError.value = err.response?.data?.message || 'Greška kod ažuriranja.'
  }
}

async function deleteReservation(id) {
  if (!confirm('Jeste li sigurni da želite obrisati ovu rezervaciju?')) return
  
  try {
    await axios.delete(`http://localhost:3000/api/reservations/${id}`)
    await fetchReservations()
  } catch (err) {
    console.error('Greška kod brisanja', err)
    alert('Greška kod brisanja rezervacije.')
  }
}

onMounted(() => {
  fetchReservations()
})
</script>

<style scoped>
.reservations-page {
  width: 100%;
}

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
  margin: 0 0 1rem 0;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag.clickable {
  cursor: pointer;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal {
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(51, 65, 85, 0.95) 100%);
  border: 1px solid rgba(71, 85, 105, 0.3);
  border-radius: 24px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(71, 85, 105, 0.3);
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .reservation-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .datetime {
    text-align: left;
  }
  
  .modal {
    width: 95%;
  }
  
  .modal-actions {
    flex-direction: column-reverse;
  }
  
  .modal-actions .btn {
    width: 100%;
  }
}
</style>