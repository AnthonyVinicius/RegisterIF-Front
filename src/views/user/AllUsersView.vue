<template>
  <BaseLayout>
    <div class="space-y-8">
      <header class="flex items-start">
        <div>
          <h1 class="text-2xl font-bold text-ponto-if-green">
            Usuarios Cadastrados
          </h1>
          <p class="text-gray-600">
            Adicione e gerencie os usuarios cadastrados
          </p>
        </div>
        <RouterLink to="registerUser" class="ms-auto">
          <button
            class="bg-[#1C5E27] text-white font-semibold py-2.5 px-5 rounded-lg flex items-center gap-2 hover:bg-[#154b1f] transition-colors text-sm"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-plus-icon lucide-plus"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Novo Usuario
          </button>
        </RouterLink>
      </header>

      <section class="bg-white p-5 rounded-md shadow-sm">
        <div class="overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-700">
            <thead class="bg-[#1C5E27]">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 font-semibold tracking-wider uppercase text-white"
                >
                  Nome
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 font-semibold tracking-wider uppercase text-white"
                >
                  Email
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 font-semibold tracking-wider uppercase text-white"
                >
                  Matrícula
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 font-semibold tracking-wider uppercase text-white text-right"
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
                  class="px-6 py-4 whitespace-nowrap font-medium text-gray-900 flex items-center gap-2"
                >
                  <div
                    class="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-800 font-semibold"
                  >
                    {{ user.name.charAt(0).toUpperCase() }}
                  </div>
                  <div>
                    <p class="font-semibold">{{ user.name }}</p>
                    <p class="text-xs text-gray-500">
                      ID: {{ user.id.slice(0, 8) }}...
                    </p>
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <span class="text-gray-700">{{ user.email }}</span>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="bg-green-50 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full"
                  >
                    {{ user.registration }}
                  </span>
                </td>

                <td class="px-6 py-4 whitespace-nowrap text-right">
                  <div class="flex justify-end gap-3">
                    <!--  
                                    <button @click="handleEdit(user)"
                                        class="p-2 rounded-md hover:bg-gray-100 transition" title="Editar">
                                        <svg xmlns="http://www.w3.org/2000/svg"
                                            class="w-5 h-5 text-gray-600 hover:text-gray-800" fill="none"
                                            viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
                                            stroke-linecap="round" stroke-linejoin="round">
                                            <path d="M13 21h8" />
                                            <path d="m15 5 4 4" />
                                            <path
                                                d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                                        </svg>
                                    </button>
                                    -->

                    <button
                      @click="handleDelete(user.id)"
                      class="p-2 rounded-md hover:bg-red-50 transition"
                      title="Excluir"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5 text-red-500 hover:text-red-700"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
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
    <ModalItem
      :isOpen="isModalOpen"
      :itemData="selectedItem"
      :isEdit="isEditMode"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </BaseLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import ModalItem from "../../components/ModalItem.vue";
import UserDao from "../../service/UserDAO";
import BaseLayout from "../../components/BaseLayout.vue";
const isModalOpen = ref(false);
const isEditMode = ref(false);
const selectedItem = ref(null);

const users = ref([]);

const getAllUsers = async () => {
  try {
    users.value = await UserDao.getAll();
    console.log(users.value);
  } catch (error) {
    console.log("Erro ao carregar os Usuarios", error);
  }
};

onMounted(async () => {
  await getAllUsers();
});

function openAddModal() {
  isEditMode.value = false;
  selectedItem.value = null;
  isModalOpen.value = true;
}

function handleEdit(item) {
  isEditMode.value = true;
  selectedItem.value = { ...item };
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  selectedItem.value = null;
}

async function handleSubmit(formData) {
  try {
    if (isEditMode.value && selectedItem.value) {
      await UserDao.update(selectedItem.value.id, formData);
    } else {
      await UserDao.insert(formData);
    }
    await loadData();
  } catch (error) {
    console.error("Erro ao salvar item:", error);
  }
}

async function handleDelete(userId) {
  if (confirm("Tem certeza que deseja excluir este item?")) {
    try {
      await UserDao.delete(userId);
      alert("Usuario removido com sucesso");
      await loadData();
    } catch (error) {
      console.error("Erro ao excluir item:", error);
    }
  }
}
</script>
