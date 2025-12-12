<script setup>
import Actions from "../../components/Actions.vue";
import { Trash2 } from "lucide-vue-next";
import CourseDAO from "../../service/CourseDAO";
import { onMounted, ref } from "vue";
import BaseLayout from "../../components/BaseLayout.vue";

const courses = ref([]);

async function loadCourses() {
  try {
    courses.value = await CourseDAO.getAll();
  } catch (error) {
    console.log("Erro ao resgatar cursos", error);
  }
}

async function deleteCourse(id) {
  if (!confirm("Tem certeza que deseja excluir este curso?")) return;
  try {
    await CourseDAO.delete(id);
    courses.value = courses.value.filter((c) => c.id !== id);
  } catch (error) {
    alert("Erro ao excluir curso.");
  }
}

onMounted(loadCourses);
</script>

<template>
  <BaseLayout>
    <div class="space-y-8">
      <h1 class="text-2xl font-bold text-ponto-if-green">Courses Dashboard</h1>

      <section class="bg-white p-5 rounded-md shadow-sm">
        <div class="flex items-center mb-3">
          <h2 class="text-lg font-semibold">Últimos Cursos Cadastrados</h2>

          <div class="ml-auto flex items-center gap-4">
            <RouterLink to="/allCourses" class="text-green-800 hover:underline">
              Ver todos
            </RouterLink>

            <RouterLink to="/registerCourse">
              <button class="bg-[#1C5E27] hover:bg-[#174a20] text-white font-semibold py-2 px-5 rounded-md shadow-sm">
                Novo Curso
              </button>
            </RouterLink>
          </div>
        </div>

        <div class="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
          <table class="w-full text-sm text-left text-gray-700">
            <thead class="bg-[#1C5E27]">
              <tr>
                <th class="px-6 py-3 font-semibold text-white">Nome</th>
                <th class="px-6 py-3 font-semibold text-white">Acrônimo</th>
                <th class="px-6 py-3 font-semibold text-white text-center">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="course in courses" :key="course.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900 cursor-pointer">
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
    </div>
  </BaseLayout>
</template>
