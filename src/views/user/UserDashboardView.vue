<script setup>
import { RouterLink } from "vue-router";
import Actions from "../../components/Actions.vue";
import { TextAlignJustify, NotepadText, Trash2 } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import UserDao from "../../service/UserDAO";
import BaseLayout from "../../components/BaseLayout.vue";

const users = ref([]);

async function loadUsers() {
  try {
    users.value = await UserDao.getAll();
  } catch (error) {
    console.error("Erro ao carregar usuários", error);
  }
}

async function deleteUser(id) {
  if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

  try {
    await UserDao.delete(id);
    users.value = users.value.filter((u) => u.id !== id);
  } catch (error) {
    console.error("Erro ao excluir usuário:", error);
    alert("Erro ao excluir usuário.");
  }
}

onMounted(loadUsers);

const actions = [
  {
    icon: NotepadText,
    title: "Cadastrar Usuário",
    description: "Adicionar novos usuários",
    color: "text-green-800",
    to: "/registerUser",
  },
  {
    icon: TextAlignJustify,
    title: "Todos os Usuários",
    description: "Visualizar e gerenciar",
    color: "text-green-800",
    to: "/allUsers",
  },
];
</script>

<template>
  <BaseLayout>
    <div class="space-y-8">
      <header>
        <h1 class="text-2xl font-bold text-ponto-if-green">User Dashboard</h1>
      </header>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
        <RouterLink
          v-for="action in actions"
          :key="action.title"
          :to="action.to"
        >
          <Actions>
            <template #logo>
              <component
                :is="action.icon"
                :class="`${action.color} w-12 h-12`"
              />
            </template>
            <template #title>{{ action.title }}</template>
            <template #description>{{ action.description }}</template>
          </Actions>
        </RouterLink>
      </div>

      <section class="bg-white p-5 rounded-md shadow-sm">
        <div class="flex items-center mb-3">
          <h2 class="text-lg font-semibold">Últimos Usuários Cadastrados</h2>
          <RouterLink
            to="/allUsers"
            class="ml-auto text-green-800 hover:underline"
            >Ver todos</RouterLink
          >
        </div>

        <div
          class="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
        >
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left text-gray-700">
              <thead class="bg-[#1C5E27]">
                <tr>
                  <th class="px-6 py-3 font-semibold uppercase text-white">
                    Nome
                  </th>
                  <th class="px-6 py-3 font-semibold uppercase text-white">
                    Email
                  </th>
                  <th class="px-6 py-3 font-semibold uppercase text-white">
                    Matrícula
                  </th>
                  <th
                    class="px-6 py-3 font-semibold uppercase text-white text-center"
                  >
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody class="divide-y divide-gray-200 bg-white">
                <tr
                  v-for="user in users"
                  :key="user.id"
                  class="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td
                    class="px-6 py-4 whitespace-nowrap font-medium text-gray-900"
                  >
                    {{ user.name }}
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    {{ user.email }}
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      class="bg-green-50 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full"
                    >
                      {{ user.registration }}
                    </span>
                  </td>

                  <td class="px-6 py-4 flex justify-center">
                    <button
                      @click="deleteUser(user.id)"
                      class="text-red-600 hover:text-red-800"
                      title="Excluir"
                    >
                      <Trash2 class="w-5 h-5" />
                    </button>
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
