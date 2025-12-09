<script setup>
import { ref, onMounted } from "vue";
import BaseLayout from "../components/BaseLayout.vue";
import StudentDAO from "../service/StudentDAO";
import SubjectOfferingDAO from "../service/SubjectOfferingDAO";

const students = ref([]);
const offerings = ref([]);
const expandedStudent = ref(null);

async function loadStudents() {
  try {
    students.value = await StudentDAO.getAll();
  } catch {
    console.error("Erro ao carregar alunos");
  }
}

async function toggleStudent(studentId) {
  if (expandedStudent.value === studentId) {
    expandedStudent.value = null;
    return;
  }

  expandedStudent.value = studentId;

  try {
    offerings.value = await SubjectOfferingDAO.getAll();
  } catch {
    console.error("Erro ao carregar ofertas");
  }
}

onMounted(loadStudents);
</script>

<template>
  <BaseLayout>
    <div class="space-y-8 pb-20 relative">
      <h1 class="text-2xl font-bold text-ponto-if-green">Matrículas</h1>

      <section class="bg-white p-5 rounded-md shadow-sm">
        <table class="w-full text-sm text-left text-gray-700">
          <thead class="bg-[#1C5E27] text-white">
            <tr>
              <th class="px-6 py-3">Aluno</th>
              <th class="px-6 py-3 text-right">Ações</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-200 bg-white">
            <template v-for="student in students" :key="student.id">
              <tr
                class="hover:bg-gray-50 cursor-pointer"
                @click="toggleStudent(student.id)"
              >
                <td class="px-6 py-4">
                  {{ student.name }}
                </td>
                <td class="px-6 py-4 text-right">
                  <span v-if="expandedStudent === student.id">▲</span>
                  <span v-else>▼</span>
                </td>
              </tr>

              <tr v-if="expandedStudent === student.id">
                <td colspan="2" class="bg-gray-50 p-4">

                  <h3 class="text-ponto-if-green font-semibold mb-3">
                    Ofertas de Disciplinas
                  </h3>

                  <ul class="space-y-2">
                    <li
                      v-for="offer in offerings"
                      :key="offer.id"
                      class="flex justify-between items-center bg-white p-3 shadow-sm rounded-md"
                    >
                      <span>{{ offer.subject?.name }}</span>

                      <button
                        class="px-3 py-1 text-white bg-[#1C5E27] rounded-md hover:bg-green-800 transition"
                      >
                        Matricular
                      </button>
                    </li>

                    <li v-if="offerings.length === 0" class="text-gray-500">
                      Nenhuma oferta disponível
                    </li>
                  </ul>
                </td>
              </tr>
            </template>

            <tr v-if="students.length === 0">
              <td colspan="2" class="text-center py-4 text-gray-500">
                Nenhum aluno encontrado
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </BaseLayout>
</template>
