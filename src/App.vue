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
          <p class="subtitle">powered by Šou Program, made by: Antonio Labinjan</p>
        </div>
        
        <!-- Navigation -->
        <nav class="navigation">
          <router-link to="/" class="nav-link">
            <span class="nav-icon">🏠</span>
            Početna
          </router-link>
          <router-link to="/reservations" class="nav-link">
            <span class="nav-icon">📅</span>
            Rezervacije
          </router-link>
          <router-link to="/problems" class="nav-link">
            <span class="nav-icon">🔧</span>
            Problemi
          </router-link>
        </nav>
      </header>

      <!-- Router View -->
      <router-view />
    </div>
  </div>
</template>

<style>
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
  margin-bottom: 2rem;
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

/* Navigation */
.navigation {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 12px 24px;
  background: rgba(30, 41, 59, 0.4);
  border: 2px solid rgba(71, 85, 105, 0.3);
  border-radius: 16px;
  color: #cbd5e1;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(20px);
}

.nav-link:hover {
  background: rgba(30, 41, 59, 0.6);
  border-color: #667eea;
  color: #f1f5f9;
  transform: translateY(-2px);
}

.nav-link.router-link-active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
}

.nav-icon {
  font-size: 1.2rem;
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
.input, .select {
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

.input:focus, .select:focus {
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

.select {
  cursor: pointer;
}

.select option {
  background: #1e293b;
  color: #f1f5f9;
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

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 8px 16px -4px rgba(102, 126, 234, 0.4);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px -4px rgba(102, 126, 234, 0.5);
}

.btn-secondary {
  background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
  color: white;
  box-shadow: 0 8px 16px -4px rgba(34, 197, 94, 0.4);
}

.btn-secondary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px -4px rgba(34, 197, 94, 0.5);
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  box-shadow: 0 8px 16px -4px rgba(239, 68, 68, 0.4);
}

.btn-danger:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px -4px rgba(239, 68, 68, 0.5);
}

.btn-small {
  padding: 8px 16px;
  font-size: 0.875rem;
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

/* Tags */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tag {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(59, 130, 246, 0.2) 100%);
  color: #c4b5fd;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  border: 1px solid rgba(139, 92, 246, 0.3);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.tag:hover {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.3) 100%);
}

.tag.selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
}

.tag-remove {
  cursor: pointer;
  font-weight: bold;
  margin-left: 0.25rem;
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
  
  .navigation {
    flex-direction: column;
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
