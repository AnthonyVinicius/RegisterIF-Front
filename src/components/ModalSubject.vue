<template>
  <div v-if="isOpen" class="fixed inset-0 bg-white flex items-center justify-center p-5 z-50">
    <div class="bg-white p-6 rounded-lg shadow-md max-w-md w-full space-y-4">
      <h2 class="text-xl font-bold text-[#1C5E27]">
        {{ isEdit ? "Editar Disciplina" : "Nova Disciplina" }}
      </h2>

      <div>
        <label class="block text-sm font-medium mb-1">Nome *</label>
        <input v-model="form.name" type="text" class="input-style" required />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Código</label>
        <input v-model="form.code" type="text" class="input-style" />
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Descrição</label>
        <textarea v-model="form.description" class="input-style h-20 resize-none"></textarea>
      </div>

      <div class="flex justify-end gap-3 mt-4">
        <button @click="close" class="btn-cancel">Cancelar</button>
        <button @click="submit" class="btn-primary" :disabled="!form.name.trim()">
          Salvar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue";

const props = defineProps(["isOpen", "isEdit", "itemData", "courses"]);
const emit = defineEmits(["close", "submit"]);

const form = reactive({
  name: "",
  code: "",
  description: "",
  courseId: null
});

watch(
  () => props.isOpen,
  (value) => {
    if (value) {
      form.name = props.itemData?.name ?? "";
      form.code = props.itemData?.code ?? "";
      form.description = props.itemData?.description ?? "";
      form.courseId = props.itemData?.courseId ?? null;
    }
  }
);

function close() {
  emit("close");
}

function submit() {
  if (!form.name.trim()) return;
  emit("submit", { ...form });
}
</script>

<style scoped>
.input-style {
  width: 100%;
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 6px;
}

.btn-primary {
  background: #1C5E27;
  color: #fff;
  padding: 8px 14px;
  border-radius: 6px;
  font-weight: 600;
}

.btn-primary:disabled {
  background: #9c9c9c;
  cursor: not-allowed;
}

.btn-cancel {
  background: #ccc;
  padding: 8px 14px;
  border-radius: 6px;
}

.btn-cancel:hover {
  background: #b3b3b3;
}

.btn-primary:not(:disabled):hover {
  background: #174a20;
}
</style>