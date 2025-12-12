<script setup>
import { ref, onMounted } from "vue";
import { Trash2, Pencil } from "lucide-vue-next";
import { RouterLink } from "vue-router";

import BaseLayout from "../../components/BaseLayout.vue";
import ModalSubject from "../../components/ModalSubject.vue";

import CourseDAO from "../../service/CourseDAO";
import SubjectDAO from "../../service/SubjectDAO";

const courses = ref([]);
const subjects = ref([]);
const allCourses = ref([]);

const isModalOpen = ref(false);
const isEditMode = ref(false);
const selectedSubject = ref(null);

async function loadCourses() {
  courses.value = await CourseDAO.getAll();
}

async function loadSubjects() {
  subjects.value = await SubjectDAO.getAll();
}

async function loadAllCourses() {
  allCourses.value = await CourseDAO.getAll();
}

async function deleteCourse(id) {
  if (!confirm("Tem certeza que deseja excluir este curso?")) return;
  await CourseDAO.delete(id);
  courses.value = courses.value.filter(c => c.id !== id);
}

function openCreateSubject() {
  isEditMode.value = false;
  selectedSubject.value = {
    name: "",
    code: "",
    description: "",
    courseId: null
  };
  isModalOpen.value = true;
}

function openEditSubject(subject) {
  isEditMode.value = true;
  selectedSubject.value = {
    ...subject,
    courseId: subject.courses?.[0]?.id ?? null
  };
  isModalOpen.value = true;
}

async function deleteSubject(id) {
  if (!confirm("Tem certeza que deseja excluir esta disciplina?")) return;
  await SubjectDAO.delete(id);
  subjects.value = subjects.value.filter(s => s.id !== id);
}

async function handleSubmitSubject(formData) {
  const payload = {
    name: formData.name,
    code: formData.code,
    description: formData.description,
    courses: formData.courseId ? [{ id: formData.courseId }] : []
  };

  if (isEditMode.value) {
    await SubjectDAO.update(selectedSubject.value.id, payload);
  } else {
    await SubjectDAO.insert(payload);
  }

  isModalOpen.value = false;
  await loadSubjects();
}

onMounted(async () => {
  await loadCourses();
  await loadSubjects();
  await loadAllCourses();
});
</script>

<template>
  <BaseLayout>
    <div class="space-y-14">

      <section class="space-y-4">
        <div class="flex items-center">
          <h1 class="text-2xl font-bold text-[#1C5E27]">
            Cursos
          </h1>

          <RouterLink to="/registerCourse" class="ml-auto">
            <button class="bg-[#1C5E27] hover:bg-[#174a20] text-white font-semibold py-2 px-5 rounded-md shadow-sm">
              Novo Curso
            </button>
          </RouterLink>
        </div>

        <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-700">
            <thead class="bg-[#1C5E27]">
              <tr>
                <th class="px-6 py-3 text-white font-semibold">Nome</th>
                <th class="px-6 py-3 text-white font-semibold">Acrônimo</th>
                <th class="px-6 py-3 text-white font-semibold text-center">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200">
              <tr v-for="course in courses" :key="course.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">
                  <RouterLink :to="`/course/${course.id}/manage`" class="flex items-center gap-2 hover:underline">
                    <div
                      class="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-800 font-semibold">
                      {{ course.name.charAt(0).toUpperCase() }}
                    </div>

                    {{ course.name }}
                  </RouterLink>
                </td>

                <td class="px-6 py-4">
                  {{ course.acronym }}
                </td>

                <td class="px-6 py-4 flex justify-center">
                  <button @click="deleteCourse(course.id)" class="text-red-600 hover:text-red-800">
                    <Trash2 class="w-5 h-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="space-y-4">
        <div class="flex items-center">
          <h1 class="text-2xl font-bold text-[#1C5E27]">
            Disciplinas
          </h1>

          <button @click="openCreateSubject"
            class="ml-auto bg-[#1C5E27] hover:bg-[#174a20] text-white font-semibold py-2 px-5 rounded-md shadow-sm">
            Nova Disciplina
          </button>
        </div>

        <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-700">
            <thead class="bg-[#1C5E27]">
              <tr>
                <th class="px-6 py-3 text-white font-semibold">Nome</th>
                <th class="px-6 py-3 text-white font-semibold">Código</th>
                <th class="px-6 py-3 text-white font-semibold">Curso(s)</th>
                <th class="px-6 py-3 text-white font-semibold text-center">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200">
              <tr v-for="subject in subjects" :key="subject.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">
                  {{ subject.name }}
                </td>

                <td class="px-6 py-4">
                  {{ subject.code }}
                </td>

                <td class="px-6 py-4 text-green-700">
                  {{subject.courses?.map(c => c.name).join(", ") || "—"}}
                </td>

                <td class="px-6 py-4 flex justify-center gap-4">
                  <button @click="openEditSubject(subject)" class="text-green-600 hover:text-green-800">
                    <Pencil class="w-5 h-5" />
                  </button>

                  <button @click="deleteSubject(subject.id)" class="text-red-600 hover:text-red-800">
                    <Trash2 class="w-5 h-5" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="subjects.length === 0" class="py-10 text-center text-gray-500">
            Nenhuma disciplina cadastrada.
          </div>
        </div>
      </section>
    </div>

    <ModalSubject :isOpen="isModalOpen" :isEdit="isEditMode" :itemData="selectedSubject" :courses="allCourses"
      @close="isModalOpen = false" @submit="handleSubmitSubject" />
  </BaseLayout>
</template>
