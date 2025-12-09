<template>
  <BaseLayout>
    <div class="space-y-8">
      <header class="flex items-start">
        <div>
          <h1 class="text-2xl font-bold text-ponto-if-green">
            Salas Cadastradas
          </h1>
          <p class="text-gray-600">Adicione e gerencie as Salas de Aula cadastradas</p>
        </div>
        <RouterLink to="/registerClassroom" class="ms-auto">
          <button
            class="bg-[#1C5E27] text-white font-semibold py-2.5 px-5 rounded-lg flex items-center gap-2 hover:bg-[#154b1f] transition-colors text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
              fill="none" stroke="currentColor" stroke-width="2"
              stroke-linecap="round" stroke-linejoin="round"
              class="lucide lucide-plus">
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Nova Sala
          </button>
        </RouterLink>
      </header>

      <section class="bg-white p-5 rounded-md shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-700">
            <thead class="bg-[#1C5E27]">
              <tr>
                <th class="px-6 py-3 font-semibold uppercase text-white tracking-wider">
                  Nome
                </th>
                <th class="px-6 py-3 font-semibold uppercase text-white tracking-wider">
                  Localização
                </th>
                <th class="px-6 py-3 font-semibold uppercase text-white tracking-wider text-right">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="room in classrooms" :key="room.id"
                class="hover:bg-gray-50 transition-colors duration-150">

                <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900 flex items-center gap-2">
                  <div
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-800 font-semibold">
                    {{ room.name.charAt(0).toUpperCase() }}
                  </div>
                  <span class="font-semibold">{{ room.name }}</span>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  {{ room.location }}
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex justify-end gap-3">
                    <button @click="handleDelete(room.id)"
                      class="p-2 rounded-md hover:bg-red-50 transition"
                      title="Excluir">
                      <svg xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5 text-red-500 hover:text-red-700"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                        <path d="M3 6h18" />
                        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </td>

              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <RouterLink to="/classroomDashboard">
      <button class="bg-[#1C5E27] text-white font-semibold py-2.5 px-5 
        rounded-lg flex items-center gap-2 hover:bg-[#154b1f] transition-colors text-sm 
        absolute bottom-6 right-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
          fill="none" stroke="currentColor" stroke-width="2"
          stroke-linecap="round" stroke-linejoin="round"
          class="lucide lucide-arrow-big-left">
          <path
            d="M13 9a1 1 0 0 1-1-1V5.061a1 1 0 0 0-1.811-.75l-6.835 6.836a1.207 1.207 0 0 0 0 1.707l6.835 6.835a1 1 0 0 0 1.811-.75V16a1 1 0 0 1 1-1h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z" />
        </svg>
        Voltar
      </button>
    </RouterLink>
  </BaseLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ClassroomDAO from "../../service/ClassroomDAO";
import BaseLayout from "../../components/BaseLayout.vue";

const classrooms = ref([]);

async function getAllClassrooms() {
  try {
    classrooms.value = await ClassroomDAO.getAll();
  } catch (error) {
    console.error("Erro ao carregar salas:", error);
  }
}

onMounted(() => getAllClassrooms());

async function handleDelete(id) {
  if (!confirm("Tem certeza que deseja excluir esta sala?")) return;
  try {
    await ClassroomDAO.delete(id);
    alert("Sala removida com sucesso!");
    await getAllClassrooms();
  } catch (error) {
    console.error("Erro ao excluir sala:", error);
  }
}
</script>
