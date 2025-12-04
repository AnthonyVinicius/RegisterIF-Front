<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-white flex items-center justify-center p-5"
  >
    <div class="bg-white p-6 rounded-lg shadow-md max-w-md w-full space-y-4">
      <h2 class="text-xl font-bold text-[#1C5E27]">
        {{ isEdit ? "Editar Disciplina" : "Nova Disciplina" }}
      </h2>

      <label class="block text-sm font-medium">Nome *</label>
      <input
        v-model="form.name"
        type="text"
        class="input-style"
        required
      />

      <label class="block text-sm font-medium">Código</label>
      <input
        v-model="form.code"
        type="text"
        class="input-style"
      />

      <label class="block text-sm font-medium">Descrição</label>
      <textarea
        v-model="form.description"
        class="input-style h-20 resize-none"
      ></textarea>

      <label class="block text-sm font-medium">Curso *</label>
      <select
        v-model="form.courseId"
        class="input-style"
        required
      >
        <option disabled value="">Selecione um curso</option>
        <option
          v-for="course in courses"
          :key="course.id"
          :value="course.id"
        >
          {{ course.name }}
        </option>
      </select>

      <div class="flex justify-end gap-3 mt-4">
        <button @click="close" class="btn-cancel">Cancelar</button>
        <button
          @click="submit"
          class="btn-primary"
          :disabled="!form.name.trim() || !form.courseId"
        >
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
  courseId: ""
});

watch(
  () => props.isOpen,
  (value) => {
    if (value) {
      form.name = props.itemData?.name ?? "";
      form.code = props.itemData?.code ?? "";
      form.description = props.itemData?.description ?? "";
      form.courseId = props.itemData?.courseId ?? "";
    }
  }
);

function close() {
  emit("close");
}

function submit() {
  if (!form.name.trim() || !form.courseId) return;
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
</style>
