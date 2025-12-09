<script setup>
import Actions from "../../components/Actions.vue";
import { TextAlignJustify, NotepadText, Trash2 } from "lucide-vue-next";
import ClassroomDAO from "../../service/ClassroomDAO";
import { onMounted, ref } from "vue";
import BaseLayout from "../../components/BaseLayout.vue";

const classrooms = ref([]);

async function loadClassrooms() {
  try {
    classrooms.value = await ClassroomDAO.getAll();
  } catch (error) {
    console.log("Erro ao resgatar salas", error);
  }
}

async function deleteClassroom(id) {
  if (!confirm("Tem certeza que deseja excluir esta sala?")) return;
  try {
    await ClassroomDAO.delete(id);
    classrooms.value = classrooms.value.filter((c) => c.id !== id);
  } catch (error) {
    alert("Erro ao excluir sala.");
  }
}

const actions = [
  {
    icon: NotepadText,
    title: "Cadastrar Sala de Aula",
    description: "Adicionar novas salas",
    color: "text-green-800",
    to: "/registerClassroom",
  },
  {
    icon: TextAlignJustify,
    title: "Todas as Salas",
    description: "Visualizar e gerenciar salas",
    color: "text-green-800",
    to: "/allClassroom",
  },
];

onMounted(loadClassrooms);
</script>

<template>
  <BaseLayout>
    <div class="space-y-8">
      <h1 class="text-2xl font-bold text-ponto-if-green">Classroom Dashboard</h1>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        <RouterLink v-for="action in actions" :key="action.title" :to="action.to">
          <Actions>
            <template #logo>
              <component :is="action.icon" :class="`${action.color} w-12 h-12`" />
            </template>
            <template #title>{{ action.title }}</template>
            <template #description>{{ action.description }}</template>
          </Actions>
        </RouterLink>
      </div>

      <section class="bg-white p-5 rounded-md shadow-sm">
        <div class="flex items-center mb-3">
          <h2 class="text-lg font-semibold">Últimas Salas Cadastradas</h2>
          <RouterLink to="/allClassroom" class="ml-auto text-green-800 hover:underline">
            Ver todas
          </RouterLink>
        </div>

        <div class="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
          <table class="w-full text-sm text-left text-gray-700">
            <thead class="bg-[#1C5E27]">
              <tr>
                <th class="px-6 py-3 font-semibold text-white">Nome</th>
                <th class="px-6 py-3 font-semibold text-white">Localização</th>
                <th class="px-6 py-3 font-semibold text-white text-center">Ações</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="room in classrooms" :key="room.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 font-medium text-gray-900">
                  <div class="flex items-center gap-2">
                    <div
                      class="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-800 font-semibold">
                      {{ room.name.charAt(0).toUpperCase() }}
                    </div>
                    {{ room.name }}
                  </div>
                </td>

                <td class="px-6 py-4">
                  {{ room.location }}
                </td>

                <td class="px-6 py-4 flex justify-center">
                  <button @click="deleteClassroom(room.id)" class="text-red-600 hover:text-red-800">
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
