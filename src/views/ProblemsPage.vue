<template>
  <div class="problems-page">
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
          <div v-for="p in problems" :key="p._id" class="problem-card">
            <div class="problem-header">
              <div class="user-info">
                <div class="avatar">{{ p.email.charAt(0).toUpperCase() }}</div>
                <div class="user-details">
                  <h3>{{ p.email }}</h3>
                  <div class="tags">
                    <span class="course-tag">{{ p.course }}</span>
                    <span v-if="p.language" class="language-tag">{{ p.language }}</span>
                  </div>
                </div>
              </div>
              <div class="problem-date">
                {{ formatDate(p.createdAt) }}
              </div>
            </div>
            
            <div v-if="p.tags && p.tags.length > 0" class="tags-container">
              <span v-for="tag in p.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
            
            <p class="description">{{ p.description }}</p>
            
            <div v-if="p.images && p.images.length" class="images">
              <div v-for="(img, j) in p.images" :key="j" class="image-wrapper">
                <img :src="img" :alt="`Problem image ${j + 1}`" />
              </div>
            </div>
            
            <div class="action-buttons">
              <button @click="startEdit(p)" class="btn btn-small btn-primary">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
                Uredi
              </button>
              <button @click="deleteProblem(p._id)" class="btn btn-small btn-danger">
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
    <div v-if="editingProblem" class="modal-overlay" @click="cancelEdit">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>Uredi problem</h2>
          <button @click="cancelEdit" class="close-btn">&times;</button>
        </div>
        <form @submit.prevent="saveEdit" class="form">
          <div class="input-group">
            <label>Unipu email</label>
            <input v-model="editForm.email" required class="input" />
          </div>
          <div class="input-group">
            <label>Kolegij</label>
            <select v-model="editForm.course" required class="select" @change="onCourseChange">
              <option value="">Odaberite kolegij</option>
              <option v-for="course in courses" :key="course" :value="course">{{ course }}</option>
            </select>
          </div>
          <div class="input-group">
            <label>Programski jezik (opcionalno)</label>
            <input v-model="editForm.language" class="input" />
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
          <div class="input-group">
            <label>Slike (opcionalno)</label>
            <input v-model="editForm.imagesStr" placeholder="Linkovi slika odvojeni zarezom" class="input" />
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

const problems = ref([])
const editingProblem = ref(null)
const editForm = ref({
  email: '',
  course: '',
  language: '',
  description: '',
  imagesStr: '',
  tags: []
})
const availableTags = ref([])
const editError = ref('')

async function fetchProblems() {
  try {
    const res = await axios.get('https://demos-rezervacije-backend-4.onrender.com/api/problems')
    problems.value = res.data
  } catch (err) {
    console.error('Greška kod dohvaćanja problema', err)
  }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('hr-HR', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function startEdit(problem) {
  editingProblem.value = problem
  editForm.value = {
    email: problem.email,
    course: problem.course,
    language: problem.language || '',
    description: problem.description,
    imagesStr: problem.images ? problem.images.join(', ') : '',
    tags: problem.tags || []
  }
  availableTags.value = courseTags[problem.course] || []
  editError.value = ''
}

function cancelEdit() {
  editingProblem.value = null
  editForm.value = {
    email: '',
    course: '',
    language: '',
    description: '',
    imagesStr: '',
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
    const payload = {
      email: editForm.value.email,
      course: editForm.value.course,
      language: editForm.value.language,
      description: editForm.value.description,
      images: editForm.value.imagesStr
        ? editForm.value.imagesStr.split(',').map(i => i.trim())
        : [],
      tags: editForm.value.tags
    }
    await axios.put(`https://demos-rezervacije-backend-4.onrender.com/api/problems/${editingProblem.value._id}`, payload)
    await fetchProblems()
    cancelEdit()
  } catch (err) {
    editError.value = err.response?.data?.message || 'Greška kod ažuriranja.'
  }
}

async function deleteProblem(id) {
  if (!confirm('Jeste li sigurni da želite obrisati ovaj problem?')) return
  
  try {
    await axios.delete(`https://demos-rezervacije-backend-4.onrender.com/api/problems/${id}`)
    await fetchProblems()
  } catch (err) {
    console.error('Greška kod brisanja', err)
    alert('Greška kod brisanja problema.')
  }
}

onMounted(() => {
  fetchProblems()
})
</script>

<style scoped>
.problems-page {
  width: 100%;
}

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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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
  flex-shrink: 0;
}

.user-details h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #f1f5f9;
  margin: 0 0 0.5rem 0;
}

.tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
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

.language-tag {
  background: linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(16, 185, 129, 0.2) 100%);
  color: #86efac;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.problem-date {
  font-size: 0.75rem;
  color: #94a3b8;
  text-align: right;
}

.description {
  color: #cbd5e1;
  font-size: 0.875rem;
  line-height: 1.5;
  margin: 0 0 1rem 0;
}

.images {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
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
  .problem-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .problem-date {
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

