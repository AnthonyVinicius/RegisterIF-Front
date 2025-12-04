<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import SubjectOfferingDAO from "../service/SubjectOfferingDAO";
import CourseDAO from "../service/CourseDAO";
import SubjectDAO from "../service/SubjectDAO";
import UserDAO from "../service/UserDAO";
import ClassroomDAO from "../service/ClassroomDAO";
import ModalOffering from "../components/ModalOffering.vue";
import BaseLayout from "../components/BaseLayout.vue";

const route = useRoute();
const courseId = route.params.courseId;
const subjectId = route.params.subjectId;

const offerings = ref([]);
const courseName = ref("");
const subjectName = ref("");

const isModalOpen = ref(false);
const selectedOffering = ref(null);

async function loadData() {
  try {
    const [course, subject, allOfferings] = await Promise.all([
      CourseDAO.getById(courseId),
      SubjectDAO.getById(subjectId),
      SubjectOfferingDAO.getAll(),
    ]);

    courseName.value = course.name;
    subjectName.value = subject.name;

    offerings.value = allOfferings.filter(
      o => o.courseSubject?.subject?.id === subjectId &&
           o.courseSubject?.course?.id === courseId
    );
  } catch (error) {
    console.error("Erro ao carregar dados:", error);
  }
}

onMounted(loadData);

function openModal() {
  selectedOffering.value = null;
  isModalOpen.value = true;
}

async function deleteOffering(id) {
  if (!confirm("Deseja realmente excluir esta turma?")) return;

  try {
    await SubjectOfferingDAO.delete(id);
    offerings.value = offerings.value.filter(o => o.id !== id);
  } catch (error) {
    console.error("Erro ao excluir oferta:", error);
  }
}

function closeModal() {
  isModalOpen.value = false;
  loadData();
}
</script>

<template>
  <BaseLayout>
  <div class="space-y-10 px-4">
    <header class="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-6">
      <div>
        <h1 class="text-3xl font-bold text-[#1C5E27]">
          Turmas de {{ subjectName }} — {{ courseName }}
        </h1>
        <p class="text-gray-600 mt-1">Gerencie as turmas desta disciplina</p>
      </div>

      <button
        @click="openModal"
        class="bg-[#1C5E27] hover:bg-[#174a20] text-white font-semibold py-2 px-5 rounded-md"
      >
        Nova Turma
      </button>
    </header>

    <section class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <div
        v-for="offering in offerings"
        :key="offering.id"
        class="p-5 bg-white border border-gray-200 rounded-md shadow-sm"
      >
        <h2 class="text-lg font-semibold text-[#1C5E27] mb-2">
          {{ offering.term }}
        </h2>

        <p class="text-xs text-gray-600">
          Sala: {{ offering.classroom?.code ?? 'N/A' }}
        </p>
        <p class="text-xs text-gray-600">
          Professor: {{ offering.teacher?.name ?? 'N/A' }}
        </p>

        <button
          @click="deleteOffering(offering.id)"
          class="text-red-600 text-sm mt-3 hover:underline"
        >
          Remover
        </button>
      </div>
    </section>

    <div v-if="offerings.length === 0" class="text-center text-gray-500 py-16">
      Nenhuma turma cadastrada ainda.
    </div>
  </div>

  <ModalOffering
    v-if="isModalOpen"
    :courseId="courseId"
    :subjectId="subjectId"
    @close="closeModal"
  />
  </BaseLayout>
</template>
