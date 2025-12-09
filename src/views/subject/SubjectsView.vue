<script setup>
import { ref, onMounted } from "vue";
import SubjectDAO from "../../service/SubjectDAO";
import CourseDAO from "../../service/CourseDAO";
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

function openCreateModal() {
  isEditMode.value = false;
  selectedSubject.value = {
    name: "",
    code: "",
    description: "",
    courseId: null,
  };
  isModalOpen.value = true;
}

function openEditModal(subject) {
  isEditMode.value = true;
  selectedSubject.value = {
    ...subject,
    courseId: subject.courses?.[0]?.id ?? null,
  };
  isModalOpen.value = true;
}

async function handleDeleteSubject(id) {
  if (!confirm("Tem certeza que deseja excluir esta disciplina?")) return;

  try {
    await SubjectDAO.delete(id);
    subjects.value = subjects.value.filter((s) => s.id !== id);
  } catch (error) {
    alert("Erro ao excluir disciplina.");
    console.error(error);
  }
}

async function handleSubmitSubject(formData) {
  try {
    const payload = {
      name: formData.name,
      code: formData.code,
      description: formData.description,
      courses: formData.courseId ? [{ id: formData.courseId }] : [],
    };

    if (isEditMode.value) {
      await SubjectDAO.update(selectedSubject.value.id, payload);
    } else {
      await SubjectDAO.insert(payload);
    }

    closeModal();
    await loadSubjects();
  } catch (error) {
    alert("Erro ao salvar disciplina.");
    console.error(error);
  }
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
          <div class="absolute top-2 right-2 flex gap-1">
            <button
              @click="openEditModal(subject)"
              class="text-green-500 hover:text-green-400"
              title="Editar disciplina"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-pencil-icon lucide-pencil"
              >
                <path
                  d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"
                />
                <path d="m15 5 4 4" />
              </svg>
            </button>
            <button
              @click="handleDeleteSubject(subject.id)"
              class="text-red-600 hover:text-red-800"
              title="Excluir disciplina"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-trash2-icon lucide-trash-2"
              >
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                <path d="M3 6h18" />
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>

          <h2 class="text-lg font-semibold text-[#1C5E27] mb-1">
            {{ subject.name }}
          </h2>
          <p class="text-sm text-gray-600">Código: {{ subject.code }}</p>
          <p class="text-xs text-gray-500 italic mt-2">
            {{ subject.description }}
          </p>
          <p class="text-xs mt-4 text-green-700 font-semibold">
            Curso(s):
            {{
              subject.courses?.map((c) => c.name).join(", ") ||
              "Sem curso associado"
            }}
          </p>
        </div>
      </section>

      <div
        v-if="subjects.length === 0"
        class="flex justify-center py-10 text-gray-500"
      >
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
