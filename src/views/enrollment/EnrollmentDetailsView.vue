<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import BaseLayout from "../../components/BaseLayout.vue";
import SubjectOfferingDAO from "../../service/SubjectOfferingDAO";
import EnrollmentDAO from "../../service/EnrollmentDAO";
import SubjectDAO from "../../service/SubjectDAO";

const route = useRoute();
const studentId = route.params.studentId;

const allOfferings = ref([]);
const availableOfferings = ref([]);
const enrolled = ref([]);
const subjects = ref({});

async function loadSubjects() {
  const data = await SubjectDAO.getAll();
  subjects.value = Object.fromEntries(data.map(s => [s.id, s.name]));
}

async function loadOfferings() {
  allOfferings.value = await SubjectOfferingDAO.getAll();
}

async function loadEnrollments() {
  enrolled.value = await EnrollmentDAO.getByStudent(studentId);
}

function filterOfferings() {
  const enrolledIds = new Set(enrolled.value.map(e => e.subjectOfferingId));
  availableOfferings.value = allOfferings.value.filter(
    offer => !enrolledIds.has(offer.id)
  );
}

function getSubjectNameFromOffering(offeringId) {
  const offer = allOfferings.value.find(o => o.id === offeringId);
  if (!offer) return "Disciplina";
  return subjects.value[offer.subjectId] || "Disciplina";
}

async function enroll(offer) {
  const payload = {
    enrollmentId: null,
    studentId,
    subjectOfferingId: offer.id,
    status: "ACTIVE",
  };

  await EnrollmentDAO.insert(payload);
  await loadEnrollments();
  filterOfferings();
}

onMounted(async () => {
  await loadSubjects();
  await loadOfferings();
  await loadEnrollments();
  filterOfferings();
});
</script>

<template>
  <BaseLayout>
    <div class="space-y-8 pb-20">
      <h1 class="text-2xl font-bold text-ponto-if-green">
        Matrículas do Aluno
      </h1>

      <section class="bg-white p-5 rounded-md shadow-sm">
        <h2 class="text-xl font-semibold mb-4 text-green-700">
          Disciplinas já matriculadas
        </h2>

        <div v-if="enrolled.length === 0" class="text-gray-500">
          O aluno não está matriculado em nenhuma disciplina.
        </div>

        <ul class="space-y-3">
          <li
            v-for="en in enrolled"
            :key="en.enrollmentId"
            class="bg-gray-50 p-4 rounded-md shadow-sm"
          >
            {{ getSubjectNameFromOffering(en.subjectOfferingId) }}
          </li>
        </ul>
      </section>

      <section class="bg-white p-5 rounded-md shadow-sm">
        <h2 class="text-xl font-semibold mb-4 text-green-700">
          Ofertas disponíveis
        </h2>

        <div v-if="availableOfferings.length === 0" class="text-gray-500">
          Nenhuma oferta disponível para matrícula.
        </div>

        <ul class="space-y-3">
          <li
            v-for="offer in availableOfferings"
            :key="offer.id"
            class="bg-gray-50 p-4 rounded-md shadow-sm flex justify-between items-center"
          >
            <div>
              <div class="font-semibold">
                {{ subjects[offer.subjectId] || "Disciplina" }}
              </div>
              <div class="text-sm text-gray-600">
                {{ offer.schedule.day }} • {{ offer.schedule.time }}
              </div>
            </div>

            <button
              class="px-3 py-1 text-white bg-green-700 rounded-md hover:bg-green-900"
              @click="enroll(offer)"
            >
              Matricular
            </button>
          </li>
        </ul>
      </section>
    </div>
  </BaseLayout>
</template>
