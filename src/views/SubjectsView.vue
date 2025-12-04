<script setup>
import { ref, onMounted } from "vue";
import SubjectDAO from "../service/SubjectDAO";
import CourseDAO from "../service/CourseDAO";
import ModalSubject from "../components/ModalSubject.vue";
import BaseLayout from "../components/BaseLayout.vue";

const subjects = ref([]);
const courses = ref([]);
const isModalOpen = ref(false);
const isEditMode = ref(false);
const selectedSubject = ref(null);

onMounted(() => {
  loadSubjects();
  loadCourses();
});

async function loadSubjects() {
  try {
    subjects.value = await SubjectDAO.getAll();
    console.log(subjects.value)
  } catch (error) {
    console.error("Erro ao carregar disciplinas:", error);
  }
}

async function loadCourses() {
  try {
    courses.value = await CourseDAO.getAll();
  } catch (error) {
    console.error("Erro ao carregar cursos:", error);
  }
}

async function handleDeleteSubject(id) {
  if (!confirm("Tem certeza que deseja excluir esta disciplina?")) return;
  try {
    await SubjectDAO.delete(id);
    subjects.value = subjects.value.filter(s => s.id !== id);
  } catch (error) {
    alert("Erro ao excluir disciplina.");
    console.error("Erro ao excluir:", error);
  }
}

async function handleSubmitSubject(formData) {
  try {
    await SubjectDAO.insert({
      name: formData.name,
      code: formData.code,
      description: formData.description ?? "",
      courses: [
        { id: formData.courseId }
      ]
    });

    closeModal();
    await loadSubjects();
  } catch (error) {
    console.error("Erro ao salvar disciplina:", error);
    alert("Erro ao salvar disciplina.");
  }
}

function openCreateModal() {
  isEditMode.value = false;
  selectedSubject.value = {
    name: "",
    code: "",
    description: "",
    courseId: ""
  };
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
}
</script>

<template>
  <BaseLayout>
    <div class="space-y-10 px-6">
      <header class="flex justify-between items-center border-b pb-5">
        <h1 class="text-2xl font-bold text-[#1C5E27]">Disciplinas</h1>
        <button
          @click="openCreateModal"
          class="bg-[#1C5E27] hover:bg-[#174a20] text-white font-semibold py-2 px-5 rounded-md shadow-sm"
        >
          Nova Disciplina
        </button>
      </header>

      <section class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div
          v-for="subject in subjects"
          :key="subject.id"
          class="p-5 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md relative"
        >
          <button
            @click="handleDeleteSubject(subject.id)"
            class="absolute top-2 right-2 text-red-600 hover:text-red-800"
            title="Excluir disciplina"
          >
            ❌
          </button>

          <h2 class="text-lg font-semibold text-[#1C5E27] mb-1">{{ subject.name }}</h2>
          <p class="text-sm text-gray-600">Código: {{ subject.code }}</p>
          <p class="text-xs text-gray-500 italic mt-2">{{ subject.description }}</p>

          <p class="text-xs mt-4 text-green-700 font-semibold">
            Curso(s): {{ subject.courses?.map(c => c.name).join(", ") || "Nenhum" }}
          </p>
        </div>
      </section>

      <div v-if="subjects.length === 0" class="flex justify-center py-10 text-gray-500">
        Nenhuma disciplina encontrada.
      </div>
    </div>

    <ModalSubject
      :isOpen="isModalOpen"
      :isEdit="isEditMode"
      :itemData="selectedSubject"
      :courses="courses"
      @close="closeModal"
      @submit="handleSubmitSubject"
    />
  </BaseLayout>
</template>
