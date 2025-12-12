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
    <div class="space-y-8">
      <h1 class="text-2xl font-bold text-ponto-if-green">Inscrição</h1>

      <section class="bg-white p-5 rounded-md shadow-sm">
        <div class="flex items-center mb-3">
          <h2 class="text-lg font-semibold">Alunos Cadastrados</h2>
        </div>

        <div class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-700">
              <thead class="bg-[#1C5E27]">
                <tr>
                  <th class="px-6 py-3 font-semibold uppercase text-white">
                    Nome
                  </th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="student in students" :key="student.id"
                  class="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  @click="goToEnrollment(student.id)">
                  <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900 hover:underline">
                    {{ student.name }}
                  </td>
                </tr>

                <tr v-if="students.length === 0">
                  <td class="px-6 py-6 text-center text-gray-500">
                    Nenhum aluno encontrado
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  </BaseLayout>
</template>
