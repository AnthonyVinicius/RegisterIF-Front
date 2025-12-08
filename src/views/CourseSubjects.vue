<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import SubjectDAO from "../service/SubjectDAO";
import CourseDAO from "../service/CourseDAO";
import BaseLayout from "../components/BaseLayout.vue";

const route = useRoute();
const router = useRouter();
const courseId = route.params.id;

const course = ref(null);
const linkedSubjects = ref([]);
const allSubjects = ref([]);
const showAllSubjects = ref(false);

async function loadLinkedSubjects() {
  linkedSubjects.value = await SubjectDAO.getByCourse(courseId);
}

async function loadAllSubjects() {
  const subjects = await SubjectDAO.getAll();
  const linkedIds = linkedSubjects.value.map(s => s.id);
  allSubjects.value = subjects.filter(s => !linkedIds.includes(s.id));
}

function toggleAttachSection() {
  showAllSubjects.value = !showAllSubjects.value;
  if (showAllSubjects.value) loadAllSubjects();
}

async function attachSubject(subject) {
  await SubjectDAO.addCourseToSubject(courseId, subject.id);
  await loadLinkedSubjects();
  await loadAllSubjects();
}

async function detachSubject(subject) {
  await SubjectDAO.removeCourseFromSubject(courseId, subject.id);
  await loadLinkedSubjects();
  if (showAllSubjects.value) await loadAllSubjects();
}

onMounted(async () => {
  course.value = await CourseDAO.getById(courseId);
  await loadLinkedSubjects();
});

function goBack() {
  router.back();
}
</script>

<template>
  <BaseLayout>
    <div class="space-y-8 px-6">

      <header class="flex justify-between items-center border-b pb-5">
        <h1 class="text-2xl font-bold text-[#1C5E27]">
          Disciplinas vinculadas: {{ course?.name }}
        </h1>

        <button
          @click="toggleAttachSection"
          class="bg-[#1C5E27] hover:bg-[#174a20] text-white font-semibold py-2 px-5 rounded-md"
        >
          {{ showAllSubjects ? "Fechar" : "Vincular Disciplina" }}
        </button>
      </header>

      <section class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="subject in linkedSubjects"
          :key="subject.id"
          class="p-5 bg-green-50 border rounded-md shadow-sm"
        >
          <h2 class="text-lg font-semibold text-[#1C5E27] mb-1">{{ subject.name }}</h2>
          <p class="text-xs text-gray-500">{{ subject.code }}</p>
          <button
            @click="detachSubject(subject)"
            class="w-full mt-3 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-md"
          >
            Remover
          </button>
        </div>

        <div v-if="linkedSubjects.length === 0"
          class="flex justify-center py-10 text-gray-500 col-span-full">
          Nenhuma disciplina vinculada ainda.
        </div>
      </section>

      <section v-if="showAllSubjects" class="space-y-5 border-t pt-5">
        <h2 class="text-lg font-semibold text-[#1C5E27]">
          Selecione para vincular
        </h2>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="subject in allSubjects"
            :key="subject.id"
            class="p-5 bg-white border rounded-md shadow-sm"
          >
            <h3 class="text-lg font-semibold text-[#1C5E27] mb-1">
              {{ subject.name }}
            </h3>
            <p class="text-xs text-gray-500">{{ subject.code }}</p>

            <button
              @click="attachSubject(subject)"
              class="w-full mt-3 py-2 bg-[#1C5E27] hover:bg-[#174a20] text-white font-semibold rounded-md"
            >
              Vincular
            </button>
          </div>
        </div>
      </section>

      <div class="flex justify-end pt-6">
        <button
          @click="goBack"
          class="bg-[#1C5E27] text-white font-semibold py-2.5 px-5 rounded-lg flex items-center gap-2 hover:bg-[#154b1f] transition-colors text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M13 9a1 1 0 0 1-1-1V5.061a1 1 0 0 0-1.811-.75l-6.835 6.836a1.207 1.207 0 0 0 0 1.707l6.835 6.835a1 1 0 0 0 1.811-.75V16a1 1 0 0 1 1-1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z"
            />
          </svg>
          Voltar
        </button>
      </div>

    </div>
  </BaseLayout>
</template>
