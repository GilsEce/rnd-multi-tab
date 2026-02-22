<script setup>
import { ref } from 'vue'
import { useTabManager } from '../composables/useTabManager'

const { tabs, activeSessionId, canClose, addTab, switchTab, closeTab, renameTab } = useTabManager()

const editingTabId = ref(null)
const editingLabel = ref('')

function startEdit(tab) {
  editingTabId.value = tab.sessionId
  editingLabel.value = tab.label
}

function onInputMounted(el) {
  if (el) {
    el.focus()
    el.select()
  }
}

function finishEdit(sessionId) {
  if (editingLabel.value.trim()) {
    renameTab(sessionId, editingLabel.value.trim())
  }
  editingTabId.value = null
}

function getColorClasses(color, isActive) {
  const colorMap = {
    blue: { dot: 'bg-blue-500', border: 'border-blue-500' },
    green: { dot: 'bg-green-500', border: 'border-green-500' },
    purple: { dot: 'bg-purple-500', border: 'border-purple-500' },
    orange: { dot: 'bg-orange-500', border: 'border-orange-500' },
    rose: { dot: 'bg-rose-500', border: 'border-rose-500' },
    cyan: { dot: 'bg-cyan-500', border: 'border-cyan-500' },
    amber: { dot: 'bg-amber-500', border: 'border-amber-500' },
    teal: { dot: 'bg-teal-500', border: 'border-teal-500' },
  }
  return colorMap[color] || colorMap.blue
}
</script>

<template>
  <div
    class="bg-white shadow-md fixed top-0 left-0 right-0 z-50 h-10 overflow-x-auto flex items-center px-2 gap-1"
  >
    <button
      v-for="tab in tabs"
      :key="tab.sessionId"
      @click="switchTab(tab.sessionId)"
      :aria-label="tab.label"
      :class="[
        'flex items-center gap-2 px-3 py-1.5 rounded-t-lg cursor-pointer transition-all duration-200 shrink-0',
        activeSessionId === tab.sessionId
          ? ['bg-white border-b-2 font-semibold', getColorClasses(tab.color).border]
          : 'bg-gray-100 hover:bg-gray-200 text-gray-500',
      ]"
    >
      <div :class="['w-2 h-2 rounded-full', getColorClasses(tab.color).dot]"></div>

      <input
        v-if="editingTabId === tab.sessionId"
        :ref="onInputMounted"
        v-model="editingLabel"
        @blur="finishEdit(tab.sessionId)"
        @keyup.enter="finishEdit(tab.sessionId)"
        @keyup.escape="editingTabId = null"
        @click.stop
        class="text-sm bg-transparent border-b border-gray-400 outline-none w-24"
      />
      <span v-else @dblclick.stop="startEdit(tab)" class="text-sm whitespace-nowrap select-none">
        {{ tab.label }}
      </span>

      <button
        v-if="canClose"
        @click.stop="closeTab(tab.sessionId)"
        class="hover:bg-gray-300 rounded px-1 text-gray-500 hover:text-gray-700 transition-all duration-200"
      >
        ×
      </button>
    </button>

    <button
      @click="addTab()"
      class="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded transition-all duration-200 shrink-0"
    >
      + New Tab
    </button>
  </div>
</template>
