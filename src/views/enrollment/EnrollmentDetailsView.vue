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
  await EnrollmentDAO.insert({
    enrollmentId: null,
    studentId,
    subjectOfferingId: offer.id,
    status: "ACTIVE",
  });

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
    <div class="space-y-10">
      <h1 class="text-2xl font-bold text-ponto-if-green">
        Matrículas do Aluno
      </h1>

      <!-- DISCIPLINAS MATRICULADAS -->
      <section class="bg-white p-5 rounded-md shadow-sm">
        <h2 class="text-lg font-semibold mb-4 text-gray-700">
          Disciplinas Matriculadas
        </h2>

        <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <table class="w-full text-sm text-left text-gray-700">
            <thead class="bg-[#1C5E27]">
              <tr>
                <th class="px-6 py-3 font-semibold uppercase text-white">
                  Disciplina
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="en in enrolled" :key="en.enrollmentId" class="hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">
                  {{ getSubjectNameFromOffering(en.subjectOfferingId) }}
                </td>
              </tr>

              <tr v-if="enrolled.length === 0">
                <td class="px-6 py-6 text-center text-gray-500">
                  Nenhuma disciplina matriculada
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- OFERTAS DISPONÍVEIS -->
      <section class="bg-white p-5 rounded-md shadow-sm">
        <h2 class="text-lg font-semibold mb-4 text-gray-700">
          Ofertas Disponíveis
        </h2>

        <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <table class="w-full text-sm text-left text-gray-700">
            <thead class="bg-[#1C5E27]">
              <tr>
                <th class="px-6 py-3 font-semibold uppercase text-white">
                  Disciplina
                </th>
                <th class="px-6 py-3 font-semibold uppercase text-white">
                  Horário
                </th>
                <th class="px-6 py-3 font-semibold uppercase text-white text-center">
                  Ação
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="offer in availableOfferings" :key="offer.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 font-medium text-gray-900">
                  {{ subjects[offer.subjectId] || "Disciplina" }}
                </td>

                <td class="px-6 py-4 text-gray-600">
                  {{ offer.schedule.day }} • {{ offer.schedule.time }}
                </td>

                <td class="px-6 py-4 flex justify-center">
                  <button @click="enroll(offer)"
                    class="bg-[#1C5E27] hover:bg-[#174a20] text-white text-sm font-semibold px-4 py-1.5 rounded-md shadow">
                    Matricular
                  </button>
                </td>
              </tr>

              <tr v-if="availableOfferings.length === 0">
                <td colspan="3" class="px-6 py-6 text-center text-gray-500">
                  Nenhuma oferta disponível para matrícula
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </BaseLayout>
</template>
