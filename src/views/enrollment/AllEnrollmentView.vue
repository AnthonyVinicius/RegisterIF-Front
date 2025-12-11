<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import BaseLayout from "../../components/BaseLayout.vue";
import StudentDAO from "../../service/StudentDAO";

const router = useRouter();
const students = ref([]);

async function loadStudents() {
  try {
    students.value = await StudentDAO.getAll();
  } catch (error) {
    console.error("Erro ao carregar alunos:", error);
  }
}

function goToEnrollment(studentId) {
  router.push(`/enrollment/${studentId}`);
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

            <tr
              v-for="student in students"
              :key="student.id"
              class="hover:bg-gray-50 cursor-pointer"
              @click="goToEnrollment(student.id)"
            >
              <td class="px-6 py-4">
                {{ student.name }}
              </td>

              <td class="px-6 py-4 text-right">
                <button
                  class="px-3 py-1 text-white bg-[#1C5E27] rounded-md hover:bg-green-800 transition"
                >
                  Ver Matrículas →
                </button>
              </td>
            </tr>

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
